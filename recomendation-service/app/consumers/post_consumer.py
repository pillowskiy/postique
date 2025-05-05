import logging
from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.config import settings
from app.consumers.base_consumer import BaseConsumer, message_handler
from app.models.categorization import CategoryClassifier
from app.models.database import VectorDatabase
from app.models.embedding import TextEmbedding
from app.models.metadata_database import MetadataDatabase

class PostData(BaseModel):
    id: str
    title: str = ""
    description: str = ""
    visibility: str = "public"
    status: str = "draft"
    content: Optional[str] = None

class PostConsumer(BaseConsumer):
    EXCHANGE_NAME = settings.POST_EXCHANGE
    QUEUE_NAME = settings.POST_QUEUE

    def __init__(self):
        self.embedding_model = TextEmbedding()
        self.category_model = CategoryClassifier()
        self.vector_db = VectorDatabase()
        self.metadata_db = MetadataDatabase()
        super().__init__()

    @message_handler(pattern="post.published", model=PostData)
    async def handle_post_updated(self, payload):
        await self._process_post(payload)

    async def _process_post(self, post: PostData):
        logging.info(f"Processing post: {post.id}")

        embedding = self.embedding_model.get_combined_embedding(
            post.title, post.description, post.content or ""
        )

        categories = self.category_model.predict_categories(
            post.title,
            post.description,
            post.content or ""
        )

        self.vector_db.store_embedding(
            post_id=post.id,
            embedding=embedding,
            metadata={
                "title": post.title,
                "description": post.description,
                "created_at": datetime.utcnow(),
            },
        )

        self.metadata_db.store_post(
            post_id=post.id,
            post_data={
                "title": post.title,
                "description": post.description,
                "visibility": post.visibility,
                "status": post.status,
                "categories": categories,
                "created_at": datetime.utcnow(),
            },
        )

        self.metadata_db.store_categories(categories)

        logging.info(f"Post {post.id} processed successfully. Categories: {categories}")
