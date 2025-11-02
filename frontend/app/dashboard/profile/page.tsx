"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useSession } from "next-auth/react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api-config";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Calendar,
  Sparkles,
  Shield,
  Camera,
  CheckCircle2,
  Image as ImageIcon,
  Clock,
  TrendingUp,
  Zap,
  Timer,
  AlertTriangle,
  Save,
  Activity,
} from "lucide-react";

interface UserStats {
  total_images_processed: number;
  images_processed_today: number;
  total_processing_time: number;
  last_upload_date: string | null;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changed, setChanged] = useState(false);

  const user = session?.user as any;
  const userName = user?.name || user?.email?.split("@")[0] || "User";
  const userEmail = user?.email || "";
  const userRole = user?.role || "user";
  const userInitial = userName.charAt(0).toUpperCase();
  const createdAt = user?.created_at ? new Date(user.created_at) : new Date();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: userEmail,
  });

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      if (!session?.accessToken) return;

      const response = await axios.get(`${API_BASE_URL}/stats`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
      setStats(response.data);
    } catch (error: any) {
      console.error("Failed to fetch stats:", error);
      if (error.response?.status !== 401) {
        toast.error("Failed to load your statistics");
      }
    } finally {
      setLoading(false);
    }
  }, [session?.accessToken]);

  useEffect(() => {
    if (session) {
      fetchStats();
      // Update form data when session loads
      setFormData({
        name: user?.name || "",
        email: userEmail,
      });
    }
  }, [session, fetchStats, user?.name, userEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // TODO: Implement profile update API endpoint
      // For now, just simulate save
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("Profile updated successfully!");
      setChanged(false);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setChanged(true);
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}m ${secs}s`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const totalImages = stats?.total_images_processed || 0;
  const todayImages = stats?.images_processed_today || 0;
  const totalTime = stats?.total_processing_time || 0;
  const avgTime = totalImages > 0 ? totalTime / totalImages : 0;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
        </div>

        {/* Profile Overview Card */}
        <Card className="border-2 border-primary-100 shadow-lg">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-purple-600 flex items-center justify-center text-white text-5xl font-bold shadow-xl group-hover:scale-105 transition-transform">
                  {userInitial}
                </div>
                <button className="absolute bottom-0 right-0 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all hover:scale-110 border-2 border-gray-100">
                  <Camera className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left space-y-4 w-full">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{formData.name || userName}</h2>
                  <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2 mt-1">
                    <Mail className="w-4 h-4" />
                    {formData.email || userEmail}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <Badge variant={userRole === "admin" ? "info" : "default"} className="text-sm">
                    <Shield className="w-3 h-3 mr-1" />
                    {userRole === "admin" ? "Admin" : "User"}
                  </Badge>
                  <Badge variant="success" className="text-sm">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Free Plan
                  </Badge>
                  <Badge variant="default" className="text-sm">
                    <Calendar className="w-3 h-3 mr-1" />
                    Joined {createdAt.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </Badge>
                  <Badge variant="info" className="text-sm">
                    <Timer className="w-3 h-3 mr-1" />
                    7-Day Session
                  </Badge>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-blue-500 flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{totalImages}</div>
                    <div className="text-xs text-gray-600 mt-1">Total Images</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-green-500 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{todayImages}</div>
                    <div className="text-xs text-gray-600 mt-1">Today</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-yellow-500 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{formatTime(totalTime)}</div>
                    <div className="text-xs text-gray-600 mt-1">Total Time</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-purple-500 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{formatTime(avgTime)}</div>
                    <div className="text-xs text-gray-600 mt-1">Avg Time</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className="border-2 border-gray-100 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                <User className="w-6 h-6 text-primary-600" />
              </div>
              <CardTitle className="text-xl font-bold">Account Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                icon={<User className="w-5 h-5" />}
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                icon={<Mail className="w-5 h-5" />}
                disabled
                helperText="Email cannot be changed"
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  loading={saving}
                  disabled={!changed || saving}
                  icon={<Save className="w-5 h-5" />}
                >
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      name: user?.name || "",
                      email: userEmail,
                    });
                    setChanged(false);
                  }}
                  disabled={!changed}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Account Details */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Plan & Limits */}
          <Card className="border-2 border-primary-100 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">Your Plan</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              <div className="p-6 bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl border-2 border-primary-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Free Plan</h3>
                      <p className="text-sm text-gray-600">50 images per day</p>
                    </div>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>50 images per day</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Instant processing (2-5 seconds)</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Zero image storage</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>7-day session duration</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity & Session */}
          <Card className="border-2 border-gray-100 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-bold">Activity & Session</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Last Activity</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatDate(stats?.last_upload_date || null)}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Session Duration</span>
                  <Badge variant="info">7 Days</Badge>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  You&apos;ll remain logged in for 7 days after login
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Account Created</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {createdAt.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Account Status</span>
                  <Badge variant="success">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Statistics */}
        <Card className="border-2 border-gray-100 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-xl font-bold">Usage Statistics</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Images Processed</p>
                    <p className="text-2xl font-bold text-gray-900">{totalImages}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">All-time processing count</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Processing Time</p>
                    <p className="text-2xl font-bold text-gray-900">{formatTime(totalTime)}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Cumulative processing time</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Average Processing Time</p>
                    <p className="text-2xl font-bold text-gray-900">{formatTime(avgTime)}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Per image average</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Images Processed Today</p>
                    <p className="text-2xl font-bold text-gray-900">{todayImages} / 50</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Daily usage limit</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security Notice */}
        <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2">Privacy & Security</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  QuickBG uses a <strong>zero storage policy</strong>. Your images are processed in memory
                  and immediately deleted after download. We never store, save, or keep any copies of your images.
                  Your data is secure and private.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-2 border-red-200 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-xl font-bold text-red-600">Danger Zone</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="p-6 bg-red-50 rounded-xl border-2 border-red-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-2">Delete Account</h4>
                  <p className="text-sm text-gray-700">
                    Permanently delete your account and all associated data. This action cannot be undone.
                    Remember, we don&apos;t store your images, so only your account information will be deleted.
                  </p>
                </div>
                <Button variant="danger" size="sm" className="flex-shrink-0">
                  Delete Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
