# QuickBG Backend - AI Background Removal API

Production-grade FastAPI backend for AI-powered background removal using U²-Net.

## Features

- ✅ **ISNet Background Removal** with professional quality edge detection
- ✅ **Async Job Queue** with Celery + Redis
- ✅ **S3 Storage** with presigned URLs for secure downloads
- ✅ **Comprehensive Health Checks** (DB, Redis, S3)
- ✅ **Task Status Tracking** with progress and metrics
- ✅ **Auto-retry** on failure (configurable, default 3 retries)
- ✅ **Structured Logging** with metrics (duration, memory usage)
- ✅ **Input Validation** (file size, dimensions, format)
- ✅ **Unit & Integration Tests**

## Architecture

```
User → FastAPI → Upload to S3 → Create Task → Queue Celery Job
                      ↓
                 Return {upload_id, task_id}
                      
Celery Worker → Download from S3 → U²-Net Processing → Upload Result → Update DB
```

## Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Set Up Environment

Create `.env` file:

```bash
# Database
DATABASE_URL=postgresql://quickbg_user:quickbg_pass@localhost:5432/quickbg

# Redis
REDIS_URL=redis://localhost:6379/0

# AWS S3
AWS_ACCESS_KEY_ID=your-key-id
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=quickbg-uploads

# Security
SECRET_KEY=your-random-secret-key-here
```

### 3. Run Database Migrations

```bash
alembic upgrade head
```

### 4. Start Services

**Start API Server:**
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Start Celery Worker:**
```bash
celery -A app.tasks.celery_app worker --loglevel=info --concurrency=2
```

**API Docs:** http://localhost:8000/api/v1/docs

## API Usage

### 1. Upload Image for Processing

**POST** `/api/v1/uploads`

**Option A: Multipart File Upload**
```bash
curl -X POST "http://localhost:8000/api/v1/uploads" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/image.jpg"
```

**Option B: S3 Key Reference**
```bash
curl -X POST "http://localhost:8000/api/v1/uploads" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F "s3_key=originals/existing-image.jpg"
```

**Response:**
```json
{
  "upload_id": "abc-123-def-456",
  "task_id": "xyz-789-uvw-012",
  "status": "queued",
  "message": "Image queued for processing"
}
```

### 2. Check Task Status

**GET** `/api/v1/tasks/{task_id}`

```bash
curl -X GET "http://localhost:8000/api/v1/tasks/xyz-789-uvw-012" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (Processing):**
```json
{
  "task_id": "xyz-789-uvw-012",
  "upload_id": "abc-123-def-456",
  "status": "processing",
  "progress": 70,
  "result_url": null,
  "presigned_url": null,
  "error_message": null,
  "processing_time": null,
  "created_at": "2025-10-28T10:30:00Z",
  "updated_at": "2025-10-28T10:30:15Z"
}
```

**Response (Completed):**
```json
{
  "task_id": "xyz-789-uvw-012",
  "upload_id": "abc-123-def-456",
  "status": "completed",
  "progress": 100,
  "result_url": "https://s3.amazonaws.com/bucket/processed/image.png",
  "presigned_url": "https://s3.amazonaws.com/bucket/processed/image.png?X-Amz-Signature=...",
  "error_message": null,
  "processing_time": 4.52,
  "created_at": "2025-10-28T10:30:00Z",
  "updated_at": "2025-10-28T10:30:20Z"
}
```

### 3. Health Check

**GET** `/api/v1/health`

```bash
curl http://localhost:8000/api/v1/health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "quickbg-backend",
  "checks": {
    "api": "ok",
    "database": "ok",
    "redis": "ok",
    "s3": "ok"
  }
}
```

## Image Processing Pipeline

The background removal task performs these steps:

1. **Download** original image from S3
2. **Validate** image (size, dimensions, format)
3. **Apply ISNet** model for professional background removal
4. **Refine mask edges** using morphological operations
5. **Trim transparent areas** with padding
6. **Upload result** to S3 as PNG
7. **Generate presigned URL** (1-hour expiration)
8. **Log metrics** (processing time, memory usage)
9. **Update database** with result URLs

## Configuration

### Image Validation Rules

- **Max file size:** 10 MB (configurable)
- **Max dimensions:** 4096x4096 px
- **Min dimensions:** 50x50 px
- **Supported formats:** JPEG, PNG, WEBP, BMP

### Task Configuration

- **Max retries:** 3
- **Retry delay:** 60 seconds (exponential backoff)
- **Task timeout:** 5 minutes
- **Presigned URL expiration:** 1 hour

## Monitoring & Observability

### Structured Logging

All tasks emit structured JSON logs:

```json
{
  "timestamp": 1698500000,
  "upload_id": "abc-123",
  "task_id": "xyz-789",
  "status": "completed",
  "processing_time_seconds": 4.52,
  "memory_usage_mb": 128.5,
  "metadata": {
    "original_size": [800, 600],
    "processed_size": [795, 595],
    "compression_ratio": 0.82
  }
}
```

### Metrics File

Metrics are written to `logs/metrics.log` for collection by monitoring tools (Prometheus, Datadog, etc.).

## Testing

### Run Unit Tests

```bash
pytest tests/test_background_removal.py -v
```

### Run Integration Tests

```bash
pytest tests/test_upload_endpoint.py -v
```

### Run All Tests with Coverage

```bash
pytest --cov=app --cov-report=html
```

### Test Upload Endpoint Manually

```bash
# Create a test user first (if needed)
python scripts/create-admin.py

# Get JWT token (implement auth endpoint first)
# Then test upload
curl -X POST "http://localhost:8000/api/v1/uploads" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@test-image.jpg"
```

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/
│   │       │   ├── uploads.py       # Upload endpoint with validation
│   │       │   ├── tasks.py         # Task status endpoint
│   │       │   ├── health.py        # Health check
│   │       │   └── ...
│   │       └── api.py
│   ├── core/
│   │   ├── config.py                # Settings & environment
│   │   └── security.py              # JWT, password hashing
│   ├── db/
│   │   ├── models.py                # User, Upload, Task models
│   │   ├── crud.py                  # Database operations
│   │   └── base.py                  # Database session
│   ├── services/
│   │   ├── storage.py               # S3 upload/download/presigned URLs
│   │   └── background_removal.py    # U²-Net processing + refinement
│   ├── tasks/
│   │   ├── celery_app.py            # Celery configuration
│   │   └── background_removal.py    # Async processing task
│   └── main.py                      # FastAPI app
├── tests/
│   ├── conftest.py                  # Test fixtures
│   ├── test_background_removal.py   # Unit tests
│   └── test_upload_endpoint.py      # Integration tests
├── alembic/                         # Database migrations
├── logs/                            # Metrics logs
├── requirements.txt
└── README.md
```

## Deployment

See main project `DEPLOYMENT.md` for production deployment instructions.

## Error Handling

The API returns clear, actionable error messages:

```json
{
  "detail": "File size (12.5MB) exceeds maximum (10MB)"
}
```

```json
{
  "detail": "Image dimensions too large (max 4096x4096)"
}
```

```json
{
  "detail": "Unsupported image format: GIF"
}
```

## Performance Notes

- **Celery concurrency:** Set based on CPU cores and memory
- **Worker prefetch:** Set to 1 to prevent memory issues
- **Task timeout:** 5 minutes (adjustable for large images)
- **Memory:** ~200-500 MB per task depending on image size

## Troubleshooting

### Task stuck in "queued"
- Check if Celery worker is running
- Check Redis connection

### S3 upload fails
- Verify AWS credentials
- Check S3 bucket permissions and region

### High memory usage
- Reduce Celery concurrency
- Add `worker_max_tasks_per_child` limit

### Slow processing
- Enable alpha_matting=False (default)
- Use smaller images
- Scale Celery workers horizontally

## License

MIT
