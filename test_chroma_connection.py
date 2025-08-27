#!/usr/bin/env python3
"""
Simple script to test ChromaDB connection and diagnose connection issues.
Run this script to check if ChromaDB is working properly.
"""

import os
import sys
from pathlib import Path

# Add the app directory to the Python path
sys.path.append(str(Path(__file__).parent / "app"))

try:
    from langchain_huggingface import HuggingFaceEmbeddings
    from langchain_community.vectorstores import Chroma
    print("✅ Successfully imported required libraries")
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Please install required packages: pip install -r requirements.txt")
    sys.exit(1)

def test_chroma_connection():
    """Test ChromaDB connection and basic operations"""
    print("\n🔍 Testing ChromaDB connection...")
    
    try:
        # Initialize embeddings
        print("📥 Initializing embeddings...")
        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        print("✅ Embeddings initialized successfully")
        
        # Check if chroma_db directory exists
        chroma_dir = "chroma_db"
        if os.path.exists(chroma_dir):
            print(f"✅ ChromaDB directory exists: {chroma_dir}")
            
            # Try to connect to existing database
            try:
                print("🔌 Attempting to connect to existing ChromaDB...")
                vector_store = Chroma(
                    embedding_function=embeddings,
                    persist_directory=chroma_dir
                )
                
                # Test basic operations
                count = vector_store._collection.count()
                print(f"✅ Successfully connected to ChromaDB. Document count: {count}")
                
                if count > 0:
                    print("✅ Database contains documents and is working properly")
                else:
                    print("⚠️  Database is empty but connection is working")
                    
            except Exception as e:
                print(f"❌ Error connecting to existing ChromaDB: {e}")
                print("🔄 Attempting to create new database...")
                
                # Try to create a new database
                try:
                    from langchain.schema import Document
                    
                    # Create a test document
                    test_docs = [Document(page_content="This is a test document", metadata={"test": True})]
                    
                    vector_store = Chroma.from_documents(
                        test_docs, 
                        embeddings, 
                        persist_directory=chroma_dir
                    )
                    vector_store.persist()
                    print("✅ Successfully created new ChromaDB database")
                    
                    # Clean up test document
                    vector_store._collection.delete(where={"test": True})
                    print("✅ Test document cleaned up")
                    
                except Exception as create_error:
                    print(f"❌ Failed to create new database: {create_error}")
                    return False
        else:
            print(f"📁 ChromaDB directory does not exist: {chroma_dir}")
            print("🔄 Creating new ChromaDB directory...")
            
            try:
                os.makedirs(chroma_dir, exist_ok=True)
                print(f"✅ Created directory: {chroma_dir}")
                
                # Create a test database
                from langchain.schema import Document
                test_docs = [Document(page_content="This is a test document", metadata={"test": True})]
                
                vector_store = Chroma.from_documents(
                    test_docs, 
                    embeddings, 
                    persist_directory=chroma_dir
                )
                vector_store.persist()
                print("✅ Successfully created new ChromaDB database")
                
                # Clean up test document
                vector_store._collection.delete(where={"test": True})
                print("✅ Test document cleaned up")
                
            except Exception as e:
                print(f"❌ Failed to create database: {e}")
                return False
        
        print("\n🎉 ChromaDB connection test completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Unexpected error during ChromaDB test: {e}")
        return False

def main():
    """Main function to run the connection test"""
    print("🚀 ChromaDB Connection Test")
    print("=" * 40)
    
    success = test_chroma_connection()
    
    if success:
        print("\n✅ All tests passed! ChromaDB is working properly.")
        print("💡 If you're still experiencing issues, check:")
        print("   - Backend server is running")
        print("   - No other processes are using the chroma_db directory")
        print("   - Sufficient disk space and permissions")
    else:
        print("\n❌ Some tests failed. Please check the error messages above.")
        print("💡 Common solutions:")
        print("   - Restart the backend server")
        print("   - Delete the chroma_db directory and restart")
        print("   - Check system resources and permissions")
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())
