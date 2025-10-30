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
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.USER)
    
    # Usage Statistics (no image storage, just counts)
    total_images_processed = Column(Integer, default=0)
    images_processed_today = Column(Integer, default=0)
    last_upload_date = Column(Date)
    
    # Performance metrics
    total_processing_time = Column(Float, default=0.0)  # Total seconds spent processing
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

