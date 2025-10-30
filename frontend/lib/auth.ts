import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const authOptions: NextAuthOptions = {
  providers: [
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
    async jwt({ token, user }) {
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
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
};

