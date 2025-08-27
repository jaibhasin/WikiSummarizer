from fastapi import FastAPI
from app.routes import wiki_routes
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

app = FastAPI(
    title="Wiki API",
    description="API for managing wiki pages",
    version="1.0.0"
)

app.add_middleware(SessionMiddleware, secret_key="supernicesecret")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],  # Frontend dev origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(wiki_routes.router)

@app.get("/")
async def root():
    return {"message": "Wikipedia RAG API is running 🚀"}
