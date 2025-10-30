#!/usr/bin/env python3
"""
Script to create an admin user in the database.
Usage: python scripts/create-admin.py
"""

import sys
import os
from getpass import getpass

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app.db.base import SessionLocal
from app.db import crud
from app.db.models import UserRole


def create_admin_user():
    """Create an admin user interactively."""
    print("=== Create Admin User ===\n")
    
    # Get user input
    email = input("Enter admin email: ").strip()
    name = input("Enter admin name (optional): ").strip() or None
    password = getpass("Enter admin password: ")
    password_confirm = getpass("Confirm password: ")
    
    # Validate input
    if not email:
        print("Error: Email is required")
        return
    
    if password != password_confirm:
        print("Error: Passwords do not match")
        return
    
    if len(password) < 8:
        print("Error: Password must be at least 8 characters")
        return
    
    # Create user
    db = SessionLocal()
    try:
        # Check if user already exists
        existing_user = crud.get_user_by_email(db, email)
        if existing_user:
            print(f"Error: User with email {email} already exists")
            return
        
        # Create admin user
        admin = crud.create_user(
            db=db,
            email=email,
            password=password,
            name=name,
            role=UserRole.ADMIN
        )
        
        print(f"\n✓ Admin user created successfully!")
        print(f"  Email: {admin.email}")
        print(f"  Name: {admin.name or 'N/A'}")
        print(f"  Role: {admin.role}")
        print(f"  ID: {admin.id}")
        
    except Exception as e:
        print(f"Error creating admin user: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    try:
        create_admin_user()
    except KeyboardInterrupt:
        print("\n\nOperation cancelled by user")
        sys.exit(0)

