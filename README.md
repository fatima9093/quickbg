# QuickBG - AI Background Removal

A production-grade full-stack application for removing backgrounds from images using AI.

## 🚀 Features

- **AI-Powered Background Removal**: Powered by rembg library
- **User Authentication**: Secure JWT-based authentication with NextAuth
- **Async Processing**: Celery + Redis for background job processing
- **Cloud Storage**: AWS S3 for storing original and processed images
- **Admin Panel**: Monitor users, uploads, and statistics
- **REST API**: Well-documented FastAPI backend
- **Modern Frontend**: Next.js 14 with App Router and TypeScript
- **Production Ready**: Docker support, proper error handling, and logging

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Authentication**: NextAuth.js
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL
- **Queue**: Redis + Celery
- **Storage**: AWS S3
- **ORM**: SQLAlchemy
- **Migrations**: Alembic
- **AI Model**: rembg

## 📁 Project Structure

```
quickbg/
├── frontend/               # Next.js frontend application
│   ├── app/               # App router pages
│   ├── components/        # React components
│   ├── lib/              # Utilities and config
│   └── types/            # TypeScript types
├── backend/              # FastAPI backend application
│   ├── app/
│   │   ├── api/         # API routes
│   │   ├── core/        # Configuration
│   │   ├── db/          # Database models
│   │   ├── services/    # Business logic
│   │   └── tasks/       # Celery tasks
│   └── alembic/         # Database migrations
├── docker-compose.yml    # Docker orchestration
├── Makefile             # Development commands
└── README.md           # This file
```

## 🏃 Getting Started

### Prerequisites

- Docker & Docker Compose (recommended)
- OR:
  - Node.js 18+
  - Python 3.11+
  - PostgreSQL
  - Redis
- AWS Account (for S3 storage)

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quickbg
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your AWS credentials and other settings
   ```

3. **Start all services**
   ```bash
   make up
   # or
   docker-compose up -d
   ```

4. **Run database migrations**
   ```bash
   make migrate
   # or
   docker-compose exec backend alembic upgrade head
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Local Development (Without Docker)

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Run migrations
alembic upgrade head

# Start the server
uvicorn app.main:app --reload

# In a separate terminal, start Celery worker
celery -A app.tasks.celery_app worker --loglevel=info
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

## 🔧 Available Commands

### Using Makefile

```bash
make help              # Show all available commands
make install           # Install dependencies
make up                # Start all services with Docker
make down              # Stop all services
make logs              # View logs from all services
make migrate           # Run database migrations
make clean             # Remove all containers and volumes
```

### Docker Commands

```bash
docker-compose up -d              # Start all services
docker-compose down               # Stop all services
docker-compose logs -f backend    # View backend logs
docker-compose exec backend sh    # Access backend shell
```

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

#### Uploads
- `POST /api/v1/uploads` - Upload image for processing
- `GET /api/v1/uploads` - Get user's uploads
- `GET /api/v1/uploads/{id}` - Get specific upload

#### Admin (requires admin role)
- `GET /api/v1/admin/stats` - Get dashboard statistics
- `GET /api/v1/admin/users` - Get all users
- `GET /api/v1/admin/uploads` - Get all uploads

## 🚀 Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Backend (Render/Railway)

#### Render

1. Create a new Web Service
2. Connect your repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add PostgreSQL and Redis instances
6. Set environment variables
7. Deploy

#### Railway

1. Create a new project
2. Add PostgreSQL and Redis plugins
3. Connect GitHub repository
4. Set environment variables
5. Deploy

### Celery Workers

Deploy Celery workers as separate services on Render or Railway using the command:
```bash
celery -A app.tasks.celery_app worker --loglevel=info
```

## 🔐 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@host:5432/quickbg
REDIS_URL=redis://host:6379/0
SECRET_KEY=your-secret-key
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET_NAME=your-bucket-name
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 📝 Database Migrations

```bash
# Create a new migration
make migrate-create name="add_new_field"

# Run migrations
make migrate

# Rollback migration
cd backend && alembic downgrade -1
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 🐛 Troubleshooting

### Common Issues

1. **Database connection error**
   - Ensure PostgreSQL is running
   - Check DATABASE_URL in .env

2. **Redis connection error**
   - Ensure Redis is running
   - Check REDIS_URL in .env

3. **S3 upload fails**
   - Verify AWS credentials
   - Check bucket permissions

4. **Celery tasks not processing**
   - Ensure Celery worker is running
   - Check Redis connection

## 📧 Support

For issues and questions, please open an issue in the repository.

---

Built with ❤️ using Next.js and FastAPI

