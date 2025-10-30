"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Sparkles, Mail, ArrowLeft, Check } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 via-white to-gray-100">
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

        <div className="card p-8 space-y-6">
          {!submitted ? (
            <>
              {/* Header */}
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  Forgot password?
                </h1>
                <p className="text-gray-600">
                  No worries, we'll send you reset instructions
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail className="w-5 h-5" />}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  loading={loading}
                >
                  Reset password
                </Button>
              </form>

              {/* Back to login */}
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to login</span>
              </Link>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-green-600" />
                </div>

                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Check your email
                  </h1>
                  <p className="text-gray-600">
                    We've sent a password reset link to
                    <br />
                    <span className="font-medium text-gray-900">{email}</span>
                  </p>
                </div>

                <div className="pt-4 space-y-4">
                  <p className="text-sm text-gray-600">
                    Didn't receive the email?{" "}
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Click to resend
                    </button>
                  </p>

                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Back to login</span>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

