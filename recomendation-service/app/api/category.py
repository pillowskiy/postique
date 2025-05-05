import logging
from typing import Dict, List, Optional

from app.models.categorization import CategoryClassifier
from app.models.metadata_database import MetadataDatabase
from fastapi import APIRouter, Body, HTTPException, Query
from pydantic import BaseModel

router = APIRouter()
metadata_db = MetadataDatabase()
category_model = CategoryClassifier()


class Category(BaseModel):
    name: str
    description: Optional[str] = None
    parent_category: Optional[str] = None
    post_count: Optional[int] = None


class CategoriesResponse(BaseModel):
    categories: List[Category]
    total: int


class CategoryCreateRequest(BaseModel):
    name: str
    description: Optional[str] = None
    parent_category: Optional[str] = None


@router.get("/", response_model=CategoriesResponse)
async def get_all_categories(
    limit: int = Query(50, ge=1, le=100),
    skip: int = Query(0, ge=0),
    sort_by: str = Query("name", regex="^(name|post_count)$"),
    sort_order: int = Query(1, ge=-1, le=1),
):
    try:
        sort_field = sort_by
        categories_cursor = (
            metadata_db.db.categories.find({})
            .sort(sort_field, sort_order)
            .skip(skip)
            .limit(limit)
        )

        total_count = metadata_db.db.categories.count_documents({})

        result = []
        for category in categories_cursor:
            post_count = metadata_db.db.posts.count_documents(
                {"categories": category["name"]}
            )

            result.append(
                Category(
                    name=category["name"],
                    description=category.get("description"),
                    parent_category=category.get("parent_category"),
                    post_count=post_count,
                )
            )

        return CategoriesResponse(categories=result, total=total_count)

    except Exception as e:
        logging.error(f"Error fetching categories: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch categories")

@router.get("/{category_name}/posts", response_model=List[Dict])
async def get_posts_by_category(
    category_name: str,
    limit: int = Query(10, ge=1, le=50),
    skip: int = Query(0, ge=0),
    sort_by: str = Query("created_at", regex="^(created_at|title|views)$"),
    sort_order: int = Query(-1, ge=-1, le=1),
):
    try:
        category = metadata_db.db.categories.find_one({"name": category_name})
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")

        posts_cursor = (
            metadata_db.db.posts.find({"categories": category_name})
            .sort(sort_by, sort_order)
            .skip(skip)
            .limit(limit)
        )

        posts = []
        for post in posts_cursor:
            posts.append(
                {
                    "id": str(post["_id"]),
                    "title": post.get("title", ""),
                    "description": post.get("description", ""),
                    "categories": post.get("categories", []),
                    "author_id": post.get("author_id"),
                    "created_at": post.get("created_at"),
                    "views": post.get("views", 0),
                }
            )

        return posts

    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error fetching posts for category {category_name}: {e}")
        raise HTTPException(
            status_code=500, detail="Failed to fetch posts for category"
        )


@router.get("/trending")
async def get_trending_categories(
    limit: int = Query(10, ge=1, le=20), days: int = Query(7, ge=1, le=30)
):
    try:
        import datetime

        threshold_date = datetime.datetime.now() - datetime.timedelta(days=days)

        pipeline = [
            {"$match": {"created_at": {"$gte": threshold_date}}},
            {"$unwind": "$categories"},
            {"$group": {"_id": "$categories", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": limit},
        ]

        trending = list(metadata_db.db.posts.aggregate(pipeline))

        result = []
        for item in trending:
            category_name = item["_id"]
            category = metadata_db.db.categories.find_one({"name": category_name})

            result.append(
                {
                    "name": category_name,
                    "description": category.get("description") if category else None,
                    "post_count": item["count"],
                }
            )

        return {"trending_categories": result}

    except Exception as e:
        logging.error(f"Error getting trending categories: {e}")
        raise HTTPException(status_code=500, detail="Failed to get trending categories")
