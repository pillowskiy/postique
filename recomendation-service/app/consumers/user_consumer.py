import logging

from app.config import settings
from app.consumers.base_consumer import BaseConsumer, message_handler
from app.models.metadata_database import MetadataDatabase


class UserConsumer(BaseConsumer):
    EXCHANGE_NAME = settings.USER_EXCHANGE
    QUEUE_NAME = settings.USER_QUEUE

    def __init__(self):
        self.metadata_db = MetadataDatabase()
        super().__init__()

    @message_handler(pattern="user_registered")
    async def handle_user_registered(self, payload):
        user_id = payload.get("id")

        if not user_id:
            logging.error("User message missing id field")
            return

        logging.info(f"Processing user: {user_id}")
        self.metadata_db.store_user(user_id, payload)
        logging.info(f"User {user_id} processed successfully")

    @message_handler(pattern="user_profile")
    async def handle_user_updated(self, message_data):
        user_data = message_data.get("data", {})
        user_id = user_data.get("id")

        if not user_id:
            logging.error("User update message missing id field")
            return

        logging.info(f"Processing user profile: {user_id}")
        self.metadata_db.update_user(user_id, user_data)
        logging.info(f"User {user_id} updated successfully")
