"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { 
  Sparkles, 
  Upload, 
  Download, 
  Check, 
  X, 
  RefreshCw,
  AlertCircle,
  ArrowRight,
  Zap
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSession, getSession } from "next-auth/react";
import { API_BASE_URL } from "@/lib/api-config";

export function HeroSection() {
  const router = useRouter();
  const { data: session } = useSession();
  const isLoggedIn = !!session;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "completed" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [remainingTries, setRemainingTries] = useState<number>(5);
  const [showSignupModal, setShowSignupModal] = useState(false);

  // Check remaining tries on mount (only for anonymous users)
  useEffect(() => {
    if (!isLoggedIn) {
      checkRemainingTries();
    }
  }, [isLoggedIn]);

  const checkRemainingTries = async () => {
    try {
      console.log("Checking usage at:", `${API_BASE_URL}/anonymous-usage`);
      const response = await axios.get(`${API_BASE_URL}/anonymous-usage`);
      setRemainingTries(response.data.remaining);
    } catch (error) {
      console.error("Failed to check usage:", error);
      // Default to 5 if check fails
      setRemainingTries(5);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size must be less than 10MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setStatus("idle");
      setProcessedBlob(null);
      setErrorMessage("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    multiple: false,
    disabled: status === "processing",
  });

  const handleRemoveBackground = async () => {
    if (!selectedFile) return;

    // Check anonymous user limit (only for non-logged-in users)
    if (!isLoggedIn && remainingTries <= 0) {
      setShowSignupModal(true);
      return;
    }

    setStatus("processing");
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Use authenticated endpoint if logged in, anonymous endpoint if not
      const endpoint = isLoggedIn ? `${API_BASE_URL}/process` : `${API_BASE_URL}/process-anonymous`;
      
      // Create axios config with auth token if logged in
      const config: any = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      };

      // Add auth token if logged in
      if (isLoggedIn) {
        const currentSession = await getSession();
        if (currentSession && (currentSession as any).accessToken) {
          config.headers.Authorization = `Bearer ${(currentSession as any).accessToken}`;
        }
      }

      const response = await axios.post(endpoint, formData, config);

      // Get remaining tries from response header (only for anonymous users)
      if (!isLoggedIn) {
        const remaining = response.headers["x-remaining-tries"];
        console.log("Response headers:", response.headers);
        console.log("Remaining tries from header:", remaining);
        
        if (remaining !== undefined) {
          const remainingCount = parseInt(remaining);
          console.log("Updating remaining tries to:", remainingCount);
          setRemainingTries(remainingCount);
        } else {
          console.warn("X-Remaining-Tries header not found in response");
        }

        // Show signup prompt if this was the last free try
        if (remaining !== undefined && parseInt(remaining) === 0) {
          console.log("Last free try used! Showing signup modal...");
          setTimeout(() => {
            setShowSignupModal(true);
          }, 2000);
        }
      }

      setProcessedBlob(response.data);
      setStatus("completed");
      toast.success("Background removed successfully! 🎉");
    } catch (error: any) {
      console.error("Processing error:", error);
      setStatus("error");

      if (error.response?.status === 429) {
        setErrorMessage("Free trial limit reached! Sign up to continue.");
        setShowSignupModal(true);
      } else if (error.response?.data) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errorData = JSON.parse(reader.result as string);
            setErrorMessage(errorData.detail || "Processing failed");
            toast.error(errorData.detail || "Processing failed");
          } catch {
            setErrorMessage("Processing failed. Please try again.");
            toast.error("Processing failed. Please try again.");
          }
        };
        reader.readAsText(error.response.data);
      } else {
        setErrorMessage("Network error. Please check your connection.");
        toast.error("Network error. Please check your connection.");
      }
    }
  };

  const handleDownload = () => {
    if (!processedBlob) return;

    const url = URL.createObjectURL(processedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedFile?.name.split(".")[0] || "image"}_nobg.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Downloaded successfully!");
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setProcessedBlob(null);
    setStatus("idle");
    setErrorMessage("");
  };

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 gradient-mesh opacity-50 dark:opacity-30" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 dark:bg-primary-900/30 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200 dark:bg-purple-900/30 rounded-full blur-3xl opacity-20 animate-pulse delay-1000" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered • Instant • Free to Try</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-gray-900 dark:text-gray-100">
            Remove Image{" "}
            <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Backgrounds
            </span>
            <br />
            Instantly & Free
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto mb-4">
            Try our AI-powered background remover right now! No signup required for your first 5 images.
          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-primary-700 dark:text-primary-400 font-medium">
            <Zap className="w-4 h-4" />
            <span>
              {isLoggedIn
                ? "Unlimited background removal"
                : remainingTries > 0
                ? `${remainingTries} free ${remainingTries === 1 ? "try" : "tries"} remaining`
                : "Sign up for unlimited access"}
            </span>
          </div>
        </div>

        {/* Main Upload Area */}
        <div className="max-w-5xl mx-auto">
          {!selectedFile ? (
            // Upload Zone
            <div
              {...getRootProps()}
              className={`
                glass rounded-3xl p-12 text-center cursor-pointer
                transition-all duration-300 border-2 border-dashed
                ${
                  isDragActive
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-105"
                    : "border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }
              `}
            >
              <input {...getInputProps()} />
              <div className="space-y-6">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mx-auto">
                  <Upload className="w-12 h-12 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {isDragActive ? "Drop your image here" : "Upload or Drag & Drop"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    PNG, JPG, or WEBP • Max 10MB
                  </p>
                </div>
                <Button size="lg" variant="primary" type="button">
                  <Upload className="w-5 h-5 mr-2" />
                  Choose Image
                </Button>
              </div>
            </div>
          ) : (
            // Processing Area
            <div className="glass rounded-3xl p-8 space-y-6">
              {/* Before/After Preview */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Before */}
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full" />
                    Original
                  </div>
                  <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl overflow-hidden">
                    {previewUrl && (
                      <img
                        src={previewUrl}
                        alt="Original"
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                </div>

                {/* After */}
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-primary-700 dark:text-primary-400 flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary-500 dark:bg-primary-400 rounded-full animate-pulse" />
                    Processed
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="relative aspect-square bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-2xl overflow-hidden border-2 border-primary-200 dark:border-primary-800">
                    {status === "idle" && (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                        <div className="text-center space-y-2">
                          <Sparkles className="w-12 h-12 mx-auto opacity-50" />
                          <p className="text-sm">Click &quot;Remove Background&quot;</p>
                        </div>
                      </div>
                    )}
                    {status === "processing" && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center space-y-3">
                          <LoadingSpinner size="lg" />
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">AI is working...</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">⚡ 2-5 seconds</p>
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
                      <div className="w-full h-full flex items-center justify-center text-red-500 dark:text-red-400">
                        <div className="text-center space-y-2">
                          <AlertCircle className="w-12 h-12 mx-auto" />
                          <p className="text-sm">{errorMessage}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 justify-center pt-4">
                {status === "idle" && (
                  <>
                    <Button
                      size="lg"
                      variant="primary"
                      onClick={handleRemoveBackground}
                      icon={<Sparkles className="w-5 h-5" />}
                      disabled={!isLoggedIn && remainingTries <= 0}
                    >
                      Remove Background
                    </Button>
                    <Button size="lg" variant="secondary" onClick={handleReset}>
                      <X className="w-5 h-5 mr-2" />
                      Cancel
                    </Button>
                  </>
                )}

                {status === "processing" && (
                  <Button size="lg" variant="primary" disabled>
                    <div className="mr-2">
                      <LoadingSpinner size="sm" />
                    </div>
                    Processing...
                  </Button>
                )}

                {status === "completed" && (
                  <>
                    <Button
                      size="lg"
                      variant="primary"
                      onClick={handleDownload}
                      icon={<Download className="w-5 h-5" />}
                    >
                      Download Image
                    </Button>
                    <Button size="lg" variant="secondary" onClick={handleReset}>
                      <RefreshCw className="w-5 h-5 mr-2" />
                      Try Another
                    </Button>
                  </>
                )}

                {status === "error" && (
                  <>
                    <Button size="lg" variant="primary" onClick={handleRemoveBackground}>
                      <RefreshCw className="w-5 h-5 mr-2" />
                      Try Again
                    </Button>
                    <Button size="lg" variant="secondary" onClick={handleReset}>
                      <X className="w-5 h-5 mr-2" />
                      Reset
                    </Button>
                  </>
                )}
              </div>

              {/* Info Banner */}
              {!isLoggedIn && remainingTries > 0 && status === "idle" && (
                <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-4 text-center">
                  <p className="text-sm text-primary-700 dark:text-primary-400">
                    <strong>{remainingTries}</strong> free {remainingTries === 1 ? "try" : "tries"} remaining •{" "}
                    <button
                      onClick={() => router.push("/signup")}
                      className="underline hover:no-underline font-semibold"
                    >
                      Sign up
                    </button>{" "}
                    for unlimited access
                  </p>
                </div>
              )}
              {isLoggedIn && status === "idle" && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center">
                  <p className="text-sm text-green-700 dark:text-green-400">
                    ✓ Unlimited background removal • No limits
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500 dark:text-green-400" />
              <span className="text-sm">No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500 dark:text-green-400" />
              <span className="text-sm">2-5 second processing</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500 dark:text-green-400" />
              <span className="text-sm">High-quality results</span>
            </div>
          </div>
        </div>
      </div>

      {/* Signup Modal */}
      {showSignupModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass rounded-3xl p-8 max-w-md w-full space-y-6 animate-slide-up">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mx-auto">
                <Sparkles className="w-10 h-10 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Love QuickBG? Sign Up for More!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You&apos;ve used all 5 free tries. Create an account to remove backgrounds from unlimited images!
              </p>
            </div>

            <div className="space-y-3">
              <Button
                size="lg"
                variant="primary"
                onClick={() => router.push("/signup")}
                className="w-full"
                icon={<Sparkles className="w-5 h-5" />}
              >
                Create Free Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => router.push("/login")}
                className="w-full"
              >
                Already have an account? Log In
              </Button>
              <button
                onClick={() => setShowSignupModal(false)}
                className="w-full text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 py-2"
              >
                Maybe later
              </button>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Check className="w-4 h-4 text-green-500 dark:text-green-400" />
                  <span>Unlimited background removal</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Check className="w-4 h-4 text-green-500 dark:text-green-400" />
                  <span>High-quality downloads</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Check className="w-4 h-4 text-green-500 dark:text-green-400" />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
