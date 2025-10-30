import boto3
from botocore.exceptions import ClientError, BotoCoreError
from app.core.config import settings
import uuid
import logging
from typing import Optional, Tuple
from io import BytesIO

logger = logging.getLogger(__name__)

# Initialize S3 client
s3_client = boto3.client(
    's3',
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    region_name=settings.AWS_REGION
)


def upload_to_s3(
    file_content: bytes,
    filename: str,
    folder: str = "uploads",
    content_type: str = "image/png"
) -> Tuple[str, str]:
    """
    Upload file to S3 and return both the S3 key and public URL.
    
    Args:
        file_content: The file content as bytes
        filename: Original filename
        folder: S3 folder (originals, processed)
        content_type: MIME type of the file
    
    Returns:
        Tuple of (s3_key, public_url)
    
    Raises:
        Exception: If upload fails
    """
    try:
        # Generate unique filename
        file_extension = filename.split('.')[-1] if '.' in filename else 'png'
        s3_key = f"{folder}/{uuid.uuid4()}.{file_extension}"
        
        logger.info(f"Uploading to S3: {s3_key} ({len(file_content)} bytes)")
        
        s3_client.put_object(
            Bucket=settings.S3_BUCKET_NAME,
            Key=s3_key,
            Body=file_content,
            ContentType=content_type,
            ServerSideEncryption='AES256'
        )
        
        # Generate public URL
        url = f"https://{settings.S3_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/{s3_key}"
        
        logger.info(f"Successfully uploaded to S3: {url}")
        return s3_key, url
    
    except ClientError as e:
        error_msg = f"S3 upload failed: {str(e)}"
        logger.error(error_msg)
        raise Exception(error_msg)
    except BotoCoreError as e:
        error_msg = f"S3 connection error: {str(e)}"
        logger.error(error_msg)
        raise Exception(error_msg)


def download_from_s3(s3_key: str) -> bytes:
    """
    Download file from S3 given its key.
    
    Args:
        s3_key: S3 object key
    
    Returns:
        File content as bytes
    
    Raises:
        Exception: If download fails
    """
    try:
        logger.info(f"Downloading from S3: {s3_key}")
        
        response = s3_client.get_object(
            Bucket=settings.S3_BUCKET_NAME,
            Key=s3_key
        )
        
        content = response['Body'].read()
        logger.info(f"Successfully downloaded from S3: {len(content)} bytes")
        return content
    
    except ClientError as e:
        if e.response['Error']['Code'] == 'NoSuchKey':
            error_msg = f"File not found in S3: {s3_key}"
        else:
            error_msg = f"S3 download failed: {str(e)}"
        logger.error(error_msg)
        raise Exception(error_msg)
    except BotoCoreError as e:
        error_msg = f"S3 connection error: {str(e)}"
        logger.error(error_msg)
        raise Exception(error_msg)


def download_from_s3_url(url: str) -> bytes:
    """
    Download file from S3 given its public URL.
    
    Args:
        url: S3 public URL
    
    Returns:
        File content as bytes
    """
    try:
        # Extract key from URL
        s3_key = url.split(f"{settings.S3_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/")[1]
        return download_from_s3(s3_key)
    except IndexError:
        raise Exception(f"Invalid S3 URL format: {url}")


def generate_presigned_url(s3_key: str, expiration: int = 3600) -> str:
    """
    Generate a presigned URL for temporary access to an S3 object.
    
    Args:
        s3_key: S3 object key
        expiration: Time in seconds for URL to remain valid (default 1 hour)
    
    Returns:
        Presigned URL as string
    
    Raises:
        Exception: If URL generation fails
    """
    try:
        logger.info(f"Generating presigned URL for: {s3_key} (expires in {expiration}s)")
        
        url = s3_client.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': settings.S3_BUCKET_NAME,
                'Key': s3_key
            },
            ExpiresIn=expiration
        )
        
        return url
    
    except ClientError as e:
        error_msg = f"Failed to generate presigned URL: {str(e)}"
        logger.error(error_msg)
        raise Exception(error_msg)


def check_s3_connection() -> bool:
    """
    Check if S3 is accessible.
    
    Returns:
        True if S3 is accessible, False otherwise
    """
    try:
        s3_client.head_bucket(Bucket=settings.S3_BUCKET_NAME)
        return True
    except Exception as e:
        logger.error(f"S3 health check failed: {str(e)}")
        return False


def extract_s3_key_from_url(url: str) -> str:
    """
    Extract S3 key from a full S3 URL.
    
    Args:
        url: Full S3 URL
    
    Returns:
        S3 key
    """
    try:
        return url.split(f"{settings.S3_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/")[1]
    except IndexError:
        raise Exception(f"Invalid S3 URL format: {url}")

