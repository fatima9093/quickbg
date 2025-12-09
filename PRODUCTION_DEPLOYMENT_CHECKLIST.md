# 🚀 Production Deployment Checklist - QuickBG

Complete step-by-step guide to deploy QuickBG to production safely and professionally.

---

## ⚠️ CRITICAL: Pre-Deployment Security Fixes

### 1. Generate Strong Secret Keys

**Backend SECRET_KEY:**
```bash
# Generate a secure random key (32+ characters)
python -c "import secrets; print(secrets.token_urlsafe(32))"
```
Save this to your production `.env` file.

**Frontend NEXTAUTH_SECRET:**
```bash
# Generate another secure random key
python -c "import secrets; print(secrets.token_urlsafe(32))"
```
Save this to your frontend `.env.local` file.

**Or use the provided script:**
```bash
python quickbg/scripts/generate_secrets.py
```

### 2. Fix Code Issues

✅ **File: `quickbg/backend/app/api/v1/endpoints/auth.py`**
- Line 168: Replaced `print()` with `logger.error()`

✅ **File: `quickbg/backend/app/api/v1/endpoints/process.py`**
- Line 21: Added comment about Redis requirement for production

---

## 📋 Environment Variables Checklist

### Backend Production `.env`

```env
# ============================================
# CRITICAL - Must be configured
# ============================================

# Security
SECRET_KEY=<generated-strong-key-32-chars-minimum>
DEBUG=False

# Database (Use strong credentials!)
DATABASE_URL=postgresql://<strong-user>:<strong-password>@<host>:5432/quickbg

# Frontend URL (Production domain)
FRONTEND_URL=https://quickbg.app

# CORS (Add all your domains)
CORS_ORIGINS=https://quickbg.app,https://www.quickbg.app

# ============================================
# Email Configuration (IONOS)
# ============================================
MAIL_USERNAME=contact@quickbg.app
MAIL_PASSWORD=<your-actual-ionos-password>
MAIL_FROM=contact@quickbg.app
MAIL_SERVER=smtp.ionos.com
MAIL_PORT=587
MAIL_FROM_NAME=QuickBG

# ============================================
# AWS S3 (If using S3 storage)
# ============================================
AWS_ACCESS_KEY_ID=<your-aws-key>
AWS_SECRET_ACCESS_KEY=<your-aws-secret>
AWS_REGION=us-east-1
S3_BUCKET_NAME=<your-bucket-name>

# ============================================
# Redis (For rate limiting & Celery)
# ============================================
REDIS_URL=redis://<host>:6379/0
CELERY_BROKER_URL=redis://<host>:6379/0
CELERY_RESULT_BACKEND=redis://<host>:6379/0

# ============================================
# Optional: Image Processing Limits
# ============================================
MAX_IMAGE_SIZE_MB=10
MAX_IMAGE_DIMENSION=4096
MIN_IMAGE_DIMENSION=50
```

### Frontend Production `.env.local`

```env
# ============================================
# CRITICAL - Must be configured
# ============================================

# API URL (Your backend domain)
NEXT_PUBLIC_API_URL=https://api.quickbg.app

# Frontend URL (Your frontend domain)
NEXTAUTH_URL=https://quickbg.app

# NextAuth Secret (Generated strong key)
NEXTAUTH_SECRET=<generated-strong-key-32-chars>

# ============================================
# Optional: Google OAuth (If using)
# ============================================
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

---

## 🔒 Security Checklist

- [ ] **SECRET_KEY** is a strong random string (32+ characters)
- [ ] **NEXTAUTH_SECRET** is a strong random string (32+ characters)
- [ ] **Database password** is strong and unique
- [ ] **DEBUG=False** in production
- [ ] **CORS_ORIGINS** includes only your production domains
- [ ] **FRONTEND_URL** points to production domain (https://)
- [ ] All `.env` files are in `.gitignore` (verify!)
- [ ] No hardcoded secrets in code
- [ ] HTTPS is enabled (SSL certificate configured)
- [ ] Database is not publicly accessible (firewall rules)

---

## 🗄️ Database Checklist

- [ ] PostgreSQL is running and accessible
- [ ] Database credentials are strong
- [ ] Database backups are configured
- [ ] Migrations are up to date: `alembic upgrade head`
- [ ] Test database connection from production server

---

## 📧 Email Configuration Checklist

- [ ] IONOS email credentials are correct
- [ ] SMTP settings are tested (send test email)
- [ ] Password reset emails work
- [ ] Contact form emails work
- [ ] Email templates render correctly

---

## 🚀 Deployment Steps

### Backend Deployment

1. **Prepare Server:**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Python 3.11+
   sudo apt install python3.11 python3.11-venv python3-pip
   
   # Install PostgreSQL
   sudo apt install postgresql postgresql-contrib
   
   # Install Redis
   sudo apt install redis-server
   ```

2. **Setup Application:**
   ```bash
   # Clone repository
   git clone <your-repo-url> quickbg
   cd quickbg/backend
   
   # Create virtual environment
   python3.11 -m venv venv
   source venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   ```

3. **Configure Environment:**
   ```bash
   # Create .env file with production values
   nano .env
   # (Paste your production .env content)
   ```

4. **Setup Database:**
   ```bash
   # Create database
   sudo -u postgres psql
   CREATE DATABASE quickbg;
   CREATE USER quickbg_user WITH PASSWORD 'strong_password_here';
   GRANT ALL PRIVILEGES ON DATABASE quickbg TO quickbg_user;
   \q
   
   # Run migrations
   alembic upgrade head
   ```

5. **Start Services:**
   ```bash
   # Start Redis
   sudo systemctl start redis
   sudo systemctl enable redis
   
   # Start Celery Worker (in separate terminal)
   celery -A app.tasks.celery_app worker --loglevel=info
   
   # Start Backend (using systemd or PM2)
   uvicorn app.main:app --host 0.0.0.0 --port 8002
   ```

6. **Setup Reverse Proxy (Nginx):**
   ```nginx
   server {
       listen 80;
       server_name api.quickbg.app;
       
       location / {
           proxy_pass http://localhost:8002;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

### Frontend Deployment (Vercel/Netlify)

1. **Connect Repository:**
   - Go to Vercel/Netlify dashboard
   - Import your Git repository
   - Select `quickbg/frontend` as root directory

2. **Configure Environment Variables:**
   - Add all variables from `.env.local` checklist
   - Set `NODE_ENV=production`

3. **Build Settings:**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Test the deployed site

---

## ✅ Post-Deployment Testing

### Functional Tests

- [ ] Homepage loads correctly
- [ ] User can register new account
- [ ] User can login
- [ ] User can upload and process image (anonymous)
- [ ] User can upload and process image (authenticated)
- [ ] Password reset flow works
- [ ] Contact form sends emails
- [ ] Admin dashboard accessible (if admin user exists)

### Security Tests

- [ ] HTTPS is enforced (no HTTP access)
- [ ] CORS only allows your frontend domain
- [ ] API requires authentication for protected routes
- [ ] Rate limiting works (5 anonymous tries)
- [ ] Error messages don't expose sensitive info

### Performance Tests

- [ ] Page load time < 3 seconds
- [ ] Image processing completes in < 10 seconds
- [ ] Database queries are fast
- [ ] No memory leaks

---

## 📊 Monitoring Setup

### Recommended Tools

1. **Error Tracking:**
   - [ ] Setup Sentry (or similar)
   - [ ] Configure error alerts

2. **Application Monitoring:**
   - [ ] Setup Uptime monitoring
   - [ ] Monitor API response times
   - [ ] Monitor database performance

3. **Logs:**
   - [ ] Centralized logging (e.g., Logtail, Papertrail)
   - [ ] Log rotation configured
   - [ ] Error logs are monitored

---

## 🔄 Maintenance Checklist

### Daily
- [ ] Check error logs
- [ ] Monitor server resources (CPU, memory, disk)

### Weekly
- [ ] Review security logs
- [ ] Check database size
- [ ] Review user feedback

### Monthly
- [ ] Update dependencies
- [ ] Review and rotate secrets
- [ ] Backup verification
- [ ] Performance optimization review

---

## 🆘 Rollback Plan

If something goes wrong:

1. **Immediate Rollback:**
   ```bash
   # Revert to previous deployment
   git checkout <previous-commit>
   # Restart services
   ```

2. **Database Rollback:**
   ```bash
   # Rollback migrations if needed
   alembic downgrade -1
   ```

3. **Emergency Contacts:**
   - Hosting provider support
   - Database admin
   - Email service support

---

## 📝 Post-Deployment Notes

After successful deployment:

- [ ] Document any custom configurations
- [ ] Save production environment variable template
- [ ] Document server access procedures
- [ ] Create runbook for common issues
- [ ] Setup automated backups

---

## 🎉 You're Live!

Once all checkboxes are complete, your application is production-ready!

**Remember:**
- Monitor closely for first 24-48 hours
- Keep backups current
- Update dependencies regularly
- Review security periodically

---

**Need Help?** Check the troubleshooting sections in:
- `README.md`
- `EMAIL_SETUP.md`
- `PASSWORD_RESET_SETUP.md`
- `CONTACT_FORM_SETUP.md`

