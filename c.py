from langchain_anthropic import ChatAnthropic
import os
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain import hub
import time

load_dotenv()

# Performance optimization 1: Initialize models once and reuse
def initialize_models():
    """Initialize models once to avoid repeated loading"""
    chat = ChatAnthropic(model="claude-3-5-haiku-latest")
    
    # Performance optimization 2: Use a smaller, faster embedding model
    # or cache embeddings locally
    embd = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        model_kwargs={'device': 'cpu'},  # Specify device explicitly
        encode_kwargs={'normalize_embeddings': True}  # Normalize for better similarity
    )
    
    return chat, embd

def process_data_efficiently(topic, chat, embd):
    """Process data with optimizations"""
    
    # Get data
    from b import get_data
    print(f"Fetching data for topic: {topic}")
    start_time = time.time()
    
    data = get_data(topic)
    if data == "No data found":
        print("No data found")
        return None
    
    print(f"Data fetched in {time.time() - start_time:.2f} seconds")
    
    # Performance optimization 3: Optimize text splitting
    # Larger chunks mean fewer embeddings to compute
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,  # Increased from 500
        chunk_overlap=100,  # Reduced from 200
        length_function=len,
        separators=["\n\n", "\n", " ", ""]
    )
    
    print("Splitting text...")
    start_time = time.time()
    splits = text_splitter.split_text(data)
    print(f"Text split into {len(splits)} chunks in {time.time() - start_time:.2f} seconds")
    
    # Performance optimization 4: Use in-memory vector store with persistence option
    print("Creating embeddings and vector store...")
    start_time = time.time()
    
    # Option 1: In-memory (faster)
    db = Chroma.from_texts(
        splits, 
        embd,
        persist_directory=None  # In-memory only
    )
    
    # Option 2: With persistence (slower initially, but faster on subsequent runs)
    # db = Chroma.from_texts(
    #     splits, 
    #     embd,
    #     persist_directory=f"./chroma_db_{topic.lower().replace(' ', '_')}"
    # )
    
    print(f"Vector store created in {time.time() - start_time:.2f} seconds")
    
    return db

def perform_rag_query(db, topic, chat):
    """Perform RAG query with optimizations"""
    
    query = f"Give me an introduction about {topic}"
    
    # Performance optimization 5: Reduce number of retrieved documents
    print("Performing similarity search...")
    start_time = time.time()
    docs = db.similarity_search(query, k=3)  # Reduced from 5 to 3
    print(f"Similarity search completed in {time.time() - start_time:.2f} seconds")
    
    # Get RAG prompt
    rag_prompt = hub.pull("rlm/rag-prompt")
    
    # Create chain
    chain = rag_prompt | chat
    
    print("Generating response...")
    start_time = time.time()
    response = chain.invoke({
        "context": docs,
        "question": query
    })
    print(f"Response generated in {time.time() - start_time:.2f} seconds")
    
    return response

def main():
    """Main function with performance tracking"""
    topic = "India"
    total_start_time = time.time()
    
    # Initialize models once
    print("Initializing models...")
    start_time = time.time()
    chat, embd = initialize_models()
    print(f"Models initialized in {time.time() - start_time:.2f} seconds")
    
    # Process data
    db = process_data_efficiently(topic, chat, embd)
    if db is None:
        return
    
    # Perform RAG query
    response = perform_rag_query(db, topic, chat)
    
    print(f"\nTotal execution time: {time.time() - total_start_time:.2f} seconds")
    print("\n" + "="*50)
    print("RESPONSE:")
    print("="*50)
    print(response.content)

if __name__ == "__main__":
    main()

# Additional performance optimization ideas:

# 1. Cache embeddings to disk for reuse
def create_persistent_vectorstore(splits, embd, topic):
    """Create or load persistent vector store"""
    import os
    persist_dir = f"./chroma_db_{topic.lower().replace(' ', '_')}"
    
    if os.path.exists(persist_dir):
        print("Loading existing vector store...")
        db = Chroma(persist_directory=persist_dir, embedding_function=embd)
    else:
        print("Creating new vector store...")
        db = Chroma.from_texts(splits, embd, persist_directory=persist_dir)
        db.persist()
    
    return db

# 2. Use async processing if your data source supports it
async def async_get_data(topic):
    """Async version of data fetching (if b.get_data supports async)"""
    # This would require modifying your get_data function
    pass

# 3. Batch processing for multiple topics
def process_multiple_topics(topics, chat, embd):
    """Process multiple topics efficiently"""
    results = {}
    
    for topic in topics:
        print(f"Processing {topic}...")
        db = process_data_efficiently(topic, chat, embd)
        if db:
            response = perform_rag_query(db, topic, chat)
            results[topic] = response.content
    
    return results