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
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days (7 * 24 * 60 = 10,080 minutes)
    
    # Email Configuration (IONOS)
    MAIL_USERNAME: str = os.getenv("MAIL_USERNAME", "")
    MAIL_PASSWORD: str = os.getenv("MAIL_PASSWORD", "")
    MAIL_FROM: str = os.getenv("MAIL_FROM", "contact@quickbg.app")
    MAIL_PORT: int = int(os.getenv("MAIL_PORT", "587"))
    MAIL_SERVER: str = os.getenv("MAIL_SERVER", "smtp.ionos.com")
    MAIL_FROM_NAME: str = os.getenv("MAIL_FROM_NAME", "QuickBG")
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False
    USE_CREDENTIALS: bool = True
    VALIDATE_CERTS: bool = True
    
    # Frontend URL for reset links
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    
    # Image Processing
    MAX_IMAGE_SIZE_MB: int = 10
    MAX_IMAGE_DIMENSION: int = 4096
    MIN_IMAGE_DIMENSION: int = 50
    TEMP_FILE_RETENTION_SECONDS: int = 30  # Auto-delete temp files after 30 seconds
    PROCESSING_TIME_SOFT_CAP_SECONDS: float = 15.0  # Clamp unrealistic processing spikes
    PROCESSING_TIME_DEFAULT_SECONDS: float = 4.0  # Fallback value for outlier normalization
    
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

