import pytest
from io import BytesIO
from PIL import Image
from unittest.mock import patch, Mock

from app.db import crud
from app.db.models import UserRole


@pytest.fixture
def test_user(db):
    """Create a test user."""
    return crud.create_user(
        db=db,
        email="test@example.com",
        password="testpass123",
        name="Test User",
        role=UserRole.USER
    )


@pytest.fixture
def auth_headers(test_user):
    """Generate auth headers for test user."""
    from app.core.security import create_access_token
    token = create_access_token(data={"sub": test_user.id})
    return {"Authorization": f"Bearer {token}"}


def create_test_image():
    """Create a test image file."""
    img = Image.new('RGB', (300, 300), color='red')
    buffer = BytesIO()
    img.save(buffer, format='JPEG')
    buffer.seek(0)
    return buffer


@patch('app.api.v1.endpoints.uploads.upload_to_s3')
@patch('app.api.v1.endpoints.uploads.process_background_removal_task')
def test_upload_image_success(mock_celery_task, mock_s3, client, auth_headers, test_user, db):
    """Test successful image upload."""
    # Mock S3 upload
    mock_s3.return_value = ("originals/test.jpg", "https://s3.amazonaws.com/bucket/originals/test.jpg")
    
    # Mock Celery task
    mock_celery_task.delay.return_value = Mock(id="celery-task-123")
    
    # Create test image
    test_image = create_test_image()
    
    # Upload image
    response = client.post(
        "/api/v1/uploads",
        files={"file": ("test.jpg", test_image, "image/jpeg")},
        headers=auth_headers
    )
    
    assert response.status_code == 201
    data = response.json()
    assert "upload_id" in data
    assert "task_id" in data
    assert data["status"] == "queued"
    
    # Verify upload was created in database
    upload = crud.get_upload_by_id(db, data["upload_id"])
    assert upload is not None
    assert upload.user_id == test_user.id
    assert upload.status.value == "queued"


def test_upload_image_no_file(client, auth_headers):
    """Test upload without file."""
    response = client.post(
        "/api/v1/uploads",
        headers=auth_headers
    )
    
    assert response.status_code == 400
    assert "must be provided" in response.json()["detail"]


def test_upload_image_invalid_type(client, auth_headers):
    """Test upload with invalid file type."""
    # Create a text file instead of image
    text_file = BytesIO(b"This is not an image")
    
    response = client.post(
        "/api/v1/uploads",
        files={"file": ("test.txt", text_file, "text/plain")},
        headers=auth_headers
    )
    
    assert response.status_code == 400
    assert "Only image files are allowed" in response.json()["detail"]


@patch('app.api.v1.endpoints.uploads.validate_image')
def test_upload_image_too_large(mock_validate, client, auth_headers):
    """Test upload with oversized image."""
    mock_validate.return_value = (False, "File size exceeds maximum", {})
    
    test_image = create_test_image()
    
    response = client.post(
        "/api/v1/uploads",
        files={"file": ("large.jpg", test_image, "image/jpeg")},
        headers=auth_headers
    )
    
    assert response.status_code == 400
    assert "exceeds maximum" in response.json()["detail"]


def test_upload_image_unauthorized(client):
    """Test upload without authentication."""
    test_image = create_test_image()
    
    response = client.post(
        "/api/v1/uploads",
        files={"file": ("test.jpg", test_image, "image/jpeg")}
    )
    
    assert response.status_code == 401


@patch('app.api.v1.endpoints.uploads.download_from_s3')
@patch('app.api.v1.endpoints.uploads.process_background_removal_task')
def test_upload_s3_key_reference(mock_celery_task, mock_s3_download, client, auth_headers, db):
    """Test upload using S3 key reference."""
    # Mock S3 download
    img = Image.new('RGB', (300, 300), color='blue')
    buffer = BytesIO()
    img.save(buffer, format='JPEG')
    mock_s3_download.return_value = buffer.getvalue()
    
    # Mock Celery task
    mock_celery_task.delay.return_value = Mock(id="celery-task-456")
    
    response = client.post(
        "/api/v1/uploads",
        data={"s3_key": "originals/existing-image.jpg"},
        headers=auth_headers
    )
    
    assert response.status_code == 201
    data = response.json()
    assert "upload_id" in data
    assert "task_id" in data


def test_get_uploads(client, auth_headers, test_user, db):
    """Test getting user's uploads."""
    # Create some test uploads
    upload1 = crud.create_upload(
        db=db,
        user_id=test_user.id,
        original_filename="test1.jpg",
        original_url="https://s3.amazonaws.com/bucket/test1.jpg"
    )
    upload2 = crud.create_upload(
        db=db,
        user_id=test_user.id,
        original_filename="test2.jpg",
        original_url="https://s3.amazonaws.com/bucket/test2.jpg"
    )
    
    response = client.get("/api/v1/uploads", headers=auth_headers)
    
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["id"] == upload1.id
    assert data[1]["id"] == upload2.id


def test_get_upload_by_id(client, auth_headers, test_user, db):
    """Test getting specific upload."""
    upload = crud.create_upload(
        db=db,
        user_id=test_user.id,
        original_filename="test.jpg",
        original_url="https://s3.amazonaws.com/bucket/test.jpg"
    )
    
    response = client.get(f"/api/v1/uploads/{upload.id}", headers=auth_headers)
    
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == upload.id
    assert data["original_filename"] == "test.jpg"


def test_get_upload_not_found(client, auth_headers):
    """Test getting non-existent upload."""
    response = client.get("/api/v1/uploads/non-existent-id", headers=auth_headers)
    
    assert response.status_code == 404


def test_get_upload_unauthorized_access(client, db):
    """Test accessing another user's upload."""
    # Create another user
    other_user = crud.create_user(
        db=db,
        email="other@example.com",
        password="otherpass123",
        role=UserRole.USER
    )
    
    # Create upload for other user
    upload = crud.create_upload(
        db=db,
        user_id=other_user.id,
        original_filename="test.jpg",
        original_url="https://s3.amazonaws.com/bucket/test.jpg"
    )
    
    # Try to access with different user's token
    from app.core.security import create_access_token
    token = create_access_token(data={"sub": "different-user-id"})
    headers = {"Authorization": f"Bearer {token}"}
    
    response = client.get(f"/api/v1/uploads/{upload.id}", headers=headers)
    
    # Should fail because token is invalid (user doesn't exist)
    assert response.status_code in [401, 403, 404]

