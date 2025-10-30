"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { adminApi, type AdminStats, type AdminUser } from "@/lib/admin-api";
import Link from "next/link";
import {
  Users,
  Image as ImageIcon,
  Clock,
  Zap,
  TrendingUp,
  Activity,
  BarChart3,
  RefreshCw,
  Shield,
  ArrowRight,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsData, usersData] = await Promise.all([
        adminApi.getStats(),
        adminApi.getUsers(0, 10), // Get 10 most recent users
      ]);
      
      setStats(statsData);
      setRecentUsers(usersData);
      setLastRefresh(new Date());
    } catch (err: any) {
      console.error("Failed to fetch admin data:", err);
      if (err.response?.status === 401) {
        setError("Unauthorized. You need admin access.");
      } else if (err.response?.status === 403) {
        setError("Forbidden. Admin privileges required.");
      } else {
        setError(err.message || "Failed to load statistics");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}m ${secs}s`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Error</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={handleRefresh} icon={<RefreshCw className="w-4 h-4" />}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="text-gray-600 mt-1">Real-time system overview and user management</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </div>
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            size="sm"
            icon={<RefreshCw className="w-4 h-4" />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <Card hover className="animate-scale-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.total_users || 0}</p>
                <div className="flex items-center gap-1 mt-2 text-gray-500 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>Registered accounts</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Images Processed */}
        <Card hover className="animate-scale-in" style={{ animationDelay: "100ms" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Images Processed</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.total_images_processed || 0}</p>
                <div className="flex items-center gap-1 mt-2 text-gray-500 text-sm">
                  <Activity className="w-4 h-4" />
                  <span>All time</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center">
                <ImageIcon className="w-7 h-7 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Processing Time */}
        <Card hover className="animate-scale-in" style={{ animationDelay: "200ms" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Processing Time</p>
                <p className="text-3xl font-bold text-gray-900">{formatTime(stats?.total_processing_time || 0)}</p>
                <div className="flex items-center gap-1 mt-2 text-gray-500 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Total spent</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center">
                <Clock className="w-7 h-7 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Processing Time */}
        <Card hover className="animate-scale-in" style={{ animationDelay: "300ms" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Processing</p>
                <p className="text-3xl font-bold text-gray-900">{formatTime(stats?.avg_processing_time || 0)}</p>
                <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                  <Zap className="w-4 h-4" />
                  <span>Per image</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
                <BarChart3 className="w-7 h-7 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Info Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Free Tier Info */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Free Tier Limit</p>
                <p className="text-2xl font-bold text-gray-900">5 tries</p>
              </div>
              <Badge variant="info">Anonymous</Badge>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Users can try 5 times before signup
            </p>
          </CardContent>
        </Card>

        {/* Registered User Limit */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Registered Limit</p>
                <p className="text-2xl font-bold text-gray-900">50/day</p>
              </div>
              <Badge variant="success">Free</Badge>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Free users get 50 images per day
            </p>
          </CardContent>
        </Card>

        {/* Processing Speed */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">Target Speed</p>
                <p className="text-2xl font-bold text-gray-900">2-5s</p>
              </div>
              <Badge variant="default">Optimized</Badge>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Instant processing with no storage
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Users</CardTitle>
            <Link href="/admin/users">
              <Button variant="ghost" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="space-y-3">
            {recentUsers.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No users yet</p>
            ) : (
              recentUsers.map((user) => (
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
                  <div className="flex items-center gap-2">
                    <Badge variant={user.role === "admin" ? "info" : "default"}>
                      {user.role === "admin" ? (
                        <>
                          <Shield className="w-3 h-3 mr-1" />
                          Admin
                        </>
                      ) : (
                        "User"
                      )}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/admin/users">
          <Card hover className="group cursor-pointer">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Manage Users
                  </h3>
                  <p className="text-gray-600">
                    View, search, and manage all registered users
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/upload">
          <Card hover className="group cursor-pointer">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Try Background Removal
                  </h3>
                  <p className="text-gray-600">
                    Test the AI background removal tool yourself
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* System Architecture */}
      <Card>
        <CardHeader>
          <CardTitle>System Architecture</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="grid md:grid-cols-3 gap-6">
            {/* API Status */}
            <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="text-3xl font-bold text-green-600 mb-2">●</div>
              <div className="text-sm font-medium text-gray-900 mb-1">FastAPI Backend</div>
              <div className="text-xs text-green-600 font-medium mb-2">Operational</div>
              <p className="text-xs text-gray-500">REST API for all operations</p>
            </div>

            {/* Database Status */}
            <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">●</div>
              <div className="text-sm font-medium text-gray-900 mb-1">PostgreSQL</div>
              <div className="text-xs text-blue-600 font-medium mb-2">Connected</div>
              <p className="text-xs text-gray-500">User data & statistics only</p>
            </div>

            {/* AI Model Status */}
            <div className="text-center p-4 rounded-lg bg-purple-50 border border-purple-200">
              <div className="text-3xl font-bold text-purple-600 mb-2">●</div>
              <div className="text-sm font-medium text-gray-900 mb-1">U²-Net AI (u2netp)</div>
              <div className="text-xs text-purple-600 font-medium mb-2">Loaded</div>
              <p className="text-xs text-gray-500">Pre-warmed for instant processing</p>
            </div>
          </div>

          {/* Architecture Notes */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Architecture Notes</h4>
            <ul className="space-y-1 text-xs text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                <span>No image storage - instant processing and download</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                <span>No queuing system - synchronous processing (2-5 seconds)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                <span>Privacy-first: Images deleted immediately after processing</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                <span>Lightweight: No Redis, Celery, or S3 dependencies</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
