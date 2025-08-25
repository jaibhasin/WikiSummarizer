from langchain_anthropic import ChatAnthropic
import os
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings

load_dotenv()

chat = ChatAnthropic(model="claude-3-5-haiku-latest")

embd = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")


topic = "India"
from b import get_data
data = get_data(topic)
if data == "No data found":
    print("No data found")
    exit()

from langchain.text_splitter import RecursiveCharacterTextSplitter
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=200)

splits = text_splitter.split_text(data)

from langchain.vectorstores import FAISS
db = FAISS.from_texts(splits, embd)

query = "Give me an introduction about " + topic
docs = db.similarity_search(query, k=5)

from langchain import hub


rag_prompt = hub.pull("rlm/rag-prompt")

chain = rag_prompt | chat

response = chain.run(input_documents=docs, question=query)

print(response)
