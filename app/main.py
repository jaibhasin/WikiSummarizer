from fastapi import FastAPI, HTTPException
from app.routes import wiki_routes
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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

@app.get("/health")
async def health_check():
    """Health check endpoint to verify API status"""
    try:
        return {
            "status": "healthy",
            "message": "API is running normally",
            "timestamp": "2024-01-01T00:00:00Z"  # You can make this dynamic if needed
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Health check failed")

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler for unhandled errors"""
    logger.error(f"Unhandled exception: {str(exc)}")
    return {"error": "Internal server error", "detail": str(exc)}
