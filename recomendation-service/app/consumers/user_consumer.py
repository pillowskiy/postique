import json
import logging

from aio_pika import IncomingMessage, connect_robust
from app.config import settings
from app.models.metadata_database import MetadataDatabase


class UserConsumer:
    def __init__(self):
        self.metadata_db = MetadataDatabase()

    async def setup(self):
        self.connection = await connect_robust(settings.RABBITMQ_URL)
        self.channel = await self.connection.channel()

        exchange = await self.channel.declare_exchange(
            settings.USER_EXCHANGE, type="fanout", durable=True
        )

        queue = await self.channel.declare_queue(
            f"recommendation_service_users", durable=True
        )

        await queue.bind(exchange)
        await queue.consume(self.process_message)

        logging.info("User consumer started successfully")

    async def process_message(self, message: IncomingMessage):
        async with message.process():
            try:
                message_data = json.loads(message.body.decode())
                message_type = message_data.get("type")
                if message_type != "user.created":
                    return

                logging.info(f"Processing message of type: {message_type}")
                user_data = message_data.get("data")
                user_id = user_data.get("id")

                if not user_id:
                    logging.error("User message missing id field")
                    return

                logging.info(f"Processing user: {user_id}")
                self.metadata_db.store_user(user_id, user_data)

                logging.info(f"User {user_id} processed successfully")

            except Exception as e:
                logging.error(f"Error processing user message: {e}")
