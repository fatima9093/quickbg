# Password Reset Implementation - Complete Setup Guide

## ✅ What Was Implemented

A professional password reset system with email functionality:

### **Backend (Python/FastAPI)**
- ✅ User model updated with reset token fields
- ✅ Password reset API endpoints (generate, verify, reset)
- ✅ Email service using `fastapi-mail` (Python library)
- ✅ Database migration applied
- ✅ Beautiful HTML email template with QuickBG branding

### **Frontend (Next.js)**
- ✅ Forgot password page (already existed, now functional)
- ✅ Reset password page (new)
- ✅ API route as proxy to backend

---

## 🚀 Quick Setup

### **1. Install Backend Dependencies**

```bash
cd quickbg/backend
pip install fastapi-mail==1.4.1
# Or: pip install -r requirements.txt
```

### **2. Configure Backend Environment**

Create/update `quickbg/backend/.env` with your IONOS credentials:

```env
# IONOS Email Configuration
MAIL_USERNAME=contact@quickbg.app
MAIL_PASSWORD=your-ionos-email-password
MAIL_FROM=contact@quickbg.app
MAIL_SERVER=smtp.ionos.com
MAIL_PORT=587
MAIL_FROM_NAME=QuickBG

# Frontend URL (for reset links)
FRONTEND_URL=http://localhost:3000
```

### **3. Get IONOS SMTP Credentials**

1. Log into IONOS account
2. Go to **Email & Office**
3. Click on `contact@quickbg.app`
4. Find **SMTP Settings**:
   - Server: `smtp.ionos.com`
   - Port: 587 (or 465 for SSL)
   - Username: `contact@quickbg.app`
   - Password: Your email password

### **4. Test the Setup**

**Start Backend:**
```bash
cd quickbg/backend
uvicorn app.main:app --reload
```

**Start Frontend:**
```bash
cd quickbg/frontend
npm run dev
```

**Test Password Reset:**
1. Go to: http://localhost:3000/forgot-password
2. Enter your email
3. Check inbox for reset email
4. Click link → enter new password
5. Try logging in with new password

---

## 🏗️ Architecture (Professional Approach)

```
User → Frontend Page → Next.js API Route → Backend API → Email Service
                                              ↓
                                        Database (Token)
                                              ↓
                                        IONOS SMTP → User's Email
```

### **Why This is Better:**

✅ **Backend handles everything** - Token generation AND email sending  
✅ **More secure** - Email credentials stay in backend `.env`  
✅ **Professional** - Proper separation of concerns  
✅ **Scalable** - Any backend service can send emails  
✅ **Consistent** - All backend in Python (no mixing Node.js)

---

## 📧 Email Features

The password reset email includes:
- Professional QuickBG branding (#2b3d98 blue)
- Clear "Reset Password" button
- Fallback plain text link
- 1-hour expiration notice
- Security disclaimer
- Responsive HTML design

---

## 🔐 Security Features

- ✅ Tokens expire after 1 hour
- ✅ Tokens are cryptographically secure (32 bytes)
- ✅ Email enumeration prevention (always shows success)
- ✅ Token can only be used once
- ✅ Minimum password length validation
- ✅ Password hashing with bcrypt

---

## 📂 Files Modified/Created

### **Backend:**
- ✅ `requirements.txt` - Added fastapi-mail
- ✅ `app/core/config.py` - Added email settings
- ✅ `app/db/models.py` - Added reset token fields
- ✅ `app/db/crud.py` - Added token management functions
- ✅ `app/schemas/auth.py` - Added password reset schemas
- ✅ `app/api/v1/endpoints/auth.py` - Updated endpoints to send email
- ✅ `app/services/email.py` - NEW: Email service
- ✅ `EMAIL_SETUP.md` - NEW: Setup documentation

### **Frontend:**
- ✅ `app/reset-password/page.tsx` - NEW: Reset password page
- ✅ `app/forgot-password/page.tsx` - Updated to call backend
- ✅ `app/api/auth/forgot-password/route.ts` - Simplified to proxy
- ❌ `lib/email.ts` - REMOVED (not needed)
- ❌ `nodemailer` - REMOVED (Python backend handles email)

---

## 🔧 Production Configuration

For production deployment on `quickbg.app`:

**Backend `.env`:**
```env
FRONTEND_URL=https://quickbg.app
CORS_ORIGINS=https://quickbg.app
MAIL_USERNAME=contact@quickbg.app
MAIL_PASSWORD=your-ionos-password
# ... other settings
```

**Frontend `.env.local`:**
```env
NEXTAUTH_URL=https://quickbg.app
NEXT_PUBLIC_API_URL=https://quickbg.app/api
```

---

## 🧪 Testing Email (Optional)

Create `quickbg/backend/test_email.py`:

```python
import asyncio
from app.services.email import send_password_reset_email

async def test():
    await send_password_reset_email(
        email="your-email@gmail.com",
        token="test-token-123",
        name="Test User"
    )
    print("✅ Email sent!")

asyncio.run(test())
```

Run: `python test_email.py`

---

## 🐛 Troubleshooting

### Emails Not Sending?
1. Check backend logs for errors
2. Verify IONOS credentials in `.env`
3. Try port 465 if 587 doesn't work
4. Check firewall rules on VPS
5. Verify email account is active

### Authentication Errors?
- Use **email password**, not IONOS account password
- Enable "External applications" in IONOS settings
- Try resetting email password

### Token Expired?
- Tokens are valid for 1 hour only
- Request a new reset link

---

## 📚 API Endpoints

### `POST /api/v1/auth/forgot-password`
- Generates reset token
- Sends email with reset link
- Returns success message (always, for security)

### `POST /api/v1/auth/reset-password`
- Verifies token
- Updates password
- Clears token

### `GET /api/v1/auth/verify-reset-token/{token}`
- Checks if token is valid
- Used by frontend to show reset form

---

## 🎉 You're Done!

The password reset system is now fully functional and professional:
- Backend handles all business logic
- Email credentials secure in backend
- Beautiful branded emails
- Professional architecture

**Need help?** Check `quickbg/backend/EMAIL_SETUP.md` for detailed troubleshooting.

