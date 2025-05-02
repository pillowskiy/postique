import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()

class Settings(BaseSettings):
    APP_NAME: str = "Recommendation Service"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    PORT: int = os.getenv("PORT", 8000)

    RABBITMQ_URL: str = os.getenv("RABBITMQ_URL", "amqp://guest:guest@localhost:5672/")
    POST_EXCHANGE: str = os.getenv("POST_EXCHANGE", "post_exchange")
    USER_EXCHANGE: str = os.getenv("USER_EXCHANGE", "user_exchange")

    QDRANT_URL: str = os.getenv("QDRANT_URL", "http://localhost:6333")
    QDRANT_COLLECTION: str = os.getenv("QDRANT_COLLECTION", "articles")
    VECTOR_SIZE: int = os.getenv("VECTOR_SIZE", 384)

    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    MONGODB_DB: str = os.getenv("MONGODB_DB")

    MODEL_NAME: str = os.getenv(
        "MODEL_NAME", "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    )
    CATEGORY_MODEL_NAME: str = os.getenv("CATEGORY_MODEL_NAME", "ukr-categories-model")

    RECOMMENDATION_LIMIT: int = os.getenv("RECOMMENDATION_LIMIT", 10)
    SIMILARITY_THRESHOLD: float = os.getenv("SIMILARITY_THRESHOLD", 0.7)

    ENV: str = os.getenv("ENV", "development")


settings = Settings()
