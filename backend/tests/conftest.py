import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
from unittest.mock import Mock, patch

from app.db.base import Base
from app.main import app
from app.db.base import get_db
from app.core.config import settings

# Test database URL
TEST_DATABASE_URL = "sqlite:///./test.db"

# Create test engine
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db():
    """Create a fresh database for each test."""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db):
    """Create a test client with database override."""
    def override_get_db():
        try:
            yield db
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def mock_s3():
    """Mock S3 operations."""
    with patch('app.services.storage.s3_client') as mock:
        mock.put_object.return_value = {}
        mock.get_object.return_value = {'Body': Mock(read=lambda: b'fake_image_data')}
        mock.generate_presigned_url.return_value = "https://fake-presigned-url.com"
        mock.head_bucket.return_value = {}
        yield mock


@pytest.fixture
def mock_rembg():
    """Mock rembg background removal."""
    with patch('app.services.background_removal.remove') as mock:
        from PIL import Image
        from io import BytesIO
        
        # Return a fake transparent image
        img = Image.new('RGBA', (100, 100), (0, 0, 0, 0))
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)
        
        mock.return_value = Image.open(buffer)
        yield mock


@pytest.fixture
def sample_image_bytes():
    """Generate sample image bytes for testing."""
    from PIL import Image
    from io import BytesIO
    
    img = Image.new('RGB', (200, 200), color='red')
    buffer = BytesIO()
    img.save(buffer, format='JPEG')
    return buffer.getvalue()

