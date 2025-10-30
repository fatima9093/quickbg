"use client";

import { useEffect, useState } from "react";
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
  BarChart3,
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

  const userRole = (session?.user as any)?.role || "user";
  const isAdmin = userRole === "admin";

  useEffect(() => {
    if (session) {
      fetchStats();
      if (isAdmin) {
        fetchAdminData();
      }
    }
  }, [session, isAdmin]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      if (!session?.accessToken) return;

      const response = await axios.get(
        `${API_BASE_URL}/stats`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );
      setStats(response.data);
    } catch (error: any) {
      console.error("Failed to fetch stats:", error);
      if (error.response?.status !== 401) {
        toast.error("Failed to load your stats");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminData = async () => {
    try {
      const [adminStatsData, usersData] = await Promise.all([
        adminApi.getStats(),
        adminApi.getUsers(0, 5), // Get recent 5 users
      ]);
      setAdminStats(adminStatsData);
      setRecentUsers(usersData);
    } catch (error: any) {
      console.error("Failed to fetch admin data:", error);
      // Don't show error toast for admin data as user stats might still load
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}m ${secs}s`;
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

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's your overview</p>
          </div>
          <Link href="/dashboard/upload">
            <Button variant="primary" icon={<Upload className="w-5 h-5" />}>
              Remove Background
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card hover className="animate-scale-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Images Processed</p>
                  <p className="text-3xl font-bold text-gray-900">{totalImages}</p>
                  <div className="flex items-center gap-1 mt-2 text-gray-500 text-sm">
                    <span>Total all time</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover className="animate-scale-in" style={{ animationDelay: "100ms" }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Today</p>
                  <p className="text-3xl font-bold text-gray-900">{todayImages}</p>
                  <div className="flex items-center gap-1 mt-2 text-gray-600 text-sm">
                    <span>Processed today</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover className="animate-scale-in" style={{ animationDelay: "200ms" }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Time</p>
                  <p className="text-3xl font-bold text-gray-900">{formatTime(totalTime)}</p>
                  <div className="flex items-center gap-1 mt-2 text-gray-600 text-sm">
                    <span>Processing time</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover className="animate-scale-in" style={{ animationDelay: "300ms" }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg Time</p>
                  <p className="text-3xl font-bold text-gray-900">{formatTime(avgTime)}</p>
                  <div className="flex items-center gap-1 mt-2 text-gray-600 text-sm">
                    <span>Per image</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Get Started Card */}
        {totalImages === 0 && (
          <Card className="animate-slide-up">
            <CardContent className="p-8">
              <EmptyState
                icon={Sparkles}
                title="Get started with QuickBG"
                description="Remove backgrounds from your images instantly with AI. No storage, no waiting – just upload, process, and download!"
                action={
                  <Link href="/dashboard/upload">
                    <Button variant="primary" icon={<Upload className="w-5 h-5" />}>
                      Remove Your First Background
                    </Button>
                  </Link>
                }
              />
            </CardContent>
          </Card>
        )}

        {/* Quick Action */}
        <Card hover className="group cursor-pointer animate-slide-up">
          <Link href="/dashboard/upload">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Upload className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Process New Image
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Upload an image and remove its background instantly with AI precision
                  </p>
                  <Button variant="primary" size="sm">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">AI-Powered</h4>
              <p className="text-sm text-gray-600">
                Advanced U²-Net AI model for precise background removal
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Instant Processing</h4>
              <p className="text-sm text-gray-600">
                Get your processed images in seconds, not minutes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                <ImageIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Privacy First</h4>
              <p className="text-sm text-gray-600">
                Your images are never stored – processed and deleted instantly
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Section - Only visible to admins */}
        {isAdmin && adminStats && (
          <>
            {/* Admin Header */}
            <div className="pt-8 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Admin Overview</h2>
                  <p className="text-gray-600">System statistics and user management</p>
                </div>
              </div>

              {/* Admin Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card hover className="animate-scale-in">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Total Users</p>
                        <p className="text-3xl font-bold text-gray-900">{adminStats.total_users}</p>
                        <div className="flex items-center gap-1 mt-2 text-gray-500 text-sm">
                          <span>All registered</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card hover className="animate-scale-in" style={{ animationDelay: "100ms" }}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Total Images</p>
                        <p className="text-3xl font-bold text-gray-900">{adminStats.total_images_processed}</p>
                        <div className="flex items-center gap-1 mt-2 text-gray-500 text-sm">
                          <span>Processed</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card hover className="animate-scale-in" style={{ animationDelay: "200ms" }}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Total Time</p>
                        <p className="text-3xl font-bold text-gray-900">{formatTime(adminStats.total_processing_time)}</p>
                        <div className="flex items-center gap-1 mt-2 text-gray-500 text-sm">
                          <span>Processing</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card hover className="animate-scale-in" style={{ animationDelay: "300ms" }}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Avg Time</p>
                        <p className="text-3xl font-bold text-gray-900">{formatTime(adminStats.avg_processing_time)}</p>
                        <div className="flex items-center gap-1 mt-2 text-gray-500 text-sm">
                          <span>Per image</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                        <Activity className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Users */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
                    <Link href="/admin/users">
                      <Button variant="ghost" size="sm">
                        View All
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {recentUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-purple-400 flex items-center justify-center text-white font-semibold">
                          {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.name || "No name"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <Badge variant={user.role === "admin" ? "info" : "default"}>
                          {user.role}
                        </Badge>
                      </div>
                    ))}
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
