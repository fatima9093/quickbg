from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status, Request
from fastapi.responses import StreamingResponse, JSONResponse
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.db import crud
from app.api.dependencies import get_current_user
from app.db.models import User
from app.services.background_removal import remove_background
from app.core.config import settings
import time
import logging
import tempfile
import os
from typing import Optional

logger = logging.getLogger(__name__)

router = APIRouter()

# In-memory storage for anonymous user limits (use Redis in production)
anonymous_usage = {}


@router.post("/process-anonymous", response_class=StreamingResponse)
async def process_image_anonymous(
    request: Request,
    file: UploadFile = File(...)
):
    """
    Anonymous image processing - FREE 3 TRIES!
    
    No authentication required. Limited to 3 uploads per session/IP.
    After 3 tries, user must sign up to continue.
    """
    temp_output_path = None
    
    try:
        # Get client identifier (IP address for rate limiting)
        client_ip = request.client.host
        
        # Check anonymous usage limit (5 free tries)
        usage_count = anonymous_usage.get(client_ip, 0)
        
        if usage_count >= 5:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Free trial limit reached! Sign up to continue removing backgrounds."
            )
        
        # Validate file
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File must be an image"
            )
        
        # Read and validate file
        logger.info(f"Processing anonymous image: {file.filename} from {client_ip}")
        contents = await file.read()
        
        # Validate image
        from app.services.background_removal import validate_image as validate_img
        is_valid, error_msg, img_info = validate_img(contents, settings.MAX_IMAGE_SIZE_MB)
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_msg
            )
        
        logger.info(f"Anonymous image validated: {img_info}")
        
        # Process image
        start_time = time.time()
        processed_bytes, metadata = remove_background(contents)
        processing_time = time.time() - start_time
        
        logger.info(f"Anonymous processing completed in {processing_time:.2f}s")
        
        # Increment anonymous usage
        anonymous_usage[client_ip] = usage_count + 1
        remaining_tries = 5 - (usage_count + 1)
        logger.info(f"Anonymous user {client_ip} has {remaining_tries} tries remaining")
        
        # Save to temp file
        temp_output_path = tempfile.NamedTemporaryFile(delete=False, suffix=".png").name
        with open(temp_output_path, 'wb') as f:
            f.write(processed_bytes)
        
        # Prepare file for download
        def iterfile():
            with open(temp_output_path, "rb") as f:
                yield from f
            try:
                os.unlink(temp_output_path)
            except Exception as e:
                logger.error(f"Failed to delete temp file: {e}")
        
        # Generate output filename
        original_name = os.path.splitext(file.filename)[0]
        output_filename = f"{original_name}_nobg.png"
        
        return StreamingResponse(
            iterfile(),
            media_type="image/png",
            headers={
                "Content-Disposition": f'attachment; filename="{output_filename}"',
                "X-Remaining-Tries": str(remaining_tries)  # Let frontend know how many tries left
            }
        )
        
    except HTTPException:
        if temp_output_path and os.path.exists(temp_output_path):
            os.unlink(temp_output_path)
        raise
    except Exception as e:
        if temp_output_path and os.path.exists(temp_output_path):
            os.unlink(temp_output_path)
        
        logger.error(f"Anonymous processing failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Image processing failed: {str(e)}"
        )


@router.get("/anonymous-usage")
async def check_anonymous_usage(request: Request):
    """Check how many free tries the anonymous user has left."""
    client_ip = request.client.host
    usage_count = anonymous_usage.get(client_ip, 0)
    remaining_tries = max(0, 5 - usage_count)
    
    return {
        "used": usage_count,
        "remaining": remaining_tries,
        "limit": 5,
        "requires_signup": usage_count >= 5
    }


@router.post("/process", response_class=StreamingResponse)
async def process_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Instant image processing: Upload → Remove Background → Download
    
    No storage, no S3, just instant processing and download.
    Returns the processed image directly as a downloadable file.
    """
    temp_output_path = None
    
    try:
        # No rate limiting for logged-in users - unlimited usage
        # Validate file
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File must be an image"
            )
        
        # Read and validate file
        logger.info(f"Processing image: {file.filename} for user {current_user.email}")
        contents = await file.read()
        
        # Validate image (checks size, format, dimensions)
        from app.services.background_removal import validate_image as validate_img
        is_valid, error_msg, img_info = validate_img(contents, settings.MAX_IMAGE_SIZE_MB)
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_msg
            )
        
        logger.info(f"Image validated successfully: {img_info}")
        
        # Process image (remove background)
        start_time = time.time()
        logger.info(f"Starting background removal for {file.filename}")
        
        # Call remove_background with bytes
        processed_bytes, metadata = remove_background(contents)
        
        processing_time = time.time() - start_time
        logger.info(f"Background removal completed in {processing_time:.2f}s")
        
        # Save processed image to temporary file for download
        temp_output_path = tempfile.NamedTemporaryFile(delete=False, suffix=".png").name
        with open(temp_output_path, 'wb') as f:
            f.write(processed_bytes)
        
        # Update user stats
        crud.increment_user_stats(db, current_user.id, processing_time)
        logger.info(f"Updated stats for user {current_user.email}")
        
        # Prepare file for download
        def iterfile():
            with open(temp_output_path, "rb") as f:
                yield from f
            # Clean up temp file after sending
            try:
                os.unlink(temp_output_path)
            except Exception as e:
                logger.error(f"Failed to delete temp file: {e}")
        
        # Generate output filename
        original_name = os.path.splitext(file.filename)[0]
        output_filename = f"{original_name}_nobg.png"
        
        return StreamingResponse(
            iterfile(),
            media_type="image/png",
            headers={
                "Content-Disposition": f'attachment; filename="{output_filename}"'
            }
        )
        
    except HTTPException:
        # Clean up temp file on error
        if temp_output_path and os.path.exists(temp_output_path):
            os.unlink(temp_output_path)
        raise
    except Exception as e:
        # Clean up temp file on error
        if temp_output_path and os.path.exists(temp_output_path):
            os.unlink(temp_output_path)
        
        logger.error(f"Image processing failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Image processing failed: {str(e)}"
        )


@router.get("/stats")
async def get_user_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's processing statistics."""
    stats = crud.get_user_stats(db, current_user.id)
    if not stats:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User stats not found"
        )
    return stats

