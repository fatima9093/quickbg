@echo off
REM Local development setup script for Windows
REM This script sets up the entire project for local development

echo ================================
echo QuickBG Local Setup (Windows)
echo ================================
echo.

REM Check prerequisites
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Node.js is not installed
    exit /b 1
)

where python >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Python is not installed
    exit /b 1
)

where docker >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Docker is not installed
    exit /b 1
)

echo [OK] Prerequisites check passed
echo.

REM Setup environment files
echo Setting up environment files...

if not exist .env (
    copy .env.example .env
    echo [OK] Created root .env file
) else (
    echo [!] Root .env file already exists
)

if not exist backend\.env (
    copy backend\.env.example backend\.env
    echo [OK] Created backend\.env file
) else (
    echo [!] Backend .env file already exists
)

if not exist frontend\.env.local (
    copy frontend\.env.example frontend\.env.local
    echo [OK] Created frontend\.env.local file
) else (
    echo [!] Frontend .env.local file already exists
)

echo.

REM Start Docker services
echo Starting Docker services (PostgreSQL and Redis)...
docker-compose up -d postgres redis

REM Wait for PostgreSQL to be ready
echo Waiting for PostgreSQL to be ready...
timeout /t 5 /nobreak >nul

echo [OK] Docker services started
echo.

REM Setup backend
echo Setting up backend...
cd backend

REM Create virtual environment
if not exist venv (
    python -m venv venv
    echo [OK] Created Python virtual environment
)

REM Activate virtual environment and install dependencies
call venv\Scripts\activate.bat

echo Installing Python dependencies...
pip install --quiet --upgrade pip
pip install --quiet -r requirements.txt
echo [OK] Backend dependencies installed

REM Run migrations
echo Running database migrations...
alembic upgrade head
echo [OK] Database migrations complete

cd ..

REM Setup frontend
echo.
echo Setting up frontend...
cd frontend

REM Install dependencies
echo Installing Node.js dependencies...
npm install --silent
echo [OK] Frontend dependencies installed

cd ..

echo.
echo ================================
echo Setup Complete!
echo ================================
echo.
echo Next steps:
echo.
echo 1. Edit .env files with your AWS credentials
echo    - .env (root)
echo    - backend\.env
echo    - frontend\.env.local
echo.
echo 2. Start the development servers:
echo.
echo    Terminal 1 (Backend):
echo    $ cd backend
echo    $ venv\Scripts\activate
echo    $ uvicorn app.main:app --reload
echo.
echo    Terminal 2 (Celery Worker):
echo    $ cd backend
echo    $ venv\Scripts\activate
echo    $ celery -A app.tasks.celery_app worker --loglevel=info
echo.
echo    Terminal 3 (Frontend):
echo    $ cd frontend
echo    $ npm run dev
echo.
echo 3. Access the application:
echo    - Frontend: http://localhost:3000
echo    - Backend API: http://localhost:8000
echo    - API Docs: http://localhost:8000/docs
echo.
echo 4. Create an admin user (optional):
echo    $ python scripts\create-admin.py
echo.

pause

