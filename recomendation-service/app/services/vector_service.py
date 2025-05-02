import logging
from typing import Any, Dict, List, Optional

from app.config import settings
from app.models.database import VectorDatabase
from app.models.embedding import TextEmbedding


class VectorService:
    def __init__(self):
        self.vector_db = VectorDatabase()
        self.text_embedding = TextEmbedding()

    async def process_post(
        self,
        post_id: str,
        title: str,
        description: str,
        content: str,
        metadata: Dict[str, Any] = None,
    ) -> bool:
        try:
            if not post_id or not title:
                logging.warning("Post ID and title are required")
                return False

            embedding = self.text_embedding.get_combined_embedding(
                title, description, content
            )

            if metadata is None:
                metadata = {}

            metadata.update(
                {
                    "title": title,
                    "description": description,
                }
            )

            self.vector_db.store_embedding(
                post_id=post_id, embedding=embedding, metadata=metadata
            )
            return True
        except Exception as e:
            logging.error(f"Error processing post vector: {e}")
            return False

    async def search_similar_posts(
        self, text: str, limit: int = 10, threshold: float = None
    ) -> List[Dict]:
        try:
            embedding = self.text_embedding.get_embedding(text)
            search_results = self.vector_db.search_similar(
                embedding=embedding,
                limit=limit,
                threshold=threshold or settings.SIMILARITY_THRESHOLD,
            )

            return [
                {"id": result.id, "score": result.score, "metadata": result.payload}
                for result in search_results
            ]
        except Exception as e:
            logging.error(f"Error searching similar posts: {e}")
            return []

    async def get_post_vector(self, post_id: str) -> Optional[List[float]]:
        try:
            result = self.vector_db.client.get_points(
                collection_name=settings.QDRANT_COLLECTION, ids=[post_id]
            )

            if result and len(result) > 0:
                return result[0].vector
            return None
        except Exception as e:
            logging.error(f"Error getting post vector: {e}")
            return None
