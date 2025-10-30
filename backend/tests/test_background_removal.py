import pytest
from io import BytesIO
from PIL import Image

from app.services.background_removal import (
    remove_background,
    validate_image,
    refine_mask_edges,
    trim_transparent_area
)


def test_validate_image_success():
    """Test image validation with valid image."""
    # Create a valid image
    img = Image.new('RGB', (500, 500), color='blue')
    buffer = BytesIO()
    img.save(buffer, format='JPEG')
    image_bytes = buffer.getvalue()
    
    is_valid, error_msg, info = validate_image(image_bytes, max_size_mb=10)
    
    assert is_valid is True
    assert error_msg == ""
    assert info['width'] == 500
    assert info['height'] == 500
    assert info['format'] == 'JPEG'


def test_validate_image_too_large():
    """Test image validation with oversized image."""
    # Create a small image but pretend it's too large
    img = Image.new('RGB', (100, 100), color='blue')
    buffer = BytesIO()
    img.save(buffer, format='JPEG')
    image_bytes = buffer.getvalue()
    
    is_valid, error_msg, info = validate_image(image_bytes, max_size_mb=0.0001)
    
    assert is_valid is False
    assert "exceeds maximum" in error_msg


def test_validate_image_dimensions_too_large():
    """Test image validation with dimensions too large."""
    # Create an image with dimensions over 4096
    img = Image.new('RGB', (5000, 100), color='blue')
    buffer = BytesIO()
    img.save(buffer, format='JPEG')
    image_bytes = buffer.getvalue()
    
    is_valid, error_msg, info = validate_image(image_bytes)
    
    assert is_valid is False
    assert "dimensions too large" in error_msg


def test_validate_image_dimensions_too_small():
    """Test image validation with dimensions too small."""
    img = Image.new('RGB', (20, 20), color='blue')
    buffer = BytesIO()
    img.save(buffer, format='JPEG')
    image_bytes = buffer.getvalue()
    
    is_valid, error_msg, info = validate_image(image_bytes)
    
    assert is_valid is False
    assert "dimensions too small" in error_msg


def test_validate_image_invalid_data():
    """Test image validation with invalid data."""
    invalid_bytes = b"not an image"
    
    is_valid, error_msg, info = validate_image(invalid_bytes)
    
    assert is_valid is False
    assert "Invalid image file" in error_msg


@pytest.mark.parametrize("mock_rembg", [None], indirect=True)
def test_remove_background_success(mock_rembg):
    """Test successful background removal."""
    # Create a test image
    img = Image.new('RGB', (200, 200), color='green')
    buffer = BytesIO()
    img.save(buffer, format='JPEG')
    image_bytes = buffer.getvalue()
    
    # Mock rembg to return a transparent image
    mock_img = Image.new('RGBA', (200, 200), (0, 0, 0, 0))
    mock_rembg.return_value = mock_img
    
    result_bytes, metadata = remove_background(image_bytes)
    
    assert result_bytes is not None
    assert isinstance(metadata, dict)
    assert 'original_size' in metadata
    assert 'processed_size' in metadata
    assert metadata['mask_refined'] is True


def test_trim_transparent_area():
    """Test trimming transparent areas from image."""
    # Create image with transparent border
    img = Image.new('RGBA', (200, 200), (0, 0, 0, 0))
    
    # Draw a solid square in the center
    from PIL import ImageDraw
    draw = ImageDraw.Draw(img)
    draw.rectangle([50, 50, 150, 150], fill=(255, 0, 0, 255))
    
    trimmed = trim_transparent_area(img)
    
    # Trimmed image should be smaller
    assert trimmed.width < img.width
    assert trimmed.height < img.height
    assert trimmed.width > 100  # Should have padding
    assert trimmed.height > 100


def test_refine_mask_edges():
    """Test mask edge refinement."""
    # Create image with alpha channel
    img = Image.new('RGBA', (100, 100), (255, 0, 0, 128))
    
    refined = refine_mask_edges(img)
    
    assert refined.mode == 'RGBA'
    assert refined.size == img.size

