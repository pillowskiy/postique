import logging
from typing import Dict, List

from app.config import settings
from app.models.database import VectorDatabase
from app.models.metadata_database import MetadataDatabase
from app.models.embedding import TextEmbedding


class RecommendationEngine:
    def __init__(self):
        self.vector_db = VectorDatabase()
        self.metadata_db = MetadataDatabase()
        self.text_embedding = TextEmbedding()

    async def get_user_recommendations(self, user_id: str, limit: int = 10) -> List[Dict]:
        print(f"Getting recommendations for user {user_id} with limit {limit}")
        try:
            user_prefs = self.metadata_db.get_user_preferences(user_id)

            print(f"User preferences for {user_id}: {user_prefs}")
            if not user_prefs["liked_categories"] and not user_prefs["liked_posts"]:
                return await self._get_popular_posts(limit)

            liked_categories = user_prefs["liked_categories"]
            viewed_posts = set(user_prefs.get("viewed_posts", []))
            liked_posts = set(user_prefs.get("liked_posts", []))
            disliked_posts = set(user_prefs.get("disliked_posts", []))

            recommendations = []

            for category in liked_categories[:3]:
                category_posts = self.vector_db.search_by_category(category, limit=5)
                recommendations.extend(category_posts)

            for post_id in list(liked_posts)[:3]:
                post_data = self.metadata_db.posts.find_one({"_id": post_id})
                if not post_data:
                    continue

                try:
                    post_vector = self.vector_db.client.get_points(
                        collection_name=settings.QDRANT_COLLECTION, ids=[post_id]
                    )
                    if post_vector and len(post_vector) > 0:
                        vector = post_vector[0].vector
                        similar_posts = self.vector_db.search_similar(vector, limit=5)
                        recommendations.extend(similar_posts)
                except Exception as e:
                    logging.error(f"Error getting vector for post {post_id}: {e}")

            filtered_recommendations = []
            seen_ids = set()

            for rec in recommendations:
                post_id = rec.id if hasattr(rec, "id") else rec["id"]

                if (
                    post_id in seen_ids
                    or post_id in viewed_posts
                    or post_id in disliked_posts
                ):
                    continue

                seen_ids.add(post_id)
                filtered_recommendations.append(
                    {
                        "id": post_id,
                        "score": rec.score if hasattr(rec, "score") else 1.0,
                        "metadata": rec.payload if hasattr(rec, "payload") else rec,
                    }
                )

            sorted_recommendations = sorted(
                filtered_recommendations, key=lambda x: x["score"], reverse=True
            )

            if len(sorted_recommendations) < limit:
                popular_posts = await self._get_popular_posts(
                    limit - len(sorted_recommendations),
                    exclude_ids=list(seen_ids)
                    + list(viewed_posts)
                    + list(disliked_posts),
                )
                sorted_recommendations.extend(popular_posts)

            return sorted_recommendations[:limit]

        except Exception as e:
            logging.error(f"Error generating recommendations: {e}")
            return await self._get_popular_posts(limit)

    async def _get_popular_posts(
        self, limit: int = 10, exclude_ids: List[str] = None
    ) -> List[Dict]:
        return await self.vector_db.get_popular_posts(limit, exclude_ids)

    def log_user_view(self, user_id: str, post_id: str):
        try:
            self.metadata_db.user_preferences.update_one(
                {"user_id": user_id}, {"$addToSet": {"viewed_posts": post_id}}
            )
        except Exception as e:
            logging.error(f"Error logging user view: {e}")

    def explain_recommendations(self, user_id: str) -> Dict:
        try:
            user_prefs = self.metadata_db.get_user_preferences(user_id)

            liked_categories = user_prefs.get("liked_categories", [])
            category_counts = {}
            for category in liked_categories:
                category_counts[category] = category_counts.get(category, 0) + 1

            sorted_categories = sorted(
                category_counts.items(), key=lambda x: x[1], reverse=True
            )

            liked_posts = user_prefs.get("liked_posts", [])
            liked_post_details = []
            for post_id in liked_posts[:10]:
                post = self.metadata_db.posts.find_one({"_id": post_id})
                if post:
                    liked_post_details.append(
                        {
                            "id": post_id,
                            "title": post.get("title", ""),
                            "categories": post.get("categories", []),
                        }
                    )

            disliked_categories = user_prefs.get("disliked_categories", [])
            disliked_category_counts = {}
            for category in disliked_categories:
                disliked_category_counts[category] = (
                    disliked_category_counts.get(category, 0) + 1
                )

            sorted_disliked = sorted(
                disliked_category_counts.items(), key=lambda x: x[1], reverse=True
            )

            return {
                "user_id": user_id,
                "liked_categories": [
                    {"name": cat, "count": count} for cat, count in sorted_categories
                ],
                "disliked_categories": [
                    {"name": cat, "count": count} for cat, count in sorted_disliked
                ],
                "liked_posts_sample": liked_post_details,
                "total_viewed_posts": len(user_prefs.get("viewed_posts", [])),
                "total_liked_posts": len(liked_posts),
                "total_disliked_posts": len(user_prefs.get("disliked_posts", [])),
                "recommendation_strategy": (
                    "Персоналізована" if liked_categories or liked_posts else "Загальна"
                ),
            }

        except Exception as e:
            logging.error(f"Error explaining recommendations: {e}")
            return {"error": "Не вдалося отримати пояснення рекомендацій"}
