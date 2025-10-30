#!/bin/bash

# Local development setup script
# This script sets up the entire project for local development

set -e

echo "================================"
echo "QuickBG Local Setup"
echo "================================"
echo ""

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "Error: Node.js is not installed"; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "Error: Python 3 is not installed"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "Error: Docker is not installed"; exit 1; }

echo "✓ Prerequisites check passed"
echo ""

# Setup environment files
echo "Setting up environment files..."

if [ ! -f .env ]; then
    cp .env.example .env
    echo "✓ Created root .env file"
else
    echo "⚠ Root .env file already exists"
fi

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✓ Created backend/.env file"
else
    echo "⚠ Backend .env file already exists"
fi

if [ ! -f frontend/.env.local ]; then
    cp frontend/.env.example frontend/.env.local
    echo "✓ Created frontend/.env.local file"
else
    echo "⚠ Frontend .env.local file already exists"
fi

echo ""

# Start Docker services
echo "Starting Docker services (PostgreSQL and Redis)..."
docker-compose up -d postgres redis

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
sleep 5

echo "✓ Docker services started"
echo ""

# Setup backend
echo "Setting up backend..."
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "✓ Created Python virtual environment"
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install --quiet --upgrade pip
pip install --quiet -r requirements.txt
echo "✓ Backend dependencies installed"

# Run migrations
echo "Running database migrations..."
alembic upgrade head
echo "✓ Database migrations complete"

cd ..

# Setup frontend
echo ""
echo "Setting up frontend..."
cd frontend

# Install dependencies
echo "Installing Node.js dependencies..."
npm install --silent
echo "✓ Frontend dependencies installed"

cd ..

echo ""
echo "================================"
echo "Setup Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Edit .env files with your AWS credentials"
echo "   - .env (root)"
echo "   - backend/.env"
echo "   - frontend/.env.local"
echo ""
echo "2. Start the development servers:"
echo ""
echo "   Terminal 1 (Backend):"
echo "   $ cd backend"
echo "   $ source venv/bin/activate"
echo "   $ uvicorn app.main:app --reload"
echo ""
echo "   Terminal 2 (Celery Worker):"
echo "   $ cd backend"
echo "   $ source venv/bin/activate"
echo "   $ celery -A app.tasks.celery_app worker --loglevel=info"
echo ""
echo "   Terminal 3 (Frontend):"
echo "   $ cd frontend"
echo "   $ npm run dev"
echo ""
echo "3. Access the application:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:8000"
echo "   - API Docs: http://localhost:8000/docs"
echo ""
echo "4. Create an admin user (optional):"
echo "   $ python scripts/create-admin.py"
echo ""

