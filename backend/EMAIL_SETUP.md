# Backend Email Setup Guide

This guide explains how to configure email sending for password reset functionality in the QuickBG backend.

## Environment Variables

Add these to your `.env` file in the `quickbg/backend` directory:

```env
# IONOS Email Configuration
MAIL_USERNAME=contact@quickbg.app
MAIL_PASSWORD=your-ionos-email-password
MAIL_FROM=contact@quickbg.app
MAIL_SERVER=smtp.ionos.com
MAIL_PORT=587
MAIL_FROM_NAME=QuickBG

# Frontend URL (for password reset links)
FRONTEND_URL=http://localhost:3000
```

## Getting Your IONOS SMTP Credentials

1. Log into your IONOS account at https://my.ionos.com
2. Navigate to **Email & Office** section
3. Click on your email account (`contact@quickbg.app`)
4. Find **SMTP Settings** or **Email client setup**
5. Note down:
   - **SMTP Server**: Usually `smtp.ionos.com`
   - **Port**: 587 (TLS) or 465 (SSL)
   - **Username**: Your full email address
   - **Password**: Your email account password

## Installing Dependencies

The email functionality requires `fastapi-mail`. Install it:

```bash
cd quickbg/backend
pip install -r requirements.txt
```

Or install manually:

```bash
pip install fastapi-mail==1.4.1
```

## Testing Email Configuration

Create a test script `test_email.py` in the backend directory:

```python
import asyncio
from app.services.email import send_password_reset_email
from app.core.config import settings

async def test_email():
    print(f"Testing email with IONOS...")
    print(f"MAIL_SERVER: {settings.MAIL_SERVER}")
    print(f"MAIL_USERNAME: {settings.MAIL_USERNAME}")
    
    try:
        await send_password_reset_email(
            email="your-test-email@gmail.com",  # Change this!
            token="test-token-123",
            name="Test User"
        )
        print("✅ Email sent successfully!")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_email())
```

Run the test:

```bash
python test_email.py
```

## Port Configuration

- **Port 587**: STARTTLS (recommended)
- **Port 465**: SSL/TLS

If port 587 doesn't work, try port 465:

```env
MAIL_PORT=465
```

## Production Configuration

For production deployment, update these values:

```env
FRONTEND_URL=https://quickbg.app
CORS_ORIGINS=https://quickbg.app
```

## Troubleshooting

### Emails Not Sending?

1. ✅ Verify email credentials are correct
2. ✅ Check if "External applications" is enabled in IONOS settings
3. ✅ Try both ports (587 and 465)
4. ✅ Verify firewall isn't blocking SMTP ports
5. ✅ Check IONOS spam/security settings
6. ✅ Ensure backend server can make outbound connections

### Authentication Errors

If you get authentication errors:
- Make sure you're using the **email password**, not your IONOS account password
- Try resetting your email password in IONOS
- Check if 2FA is enabled (may require app-specific password)

### Connection Timeout

If connection times out:
- Check firewall rules on your VPS
- Verify DNS resolution: `nslookup smtp.ionos.com`
- Try pinging the SMTP server
- Check if your ISP blocks SMTP ports

### Email Goes to Spam

To improve deliverability:
- Set up SPF records for your domain
- Set up DKIM signing
- Configure DMARC policy
- Use a consistent "From" address
- Avoid spam trigger words in subject/body

## How It Works

1. User requests password reset via frontend
2. Frontend calls backend API: `POST /api/v1/auth/forgot-password`
3. Backend generates secure token (valid for 1 hour)
4. Backend sends beautiful HTML email via `fastapi-mail`
5. User clicks link in email
6. User enters new password
7. Backend updates password and clears token

## Email Template

The password reset email includes:
- QuickBG branding with blue color (#2b3d98)
- Clear call-to-action button
- Fallback plain text link
- 1-hour expiration notice
- Security disclaimer
- Responsive HTML design

## Alternative Email Services

If IONOS doesn't work well, you can easily switch to:

### SendGrid
```env
MAIL_SERVER=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=your-sendgrid-api-key
```

### Gmail (for testing only)
```env
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password  # Not regular password!
```

### AWS SES
```env
MAIL_SERVER=email-smtp.us-east-1.amazonaws.com
MAIL_PORT=587
MAIL_USERNAME=your-smtp-username
MAIL_PASSWORD=your-smtp-password
```

## Security Best Practices

- ✅ Never commit `.env` file to git
- ✅ Use strong, unique password for email account
- ✅ Enable 2FA on IONOS account
- ✅ Rotate credentials periodically
- ✅ Monitor email sending logs
- ✅ Set up rate limiting to prevent abuse

## Support

If you continue to have issues:
1. Check backend logs for detailed error messages
2. Contact IONOS support for SMTP issues
3. Verify your email account is active and not suspended

---

**Need Help?** Check the console output when the backend starts for any email configuration warnings.

