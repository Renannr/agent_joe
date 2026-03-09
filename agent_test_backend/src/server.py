from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.routes import chat_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api", tags=["chat"])


@app.get("/health")
def read_root() -> dict[str, str]:
    return {"status": "ok"}