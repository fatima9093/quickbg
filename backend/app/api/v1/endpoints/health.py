from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
import logging

from app.db.base import get_db

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("")
async def health_check(db: Session = Depends(get_db)):
    """
    Health check endpoint.
    
    Checks:
    - API responsiveness
    - Database connection
    """
    health_status = {
        "status": "healthy",
        "service": "quickbg-backend",
        "checks": {
            "api": "ok",
            "database": "unknown"
        }
    }
    
    # Check database
    try:
        db.execute(text("SELECT 1"))
        health_status["checks"]["database"] = "ok"
    except Exception as e:
        logger.error(f"Database health check failed: {str(e)}")
        health_status["checks"]["database"] = "error"
        health_status["status"] = "degraded"
    
    return health_status

