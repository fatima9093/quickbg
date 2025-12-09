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
    refine_mask: bool = False,  # Disabled - causes blur and artifacts
    trim_transparent: bool = False,  # Disabled - can cut parts of the subject
    alpha_matting: bool = False,  # Let AI model handle edges naturally
    preserve_original_size: bool = True  # Preserve original dimensions
) -> Tuple[bytes, dict]:
    """
    Remove background from image using rembg (ISNet) - PURE AI OUTPUT FOR MAXIMUM QUALITY.
    
    Args:
        image_bytes: Input image as bytes
        refine_mask: Apply mask refinement (disabled by default - can cause artifacts)
        trim_transparent: Remove transparent padding (disabled by default - can cut subject)
        alpha_matting: Use alpha matting (disabled by default - AI handles it better)
        preserve_original_size: Keep original image dimensions (True by default)
    
    Returns:
        Tuple of (processed_image_bytes, metadata_dict)
        
    Raises:
        Exception: If processing fails
        
    Note:
        By default, this function uses PURE AI output without post-processing.
        This provides the best results similar to remove.bg - sharp, clean, accurate.
    """
    try:
        logger.info("Starting high-quality background removal")
        
        # Load input image
        input_image = Image.open(BytesIO(image_bytes))
        original_size = input_image.size
        logger.info(f"Input image size: {original_size}")
        
        # PRESERVE ORIGINAL SIZE for maximum quality
        # Only resize if image is extremely large (to prevent memory issues)
        max_dimension = 4096  # Increased from 1920 for better quality
        processing_size = original_size
        
        if preserve_original_size and max(input_image.size) <= max_dimension:
            # Keep original size - no resizing for best quality
            logger.info(f"Preserving original size: {original_size} for maximum quality")
            processing_image = input_image.copy()
        elif max(input_image.size) > max_dimension:
            # Only resize if absolutely necessary (very large images)
            ratio = max_dimension / max(input_image.size)
            processing_size = tuple(int(dim * ratio) for dim in input_image.size)
            logger.info(f"Resizing from {original_size} to {processing_size} (image too large)")
            # Use LANCZOS for best quality resampling
            processing_image = input_image.resize(processing_size, Image.Resampling.LANCZOS)
        else:
            processing_image = input_image.copy()
        
        # Preserve original color mode - don't convert RGBA to RGB (loses transparency info)
        # Only convert if it's not RGB/RGBA
        if processing_image.mode not in ('RGB', 'RGBA'):
            logger.info(f"Converting from {processing_image.mode} to RGB")
            processing_image = processing_image.convert('RGB')
        elif processing_image.mode == 'RGBA':
            # Keep RGBA if present - better color preservation
            logger.info("Preserving RGBA mode for better color accuracy")
        
        # Remove background using cached session with high-quality model
        # Let the AI model do the work - don't over-process
        logger.info("Applying professional ISNet background removal (pure AI output)")
        session = get_session()
        
        # Use the AI model with MINIMAL post-processing for best results
        # Alpha matting can sometimes cause artifacts, so only use when needed
        if alpha_matting:
            logger.info("Using alpha matting for complex edges")
            output_image = remove(
                processing_image,
                session=session,
                alpha_matting=True,
                alpha_matting_foreground_threshold=240,
                alpha_matting_background_threshold=10,
                alpha_matting_erode_size=10
            )
        else:
            # Pure AI output - no post-processing by rembg
            logger.info("Using pure AI output (no alpha matting)")
            output_image = remove(
                processing_image,
                session=session,
                alpha_matting=False
            )
        
        # Restore to original size if we resized for processing
        if preserve_original_size and processing_size != original_size:
            logger.info(f"Restoring to original size: {original_size}")
            output_image = output_image.resize(original_size, Image.Resampling.LANCZOS)
        
        # Apply mask refinement ONLY if explicitly requested
        # (Usually not needed and can cause artifacts)
        if refine_mask:
            logger.info("Refining mask edges (optional post-processing)")
            output_image = refine_mask_edges(output_image, kernel_size=2, use_blur=False)
        
        # Trim ONLY if explicitly requested
        # (Can cut parts of the subject, so disabled by default)
        if trim_transparent:
            logger.info("Trimming transparent areas (optional)")
            output_image = trim_transparent_area(output_image)
        
        # Convert to bytes with MAXIMUM QUALITY
        output_buffer = BytesIO()
        # Use compress_level=9 for maximum quality (slower but best quality)
        # optimize=True for better file size without quality loss
        output_image.save(output_buffer, format='PNG', compress_level=9, optimize=True)
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
            'trimmed': trim_transparent,
            'preserved_original_size': preserve_original_size
        }
        
        logger.info(f"Background removal complete: {metadata}")
        return output_bytes, metadata
    
    except Exception as e:
        error_msg = f"Background removal failed: {str(e)}"
        logger.error(error_msg)
        raise Exception(error_msg)


def refine_mask_edges(image: Image.Image, kernel_size: int = 2, use_blur: bool = False) -> Image.Image:
    """
    Refine mask edges using morphological operations with minimal smoothing.
    
    Args:
        image: PIL Image with alpha channel
        kernel_size: Size of the smoothing kernel (smaller = sharper edges)
        use_blur: Whether to apply Gaussian blur (False for logos/text to prevent blurriness)
    
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
        
        # Apply morphological operations with smaller kernel for sharper edges
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (kernel_size, kernel_size))
        
        # Closing operation to fill small holes (minimal)
        alpha = cv2.morphologyEx(alpha, cv2.MORPH_CLOSE, kernel, iterations=1)
        
        # Opening operation to remove noise (minimal)
        alpha = cv2.morphologyEx(alpha, cv2.MORPH_OPEN, kernel, iterations=1)
        
        # Only apply blur if requested (disabled by default to preserve sharpness)
        if use_blur:
            # Very light blur only if needed
            alpha = cv2.GaussianBlur(alpha, (kernel_size, kernel_size), 0.5)
        
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

