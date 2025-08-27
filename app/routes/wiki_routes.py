from fastapi import APIRouter, HTTPException , Request# use of http exception is to handle errors like 404 not found
from pydantic import BaseModel
from app.services.rag import RAGService
from app.services.fetch_n_parse_wiki import wiki_search
import asyncio
import time
import logging
# from starlette.middleware.sessions import SessionMiddleware

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/wiki", tags=["Wikipedia"])

wiki_search1 = wiki_search()
rag1 = RAGService()

class FetchPageRequest(BaseModel):
    topic: str

class GetResponseRequest(BaseModel):
    query: str

@router.post("/fetch_page")
async def ingest_topic(payload: FetchPageRequest , request: Request):
    try:
        start_time = time.time()
        topic = payload.topic
        request.session['topic'] = topic  # Store the topic in the session
        
        logger.info(f"Starting to fetch topic: {topic}")
        
        # Fetch sections (make it async if possible in wiki_search)
        try:
            sections = await asyncio.wait_for(
                asyncio.to_thread(wiki_search1.get_sections, topic),
                timeout=60.0  # 60 second timeout for wiki fetching
            )
        except asyncio.TimeoutError:
            raise HTTPException(status_code=408, detail="Request timeout while fetching Wikipedia content")
        
        if not sections:
            raise HTTPException(status_code=404, detail="No content found for the given topic.")
        
        print(f"Sections for topic {topic} fetched successfully in {time.time() - start_time:.2f} sec")

        # Chunk + store in vector DB
        try:
            split_docs1 = await asyncio.wait_for(
                asyncio.to_thread(rag1.prepare_chunks, sections),
                timeout=30.0  # 30 second timeout for chunking
            )
            await asyncio.wait_for(
                asyncio.to_thread(rag1.add_to_vector_store, split_docs1),
                timeout=60.0  # 60 second timeout for vector store creation
            )
        except asyncio.TimeoutError:
            raise HTTPException(status_code=408, detail="Request timeout while processing content")
        except Exception as e:
            logger.error(f"Error in vector store operations: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error processing content: {str(e)}")
        
        print(f"Vector store created successfully in {time.time() - start_time:.2f} sec")

        # Run multiple summary queries in parallel with timeout
        try:
            Quick_Overview, History_n_Timeline, Controversies_n_Debates, Impact_n_Legacy, Further_Reading_n_References = await asyncio.wait_for(
                asyncio.gather(
                    asyncio.to_thread(rag1.generate_response, topic, "Give a quick overview of the topic"),
                    asyncio.to_thread(rag1.generate_response, topic, "Give a brief history and timeline of the topic"),
                    asyncio.to_thread(rag1.generate_response, topic, "Are there any controversies or debates related to the topic"),
                    asyncio.to_thread(rag1.generate_response, topic, "What is the impact and legacy of the topic"),
                    asyncio.to_thread(rag1.generate_response, topic, "Provide further reading and references for the topic"),
                ),
                timeout=180.0  # 3 minute timeout for all summaries
            )
        except asyncio.TimeoutError:
            raise HTTPException(status_code=408, detail="Request timeout while generating summaries")
        except Exception as e:
            logger.error(f"Error generating summaries: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error generating summaries: {str(e)}")
        
        print(f"All summaries generated in {time.time() - start_time:.2f} sec")

        return {
            "message": f"Data for topic '{topic}' ingested and vector store created successfully.",
            "Quick_Overview": Quick_Overview,
            "History_n_Timeline": History_n_Timeline,
            "Controversies_n_Debates": Controversies_n_Debates,
            "Impact_n_Legacy": Impact_n_Legacy,
            "Further_Reading_n_References": Further_Reading_n_References,
        }

    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        logger.error(f"Unexpected error in ingest_topic: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    
@router.post('/get_response')
async def get_response(payload: GetResponseRequest , request: Request):
    try:
        t1 = "Answer the following question in 40-50 words"
        topic = request.session.get('topic')  # Retrieve the topic from the session
        
        if not topic:
            raise HTTPException(status_code=400, detail="No topic found in session. Please fetch a topic first.")
        
        try:
            response = await asyncio.wait_for(
                asyncio.to_thread(rag1.generate_response, topic, t1+payload.query),
                timeout=60.0  # 60 second timeout for QnA response
            )
            return {"response": response}
        except asyncio.TimeoutError:
            raise HTTPException(status_code=408, detail="Request timeout while generating answer")
        except Exception as e:
            logger.error(f"Error generating QnA response: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error generating answer: {str(e)}")
            
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        logger.error(f"Unexpected error in get_response: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")