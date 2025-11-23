// Authentication API functions
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8002";

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user?: {
    id: string;
    email: string;
    name: string | null;
    role: string;
  };
}

export const authApi = {
  // Register new user
  async register(data: RegisterData) {
    const response = await axios.post(`${API_URL}/api/v1/auth/register`, {
      email: data.email,
      password: data.password,
      name: data.name || null,
    });
    return response.data;
  },

  // Login (called by NextAuth, but available for direct use)
  async login(email: string, password: string): Promise<LoginResponse> {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const response = await axios.post(`${API_URL}/api/v1/auth/login`, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  },
};

