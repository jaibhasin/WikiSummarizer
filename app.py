from langchain_anthropic import ChatAnthropic
import os
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings


load_dotenv()

chat = ChatAnthropic(model="claude-3-5-haiku-latest")

embd = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")


