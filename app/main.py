from fastapi import FastAPI
from app.routes import wiki_routes

app = FastAPI()
app.include_router(wiki_routes.router)