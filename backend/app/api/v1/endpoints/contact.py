from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from app.services.email import send_contact_email

router = APIRouter()


class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


class ContactResponse(BaseModel):
    success: bool
    message: str


@router.post("/contact", response_model=ContactResponse)
async def submit_contact_form(request: ContactRequest):
    """Handle contact form submissions."""
    import logging
    logger = logging.getLogger(__name__)
    
    try:
        logger.info(f"Received contact form submission from {request.email}")
        await send_contact_email(
            name=request.name,
            email=request.email,
            subject=request.subject,
            message=request.message
        )
        logger.info(f"Successfully sent contact email for {request.email}")
        return ContactResponse(
            success=True,
            message="Your message has been sent successfully!"
        )
    except Exception as e:
        logger.error(f"Failed to send contact email: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send email: {str(e)}"
        )

