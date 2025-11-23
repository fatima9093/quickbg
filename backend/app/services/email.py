from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from app.core.config import settings
from typing import List

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

