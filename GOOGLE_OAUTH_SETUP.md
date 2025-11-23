# Google OAuth Setup - Professional Implementation Guide

Complete guide to implement "Continue with Google" authentication in QuickBG.

---

## 📋 Table of Contents

1. [Google Cloud Console Setup](#1-google-cloud-console-setup)
2. [Install Dependencies](#2-install-dependencies)
3. [Configure Environment Variables](#3-configure-environment-variables)
4. [Update NextAuth Configuration](#4-update-nextauth-configuration)
5. [Update Backend User Model](#5-update-backend-user-model)
6. [Update Login/Signup Pages](#6-update-loginsignup-pages)
7. [Testing](#7-testing)
8. [Production Deployment](#8-production-deployment)

---

## 1. Google Cloud Console Setup

### Step 1.1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. **Project Name**: `QuickBG`
4. Click **"Create"**

### Step 1.2: Enable Google+ API

1. In your project, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"**
3. Click on it and press **"Enable"**

### Step 1.3: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Select **"External"** (unless you have Google Workspace)
3. Click **"Create"**

**Fill in the form:**

| Field | Value |
|-------|-------|
| **App name** | QuickBG |
| **User support email** | contact@quickbg.app |
| **App logo** | Upload your logo (120x120px) |
| **Application home page** | https://quickbg.app |
| **Application privacy policy** | https://quickbg.app/privacy |
| **Application terms of service** | https://quickbg.app/terms |
| **Authorized domains** | quickbg.app |
| **Developer contact email** | contact@quickbg.app |

4. Click **"Save and Continue"**
5. **Scopes**: Click **"Add or Remove Scopes"**
   - Select: `email`, `profile`, `openid`
   - Click **"Update"** → **"Save and Continue"**
6. **Test users** (for development): Add your email
7. Click **"Save and Continue"** → **"Back to Dashboard"**

### Step 1.4: Create OAuth Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. **Application type**: Web application
4. **Name**: QuickBG Web Client

**Authorized JavaScript origins:**
```
http://localhost:3000
https://quickbg.app
```

**Authorized redirect URIs:**
```
http://localhost:3000/api/auth/callback/google
https://quickbg.app/api/auth/callback/google
```

5. Click **"Create"**
6. **Copy your credentials:**
   - Client ID: `xxxxx.apps.googleusercontent.com`
   - Client Secret: `GOCSPX-xxxxx`

⚠️ **Keep these secret!** Never commit them to GitHub.

---

## 2. Install Dependencies

### Frontend (Next.js)

```bash
cd quickbg/frontend
npm install next-auth@latest
```

The dependencies should already be installed, but ensure you have:
- `next-auth` (for OAuth)
- `@next-auth/prisma-adapter` (optional, if using Prisma)

---

## 3. Configure Environment Variables

### Frontend `.env.local`

Create or update `quickbg/frontend/.env.local`:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-a-random-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-google-client-secret

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Generate NEXTAUTH_SECRET:**
```bash
# In terminal:
openssl rand -base64 32
# Or use: https://generate-secret.vercel.app/32
```

### Backend `.env`

Add to `quickbg/backend/.env`:

```env
# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-google-client-secret
```

---

## 4. Update NextAuth Configuration

### Step 4.1: Update NextAuth Route

**File:** `quickbg/frontend/app/api/auth/[...nextauth]/route.ts`

```typescript
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    
    // Existing Credentials Provider
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Call your backend API
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              username: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            return null;
          }

          const data = await response.json();
          
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            role: data.user.role,
            accessToken: data.access_token,
          };
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google OAuth sign-in
      if (account?.provider === "google") {
        try {
          // Register/login user in backend
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google-login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              google_id: account.providerAccountId,
              avatar: user.image,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            user.id = data.user.id;
            user.role = data.user.role;
            user.accessToken = data.access_token;
            return true;
          }
          
          return false;
        } catch (error) {
          console.error("Google sign-in error:", error);
          return false;
        }
      }
      
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
```

### Step 4.2: Update TypeScript Types

**File:** `quickbg/frontend/types/next-auth.d.ts`

```typescript
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name?: string;
    role?: string;
    accessToken?: string;
    image?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      role?: string;
      accessToken?: string;
      image?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    accessToken?: string;
  }
}
```

---

## 5. Update Backend User Model

### Step 5.1: Update User Model

**File:** `quickbg/backend/app/db/models.py`

Add OAuth fields to User model:

```python
class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String)
    hashed_password = Column(String, nullable=True)  # Nullable for OAuth users
    role = Column(Enum(UserRole), default=UserRole.USER)
    
    # OAuth fields - ADD THESE
    google_id = Column(String, unique=True, nullable=True, index=True)
    avatar = Column(String, nullable=True)
    oauth_provider = Column(String, nullable=True)  # 'google', 'github', etc.
    
    # Password Reset
    reset_token = Column(String, nullable=True)
    reset_token_expires = Column(DateTime(timezone=True), nullable=True)
    
    # ... rest of existing fields ...
```

### Step 5.2: Create Migration

```bash
cd quickbg/backend
alembic revision --autogenerate -m "add_oauth_fields"
alembic upgrade head
```

### Step 5.3: Add Google Login Endpoint

**File:** `quickbg/backend/app/api/v1/endpoints/auth.py`

Add this new endpoint:

```python
@router.post("/google-login", response_model=LoginResponse)
async def google_login(
    email: str,
    name: str,
    google_id: str,
    avatar: str = None,
    db: Session = Depends(get_db)
):
    """Login or register user via Google OAuth."""
    # Check if user exists by Google ID
    user = db.query(User).filter(User.google_id == google_id).first()
    
    if not user:
        # Check if user exists by email
        user = db.query(User).filter(User.email == email).first()
        
        if user:
            # Link Google account to existing user
            user.google_id = google_id
            user.avatar = avatar
            user.oauth_provider = "google"
        else:
            # Create new user
            user = User(
                email=email,
                name=name,
                google_id=google_id,
                avatar=avatar,
                oauth_provider="google",
                hashed_password=None,  # No password for OAuth users
                total_images_processed=0,
                images_processed_today=0,
                total_processing_time=0.0
            )
            db.add(user)
        
        db.commit()
        db.refresh(user)
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id, "email": user.email, "role": user.role},
        expires_delta=access_token_expires
    )
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            role=user.role,
            created_at=user.created_at
        )
    )
```

---

## 6. Update Login/Signup Pages

### Step 6.1: Update Login Page

**File:** `quickbg/frontend/app/login/page.tsx`

Add Google button:

```typescript
import { signIn } from "next-auth/react";
import Image from "next/image";

// Add this component for Google button
const GoogleButton = ({ loading }: { loading: boolean }) => (
  <button
    type="button"
    onClick={() => signIn("google", { callbackUrl: "/" })}
    disabled={loading}
    className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
    <span className="font-medium text-gray-700 dark:text-gray-300">
      Continue with Google
    </span>
  </button>
);

// In your login form, add after the login button:
<div className="relative my-6">
  <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
  </div>
  <div className="relative flex justify-center text-sm">
    <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
      Or continue with
    </span>
  </div>
</div>

<GoogleButton loading={loading} />
```

### Step 6.2: Update Signup Page

**File:** `quickbg/frontend/app/signup/page.tsx`

Add the same Google button component and divider.

---

## 7. Testing

### Step 7.1: Test Locally

1. **Start Backend:**
```bash
cd quickbg/backend
uvicorn app.main:app --reload
```

2. **Start Frontend:**
```bash
cd quickbg/frontend
npm run dev
```

3. **Test Flow:**
   - Go to http://localhost:3000/login
   - Click "Continue with Google"
   - Select your Google account
   - Verify you're redirected and logged in
   - Check backend database for new user

### Step 7.2: Check User in Database

```sql
SELECT id, email, name, google_id, oauth_provider FROM users;
```

---

## 8. Production Deployment

### Step 8.1: Update Google OAuth Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Credentials**
3. Edit your OAuth client
4. Add production URIs:

**Authorized JavaScript origins:**
```
https://quickbg.app
```

**Authorized redirect URIs:**
```
https://quickbg.app/api/auth/callback/google
```

### Step 8.2: Update Production Environment

**Frontend:**
```env
NEXTAUTH_URL=https://quickbg.app
NEXTAUTH_SECRET=your-production-secret
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
NEXT_PUBLIC_API_URL=https://quickbg.app/api
```

**Backend:**
```env
FRONTEND_URL=https://quickbg.app
CORS_ORIGINS=https://quickbg.app
```

### Step 8.3: Publish OAuth Consent Screen

1. Go to **OAuth consent screen**
2. Click **"Publish App"**
3. Submit for verification (if needed)

---

## 🎨 Professional UI Enhancements

### Google Button Design Best Practices:

1. ✅ Use official Google logo/colors
2. ✅ "Continue with Google" (not "Sign in")
3. ✅ Proper spacing and padding
4. ✅ Hover effects
5. ✅ Loading states
6. ✅ Dark mode support

### Example Enhanced Button:

```typescript
const GoogleButton = ({ loading }: { loading: boolean }) => (
  <button
    type="button"
    onClick={() => signIn("google", { callbackUrl: "/" })}
    disabled={loading}
    className="group relative w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 rounded-lg transition-all duration-200"></div>
    
    <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24">
      {/* Google SVG paths */}
    </svg>
    
    <span className="relative z-10 font-semibold text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
      {loading ? "Connecting..." : "Continue with Google"}
    </span>
  </button>
);
```

---

## 🔒 Security Best Practices

1. ✅ Always use HTTPS in production
2. ✅ Never expose client secrets in frontend code
3. ✅ Validate OAuth state parameter
4. ✅ Implement rate limiting
5. ✅ Use secure session storage
6. ✅ Rotate secrets regularly
7. ✅ Monitor OAuth usage

---

## 🐛 Troubleshooting

### Error: "redirect_uri_mismatch"
- Check authorized redirect URIs in Google Console
- Must exactly match (including http/https)

### Error: "invalid_client"
- Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
- Ensure they match Google Console credentials

### Users Created But Not Logged In
- Check callback implementation
- Verify JWT token generation
- Check session strategy

### "Access Blocked" Error
- Ensure OAuth consent screen is configured
- Add test users if app is not published

---

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [Google Sign-In Branding Guidelines](https://developers.google.com/identity/branding-guidelines)

---

## ✅ Checklist

Before going live:

- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] OAuth credentials created
- [ ] Frontend environment variables set
- [ ] Backend environment variables set
- [ ] NextAuth configured
- [ ] Backend endpoint created
- [ ] Database migration applied
- [ ] UI updated with Google button
- [ ] Local testing completed
- [ ] Production URIs added to Google Console
- [ ] OAuth app published
- [ ] Production deployment tested

---

**Need help?** Check the troubleshooting section or contact support at contact@quickbg.app

