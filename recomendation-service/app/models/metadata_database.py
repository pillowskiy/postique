from pymongo import MongoClient

from app.config import settings
from datetime import datetime


class MetadataDatabase:
    def __init__(self):
        self.client = MongoClient(settings.MONGODB_URL)
        self.db = self.client[settings.MONGODB_DB]

        self.posts = self.db.posts
        self.users = self.db.users
        self.categories = self.db.categories
        self.user_preferences = self.db.user_preferences

    def store_categories(self, categories: list[str]):
        for category in categories:
            self.categories.update_one(
                {"name": category}, {"$set": {"name": category}}, upsert=True
            )

    def store_post(self, post_id: str, post_data: dict):
        post_data["created_at"] = datetime.utcnow()
        self.posts.update_one({"_id": post_id}, {"$set": {
            "_id": post_id,
            "title": post_data.get("title", ""),
            "description": post_data.get("description", ""),
            "categories": post_data.get("categories", []),
            "status": post_data.get("status", "draft"),
            "visibility": post_data.get("visibility", "public"),
            "created_at": post_data.get("created_at", datetime.utcnow()),
        }}, upsert=True)

    def store_user(self, user_id: str, user_data: dict):
        session = self.client.start_session()
        session.start_transaction()

        try:
            self.users.update_one({"_id": user_id}, {"$set": user_data}, upsert=True, session=session)

            self.user_preferences.update_one(
                {"user_id": user_id},
                {
                    "$setOnInsert": {
                        "user_id": user_id,
                        "liked_categories": [],
                        "disliked_categories": [],
                        "viewed_posts": [],
                        "liked_posts": [],
                        "disliked_posts": [],
                    }
                },
                upsert=True,
            )
            session.commit_transaction()
        except Exception as e:
            session.abort_transaction()
            raise e
        finally:
            session.end_session()


    def update_user_preference(self, user_id: str, post_id: str, action: str):
        if action == "show-more":
            self.user_preferences.update_one(
                {"user_id": user_id},
                {
                    "$addToSet": {"liked_posts": post_id},
                    "$pull": {"disliked_posts": post_id},
                },
            )

            post = self.posts.find_one({"_id": post_id})
            if post and "categories" in post:
                self.user_preferences.update_one(
                    {"user_id": user_id},
                    {
                        "$addToSet": {
                            "liked_categories": {"$each": post["categories"]}
                        },
                        "$pull": {"disliked_categories": {"$in": post["categories"]}},
                    },
                )

        elif action == "show-less":
            self.user_preferences.update_one(
                {"user_id": user_id},
                {
                    "$addToSet": {"disliked_posts": post_id},
                    "$pull": {"liked_posts": post_id},
                },
            )

            post = self.posts.find_one({"_id": post_id})
            if post and "categories" in post:
                self.user_preferences.update_one(
                    {"user_id": user_id},
                    {
                        "$addToSet": {
                            "disliked_categories": {"$each": post["categories"]}
                        },
                        "$pull": {"liked_categories": {"$in": post["categories"]}},
                    },
                )

    def get_user_preferences(self, user_id: str):
        preferences = self.user_preferences.find_one({"user_id": user_id})
        return preferences or {
            "user_id": user_id,
            "liked_categories": [],
            "disliked_categories": [],
            "viewed_posts": [],
            "liked_posts": [],
            "disliked_posts": [],
        }
