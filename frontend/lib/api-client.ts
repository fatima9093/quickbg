import axios from "axios";
import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to attach auth token
apiClient.interceptors.request.use(
  async (config) => {
    // Get session to retrieve access token
    const session = await getSession();
    if (session && (session as any).accessToken) {
      config.headers.Authorization = `Bearer ${(session as any).accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - could redirect to login
      console.error("Unauthorized request");
    }
    return Promise.reject(error);
  }
);

// Helper function to create authenticated API client (for server-side)
export const createAuthenticatedClient = (token: string) => {
  return axios.create({
    baseURL: `${API_URL}/api/v1`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

