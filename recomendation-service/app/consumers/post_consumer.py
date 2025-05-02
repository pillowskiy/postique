import json
import logging

from aio_pika import IncomingMessage, connect_robust
from app.config import settings
from app.models.categorization import CategoryClassifier
from app.models.database import VectorDatabase
from app.models.metadata_database import MetadataDatabase
from app.models.embedding import TextEmbedding
from datetime import datetime


class PostConsumer:
    def __init__(self):
        self.embedding_model = TextEmbedding()
        self.category_model = CategoryClassifier()
        self.vector_db = VectorDatabase()
        self.metadata_db = MetadataDatabase()

    async def setup(self):
        self.connection = await connect_robust(settings.RABBITMQ_URL)
        self.channel = await self.connection.channel()

        exchange = await self.channel.declare_exchange(
            settings.POST_EXCHANGE, type="fanout", durable=True
        )

        queue = await self.channel.declare_queue(f"recomendations.post", durable=True)

        await queue.bind(exchange)

        await queue.consume(self.process_message)

        logging.info("Post consumer started successfully")

    async def process_message(self, message: IncomingMessage):
        async with message.process():
            try:
                post_data = json.loads(message.body.decode())

                post_id = post_data.get("id")
                title = post_data.get("title", "")
                description = post_data.get("description", "")
                content = post_data.get("content", "")

                logging.info(f"Processing post: {post_id}")

                embedding = self.embedding_model.get_combined_embedding(
                    title, description, content
                )

                categories = self.category_model.predict_categories(
                    title, description, content
                )

                self.vector_db.store_embedding(
                    post_id=post_id,
                    embedding=embedding,
                    metadata={
                        "title": title,
                        "description": description,
                        "categories": categories,
                        "created_at": post_data.get(
                            "created_at", datetime.utcnow().isoformat()
                        ),
                    },
                )

                self.metadata_db.store_post(
                    post_id=post_id,
                    title=title,
                    description=description,
                    categories=categories,
                )

                self.metadata_db.store_categories(categories)

                logging.info(
                    f"Post {post_id} processed successfully. Categories: {categories}"
                )

            except Exception as e:
                logging.error(f"Error processing post message: {e}")
