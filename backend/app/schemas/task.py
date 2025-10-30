from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TaskResponse(BaseModel):
    id: str
    upload_id: str
    celery_task_id: Optional[str] = None
    status: str
    progress: int
    error_message: Optional[str] = None
    retry_count: int
    max_retries: int
    processing_time: Optional[float] = None
    memory_usage: Optional[float] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TaskStatusResponse(BaseModel):
    task_id: str
    upload_id: str
    status: str
    progress: int
    result_url: Optional[str] = None
    presigned_url: Optional[str] = None
    error_message: Optional[str] = None
    processing_time: Optional[float] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

