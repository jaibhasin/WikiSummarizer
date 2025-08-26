from fastapi import APIRouter, HTTPException # use of http exception is to handle errors like 404 not found
from app.services.rag import RAGService
from app.services.fetch_n_parse_wiki import wiki_search
import asyncio
import time

router = APIRouter(prefix="/wiki", tags=["Wikipedia"])

wiki_search1 = wiki_search()
rag1 = RAGService()

@router.post("/fetch_page")
async def ingest_topic(topic: str):
    try:
        start_time = time.time()

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
            asyncio.to_thread(wiki_search1.get_quick_overview, topic, "Give a quick overview of the topic"),
            asyncio.to_thread(wiki_search1.get_quick_overview, topic, "Give a brief history and timeline of the topic"),
            asyncio.to_thread(wiki_search1.get_quick_overview, topic, "Are there any controversies or debates related to the topic"),
            asyncio.to_thread(wiki_search1.get_quick_overview, topic, "What is the impact and legacy of the topic"),
            asyncio.to_thread(wiki_search1.get_quick_overview, topic, "Provide further reading and references for the topic"),
        )
        print(f"All summaries generated in {time.time() - start_time:.2f} sec")

        return {
            "message": f"Data for topic '{topic}' ingested and vector store created successfully.",
            "Quick_Overview": Quick_Overview,
            "History_n_Timeline": History_n_Timeline,
            "Controversies_n_Debates": Controversies_n_Debates,
            "Impact_n_Legacy": Impact_n_Legacy,
            "Further_Reading_n_References": Further_Reading_n_References,
            "time_taken_sec": round(time.time() - start_time, 2),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))