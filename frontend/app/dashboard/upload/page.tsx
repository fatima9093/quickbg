"use client";

import { useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useDropzone } from "react-dropzone";
import { Upload, Download, X, CheckCircle2, Sparkles, RefreshCw } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import axios from "axios";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { API_BASE_URL } from "@/lib/api-config";

type ProcessingStatus = "idle" | "processing" | "completed" | "error";

export default function UploadPage() {
  const { data: session } = useSession();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setStatus("idle");
      setProcessedBlob(null);
      setErrorMessage(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  const processImage = async () => {
    if (!selectedFile || !session?.accessToken) return;

    try {
      setStatus("processing");
      setErrorMessage(null);

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await axios.post(
        `${API_BASE_URL}/process`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
          responseType: "blob",
        }
      );

      setProcessedBlob(response.data);
      setStatus("completed");
      toast.success("Background removed successfully!");
    } catch (error: any) {
      console.error("Processing error:", error);
      setStatus("error");
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || "Failed to process image";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  const downloadImage = () => {
    if (!processedBlob) return;

    const url = URL.createObjectURL(processedBlob);
    const a = document.createElement("a");
    a.href = url;
    const originalName = selectedFile?.name.replace(/\.[^/.]+$/, "") || "image";
    a.download = `${originalName}_nobg.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Image downloaded!");
  };

  const reset = () => {
    setSelectedFile(null);
    setPreview(null);
    setProcessedBlob(null);
    setStatus("idle");
    setErrorMessage(null);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Remove Background</h1>
          <p className="text-gray-600 mt-1">
            Upload an image and get instant background removal with AI
          </p>
        </div>

        {/* Main Upload/Process Card */}
        <Card>
          <CardContent className="p-8">
            {!selectedFile ? (
              /* Upload Dropzone */
              <div
                {...getRootProps()}
                className={`
                  relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer
                  ${
                    isDragActive
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-300 hover:border-primary-400 hover:bg-gray-50"
                  }
                `}
              >
                <input {...getInputProps()} />
                
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center mx-auto shadow-lg">
                    {isDragActive ? (
                      <Sparkles className="w-8 h-8 text-white animate-pulse" />
                    ) : (
                      <Upload className="w-8 h-8 text-white" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {isDragActive ? "Drop your image here" : "Upload an image"}
                    </h3>
                    <p className="text-gray-600">
                      Drag and drop or click to browse
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                    <span>PNG, JPG, JPEG, WebP</span>
                    <span>•</span>
                    <span>Max 10MB</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Processing View */
              <div className="space-y-6">
                {/* Image Preview */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Original */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Original</h4>
                    <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-square">
                      <img
                        src={preview!}
                        alt="Original"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  {/* Processed */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Processed</h4>
                    <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-square">
                      {status === "idle" && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center text-gray-400">
                            <Sparkles className="w-12 h-12 mx-auto mb-2" />
                            <p className="text-sm">Click process to start</p>
                          </div>
                        </div>
                      )}
                      {status === "processing" && (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-purple-50">
                          <div className="text-center space-y-3">
                            <LoadingSpinner size="lg" />
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-700">AI is working its magic...</p>
                              <p className="text-xs text-gray-500">⚡ Optimized for speed: 2-5 seconds</p>
                            </div>
                          </div>
                        </div>
                      )}
                      {status === "completed" && processedBlob && (
                        <img
                          src={URL.createObjectURL(processedBlob)}
                          alt="Processed"
                          className="w-full h-full object-contain"
                        />
                      )}
                      {status === "error" && (
                        <div className="w-full h-full flex items-center justify-center bg-red-50">
                          <div className="text-center text-red-600">
                            <X className="w-12 h-12 mx-auto mb-2" />
                            <p className="text-sm">{errorMessage || "Processing failed"}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600">{selectedFile.name}</p>
                    <span className="text-xs text-gray-500">
                      ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {status === "idle" && (
                      <>
                        <Button variant="outline" onClick={reset} icon={<X className="w-4 h-4" />}>
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          onClick={processImage}
                          icon={<Sparkles className="w-4 h-4" />}
                        >
                          Remove Background
                        </Button>
                      </>
                    )}
                    {status === "processing" && (
                      <Button variant="primary" disabled>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Processing...
                      </Button>
                    )}
                    {status === "completed" && (
                      <>
                        <Button variant="outline" onClick={reset} icon={<RefreshCw className="w-4 h-4" />}>
                          Process Another
                        </Button>
                        <Button
                          variant="primary"
                          onClick={downloadImage}
                          icon={<Download className="w-4 h-4" />}
                        >
                          Download Image
                        </Button>
                      </>
                    )}
                    {status === "error" && (
                      <>
                        <Button variant="outline" onClick={reset}>
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          onClick={processImage}
                          icon={<RefreshCw className="w-4 h-4" />}
                        >
                          Try Again
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">AI Precision</h4>
              <p className="text-sm text-gray-600">
                Advanced AI removes backgrounds with pixel-perfect accuracy
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Instant Results</h4>
              <p className="text-sm text-gray-600">
                No waiting! Process and download immediately
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-3">
                <Download className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">No Storage</h4>
              <p className="text-sm text-gray-600">
                Your images are processed instantly and never stored
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
