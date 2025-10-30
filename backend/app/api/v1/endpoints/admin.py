from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.base import get_db
from app.db import crud
from app.schemas.auth import UserResponse
from app.api.dependencies import get_current_admin_user
from app.db.models import User

router = APIRouter()


@router.get("/stats")
async def get_stats(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get admin dashboard statistics."""
    from sqlalchemy import func
    
    total_users = db.query(func.count(User.id)).scalar()
    total_images_processed = db.query(func.sum(User.total_images_processed)).scalar()
    total_processing_time = db.query(func.sum(User.total_processing_time)).scalar()
    
    return {
        "total_users": total_users or 0,
        "total_images_processed": int(total_images_processed or 0),
        "total_processing_time": round(float(total_processing_time or 0), 2),
        "avg_processing_time": round(float(total_processing_time or 0) / float(total_images_processed or 1), 2)
    }


@router.get("/users", response_model=List[UserResponse])
async def get_users(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get all users with their stats (admin only)."""
    users = crud.get_users(db, skip, limit)
    return [
        UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            role=user.role,
            created_at=user.created_at
        )
        for user in users
    ]

