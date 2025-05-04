import asyncio
import logging

from app.api import recommendations, search
from app.config import settings
from app.consumers.post_consumer import PostConsumer
from app.consumers.user_consumer import UserConsumer
from fastapi import APIRouter, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from rich import pretty
from rich.logging import RichHandler

pretty.install()

logging.basicConfig(
    level=logging.INFO,
    format="%(message)s",
    datefmt="[%X]",
    handlers=[RichHandler()],
)
logging.getLogger().setLevel(logging.INFO)

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(
    recommendations.router, prefix="/recommendations", tags=["recommendations"]
)
api_router.include_router(search.router, prefix="/search", tags=["search"])

app.include_router(api_router)

@app.on_event("startup")
async def startup_event():
    try:
        post_consumer = PostConsumer()
        user_consumer = UserConsumer()

        asyncio.create_task(post_consumer.setup())
        asyncio.create_task(user_consumer.setup())

        logging.info("Message consumers started")
    except Exception as e:
        logging.info(f"Error starting message consumers: {e}")


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=settings.ENV == "development",
        log_config=None,
        log_level=logging.INFO
    )
