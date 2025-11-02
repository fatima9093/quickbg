"use client";

import { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Badge } from "@/components/ui/Badge";
import axios from "axios";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { API_BASE_URL } from "@/lib/api-config";
import { adminApi, type AdminStats, type AdminUser } from "@/lib/admin-api";
import {
  Upload,
  Image as ImageIcon,
  Clock,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Users,
  Shield,
  Activity,
  Zap,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Timer,
  Target,
  Award,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

interface UserStats {
  total_images_processed: number;
  images_processed_today: number;
  total_processing_time: number;
  last_upload_date: string | null;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const userRole = (session?.user as any)?.role || "user";
  const isAdmin = userRole === "admin";
  const userName = (session?.user as any)?.name || (session?.user as any)?.email?.split("@")[0] || "User";
  const MAX_DAILY_IMAGES = 50;

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
        toast.error("Failed to load your stats");
      }
    } finally {
      setLoading(false);
    }
  }, [session?.accessToken]);

  const fetchAdminData = useCallback(async () => {
    try {
      const [adminStatsData, usersData] = await Promise.all([
        adminApi.getStats(),
        adminApi.getUsers(0, 5),
      ]);
      setAdminStats(adminStatsData);
      setRecentUsers(usersData);
    } catch (error: any) {
      console.error("Failed to fetch admin data:", error);
    }
  }, []);

  useEffect(() => {
    if (session) {
      fetchStats();
      if (isAdmin) {
        fetchAdminData();
      }
    }
  }, [session, isAdmin, fetchStats, fetchAdminData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchStats(), isAdmin && fetchAdminData()]);
    setRefreshing(false);
    toast.success("Dashboard refreshed");
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
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRemainingImages = () => {
    return Math.max(0, MAX_DAILY_IMAGES - (stats?.images_processed_today || 0));
  };

  const getDailyUsagePercent = () => {
    return ((stats?.images_processed_today || 0) / MAX_DAILY_IMAGES) * 100;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  const totalImages = stats?.total_images_processed || 0;
  const todayImages = stats?.images_processed_today || 0;
  const totalTime = stats?.total_processing_time || 0;
  const avgTime = totalImages > 0 ? totalTime / totalImages : 0;
  const remainingImages = getRemainingImages();
  const usagePercent = getDailyUsagePercent();

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Header */}
        <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Welcome back, {userName}!</h1>
                  <p className="text-white/90">Here&apos;s your QuickBG overview</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/dashboard/upload">
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur"
                  icon={<Upload className="w-5 h-5" />}
                >
                  Remove Background
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur"
                icon={<RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />}
              >
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Daily Usage Limit Card */}
        <Card className="border-2 border-primary-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Daily Usage Limit</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  You can process up to {MAX_DAILY_IMAGES} images per day. Resets every 24 hours.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Images processed today</span>
                    <span className="font-semibold text-gray-900">
                      {todayImages} / {MAX_DAILY_IMAGES}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        usagePercent >= 100
                          ? "bg-red-500"
                          : usagePercent >= 80
                          ? "bg-yellow-500"
                          : "bg-gradient-to-r from-primary-500 to-primary-600"
                      }`}
                      style={{ width: `${Math.min(usagePercent, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Remaining today</span>
                    <span
                      className={`font-semibold ${
                        remainingImages === 0 ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {remainingImages} images
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center flex-shrink-0">
                <Target className="w-8 h-8 text-primary-600" />
              </div>
            </div>
            {remainingImages === 0 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-800">
                  You&apos;ve reached your daily limit. Come back tomorrow to process more images!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card hover className="group border-2 border-blue-100 hover:border-blue-200 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-7 h-7 text-white" />
                </div>
                <Badge variant="info" className="text-xs">
                  All Time
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Images Processed</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{totalImages}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Lifetime total
              </p>
            </CardContent>
          </Card>

          <Card hover className="group border-2 border-green-100 hover:border-green-200 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Activity className="w-7 h-7 text-white" />
                </div>
                <Badge variant="success" className="text-xs">
                  Today
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-1">Processed Today</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{todayImages}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {remainingImages > 0 ? `${remainingImages} remaining` : "Limit reached"}
              </p>
            </CardContent>
          </Card>

          <Card hover className="group border-2 border-yellow-100 hover:border-yellow-200 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <Badge variant="warning" className="text-xs">
                  Total
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Processing Time</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{formatTime(totalTime)}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Timer className="w-3 h-3" />
                Cumulative time
              </p>
            </CardContent>
          </Card>

          <Card hover className="group border-2 border-purple-100 hover:border-purple-200 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <Badge variant="info" className="text-xs">
                  Average
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-1">Average Time</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{formatTime(avgTime)}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Per image
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Info Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Quick Action Card */}
          <Card hover className="group cursor-pointer border-2 border-primary-100 bg-gradient-to-br from-white to-primary-50">
            <Link href="/dashboard/upload">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Process New Image</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      Upload an image and remove its background instantly with AI-powered precision.
                      Your images are processed in seconds and never stored.
                    </p>
                    <Button variant="primary" size="sm" className="group-hover:shadow-lg transition-all">
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          {/* Account Info Card */}
          <Card className="border-2 border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Award className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
                  <p className="text-sm text-gray-600">Free Plan - 50 images/day</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Session Duration</span>
                  <Badge variant="info">7 Days</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Last Activity</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(stats?.last_upload_date || null)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Account Status</span>
                  <Badge variant="success">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Get Started Card (for new users) */}
        {totalImages === 0 && (
          <Card className="border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-white animate-slide-up">
            <CardContent className="p-10">
              <EmptyState
                icon={Sparkles}
                title="Get Started with QuickBG"
                description="You haven't processed any images yet. Start removing backgrounds from your images instantly with AI. No storage, no waiting – just upload, process, and download!"
                action={
                  <Link href="/dashboard/upload">
                    <Button variant="primary" size="lg" icon={<Upload className="w-5 h-5" />}>
                      Remove Your First Background
                    </Button>
                  </Link>
                }
              />
            </CardContent>
          </Card>
        )}

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card hover className="group border-2 border-blue-100">
            <CardContent className="p-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">AI-Powered</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Advanced U²-Net AI model optimized for precise background removal in 2-5 seconds.
              </p>
            </CardContent>
          </Card>

          <Card hover className="group border-2 border-green-100">
            <CardContent className="p-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-green-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Lightning Fast</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Get your processed images in seconds, not minutes. Optimized for speed without compromising quality.
              </p>
            </CardContent>
          </Card>

          <Card hover className="group border-2 border-purple-100">
            <CardContent className="p-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-purple-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Privacy First</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Zero storage policy. Your images are processed in memory and deleted immediately after download.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Section - Only visible to admins */}
        {isAdmin && adminStats && (
          <>
            <div className="pt-8 border-t-2 border-gray-200">
              {/* Admin Header */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Admin Overview</h2>
                    <p className="text-gray-600">System statistics and user management</p>
                  </div>
                </div>
              </div>

              {/* Admin Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card hover className="group border-2 border-blue-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Users className="w-7 h-7 text-white" />
                      </div>
                      <Badge variant="info">Total</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">{adminStats.total_users}</p>
                    <p className="text-xs text-gray-500 mt-2">All registered accounts</p>
                  </CardContent>
                </Card>

                <Card hover className="group border-2 border-purple-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <ImageIcon className="w-7 h-7 text-white" />
                      </div>
                      <Badge variant="info">All Time</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Total Images</p>
                    <p className="text-3xl font-bold text-gray-900">{adminStats.total_images_processed}</p>
                    <p className="text-xs text-gray-500 mt-2">Processed by all users</p>
                  </CardContent>
                </Card>

                <Card hover className="group border-2 border-yellow-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Clock className="w-7 h-7 text-white" />
                      </div>
                      <Badge variant="warning">Total</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Total Time</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatTime(adminStats.total_processing_time)}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">System-wide processing</p>
                  </CardContent>
                </Card>

                <Card hover className="group border-2 border-green-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Activity className="w-7 h-7 text-white" />
                      </div>
                      <Badge variant="success">Average</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Avg Time</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatTime(adminStats.avg_processing_time)}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Per image</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Users */}
              <Card className="border-2 border-gray-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Recent Users</h3>
                    <Link href="/admin/users">
                      <Button variant="ghost" size="sm">
                        View All
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {recentUsers.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No users yet</p>
                      </div>
                    ) : (
                      recentUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                        >
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {user.name || "No name"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          </div>
                          <Badge variant={user.role === "admin" ? "info" : "default"} className="flex-shrink-0">
                            {user.role}
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
