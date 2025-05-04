from datetime import datetime
import logging
from typing import List, Optional

from app.models.categorization import CategoryClassifier
from app.models.database import VectorDatabase
from app.models.metadata_database import MetadataDatabase
from app.models.embedding import TextEmbedding
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

router = APIRouter()
text_embedding = TextEmbedding()
vector_db = VectorDatabase()
metadata_db = MetadataDatabase()
category_model = CategoryClassifier()


class SearchPostResponse(BaseModel):
    id: str
    title: str
    description: str
    categories: List[str]
    score: float


class SearchResponse(BaseModel):
    results: List[SearchPostResponse]
    total: int
    query: str


class SearchPostCreateResponse(BaseModel):
    id: str

@router.get("/text", response_model=SearchResponse)
async def search_by_text(
    q: str = Query(..., min_length=1, description="Текст для пошуку"),
    limit: int = Query(10, ge=1, le=50),
    threshold: Optional[float] = Query(0.6, ge=0, le=1),
):
    try:
        query_embedding = text_embedding.get_embedding(q)

        search_results = vector_db.search_similar(
            embedding=query_embedding, limit=limit, threshold=threshold
        )

        results = []
        for result in search_results:
            metadata = result.payload
            results.append(
                SearchPostResponse(
                    id=result.id,
                    title=metadata.get("title", ""),
                    description=metadata.get("description", ""),
                    categories=metadata.get("categories", []),
                    score=result.score,
                )
            )

        return SearchResponse(results=results, total=len(results), query=q)

    except Exception as e:
        logging.error(f"Error searching by text: {e}")
        raise HTTPException(status_code=500, detail="Failed to search")


@router.get("/category/{category}", response_model=SearchResponse)
async def search_by_category(
    category: str, q: Optional[str] = None, limit: int = Query(10, ge=1, le=50)
):
    try:
        query_embedding = None
        if q:
            query_embedding = text_embedding.get_embedding(q)

        search_results = vector_db.search_by_category(
            category=category, embedding=query_embedding, limit=limit
        )

        results = []
        for result in search_results:
            metadata = result.payload if hasattr(result, "payload") else result

            score = result.score if hasattr(result, "score") else 1.0

            results.append(
                SearchPostResponse(
                    id=result.id if hasattr(result, "id") else metadata.get("_id", ""),
                    title=metadata.get("title", ""),
                    description=metadata.get("description", ""),
                    categories=metadata.get("categories", []),
                    score=score,
                )
            )

        return SearchResponse(
            results=results,
            total=len(results),
            query=f"category:{category}" + (f" query:{q}" if q else ""),
        )

    except Exception as e:
        logging.error(f"Error searching by category: {e}")
        raise HTTPException(status_code=500, detail="Failed to search")
