from fastapi import APIRouter
from app.api.v1.endpoints import auth, process, admin, health

api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(process.router, tags=["process"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])

