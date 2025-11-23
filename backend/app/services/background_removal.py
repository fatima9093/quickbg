from rembg import remove, new_session
from PIL import Image, ImageFilter
import numpy as np
import cv2
from io import BytesIO
from typing import Tuple, Optional
import logging

logger = logging.getLogger(__name__)

# Create a persistent session for faster processing (model stays in memory)
_session = None

def get_session():
    """Get or create a persistent rembg session for faster processing."""
    global _session
    if _session is None:
        logger.info("Initializing rembg session with high-quality isnet-general-use model (one-time setup)")
        # Use isnet-general-use for professional quality (like Remove.bg)
        _session = new_session("isnet-general-use")  # Best balance of speed & quality
    return _session


def remove_background(
    image_bytes: bytes,
    refine_mask: bool = False,  # Disabled by default for speed
    trim_transparent: bool = True,
    alpha_matting: bool = False  # Disabled by default for speed
) -> Tuple[bytes, dict]:
    """
    Remove background from image using rembg (ISNet) - OPTIMIZED FOR QUALITY.
    
    Args:
        image_bytes: Input image as bytes
        refine_mask: Apply mask refinement for better edges (slower)
        trim_transparent: Remove transparent padding
        alpha_matting: Use alpha matting for complex edges (much slower)
    
    Returns:
        Tuple of (processed_image_bytes, metadata_dict)
        
    Raises:
        Exception: If processing fails
    """
    try:
        logger.info("Starting high-quality background removal")
        
        # Load input image
        input_image = Image.open(BytesIO(image_bytes))
        original_size = input_image.size
        logger.info(f"Input image size: {original_size}")
        
        # QUALITY OPTIMIZATION: Process at higher resolution for better edges
        max_dimension = 1920  # Higher resolution = better edge quality
        if max(input_image.size) > max_dimension:
            ratio = max_dimension / max(input_image.size)
            new_size = tuple(int(dim * ratio) for dim in input_image.size)
            logger.info(f"Resizing from {original_size} to {new_size} for quality processing")
            # Use LANCZOS for best quality resampling
            input_image = input_image.resize(new_size, Image.Resampling.LANCZOS)
        
        # SPEED OPTIMIZATION: Compress image quality for faster processing
        if input_image.mode == 'RGBA':
            input_image = input_image.convert('RGB')  # Remove alpha for speed
        
        # Convert to RGB if necessary
        if input_image.mode not in ('RGB', 'RGBA'):
            input_image = input_image.convert('RGB')
        
        # Remove background using cached session with high-quality model
        logger.info("Applying professional ISNet background removal")
        session = get_session()
        output_image = remove(
            input_image,
            session=session,
            alpha_matting=alpha_matting,
            alpha_matting_foreground_threshold=240,
            alpha_matting_background_threshold=10,
            alpha_matting_erode_size=10
        )
        
        # SKIP post-processing for MAXIMUM SPEED (refine_mask is False by default)
        # Only trim if enabled
        if trim_transparent:
            logger.info("Quick trim of transparent areas")
            output_image = trim_transparent_area(output_image)
        
        # Convert to bytes with FAST compression
        output_buffer = BytesIO()
        # Use compress_level=1 for faster compression (default is 6)
        output_image.save(output_buffer, format='PNG', compress_level=1)
        output_bytes = output_buffer.getvalue()
        
        # Collect metadata
        metadata = {
            'original_size': original_size,
            'processed_size': output_image.size,
            'original_bytes': len(image_bytes),
            'processed_bytes': len(output_bytes),
            'compression_ratio': round(len(output_bytes) / len(image_bytes), 2),
            'alpha_matting': alpha_matting,
            'mask_refined': refine_mask,
            'trimmed': trim_transparent
        }
        
        logger.info(f"Background removal complete: {metadata}")
        return output_bytes, metadata
    
    except Exception as e:
        error_msg = f"Background removal failed: {str(e)}"
        logger.error(error_msg)
        raise Exception(error_msg)


def refine_mask_edges(image: Image.Image, kernel_size: int = 3) -> Image.Image:
    """
    Refine mask edges using morphological operations and smoothing.
    
    Args:
        image: PIL Image with alpha channel
        kernel_size: Size of the smoothing kernel
    
    Returns:
        Image with refined edges
    """
    try:
        # Convert to numpy array
        img_array = np.array(image)
        
        if img_array.shape[2] != 4:
            return image  # No alpha channel, return as is
        
        # Extract alpha channel
        alpha = img_array[:, :, 3]
        
        # Apply morphological operations to smooth edges
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (kernel_size, kernel_size))
        
        # Closing operation to fill small holes
        alpha = cv2.morphologyEx(alpha, cv2.MORPH_CLOSE, kernel)
        
        # Opening operation to remove noise
        alpha = cv2.morphologyEx(alpha, cv2.MORPH_OPEN, kernel)
        
        # Gaussian blur for smooth transitions
        alpha = cv2.GaussianBlur(alpha, (kernel_size, kernel_size), 0)
        
        # Update alpha channel
        img_array[:, :, 3] = alpha
        
        # Convert back to PIL Image
        return Image.fromarray(img_array)
    
    except Exception as e:
        logger.warning(f"Mask refinement failed, returning original: {str(e)}")
        return image


def trim_transparent_area(image: Image.Image, threshold: int = 10) -> Image.Image:
    """
    Trim transparent padding from the image.
    
    Args:
        image: PIL Image with alpha channel
        threshold: Alpha threshold for trimming (0-255)
    
    Returns:
        Trimmed image
    """
    try:
        # Convert to numpy array
        img_array = np.array(image)
        
        if img_array.shape[2] != 4:
            return image  # No alpha channel, return as is
        
        # Get alpha channel
        alpha = img_array[:, :, 3]
        
        # Find non-transparent pixels
        rows = np.any(alpha > threshold, axis=1)
        cols = np.any(alpha > threshold, axis=0)
        
        if not rows.any() or not cols.any():
            # Image is completely transparent, return as is
            return image
        
        # Get bounding box
        row_min, row_max = np.where(rows)[0][[0, -1]]
        col_min, col_max = np.where(cols)[0][[0, -1]]
        
        # Add small padding
        padding = 5
        row_min = max(0, row_min - padding)
        row_max = min(img_array.shape[0], row_max + padding + 1)
        col_min = max(0, col_min - padding)
        col_max = min(img_array.shape[1], col_max + padding + 1)
        
        # Crop image
        cropped_array = img_array[row_min:row_max, col_min:col_max]
        
        return Image.fromarray(cropped_array)
    
    except Exception as e:
        logger.warning(f"Trimming failed, returning original: {str(e)}")
        return image


def validate_image(image_bytes: bytes, max_size_mb: int = 10) -> Tuple[bool, str, dict]:
    """
    Validate image before processing.
    
    Args:
        image_bytes: Image data as bytes
        max_size_mb: Maximum allowed file size in MB
    
    Returns:
        Tuple of (is_valid, error_message, image_info)
    """
    try:
        # Check file size
        file_size_mb = len(image_bytes) / (1024 * 1024)
        if file_size_mb > max_size_mb:
            return False, f"File size ({file_size_mb:.1f}MB) exceeds maximum ({max_size_mb}MB)", {}
        
        # Try to open image
        image = Image.open(BytesIO(image_bytes))
        
        # Get image info
        info = {
            'format': image.format,
            'mode': image.mode,
            'size': image.size,
            'width': image.width,
            'height': image.height,
            'file_size_mb': round(file_size_mb, 2)
        }
        
        # Validate format
        valid_formats = ['JPEG', 'JPG', 'PNG', 'WEBP', 'BMP']
        if image.format and image.format.upper() not in valid_formats:
            return False, f"Unsupported image format: {image.format}", info
        
        # Validate dimensions
        max_dimension = 4096
        if image.width > max_dimension or image.height > max_dimension:
            return False, f"Image dimensions too large (max {max_dimension}x{max_dimension})", info
        
        min_dimension = 50
        if image.width < min_dimension or image.height < min_dimension:
            return False, f"Image dimensions too small (min {min_dimension}x{min_dimension})", info
        
        return True, "", info
    
    except Exception as e:
        return False, f"Invalid image file: {str(e)}", {}

