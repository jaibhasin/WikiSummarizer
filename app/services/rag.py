# check if db is resest for new user 
from langchain_anthropic import ChatAnthropic
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_huggingface import HuggingFaceEmbeddings
from operator import itemgetter
import os
from dotenv import load_dotenv
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
import time
import logging

from langchain.schema import Document


from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
# from langchain_core.runnables import RunnablePassthrough , RunnableParallel
# from langchain_core.runnables import RunnablePassthrough, RunnableParallel
from langchain_core.runnables import RunnableParallel, RunnablePassthrough



load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RAGService :
    def __init__(self, model = 'claude-3-5-haiku-latest'):
        # self.embeddings = GoogleGenerativeAIEmbeddings(model='models/gemini-embedding-001')
        self.embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

        self.vector_store = None
        self.text_splitter = RecursiveCharacterTextSplitter(chunk_size=400, chunk_overlap=130)
        self.llm = ChatAnthropic(model=model)
        self.persist_directory = "chroma_db"

    def _ensure_chroma_connection(self, max_retries=3, delay=1):
        """Ensure ChromaDB connection is stable with retry logic"""
        for attempt in range(max_retries):
            try:
                # Try to create a simple connection to test
                test_store = Chroma(
                    embedding_function=self.embeddings,
                    persist_directory=self.persist_directory
                )
                # Test the connection
                test_store._collection.count()
                return True
            except Exception as e:
                logger.warning(f"ChromaDB connection attempt {attempt + 1} failed: {str(e)}")
                if attempt < max_retries - 1:
                    time.sleep(delay)
                    delay *= 2  # Exponential backoff
                else:
                    logger.error(f"Failed to connect to ChromaDB after {max_retries} attempts")
                    return False
        return False

    def prepare_chunks(self, sections):
        docs = [Document(page_content=s['text'] , metadata={"title_path":s['title_path']}) for s in sections if s['text'].strip()]
        split_docs = self.text_splitter.split_documents(docs)
        return split_docs
    
    def add_to_vector_store(self, docs):
        try:
            # Ensure connection before adding documents
            if not self._ensure_chroma_connection():
                raise Exception("Failed to establish ChromaDB connection")
            
            self.vector_store = Chroma.from_documents(
                docs, 
                self.embeddings, 
                persist_directory=self.persist_directory
            )
            self.vector_store.persist()
            logger.info("Vector store created and persisted successfully")
        except Exception as e:
            logger.error(f"Error creating vector store: {str(e)}")
            raise Exception(f"Failed to create vector store: {str(e)}")
    
    def _get_or_create_vector_store(self):
        """Get existing vector store or create a new one if needed"""
        if self.vector_store is None:
            try:
                # Try to load existing vector store
                self.vector_store = Chroma(
                    embedding_function=self.embeddings,
                    persist_directory=self.persist_directory
                )
                # Test if it has any documents
                if self.vector_store._collection.count() == 0:
                    raise Exception("Vector store is empty")
                logger.info("Loaded existing vector store")
            except Exception as e:
                logger.error(f"Could not load existing vector store: {str(e)}")
                raise Exception("Vector store not available. Please fetch a topic first.")
        return self.vector_store

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
                - Please follow the text length mentioned in the prompt
                - Make the query more specific to get better, more focused responses
                - If it's a general question, add context about what aspect of {title} to focus on
            """
        # response = self.llm.predict(prompt)
        messages = (
            ("system", prompt),
            ("user", query),
        )
        response = self.llm.invoke(messages)
        return response.content.strip()

    def generate_response(self, title ,query):
        try:
            # Ensure we have a valid vector store
            vector_store = self._get_or_create_vector_store()
            
            # Check if this is a QnA query (shorter response)
            is_qna = "40-50 words" in query or "Answer the following question" in query
            
            if is_qna:
                template = """
                    You are a Wikipedia expert. Answer the question about '{title}' using the provided context.
                    
                    Guidelines:
                    - Keep response to 40-50 words maximum
                    - Be precise and factual
                    - Focus only on what's asked
                    - Use clear, concise language
                    - If you can answer from your knowledge that is also good 
                    - If context is insufficient, provide a brief, helpful response based on what you know about the topic
                    - Never say you lack context - instead provide the most relevant information available
                    - If you can answer from your knowledge that is also good 
                    
                    Context:
                    {context}
                    
                    Question: {question}
                    Answer:
                    """
            else:
                template = """
                    You are a neutral Wikipedia summarizer. Using the provided context from Wikipedia sections, create a concise summary for the Article of '{title}'.
                    
                    Guidelines:
                    - Answer in 150-200 words (much shorter than before)
                    - Focus on key facts: introduction, major points, and impacts
                    - Keep it objective and factual—avoid opinions
                    - Sound engaging and informative
                    - Structure: brief intro, 2-3 key points, brief conclusion
                    - Be concise but comprehensive
                    - If context is limited, work with what's available and note any gaps
                    
                    Context:
                    {context}
                    
                    Question: {question}
                    Answer:
                    """
            
            prompt = PromptTemplate(
                input_variables=["title", "context", "question"],
                template=template,
            )
            
            # Increase context retrieval for better answers
            retriever = vector_store.as_retriever(
                search_type="similarity", 
                search_kwargs={"k": 10}  # Increased from 7 to 10 for more context
            )

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
        except Exception as e:
            logger.error(f"Error generating response: {str(e)}")
            raise Exception(f"Failed to generate response: {str(e)}")