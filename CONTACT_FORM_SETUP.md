# Contact Form Email Setup - Complete Guide

## ✅ What Was Implemented

A fully functional contact form with email notifications:

### **Backend (Python/FastAPI)**
- ✅ Contact form API endpoint (`POST /api/v1/contact/contact`)
- ✅ Email service function (`send_contact_email`) that sends:
  - Admin notification email to `contact@quickbg.app`
  - Auto-reply confirmation email to the user
- ✅ Beautiful HTML email templates with QuickBG branding

### **Frontend (Next.js)**
- ✅ Contact form connected to backend API
- ✅ Error handling and user feedback
- ✅ Loading states during submission

---

## 🚀 Quick Setup

### **1. Configure Backend Environment**

Make sure your `quickbg/backend/.env` file has these IONOS email settings:

```env
# IONOS Email Configuration
MAIL_USERNAME=contact@quickbg.app
MAIL_PASSWORD=your-ionos-email-password
MAIL_FROM=contact@quickbg.app
MAIL_SERVER=smtp.ionos.com
MAIL_PORT=587
MAIL_FROM_NAME=QuickBG

# Frontend URL
FRONTEND_URL=http://localhost:3003
```

### **2. Get IONOS SMTP Credentials**

1. Log into your IONOS account: https://my.ionos.com
2. Navigate to **Email & Office**
3. Click on `contact@quickbg.app`
4. Find **SMTP Settings** or **Email client setup**
5. Note down:
   - **SMTP Server**: `smtp.ionos.com`
   - **Port**: `587` (TLS) or `465` (SSL)
   - **Username**: `contact@quickbg.app`
   - **Password**: Your email account password

### **3. Test the Setup**

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

**Test Contact Form:**
1. Go to: http://localhost:3003/contact
2. Fill out the contact form
3. Submit the form
4. Check `contact@quickbg.app` inbox for admin notification
5. Check the user's email for auto-reply confirmation

---

## 📧 How It Works

### **Email Flow**

1. **User submits contact form** → Frontend sends POST request to backend
2. **Backend receives submission** → Validates data and calls email service
3. **Two emails are sent:**
   - **Admin Email** → Sent to `contact@quickbg.app` with:
     - User's name and email
     - Subject and message
     - Reply-to set to user's email (for easy replies)
   - **User Auto-Reply** → Sent to user's email with:
     - Thank you message
     - Confirmation that message was received
     - 24-hour response time notice

### **Admin Reply Process**

To reply to a user from `contact@quickbg.app`:

1. Log into your IONOS email account (webmail or email client)
2. Open the contact form notification email
3. Click **Reply** (the reply-to is already set to the user's email)
4. Type your response and send

The user will receive your reply directly in their inbox!

---

## 🏗️ Architecture

```
User → Contact Form (Frontend)
         ↓
    POST /api/v1/contact/contact
         ↓
    Backend API Endpoint
         ↓
    Email Service (send_contact_email)
         ↓
    ┌─────────────────┐
    │                 │
    ↓                 ↓
Admin Email      User Auto-Reply
(contact@...)    (user@...)
```

---

## 📁 Files Created/Modified

### **Backend Files:**
- ✅ `app/services/email.py` - Added `send_contact_email()` function
- ✅ `app/api/v1/endpoints/contact.py` - NEW: Contact form endpoint
- ✅ `app/api/v1/api.py` - Registered contact router

### **Frontend Files:**
- ✅ `app/contact/page.tsx` - Updated to call backend API
- ✅ `lib/api-config.ts` - Added contact endpoint

---

## 🔧 API Endpoint Details

### **POST /api/v1/contact/contact**

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Question about QuickBG",
  "message": "I have a question about..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Your message has been sent successfully!"
}
```

**Error Response (500):**
```json
{
  "detail": "Failed to send email: [error message]"
}
```

---

## 🎨 Email Templates

Both emails use professional HTML templates with:
- QuickBG branding (blue color scheme #2b3d98)
- Responsive design
- Clear typography
- Professional layout

### **Admin Email Includes:**
- User's name and email address
- Subject line
- Full message content
- Reply-to link for easy responses

### **User Auto-Reply Includes:**
- Thank you message
- Confirmation of receipt
- Subject line reminder
- 24-hour response time notice

---

## 🛡️ Security & Best Practices

- ✅ Email validation using Pydantic `EmailStr`
- ✅ Input sanitization (HTML is properly formatted)
- ✅ Error handling with user-friendly messages
- ✅ No sensitive data exposed in error messages
- ✅ Reply-to header set correctly for admin convenience

---

## 🐛 Troubleshooting

### **Emails Not Sending?**

1. ✅ Verify IONOS email credentials in `.env`
2. ✅ Check backend logs for error messages
3. ✅ Ensure `fastapi-mail` is installed: `pip install fastapi-mail`
4. ✅ Test SMTP connection (see EMAIL_SETUP.md)
5. ✅ Check IONOS spam/security settings
6. ✅ Verify firewall allows outbound SMTP connections

### **Contact Form Not Working?**

1. ✅ Check browser console for errors
2. ✅ Verify backend is running on correct port
3. ✅ Check `NEXT_PUBLIC_API_URL` in frontend `.env`
4. ✅ Ensure CORS is configured correctly
5. ✅ Check network tab for API request/response

### **Admin Not Receiving Emails?**

1. ✅ Check spam/junk folder
2. ✅ Verify `MAIL_FROM` matches your IONOS email
3. ✅ Check IONOS email account is active
4. ✅ Verify SMTP credentials are correct

---

## 📝 Production Checklist

Before deploying to production:

- [ ] Update `FRONTEND_URL` to production domain
- [ ] Update `CORS_ORIGINS` to include production domain
- [ ] Verify IONOS email account is active
- [ ] Test contact form on production
- [ ] Set up email monitoring/alerts
- [ ] Configure SPF/DKIM records for better deliverability
- [ ] Set up rate limiting to prevent abuse

---

## 🔄 Future Enhancements

Potential improvements:
- Save contact submissions to database
- Admin dashboard to view/manage submissions
- Email templates customization
- Support for file attachments
- Automated response templates
- Integration with ticketing system

---

## 📚 Related Documentation

- See `EMAIL_SETUP.md` for detailed IONOS SMTP configuration
- See `PASSWORD_RESET_SETUP.md` for password reset email setup

---

**Need Help?** Check the backend console logs for detailed error messages when testing the contact form.

