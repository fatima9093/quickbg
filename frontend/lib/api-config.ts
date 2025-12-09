// API Configuration
// Note: NEXT_PUBLIC_API_URL should be just the host (e.g., "http://localhost:8002")
// We append /api/v1 here to match the backend routing
const API_HOST = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8002";
export const API_BASE_URL = `${API_HOST}/api/v1`;

// API Endpoints (paths relative to /api/v1)
export const API_ENDPOINTS = {
  // Auth
  login: `${API_BASE_URL}/auth/login`,
  signup: `${API_BASE_URL}/auth/signup`,
  
  // Anonymous (no auth)
  anonymousProcess: `${API_BASE_URL}/process-anonymous`,
  anonymousUsage: `${API_BASE_URL}/anonymous-usage`,
  
  // Authenticated
  process: `${API_BASE_URL}/process`,
  stats: `${API_BASE_URL}/stats`,
  userStats: `${API_BASE_URL}/stats`,
  
  // Admin
  adminStats: `${API_BASE_URL}/admin/stats`,
  adminUsers: `${API_BASE_URL}/admin/users`,
  
  // Contact
  contact: `${API_BASE_URL}/contact/contact`,
  
  // Health
  health: `${API_BASE_URL}/health`,
};

// Helper to build full URL
export function getApiUrl(endpoint: string): string {
  return `${API_BASE_URL}${endpoint}`;
}

