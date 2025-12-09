#!/usr/bin/env python3
"""
Generate secure secret keys for QuickBG production deployment.

This script generates cryptographically secure random keys for:
- Backend SECRET_KEY (JWT signing)
- Frontend NEXTAUTH_SECRET (NextAuth.js)

Usage:
    python scripts/generate_secrets.py
"""

import secrets
import sys
from pathlib import Path

def generate_secret_key(length=32):
    """Generate a secure random URL-safe secret key."""
    return secrets.token_urlsafe(length)

def main():
    """Generate and display secret keys."""
    print("=" * 60)
    print("🔐 QuickBG Secret Key Generator")
    print("=" * 60)
    print()
    
    # Generate keys
    backend_secret = generate_secret_key(32)
    frontend_secret = generate_secret_key(32)
    
    print("✅ Generated secure secret keys:")
    print()
    print("📋 Backend SECRET_KEY (for JWT signing):")
    print(f"   {backend_secret}")
    print()
    print("📋 Frontend NEXTAUTH_SECRET (for NextAuth.js):")
    print(f"   {frontend_secret}")
    print()
    print("=" * 60)
    print("📝 Next Steps:")
    print("=" * 60)
    print()
    print("1. Add to backend/.env:")
    print(f"   SECRET_KEY={backend_secret}")
    print()
    print("2. Add to frontend/.env.local:")
    print(f"   NEXTAUTH_SECRET={frontend_secret}")
    print()
    print("⚠️  IMPORTANT:")
    print("   - Never commit these keys to Git")
    print("   - Keep them secure and private")
    print("   - Use different keys for each environment")
    print("   - Rotate keys periodically")
    print()
    print("=" * 60)
    
    # Optionally save to a temporary file (user must delete it!)
    save_to_file = input("Save to secrets.txt? (y/N): ").strip().lower()
    if save_to_file == 'y':
        script_dir = Path(__file__).parent
        secrets_file = script_dir / "secrets.txt"
        
        with open(secrets_file, 'w') as f:
            f.write("# QuickBG Secret Keys - DELETE THIS FILE AFTER USE!\n")
            f.write("# Generated on: " + str(Path(__file__).stat().st_mtime) + "\n")
            f.write("#\n")
            f.write("# Backend SECRET_KEY:\n")
            f.write(f"SECRET_KEY={backend_secret}\n")
            f.write("#\n")
            f.write("# Frontend NEXTAUTH_SECRET:\n")
            f.write(f"NEXTAUTH_SECRET={frontend_secret}\n")
        
        print(f"✅ Keys saved to: {secrets_file}")
        print("⚠️  DELETE THIS FILE after copying the keys!")
        print()
    
    return 0

if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print("\n\n❌ Cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Error: {e}")
        sys.exit(1)

