"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Sparkles, Mail, Lock, User, Check, AlertCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { authApi } from "@/lib/api/auth";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Register the user
      await authApi.register({
        email: formData.email,
        password: formData.password,
        name: formData.name || undefined,
      });

      toast.success("Account created successfully!");

      // Automatically sign in after registration
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      const errorMessage = error.response?.data?.detail || "Registration failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary-600 via-primary-700 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="relative flex items-center justify-center p-12 text-white">
          <div className="max-w-md space-y-8">
            <h2 className="text-4xl font-bold">
              Start your free trial today
            </h2>
            <div className="space-y-4">
              {[
                "Process 10 images for free",
                "No credit card required",
                "Cancel anytime",
                "24/7 support",
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-white/90">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Logo */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center shadow-lg shadow-primary-600/30 group-hover:shadow-xl group-hover:scale-110 transition-all duration-200">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                QuickBG
              </span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Create your account
            </h1>
            <p className="text-gray-600">
              Start removing backgrounds in seconds
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Full name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              icon={<User className="w-5 h-5" />}
              required
            />

            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              icon={<Mail className="w-5 h-5" />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              icon={<Lock className="w-5 h-5" />}
              required
            />

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                className="mt-1 w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                required
              />
              <span className="text-sm text-gray-600">
                I agree to the{" "}
                <Link href="#" className="text-primary-600 hover:text-primary-700">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-primary-600 hover:text-primary-700">
                  Privacy Policy
                </Link>
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={loading}
            >
              Create account
            </Button>
          </form>

          {/* Sign in link */}
          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

