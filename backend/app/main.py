from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.core.config import settings
from app.api.v1.api import api_router

# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    logger.info("Starting QuickBG Backend API")
    
    # PRE-WARM the AI model for INSTANT first request!
    logger.info("Pre-warming AI model for fast processing...")
    try:
        from app.services.background_removal import get_session
        get_session()  # Load model into memory NOW
        logger.info("✅ AI model ready! First upload will be FAST!")
    except Exception as e:
        logger.warning(f"⚠️ Failed to pre-warm model: {e}")
    
    yield
    logger.info("Shutting down QuickBG Backend API")


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="AI-powered background removal API using ISNet",
    openapi_url=f"/api/{settings.API_VERSION}/openapi.json",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Remaining-Tries"],  # Allow frontend to read this custom header
)

# Include API router
app.include_router(api_router, prefix=f"/api/{settings.API_VERSION}")

@app.get("/")
async def root():
    return {
        "message": "QuickBG API - AI Background Removal",
        "version": "1.0.0",
        "status": "operational",
        "docs": f"/api/{settings.API_VERSION}/docs"
    }

