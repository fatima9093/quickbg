// Admin API helpers
import { apiClient } from "./api-client";

export interface AdminStats {
  total_users: number;
  total_images_processed: number;
  total_processing_time: number;
  avg_processing_time: number;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  created_at: string;
}

export interface AdminUpload {
  id: string;
  user_id: string;
  original_filename: string;
  original_url: string;
  processed_url: string | null;
  presigned_url: string | null;
  status: string;
  file_size: number | null;
  created_at: string;
  updated_at: string;
}

export const adminApi = {
  // Get dashboard stats (token automatically added by interceptor)
  async getStats(): Promise<AdminStats> {
    const response = await apiClient.get("/admin/stats");
    return response.data;
  },

  // Get all users
  async getUsers(skip = 0, limit = 100): Promise<AdminUser[]> {
    const response = await apiClient.get("/admin/users", {
      params: { skip, limit },
    });
    return response.data;
  },

  // Get all uploads
  async getUploads(skip = 0, limit = 100): Promise<AdminUpload[]> {
    const response = await apiClient.get("/admin/uploads", {
      params: { skip, limit },
    });
    return response.data;
  },

  // Delete user (to be implemented in backend)
  async deleteUser(userId: string): Promise<void> {
    const response = await apiClient.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Delete upload (to be implemented in backend)
  async deleteUpload(uploadId: string): Promise<void> {
    const response = await apiClient.delete(`/admin/uploads/${uploadId}`);
    return response.data;
  },
};

