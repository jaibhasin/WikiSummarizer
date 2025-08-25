from langchain_anthropic import ChatAnthropic
import os
from dotenv import load_dotenv

load_dotenv()

chat = ChatAnthropic(model="claude-3-5-haiku-latest")

messages = [
    ("system", "You are a helpful assistant who answer in 1-2 lines"),
    ("user", "How many stars and galaxies have humans counted?")
]

response = chat.invoke(messages)
print(response)
