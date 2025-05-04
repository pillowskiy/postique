import logging
from typing import Dict, List

from app.config import settings
from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, PointStruct, VectorParams


class VectorDatabase:
    def __init__(self):
        self.client = QdrantClient(url=settings.QDRANT_URL)

        try:
            collections = self.client.get_collections().collections
            collection_names = [collection.name for collection in collections]

            if settings.QDRANT_COLLECTION not in collection_names:
                self.client.create_collection(
                    collection_name=settings.QDRANT_COLLECTION,
                    vectors_config=VectorParams(
                        size=settings.VECTOR_SIZE, distance=Distance.COSINE
                    ),
                )
                logging.info(f"Created vector collection {settings.QDRANT_COLLECTION}")
        except Exception as e:
            logging.error(f"Error initializing Qdrant: {e}")

    async def get_popular_posts(
        self, limit: int = 10, exclude_ids: List[str] = None
    ) -> List[Dict]:
        try:
            exclude_ids = exclude_ids or []
            filter_condition = None
            if exclude_ids:
                filter_condition = {
                    "must_not": [
                        {"id": {"in": exclude_ids}}
                    ]
                }

            scroll_result = self.client.scroll(
                collection_name=settings.QDRANT_COLLECTION,
                scroll_filter=filter_condition,
                limit=limit,
                with_payload=True,
                with_vectors=False,
            )

            points = scroll_result[0]

            logging.info(f"Found {len(points)} popular posts")

            return [
                {
                    "id": item.id,
                    "score": 1.0,
                    "metadata": item.payload,
                }
                for item in points
            ]
        except Exception as e:
            logging.error(f"Error getting popular posts from Qdrant: {e}")
            return []

    def store_embedding(
        self, post_id: str, embedding: list[float], metadata: dict = None
    ):
        try:
            self.client.upsert(
                collection_name=settings.QDRANT_COLLECTION,
                points=[
                    PointStruct(id=post_id, vector=embedding, payload=metadata or {})
                ],
            )
            return True
        except Exception as e:
            logging.error(f"Error storing embedding: {e}")
            return False

    def search_similar(
        self,
        embedding: list[float],
        text_query: str | None = None,
        limit: int = 10,
        threshold: float | None = None,
    ):
        try:
            search_threshold = threshold or settings.SIMILARITY_THRESHOLD

            search_results = self.client.search(
                collection_name=settings.QDRANT_COLLECTION,
                query_vector=embedding,
                limit=limit,
                score_threshold=search_threshold,
            )

            return search_results

        except Exception as e:
            logging.error(f"Error searching similar embeddings: {e}")
            return []

    def search_by_category(
        self, category: str, embedding: list[float] = None, limit: int = 10
    ):
        try:
            if embedding:
                search_results = self.client.search(
                    collection_name=settings.QDRANT_COLLECTION,
                    query_vector=embedding,
                    query_filter={
                        "must": [{"key": "categories", "match": {"value": category}}]
                    },
                    limit=limit,
                )
            else:
                search_results = self.client.scroll(
                    collection_name=settings.QDRANT_COLLECTION,
                    scroll_filter={
                        "must": [{"key": "categories", "match": {"value": category}}]
                    },
                    limit=limit,
                )[0]

            return search_results
        except Exception as e:
            logging.error(f"Error searching by category: {e}")
            return []
