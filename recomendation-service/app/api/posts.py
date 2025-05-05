import logging
from datetime import datetime
from typing import Dict, List, Optional
from bson import ObjectId

from app.models.metadata_database import MetadataDatabase
from app.models.embedding import TextEmbedding
from app.models.database import VectorDatabase
from app.models.categorization import CategoryClassifier
from fastapi import APIRouter, HTTPException, Query, Body, Path, Depends
from pydantic import BaseModel, Field

router = APIRouter()
metadata_db = MetadataDatabase()
text_embedding = TextEmbedding()
vector_db = VectorDatabase()
category_model = CategoryClassifier()


class PostBase(BaseModel):
    title: str
    description: str
    content: str
    categories: List[str]
    author_id: Optional[str] = None
    image_url: Optional[str] = None
    tags: Optional[List[str]] = []

class PostResponse(PostBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    views: int = 0
    likes: int = 0
    dislikes: int = 0


class PostsResponse(BaseModel):
    posts: List[PostResponse]
    total: int
    page: int
    page_size: int

@router.get("/related/{post_id}", response_model=List[PostResponse])
async def get_related_posts(
    post_id: str = Path(..., description="The ID of the post to find related posts for"),
    limit: int = Query(5, ge=1, le=20)
):
    try:
        post = metadata_db.db.posts.find_one({"_id": post_id})
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")

        related_posts = []
        if post.get("categories"):
            category_posts = list(metadata_db.db.posts.find(
                {
                    "_id": {"$ne": post_id},
                    "categories": {"$in": post["categories"]}
                }
            ).limit(limit))

            for related in category_posts:
                related["id"] = str(related.pop("_id"))
                related_posts.append(PostResponse(**related))

        if len(related_posts) < limit:
            remaining = limit - len(related_posts)

            text_to_embed = f"{post['title']} {post['description']} {post.get('content', '')}"
            embedding = text_embedding.get_embedding(text_to_embed)

            similar_posts = vector_db.search_similar(
                embedding=embedding,
                limit=remaining + 1
            )

            for item in similar_posts:
                if item.id == post_id:
                    continue

                similar_post = metadata_db.db.posts.find_one({"_id": item.id})
                if similar_post:
                    similar_post["id"] = str(similar_post.pop("_id"))

                    if any(p.id == similar_post["id"] for p in related_posts):
                        continue

                    similar_post["score"] = item.score
                    related_posts.append(PostResponse(**similar_post))

                    if len(related_posts) >= limit:
                        break

        return related_posts

    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error getting related posts for {post_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to get related posts")
