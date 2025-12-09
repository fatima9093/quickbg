import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8002";

export const authOptions: NextAuthOptions = {
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
    
    // Credentials Provider (Email/Password)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        try {
          // Backend expects form data with username (not email) and password
          const formData = new URLSearchParams();
          formData.append("username", credentials.email);
          formData.append("password", credentials.password);

          const response = await axios.post(
            `${API_URL}/api/v1/auth/login`,
            formData,
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );

          if (response.data.access_token) {
            // Return user object with token
            return {
              id: response.data.user?.id || credentials.email,
              email: credentials.email,
              name: response.data.user?.name || null,
              role: response.data.user?.role || "user",
              accessToken: response.data.access_token,
            };
          }
          
          throw new Error("Invalid credentials");
        } catch (error: any) {
          console.error("Auth error:", error.response?.data || error.message);
          throw new Error(error.response?.data?.detail || "Authentication failed");
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
          const response = await axios.post(`${API_URL}/api/v1/auth/google-login`, {
            email: user.email,
            name: user.name,
            google_id: account.providerAccountId,
            avatar: user.image,
          });

          if (response.data.access_token) {
            // Store backend data in user object
            user.id = response.data.user.id;
            user.role = response.data.user.role;
            (user as any).accessToken = response.data.access_token;
            return true;
          }
          
          return false;
        } catch (error) {
          console.error("Google sign-in error:", error);
          return false;
        }
      }
      
      // Allow credentials login
      return true;
    },
    
    async jwt({ token, user, account }) {
      // On signin, user object contains our returned data
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },
    
    async session({ session, token }) {
      // Pass token data to session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
      }
      (session as any).accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days (604,800 seconds)
  },
  // Secure cookie configuration for production
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
};

