.PHONY: help install dev build up down logs clean migrate

help: ## Show this help message
	@echo "Usage: make [target]"
	@echo ""
	@echo "Available targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies for frontend and backend
	@echo "Installing frontend dependencies..."
	cd frontend && npm install
	@echo "Installing backend dependencies..."
	cd backend && pip install -r requirements.txt

dev-frontend: ## Run frontend in development mode
	cd frontend && npm run dev

dev-backend: ## Run backend in development mode
	cd backend && uvicorn app.main:app --reload

dev-celery: ## Run Celery worker
	cd backend && celery -A app.tasks.celery_app worker --loglevel=info

up: ## Start all services with Docker Compose
	docker-compose up -d

down: ## Stop all services
	docker-compose down

logs: ## View logs from all services
	docker-compose logs -f

logs-backend: ## View backend logs
	docker-compose logs -f backend

logs-celery: ## View Celery logs
	docker-compose logs -f celery-worker

build: ## Build Docker images
	docker-compose build

clean: ## Remove all containers, volumes, and images
	docker-compose down -v --rmi all

migrate: ## Run database migrations
	cd backend && alembic upgrade head

migrate-create: ## Create a new migration
	cd backend && alembic revision --autogenerate -m "$(name)"

db-shell: ## Open PostgreSQL shell
	docker-compose exec postgres psql -U quickbg_user -d quickbg

redis-cli: ## Open Redis CLI
	docker-compose exec redis redis-cli

backend-shell: ## Open backend container shell
	docker-compose exec backend sh

test-backend: ## Run backend tests
	cd backend && pytest

lint-frontend: ## Lint frontend code
	cd frontend && npm run lint

type-check: ## Type check frontend code
	cd frontend && npm run type-check

