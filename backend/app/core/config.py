from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "QuickBG"
    DEBUG: bool = False
    API_VERSION: str = "v1"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://quickbg_user:quickbg_pass@localhost:5432/quickbg")
    
    # JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "CHANGE_THIS_SECRET_KEY_IN_PRODUCTION")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Image Processing
    MAX_IMAGE_SIZE_MB: int = 10
    MAX_IMAGE_DIMENSION: int = 4096
    MIN_IMAGE_DIMENSION: int = 50
    TEMP_FILE_RETENTION_SECONDS: int = 30  # Auto-delete temp files after 30 seconds
    
    # Rate Limiting (per user)
    MAX_IMAGES_PER_DAY: int = 50  # Free tier limit
    MAX_IMAGES_PER_MONTH: int = 500
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # Ignore extra fields from old .env file

    @property
    def get_cors_origins(self) -> List[str]:
        origins = os.getenv("CORS_ORIGINS", "http://localhost:3000")
        return [origin.strip() for origin in origins.split(",")]


settings = Settings()

