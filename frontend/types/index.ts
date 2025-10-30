export interface User {
  id: string;
  email: string;
  name?: string;
  role: "user" | "admin";
  createdAt: string;
}

export interface Upload {
  id: string;
  userId: string;
  originalUrl: string;
  processedUrl?: string;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
}

export interface ProcessingJob {
  id: string;
  uploadId: string;
  status: "queued" | "processing" | "completed" | "failed";
  progress?: number;
  error?: string;
}

