from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime, date
from app.db.models import User, UserRole
from app.core.security import get_password_hash


# User CRUD operations
def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Get user by email."""
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: str) -> Optional[User]:
    """Get user by ID."""
    return db.query(User).filter(User.id == user_id).first()


def create_user(db: Session, email: str, password: str, name: Optional[str] = None, role: UserRole = UserRole.USER) -> User:
    """Create a new user."""
    hashed_password = get_password_hash(password)
    user = User(
        email=email,
        name=name,
        hashed_password=hashed_password,
        role=role,
        total_images_processed=0,
        images_processed_today=0,
        total_processing_time=0.0
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    """Get list of users."""
    return db.query(User).offset(skip).limit(limit).all()


def increment_user_stats(db: Session, user_id: str, processing_time: float) -> Optional[User]:
    """Increment user's image processing statistics."""
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        today = date.today()
        
        # Reset daily count if it's a new day
        if user.last_upload_date != today:
            user.images_processed_today = 0
        
        # Update stats
        user.total_images_processed += 1
        user.images_processed_today += 1
        user.last_upload_date = today
        user.total_processing_time += processing_time
        
        db.commit()
        db.refresh(user)
    return user


def get_user_stats(db: Session, user_id: str) -> Optional[dict]:
    """Get user's processing statistics."""
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        today = date.today()
        # Reset today's count if it's old data
        images_today = user.images_processed_today if user.last_upload_date == today else 0
        
        return {
            "total_images_processed": user.total_images_processed,
            "images_processed_today": images_today,
            "total_processing_time": user.total_processing_time,
            "last_upload_date": user.last_upload_date.isoformat() if user.last_upload_date else None
        }
    return None

