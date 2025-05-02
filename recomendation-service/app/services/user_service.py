import logging
from typing import Dict, List, Optional

from app.models.database import MetadataDatabase


class UserService:
    def __init__(self):
        self.metadata_db = MetadataDatabase()

    async def get_user_profile(self, user_id: str) -> Optional[Dict]:
        try:
            user = self.metadata_db.users.find_one({"_id": user_id})
            if not user:
                return None

            return {
                "id": user_id,
                "username": user.get("username", ""),
                "email": user.get("email", ""),
                "created_at": user.get("created_at", ""),
                "last_seen": user.get("last_seen", ""),
            }
        except Exception as e:
            logging.error(f"Error getting user profile: {e}")
            return None

    async def get_user_preferences(self, user_id: str) -> Dict:
        try:
            preferences = self.metadata_db.get_user_preferences(user_id)

            liked_posts_data = []
            for post_id in preferences.get("liked_posts", [])[:10]:
                post = self.metadata_db.posts.find_one({"_id": post_id})
                if post:
                    liked_posts_data.append(
                        {
                            "id": post_id,
                            "title": post.get("title", ""),
                            "categories": post.get("categories", []),
                        }
                    )

            return {
                "user_id": user_id,
                "liked_categories": preferences.get("liked_categories", []),
                "disliked_categories": preferences.get("disliked_categories", []),
                "liked_posts": liked_posts_data,
                "viewed_posts_count": len(preferences.get("viewed_posts", [])),
                "liked_posts_count": len(preferences.get("liked_posts", [])),
                "disliked_posts_count": len(preferences.get("disliked_posts", [])),
            }
        except Exception as e:
            logging.error(f"Error getting user preferences: {e}")
            return {
                "user_id": user_id,
                "liked_categories": [],
                "disliked_categories": [],
                "liked_posts": [],
                "viewed_posts_count": 0,
                "liked_posts_count": 0,
                "disliked_posts_count": 0,
            }

    async def update_user_activity(
        self, user_id: str, activity_type: str, post_id: str
    ) -> bool:
        try:
            if activity_type == "view":
                self.metadata_db.user_preferences.update_one(
                    {"user_id": user_id}, {"$addToSet": {"viewed_posts": post_id}}
                )
            elif activity_type == "like":
                self.metadata_db.update_user_preference(user_id, post_id, "show-more")
            elif activity_type == "dislike":
                self.metadata_db.update_user_preference(user_id, post_id, "show-less")
            else:
                logging.warning(f"Unknown activity type: {activity_type}")
                return False

            return True
        except Exception as e:
            logging.error(f"Error updating user activity: {e}")
            return False

    async def get_user_category_preferences(self, user_id: str) -> Dict[str, List]:
        try:
            preferences = self.metadata_db.get_user_preferences(user_id)

            liked_categories = preferences.get("liked_categories", [])
            disliked_categories = preferences.get("disliked_categories", [])

            liked_counts = {}
            for cat in liked_categories:
                liked_counts[cat] = liked_counts.get(cat, 0) + 1

            disliked_counts = {}
            for cat in disliked_categories:
                disliked_counts[cat] = disliked_counts.get(cat, 0) + 1

            sorted_liked = sorted(
                liked_counts.items(), key=lambda x: x[1], reverse=True
            )
            sorted_disliked = sorted(
                disliked_counts.items(), key=lambda x: x[1], reverse=True
            )

            return {
                "liked_categories": [
                    {"name": cat, "count": count} for cat, count in sorted_liked
                ],
                "disliked_categories": [
                    {"name": cat, "count": count} for cat, count in sorted_disliked
                ],
            }
        except Exception as e:
            logging.error(f"Error getting user category preferences: {e}")
            return {"liked_categories": [], "disliked_categories": []}
