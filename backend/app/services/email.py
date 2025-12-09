from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from app.core.config import settings
from typing import List
import html

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_FROM_NAME=settings.MAIL_FROM_NAME,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    USE_CREDENTIALS=settings.USE_CREDENTIALS,
    VALIDATE_CERTS=settings.VALIDATE_CERTS
)

fm = FastMail(conf)


async def send_password_reset_email(email: str, token: str, name: str = None):
    """Send password reset email with token link."""
    reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"
    
    html_body = f"""
    <!DOCTYPE html>
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <div style="background-color: #2b3d98; padding: 30px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">QuickBG</h1>
                </div>
                <div style="padding: 40px 30px;">
                    <h2 style="color: #2b3d98; margin-top: 0;">Reset Your Password</h2>
                    <p style="font-size: 16px;">Hi {name or 'there'},</p>
                    <p style="font-size: 16px;">We received a request to reset your password for your QuickBG account.</p>
                    <p style="font-size: 16px;">Click the button below to reset your password:</p>
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="{reset_link}" 
                           style="background-color: #2b3d98; color: white; padding: 14px 35px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block; 
                                  font-weight: bold; font-size: 16px;">
                            Reset Password
                        </a>
                    </div>
                    <p style="font-size: 14px; color: #666;">Or copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; color: #2b3d98; background-color: #f8f9fa; padding: 10px; border-radius: 5px; font-size: 14px;">
                        {reset_link}
                    </p>
                    <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #eee;">
                        <p style="color: #666; font-size: 14px; margin: 5px 0;">
                            ⏰ This link will expire in <strong>1 hour</strong>.
                        </p>
                        <p style="color: #666; font-size: 14px; margin: 5px 0;">
                            🔒 If you didn't request a password reset, you can safely ignore this email.
                        </p>
                    </div>
                </div>
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
                    <p style="color: #999; font-size: 12px; margin: 0;">
                        © 2024 QuickBG - AI Background Removal Tool
                    </p>
                </div>
            </div>
        </body>
    </html>
    """
    
    message = MessageSchema(
        subject="Reset Your QuickBG Password",
        recipients=[email],
        body=html_body,
        subtype=MessageType.html
    )
    
    await fm.send_message(message)


async def send_contact_email(name: str, email: str, subject: str, message: str):
    """Send contact form email to admin and auto-reply to user."""
    import logging
    logger = logging.getLogger(__name__)
    
    # Validate email configuration
    if not settings.MAIL_USERNAME or not settings.MAIL_PASSWORD:
        error_msg = "Email configuration is missing. Please set MAIL_USERNAME and MAIL_PASSWORD in .env file"
        logger.error(error_msg)
        raise ValueError(error_msg)
    
    if not settings.MAIL_SERVER:
        error_msg = "Email server is not configured. Please set MAIL_SERVER in .env file"
        logger.error(error_msg)
        raise ValueError(error_msg)
    
    # Escape HTML to prevent XSS and formatting issues
    name_escaped = html.escape(name)
    email_escaped = html.escape(email)
    subject_escaped = html.escape(subject)
    message_escaped = html.escape(message)
    
    logger.info(f"Attempting to send contact email from {email} to {settings.MAIL_FROM}")
    
    # Email to admin (contact@quickbg.app)
    admin_html = f"""
    <!DOCTYPE html>
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <div style="background-color: #2b3d98; padding: 30px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">QuickBG Contact Form</h1>
                </div>
                <div style="padding: 40px 30px;">
                    <h2 style="color: #2b3d98; margin-top: 0;">New Contact Form Submission</h2>
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
                        <p style="margin: 10px 0;"><strong>From:</strong> {name_escaped} ({email_escaped})</p>
                        <p style="margin: 10px 0;"><strong>Subject:</strong> {subject_escaped}</p>
                    </div>
                    <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #2b3d98; margin: 20px 0;">
                        <p style="font-size: 16px; white-space: pre-wrap;">{message_escaped}</p>
                    </div>
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                        <p style="color: #666; font-size: 14px;">
                            <strong>Reply to:</strong> <a href="mailto:{email_escaped}" style="color: #2b3d98;">{email_escaped}</a>
                        </p>
                    </div>
                </div>
            </div>
        </body>
    </html>
    """
    
    admin_message = MessageSchema(
        subject=f"Contact Form: {subject}",
        recipients=[settings.MAIL_FROM],  # Send to contact@quickbg.app
        body=admin_html,
        subtype=MessageType.html,
        reply_to=[email]  # So admin can reply directly (must be a list)
    )
    
    # Auto-reply to user
    user_html = f"""
    <!DOCTYPE html>
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <div style="background-color: #2b3d98; padding: 30px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">QuickBG</h1>
                </div>
                <div style="padding: 40px 30px;">
                    <h2 style="color: #2b3d98; margin-top: 0;">Thank You for Contacting Us!</h2>
                    <p style="font-size: 16px;">Hi {name_escaped},</p>
                    <p style="font-size: 16px;">We've received your message and will get back to you within 24 hours.</p>
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>Your Message:</strong></p>
                        <p style="margin: 5px 0; color: #666;">{subject_escaped}</p>
                    </div>
                    <p style="font-size: 16px;">If you have any urgent questions, feel free to reply to this email.</p>
                </div>
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
                    <p style="color: #999; font-size: 12px; margin: 0;">
                        © 2024 QuickBG - AI Background Removal Tool
                    </p>
                </div>
            </div>
        </body>
    </html>
    """
    
    user_message = MessageSchema(
        subject="We've Received Your Message - QuickBG",
        recipients=[email],
        body=user_html,
        subtype=MessageType.html
    )
    
    # Send both emails
    try:
        logger.info("Sending admin notification email...")
        await fm.send_message(admin_message)
        logger.info("Admin email sent successfully")
        
        logger.info("Sending user auto-reply email...")
        await fm.send_message(user_message)
        logger.info("User auto-reply sent successfully")
    except Exception as e:
        logger.error(f"Failed to send email via SMTP: {str(e)}")
        raise Exception(f"SMTP error: {str(e)}. Please check your email configuration and IONOS SMTP settings.")
