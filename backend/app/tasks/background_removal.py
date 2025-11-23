from app.tasks.celery_app import celery_app
from app.db.base import SessionLocal
from app.db import crud
from app.db.models import UploadStatus, TaskStatus
from app.services.storage import (
    download_from_s3_url,
    upload_to_s3,
    generate_presigned_url,
    extract_s3_key_from_url
)
from app.services.background_removal import remove_background, validate_image
import logging
import time
import traceback
import psutil
import os

logger = logging.getLogger(__name__)


@celery_app.task(
    name="process_background_removal",
    bind=True,
    max_retries=3,
    default_retry_delay=60,  # 60 seconds
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_jitter=True
)
def process_background_removal_task(self, upload_id: str, task_id: str):
    """
    Celery task to process background removal with retries and comprehensive logging.
    
    Args:
        self: Celery task instance
        upload_id: ID of the upload to process
        task_id: ID of the task record
    """
    db = SessionLocal()
    start_time = time.time()
    process = psutil.Process(os.getpid())
    initial_memory = process.memory_info().rss / 1024 / 1024  # MB
    
    try:
        logger.info(f"Starting background removal task for upload {upload_id}, task {task_id}")
        
        # Get upload and task records
        upload = crud.get_upload_by_id(db, upload_id)
        task = crud.get_task_by_id(db, task_id)
        
        if not upload:
            raise Exception(f"Upload {upload_id} not found")
        if not task:
            raise Exception(f"Task {task_id} not found")
        
        # Update task status to processing
        crud.update_task_status(db, task_id, TaskStatus.PROCESSING, progress=10)
        crud.update_upload_status(db, upload_id, UploadStatus.PROCESSING)
        
        logger.info(f"Downloading image from S3: {upload.original_url}")
        
        # Download original image
        try:
            image_bytes = download_from_s3_url(upload.original_url)
        except Exception as e:
            raise Exception(f"Failed to download original image: {str(e)}")
        
        crud.update_task_status(db, task_id, TaskStatus.PROCESSING, progress=30)
        
        # Validate image
        is_valid, error_msg, image_info = validate_image(image_bytes)
        if not is_valid:
            raise Exception(f"Image validation failed: {error_msg}")
        
        logger.info(f"Image validated: {image_info}")
        crud.update_task_status(db, task_id, TaskStatus.PROCESSING, progress=40)
        
        # Remove background
        logger.info(f"Processing background removal with ISNet (professional quality)")
        processed_bytes, metadata = remove_background(
            image_bytes,
            refine_mask=True,
            trim_transparent=True,
            alpha_matting=False  # Disabled for speed, can be enabled for complex images
        )
        
        crud.update_task_status(db, task_id, TaskStatus.PROCESSING, progress=70)
        
        # Upload processed image to S3
        logger.info(f"Uploading processed image to S3")
        processed_filename = f"processed_{upload.original_filename.rsplit('.', 1)[0]}.png"
        s3_key, processed_url = upload_to_s3(
            processed_bytes,
            processed_filename,
            folder="processed",
            content_type="image/png"
        )
        
        crud.update_task_status(db, task_id, TaskStatus.PROCESSING, progress=90)
        
        # Generate presigned URL for secure download
        presigned_url = generate_presigned_url(s3_key, expiration=3600)  # 1 hour
        
        # Calculate metrics
        processing_time = time.time() - start_time
        current_memory = process.memory_info().rss / 1024 / 1024  # MB
        memory_used = current_memory - initial_memory
        
        # Update upload record
        crud.update_upload_status(
            db,
            upload_id,
            UploadStatus.COMPLETED,
            processed_url=processed_url,
            presigned_url=presigned_url
        )
        
        # Update task record with metrics
        crud.update_task_status(
            db,
            task_id,
            TaskStatus.COMPLETED,
            progress=100,
            processing_time=processing_time,
            memory_usage=memory_used
        )
        
        # Log structured metrics
        log_metrics(
            upload_id=upload_id,
            task_id=task_id,
            status="completed",
            processing_time=processing_time,
            memory_usage=memory_used,
            metadata=metadata
        )
        
        logger.info(
            f"Successfully completed task {task_id} for upload {upload_id} "
            f"in {processing_time:.2f}s, memory: {memory_used:.2f}MB"
        )
        
        return {
            'upload_id': upload_id,
            'task_id': task_id,
            'status': 'completed',
            'processed_url': processed_url,
            'presigned_url': presigned_url,
            'processing_time': processing_time,
            'metadata': metadata
        }
    
    except Exception as e:
        processing_time = time.time() - start_time
        error_msg = str(e)
        error_trace = traceback.format_exc()
        
        logger.error(
            f"Task {task_id} failed for upload {upload_id}: {error_msg}\n{error_trace}"
        )
        
        # Update records with error
        crud.update_upload_status(
            db,
            upload_id,
            UploadStatus.FAILED,
            error_message=error_msg
        )
        
        crud.update_task_status(
            db,
            task_id,
            TaskStatus.FAILED,
            error_message=error_msg,
            processing_time=processing_time
        )
        
        # Log metrics
        log_metrics(
            upload_id=upload_id,
            task_id=task_id,
            status="failed",
            processing_time=processing_time,
            error=error_msg
        )
        
        # Check if should retry
        if self.request.retries < self.max_retries:
            logger.info(
                f"Retrying task {task_id} (attempt {self.request.retries + 1}/{self.max_retries})"
            )
            crud.increment_task_retry(db, task_id)
            raise self.retry(exc=e)
        else:
            logger.error(f"Task {task_id} failed after {self.max_retries} retries")
            return {
                'upload_id': upload_id,
                'task_id': task_id,
                'status': 'failed',
                'error': error_msg
            }
    
    finally:
        db.close()


def log_metrics(
    upload_id: str,
    task_id: str,
    status: str,
    processing_time: float,
    memory_usage: float = None,
    error: str = None,
    metadata: dict = None
):
    """
    Log structured metrics for monitoring and observability.
    
    Args:
        upload_id: Upload ID
        task_id: Task ID
        status: Task status (completed/failed)
        processing_time: Processing time in seconds
        memory_usage: Memory used in MB
        error: Error message if failed
        metadata: Processing metadata
    """
    metrics = {
        'timestamp': time.time(),
        'upload_id': upload_id,
        'task_id': task_id,
        'status': status,
        'processing_time_seconds': round(processing_time, 2),
    }
    
    if memory_usage is not None:
        metrics['memory_usage_mb'] = round(memory_usage, 2)
    
    if error:
        metrics['error'] = error
    
    if metadata:
        metrics['metadata'] = metadata
    
    # Log as structured JSON for easy parsing
    logger.info(f"METRICS: {metrics}")
    
    # Write to metrics file for later collection
    try:
        metrics_file = "logs/metrics.log"
        os.makedirs("logs", exist_ok=True)
        with open(metrics_file, "a") as f:
            import json
            f.write(json.dumps(metrics) + "\n")
    except Exception as e:
        logger.warning(f"Failed to write metrics file: {str(e)}")

