from fastapi import APIRouter, HTTPException , Request# use of http exception is to handle errors like 404 not found
from pydantic import BaseModel
from app.services.rag import RAGService
from app.services.fetch_n_parse_wiki import wiki_search
import asyncio
import time
# from starlette.middleware.sessions import SessionMiddleware


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
        # Fetch sections (make it async if possible in wiki_search)
        sections = await asyncio.to_thread(wiki_search1.get_sections, topic)
        if not sections:
            raise HTTPException(status_code=404, detail="No content found for the given topic.")
        print(f"Sections for topic {topic} fetched successfully in {time.time() - start_time:.2f} sec")

        # Chunk + store in vector DB
        split_docs1 = await asyncio.to_thread(rag1.prepare_chunks, sections)
        await asyncio.to_thread(rag1.add_to_vector_store, split_docs1)
        print(f"Vector store created successfully in {time.time() - start_time:.2f} sec")

        # Run multiple summary queries in parallel
        Quick_Overview, History_n_Timeline, Controversies_n_Debates, Impact_n_Legacy, Further_Reading_n_References = await asyncio.gather(
            asyncio.to_thread(rag1.generate_response, topic, "Give a quick overview of the topic"),
            asyncio.to_thread(rag1.generate_response, topic, "Give a brief history and timeline of the topic"),
            asyncio.to_thread(rag1.generate_response, topic, "Are there any controversies or debates related to the topic"),
            asyncio.to_thread(rag1.generate_response, topic, "What is the impact and legacy of the topic"),
            asyncio.to_thread(rag1.generate_response, topic, "Provide further reading and references for the topic"),
        )
        print(f"All summaries generated in {time.time() - start_time:.2f} sec")

        return {
            "message": f"Data for topic '{topic}' ingested and vector store created successfully.",
            "Quick_Overview": Quick_Overview,
            "History_n_Timeline": History_n_Timeline,
            "Controversies_n_Debates": Controversies_n_Debates,
            "Impact_n_Legacy": Impact_n_Legacy,
            "Further_Reading_n_References": Further_Reading_n_References,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post('/get_response')
async def get_response(payload: GetResponseRequest , request: Request):
    try:
        topic = request.session.get('topic')  # Retrieve the topic from the session
        response = await asyncio.to_thread(rag1.generate_response, topic, payload.query)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))