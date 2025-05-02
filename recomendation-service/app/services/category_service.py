import logging
from typing import Dict, List

from app.models.categorization import CategoryClassifier
from app.models.database import MetadataDatabase


class CategoryService:
    def __init__(self):
        self.category_model = CategoryClassifier()
        self.metadata_db = MetadataDatabase()

    async def predict_post_categories(
        self, title: str, description: str, content: str
    ) -> List[str]:
        try:
            categories = self.category_model.predict_categories(
                title, description, content
            )
            return categories
        except Exception as e:
            logging.error(f"Error predicting categories: {e}")
            return ["Інше"]

    async def get_all_categories(self) -> List[Dict]:
        try:
            categories = list(self.metadata_db.categories.find({}))
            return [
                {"id": str(cat.get("_id")), "name": cat.get("name")}
                for cat in categories
            ]
        except Exception as e:
            logging.error(f"Error getting categories: {e}")
            return []

    async def get_popular_categories(self, limit: int = 10) -> List[Dict]:
        try:
            pipeline = [
                {"$unwind": "$categories"},
                {"$group": {"_id": "$categories", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}},
                {"$limit": limit},
            ]

            popular_categories = list(self.metadata_db.posts.aggregate(pipeline))
            return [
                {"name": cat["_id"], "count": cat["count"]}
                for cat in popular_categories
            ]
        except Exception as e:
            logging.error(f"Error getting popular categories: {e}")
            return []

    async def update_category(self, post_id: str, categories: List[str]) -> bool:
        try:
            if not post_id or not categories:
                return False

            self.metadata_db.posts.update_one(
                {"_id": post_id}, {"$set": {"categories": categories}}
            )

            self.metadata_db.store_categories(categories)

            return True
        except Exception as e:
            logging.error(f"Error updating post categories: {e}")
            return False
