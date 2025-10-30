#!/usr/bin/env python3
"""
Script to test AWS S3 connection and permissions.
Usage: python scripts/test-s3.py
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

import boto3
from botocore.exceptions import ClientError
from app.core.config import settings


def test_s3_connection():
    """Test S3 connection and permissions."""
    print("=== Testing AWS S3 Connection ===\n")
    
    print(f"Bucket: {settings.S3_BUCKET_NAME}")
    print(f"Region: {settings.AWS_REGION}\n")
    
    # Create S3 client
    try:
        s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION
        )
        print("✓ S3 client created successfully")
    except Exception as e:
        print(f"✗ Failed to create S3 client: {e}")
        return
    
    # Test bucket access
    try:
        s3_client.head_bucket(Bucket=settings.S3_BUCKET_NAME)
        print("✓ Bucket exists and is accessible")
    except ClientError as e:
        error_code = e.response['Error']['Code']
        if error_code == '404':
            print(f"✗ Bucket '{settings.S3_BUCKET_NAME}' does not exist")
        elif error_code == '403':
            print(f"✗ Access denied to bucket '{settings.S3_BUCKET_NAME}'")
        else:
            print(f"✗ Error accessing bucket: {e}")
        return
    
    # Test upload permission
    test_key = "test/connection-test.txt"
    test_content = b"S3 connection test"
    
    try:
        s3_client.put_object(
            Bucket=settings.S3_BUCKET_NAME,
            Key=test_key,
            Body=test_content,
            ContentType="text/plain"
        )
        print("✓ Upload permission: OK")
    except ClientError as e:
        print(f"✗ Upload permission: FAILED - {e}")
        return
    
    # Test read permission
    try:
        response = s3_client.get_object(
            Bucket=settings.S3_BUCKET_NAME,
            Key=test_key
        )
        content = response['Body'].read()
        if content == test_content:
            print("✓ Read permission: OK")
        else:
            print("✗ Read permission: Content mismatch")
    except ClientError as e:
        print(f"✗ Read permission: FAILED - {e}")
    
    # Test delete permission
    try:
        s3_client.delete_object(
            Bucket=settings.S3_BUCKET_NAME,
            Key=test_key
        )
        print("✓ Delete permission: OK")
    except ClientError as e:
        print(f"✗ Delete permission: FAILED - {e}")
    
    # List objects (optional test)
    try:
        response = s3_client.list_objects_v2(
            Bucket=settings.S3_BUCKET_NAME,
            MaxKeys=5
        )
        count = response.get('KeyCount', 0)
        print(f"✓ List permission: OK ({count} objects in bucket)")
    except ClientError as e:
        print(f"✗ List permission: FAILED - {e}")
    
    # Generate presigned URL test
    try:
        url = s3_client.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': settings.S3_BUCKET_NAME,
                'Key': 'test/dummy.txt'
            },
            ExpiresIn=3600
        )
        print("✓ Presigned URL generation: OK")
    except Exception as e:
        print(f"✗ Presigned URL generation: FAILED - {e}")
    
    print("\n=== S3 Connection Test Complete ===")


if __name__ == "__main__":
    try:
        test_s3_connection()
    except KeyboardInterrupt:
        print("\n\nTest cancelled by user")
        sys.exit(0)
    except Exception as e:
        print(f"\nUnexpected error: {e}")
        sys.exit(1)

