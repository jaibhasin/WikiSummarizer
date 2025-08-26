# check if db is resest for new user 
from langchain_anthropic import ChatAnthropic
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_huggingface import HuggingFaceEmbeddings
from operator import itemgetter
import os
from dotenv import load_dotenv
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma

from langchain.schema import Document


from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
# from langchain_core.runnables import RunnablePassthrough , RunnableParallel
# from langchain_core.runnables import RunnablePassthrough, RunnableParallel
from langchain_core.runnables import RunnableParallel, RunnablePassthrough



load_dotenv()

class RAGService :
    def __init__(self, model = 'claude-3-5-haiku-latest'):
        # self.embeddings = GoogleGenerativeAIEmbeddings(model='models/gemini-embedding-001')
        self.embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

        self.vector_store = None
        self.text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=130)
        self.llm = ChatAnthropic(model=model)

    def prepare_chunks(self, sections):
        docs = [Document(page_content=s['text'] , metadata={"title_path":s['title_path']}) for s in sections if s['text'].strip()]
        split_docs = self.text_splitter.split_documents(docs)
        return split_docs
    

    def add_to_vector_store(self, docs):
        self.vector_store = Chroma.from_documents(docs, self.embeddings , persist_directory="chroma_db")
        self.vector_store.persist()
    
    def improved_query(self, query, title):
        prompt = f"""
                You are an assistant helping with Retrieval-Augmented Generation (RAG). 
                The user asked a query about the article titled "{title}".

                Rewrite this request into a clear and effective instruction for the RAG system:
                - Be specific and contextualized to the given article.
                - If the query is vague (e.g., "give me a summary"), make it more precise, 
                like "Provide a concise summary of the main points, history, and impact of {title}".
                - Keep it factual and focused on retrieved context.
                - Maintain a helpful, neutral, and engaging tone.
            """
        # response = self.llm.predict(prompt)
        messages = (
            ("system", prompt),
            ("user", query),
        )
        response = self.llm.invoke(messages)
        return response.content.strip()

    def generate_response(self, title ,query):
        if not self.vector_store:
            return ValueError("Vector store not created !!!!")
        
        template = """
                You are a neutral Wikipedia summarizer. Using the provided context from Wikipedia sections, answer the question on the Article of '{title}'.
                
                Guidelines:
                - Focus on key facts: introduction, history, major sections, and impacts.
                - Keep it objective and factual—avoid opinions.
                - Sound little fund and engaging, like a friendly encyclopedia for users attention and curiosity.
                - Structure the summary with: 
                - Give a nice paragraph summary.
                - End with notable references or controversies if relevant.
                - Limit to 400 words max.
                - Only If context is really insufficient, note what might be missing.
                
                Context:
                {context}
                
                Question : {question}
                Answer:
                """
        prompt = PromptTemplate(
            input_variables=["title", "context", "question"],
            template=template,
        )
        retriever = self.vector_store.as_retriever(search_type="similarity", search_kwargs={"k":6})

        chain = (
            RunnableParallel({
                "context": itemgetter("question") | retriever,   # itemgetter is different from RunnablePassthrough as it gets the value of the key instead of the whole dict
                "question": itemgetter("question"),
                "title": itemgetter("title"),
            })
            | prompt
            | self.llm
            | StrOutputParser()
        )

        query = self.improved_query(query , title)
        return chain.invoke({"title": title, "question": query})