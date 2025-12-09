from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.db import crud
from app.core.security import verify_password, create_access_token
from app.schemas.auth import (
    LoginResponse, RegisterRequest, UserResponse,
    ForgotPasswordRequest, ResetPasswordRequest, 
    ForgotPasswordResponse, MessageResponse, GoogleLoginRequest
)
from datetime import timedelta
from app.core.config import settings

router = APIRouter()


@router.post("/register", response_model=UserResponse)
async def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new user."""
    # Check if user already exists
    existing_user = crud.get_user_by_email(db, request.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user = crud.create_user(
        db=db,
        email=request.email,
        password=request.password,
        name=request.name
    )
    
    return UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        role=user.role,
        created_at=user.created_at
    )


@router.post("/login", response_model=LoginResponse)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Login user and return access token.
    
    Note: form_data.username contains the email address.
    """
    # Get user (username field contains email)
    user = crud.get_user_by_email(db, form_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id, "email": user.email, "role": user.role},
        expires_delta=access_token_expires
    )
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            role=user.role,
            created_at=user.created_at
        )
    )


@router.post("/google-login", response_model=LoginResponse)
async def google_login(request: GoogleLoginRequest, db: Session = Depends(get_db)):
    """Login or register user via Google OAuth."""
    from app.db.models import User
    
    # Check if user exists by Google ID
    user = db.query(User).filter(User.google_id == request.google_id).first()
    
    if not user:
        # Check if user exists by email
        user = db.query(User).filter(User.email == request.email).first()
        
        if user:
            # Link Google account to existing user
            user.google_id = request.google_id
            user.avatar = request.avatar
            user.oauth_provider = "google"
            if not user.name:
                user.name = request.name
        else:
            # Create new user with OAuth
            user = User(
                email=request.email,
                name=request.name,
                google_id=request.google_id,
                avatar=request.avatar,
                oauth_provider="google",
                hashed_password=None,  # No password for OAuth users
                total_images_processed=0,
                images_processed_today=0,
                total_processing_time=0.0
            )
            db.add(user)
        
        db.commit()
        db.refresh(user)
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id, "email": user.email, "role": user.role},
        expires_delta=access_token_expires
    )
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            role=user.role,
            created_at=user.created_at
        )
    )


@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Generate password reset token and send email."""
    user = crud.get_user_by_email(db, request.email)
    
    if not user:
        # Return success for security (prevent email enumeration)
        return MessageResponse(
            message="If that email exists, a reset link has been sent"
        )
    
    # Generate reset token
    token = crud.create_password_reset_token(db, user)
    
    # Send email with reset link
    from app.services.email import send_password_reset_email
    import logging
    logger = logging.getLogger(__name__)
    
    try:
        await send_password_reset_email(user.email, token, user.name)
    except Exception as e:
        logger.error(f"Failed to send password reset email: {str(e)}", exc_info=True)
        # Still return success for security
    
    return MessageResponse(
        message="If that email exists, a reset link has been sent"
    )


@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Reset password with valid token."""
    user = crud.verify_reset_token(db, request.token)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    
    # Reset password
    crud.reset_user_password(db, user, request.new_password)
    
    return MessageResponse(message="Password reset successful")


@router.get("/verify-reset-token/{token}", response_model=MessageResponse)
async def verify_reset_token(token: str, db: Session = Depends(get_db)):
    """Verify if a reset token is valid."""
    user = crud.verify_reset_token(db, token)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    
    return MessageResponse(message="Token is valid")

