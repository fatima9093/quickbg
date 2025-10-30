from pydantic import BaseModel


class AdminStats(BaseModel):
    total_users: int
    total_uploads: int
    processing_count: int
    completed_count: int
    failed_count: int

