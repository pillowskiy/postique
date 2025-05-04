import logging
from typing import Dict, List, Optional

from app.models.recommendation import RecommendationEngine
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

router = APIRouter()
recommendation_engine = RecommendationEngine()


class PostResponse(BaseModel):
    id: str
    title: str
    description: str
    categories: List[str]
    score: float
    author_id: Optional[str] = None


class RecommendationResponse(BaseModel):
    recommendations: List[PostResponse]
    explanation: Optional[Dict] = None


@router.get("/user/{user_id}", response_model=RecommendationResponse)
async def get_recommendations(
    user_id: str, limit: int = Query(10, ge=1, le=50), with_explanation: bool = False
):
    try:
        posts = await recommendation_engine.get_user_recommendations(user_id, limit)

        recommendations = []
        for post in posts:
            metadata = post["metadata"]
            recommendations.append(
                PostResponse(
                    id=post["id"],
                    title=metadata.get("title", ""),
                    description=metadata.get("description", ""),
                    categories=metadata.get("categories", []),
                    score=post["score"],
                    author_id=metadata.get("author_id"),
                )
            )

        explanation = None
        if with_explanation:
            explanation = recommendation_engine.explain_recommendations(user_id)

        return RecommendationResponse(
            recommendations=recommendations, explanation=explanation
        )
    except Exception as e:
        logging.error(f"Error getting recommendations: {e}")
        raise HTTPException(status_code=500, detail="Failed to get recommendations")


@router.post("/user/{user_id}/post/{post_id}/more")
async def show_more(user_id: str, post_id: str):
    try:
        recommendation_engine.metadata_db.update_user_preference(
            user_id, post_id, "show-more"
        )
        return {"status": "success", "message": "Preference updated"}
    except Exception as e:
        logging.error(f"Error updating preference: {e}")
        raise HTTPException(status_code=500, detail="Failed to update preference")


@router.post("/user/{user_id}/post/{post_id}/less")
async def show_less(user_id: str, post_id: str):
    try:
        recommendation_engine.metadata_db.update_user_preference(
            user_id, post_id, "show-less"
        )
        return {"status": "success", "message": "Preference updated"}
    except Exception as e:
        logging.error(f"Error updating preference: {e}")
        raise HTTPException(status_code=500, detail="Failed to update preference")


@router.post("/user/{user_id}/post/{post_id}/view")
async def log_view(user_id: str, post_id: str):
    try:
        recommendation_engine.log_user_view(user_id, post_id)
        return {"status": "success", "message": "View logged"}
    except Exception as e:
        logging.error(f"Error logging view: {e}")
        raise HTTPException(status_code=500, detail="Failed to log view")


@router.get("/user/{user_id}/explanation", response_model=Dict)
async def get_recommendation_explanation(user_id: str):
    try:
        explanation = recommendation_engine.explain_recommendations(user_id)
        return explanation
    except Exception as e:
        logging.error(f"Error getting explanation: {e}")
        raise HTTPException(status_code=500, detail="Failed to get explanation")
