from sqlalchemy import Column, String, DateTime, Enum, Integer, Float, Date
from sqlalchemy.sql import func
from app.db.base import Base
import enum
import uuid


class UserRole(str, enum.Enum):
    USER = "user"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String)
    hashed_password = Column(String, nullable=True)  # Nullable for OAuth users
    role = Column(Enum(UserRole), default=UserRole.USER)
    
    # OAuth fields
    google_id = Column(String, unique=True, nullable=True, index=True)
    avatar = Column(String, nullable=True)
    oauth_provider = Column(String, nullable=True)  # 'google', 'github', etc.
    
    # Password Reset
    reset_token = Column(String, nullable=True)
    reset_token_expires = Column(DateTime(timezone=True), nullable=True)
    
    # Usage Statistics (no image storage, just counts)
    total_images_processed = Column(Integer, default=0)
    images_processed_today = Column(Integer, default=0)
    last_upload_date = Column(Date)
    
    # Performance metrics
    total_processing_time = Column(Float, default=0.0)  # Total seconds spent processing
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

