# QuickBG - AI Background Removal

A fast, privacy-focused full-stack application for removing backgrounds from images using AI. Features instant processing, zero storage policy, and user-friendly experience.

## 🚀 Features

### Core Features
- **AI-Powered Background Removal**: Powered by rembg (U²-Net AI model) for professional-quality results
- **Lightning Fast Processing**: Images processed in 2-5 seconds
- **Zero Storage Policy**: Images processed in memory and never stored - complete privacy
- **Free Tier Access**: 5 free tries without signup required
- **Generous Free Plan**: Unlimited background removal for registered users (forever free)
- **User Authentication**: Secure JWT-based authentication with 7-day sessions
- **Role-Based Access**: Admin and user roles with unified dashboard
- **Admin Panel**: Monitor users, statistics, and system metrics
- **Modern UI**: Beautiful, responsive interface built with Next.js and TailwindCSS

### User Experience
- Try without signup (5 free attempts)
- Instant processing - no waiting, no queues
- Direct download - processed images ready immediately
- Dashboard with usage statistics and activity tracking
- Cookie consent management
- Comprehensive pages: About, FAQ, Contact, Privacy, Terms

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Authentication**: NextAuth.js
- **State Management**: React Hooks, TanStack Query (React Query)
- **UI Components**: Custom components with Lucide icons
- **Form Handling**: React Hook Form patterns
- **Notifications**: React Hot Toast

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT tokens (7-day expiration)
- **AI Processing**: rembg library (U²-Net model)
- **Image Processing**: PIL/Pillow, OpenCV, NumPy
- **Migrations**: Alembic
- **No Queue System**: Direct instant processing
- **No Storage**: Zero image storage - in-memory processing only

## 📁 Project Structure

```
quickbg/
├── frontend/                    # Next.js frontend application
│   ├── app/                     # App router pages
│   │   ├── about/              # About page
│   │   ├── admin/               # Admin dashboard pages
│   │   │   ├── page.tsx        # Admin dashboard
│   │   │   └── users/          # User management
│   │   ├── contact/            # Contact page
│   │   ├── cookies/            # Cookie policy
│   │   ├── dashboard/          # User dashboard
│   │   │   ├── page.tsx        # Main dashboard
│   │   │   ├── profile/       # User profile
│   │   │   ├── settings/      # Settings
│   │   │   └── upload/         # Image upload & processing
│   │   ├── faq/                # FAQ page
│   │   ├── login/               # Login page
│   │   ├── privacy/            # Privacy policy
│   │   ├── signup/             # Signup page
│   │   └── terms/              # Terms of service
│   ├── components/             # React components
│   │   ├── layout/            # Layout components (Navbar, Footer, Sidebar)
│   │   ├── sections/          # Homepage sections
│   │   └── ui/                # Reusable UI components
│   ├── lib/                    # Utilities and API clients
│   └── types/                  # TypeScript type definitions
├── backend/                     # FastAPI backend application
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   └── v1/
│   │   │       ├── endpoints/
│   │   │       │   ├── admin.py      # Admin endpoints
│   │   │       │   ├── auth.py       # Authentication
│   │   │       │   ├── health.py     # Health check
│   │   │       │   └── process.py    # Image processing
│   │   │       └── api.py            # API router
│   │   ├── core/              # Configuration and security
│   │   │   ├── config.py      # Settings and environment
│   │   │   └── security.py    # JWT and password hashing
│   │   ├── db/                 # Database layer
│   │   │   ├── models.py      # SQLAlchemy models
│   │   │   ├── crud.py        # Database operations
│   │   │   └── base.py        # Database connection
│   │   ├── services/           # Business logic
│   │   │   └── background_removal.py  # AI processing service
│   │   └── schemas/           # Pydantic schemas
│   ├── alembic/                # Database migrations
│   └── requirements.txt        # Python dependencies
├── scripts/                     # Utility scripts
│   ├── create-admin.py        # Create admin user
│   └── setup-local.sh         # Local setup script
└── README.md                   # This file
```

## 🏃 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11+
- **PostgreSQL** 12+
- (Optional) Docker & Docker Compose

### Local Development Setup

#### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
# Create a .env file with:
DATABASE_URL=postgresql://user:password@localhost:5432/quickbg
SECRET_KEY=your-secret-key-here
CORS_ORIGINS=http://localhost:3000

# Run database migrations
alembic upgrade head

# (Optional) Create admin user
python scripts/create-admin.py

# Start the server
uvicorn app.main:app --reload
```

Backend will be available at: `http://localhost:8000`
API Documentation: `http://localhost:8000/docs`

#### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
# Create a .env.local file with:
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# Start development server
npm run dev
```

Frontend will be available at: `http://localhost:3000`

## 🔧 Configuration

### Backend Environment Variables (.env)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/quickbg

# Security
SECRET_KEY=your-secret-key-here  # Change in production!

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Image Processing (optional - defaults shown)
MAX_IMAGE_SIZE_MB=10
MAX_IMAGE_DIMENSION=4096
MIN_IMAGE_DIMENSION=50
PROCESSING_TIME_SOFT_CAP_SECONDS=15.0
PROCESSING_TIME_DEFAULT_SECONDS=4.0

# Rate Limiting
MAX_IMAGES_PER_DAY=50
MAX_IMAGES_PER_MONTH=500

# JWT
ACCESS_TOKEN_EXPIRE_MINUTES=10080  # 7 days
```

### Frontend Environment Variables (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here
```

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user (returns JWT token)

#### Image Processing
- `POST /api/v1/process-anonymous` - Process image without authentication (5 free tries)
- `GET /api/v1/anonymous-usage` - Check remaining free tries
- `POST /api/v1/process` - Process image (authenticated users, unlimited)
- `GET /api/v1/stats` - Get user statistics

#### Admin (requires admin role)
- `GET /api/v1/admin/stats` - Get system-wide statistics
- `GET /api/v1/admin/users` - Get all users (with pagination)

#### Health
- `GET /api/v1/health` - Health check endpoint

## 🎯 Key Features Explained

### Zero Storage Policy
- Images are processed entirely in memory
- Temporary files are deleted immediately after download
- No AWS S3, no file system storage
- Complete privacy - images never persist

### Instant Processing
- No task queue system (no Celery/Redis)
- Direct synchronous processing
- AI model pre-warmed on startup for instant first request
- Typical processing time: 2-5 seconds

### Free Tier Limits
- **Anonymous Users**: 5 free tries (tracked by IP address)
- **Registered Users**: Unlimited background removal
- No credit card required
- Forever free plan

### Session Management
- JWT tokens expire after 7 days
- Automatic logout after expiration
- Persistent sessions across page refreshes

### Role-Based Access
- **Regular Users**: Standard dashboard with personal stats
- **Admin Users**: Unified dashboard with admin panels, user management, and system statistics
- Role-based UI rendering - no separate admin routes required

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Type Checking
```bash
cd frontend
npm run type-check
```

### Build Frontend
```bash
cd frontend
npm run build
```

## 📝 Database Migrations

```bash
cd backend

# Create a new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

## 🚀 Deployment

### Backend Deployment (Render/Railway/Heroku)

1. Set environment variables:
   - `DATABASE_URL`
   - `SECRET_KEY`
   - `CORS_ORIGINS` (your frontend URL)

2. Build command: `pip install -r requirements.txt`

3. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

4. Run migrations: `alembic upgrade head`

### Frontend Deployment (Vercel/Netlify)

1. Set environment variables:
   - `NEXT_PUBLIC_API_URL` (your backend URL)
   - `NEXTAUTH_URL` (your frontend URL)
   - `NEXTAUTH_SECRET`

2. Build command: `npm run build`

3. Deploy automatically on git push

## 🐛 Troubleshooting

### Common Issues

1. **Database connection error**
   - Ensure PostgreSQL is running
   - Check `DATABASE_URL` in `.env`
   - Verify database exists and credentials are correct

2. **CORS errors**
   - Add your frontend URL to `CORS_ORIGINS` in backend `.env`
   - Format: `http://localhost:3000,https://yourdomain.com`

3. **JWT token errors**
   - Ensure `SECRET_KEY` matches between environments
   - Check token expiration (default: 7 days)

4. **Processing time shows incorrectly**
   - Backend automatically normalizes unrealistic spikes
   - Processing times are clamped to max 15 seconds per image
   - Average calculated from normalized totals

5. **Frontend build errors**
   - Run `npm install` to ensure dependencies are installed
   - Check TypeScript errors: `npm run type-check`

## 📊 Architecture Highlights

- **No Storage**: Complete privacy with in-memory processing
- **No Queue**: Instant processing without background jobs
- **Pre-warmed AI**: Model loaded at startup for fast first request
- **Optimized Processing**: Images resized to max 800px for speed
- **Smart Caching**: AI model session cached in memory
- **Processing Time Normalization**: Automatic correction of unrealistic metrics

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- CORS protection
- Rate limiting (5 anonymous tries)
- Input validation and sanitization
- SQL injection protection via SQLAlchemy
- Secure session management (7-day expiration)

## 📄 License

This project is proprietary and confidential.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📧 Support

For issues and questions, please open an issue in the repository.

---

Built with ❤️ using Next.js and FastAPI

**QuickBG** - Fast, private, and free background removal powered by AI.
