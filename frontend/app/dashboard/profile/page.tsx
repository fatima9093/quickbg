"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  User,
  Mail,
  Calendar,
  Crown,
  Shield,
  Camera,
} from "lucide-react";

export default function ProfilePage() {
  // TODO: Get user from auth session
  // const { data: session } = useSession();
  // const user = session?.user;
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  // Placeholder stats - will be fetched from API
  const stats = {
    totalUploads: 0,
    completedUploads: 0,
    storageUsed: "0 MB",
    storageLimit: "10 GB",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Show success message
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account settings</p>
        </div>

        {/* Profile Card */}
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary-400 to-purple-400 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                  <User className="w-16 h-16" />
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <Camera className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{formData.name || "Your Name"}</h2>
                  <p className="text-gray-600">{formData.email || "your.email@example.com"}</p>
                </div>

                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <Badge variant="info">
                    <User className="w-3 h-3 mr-1" />
                    User
                  </Badge>
                  <Badge variant="success">
                    <Crown className="w-3 h-3 mr-1" />
                    Free Plan
                  </Badge>
                  <Badge variant="default">
                    <Calendar className="w-3 h-3 mr-1" />
                    Joined {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </Badge>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900">{stats.totalUploads}</div>
                    <div className="text-xs text-gray-600">Uploads</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900">{stats.completedUploads}</div>
                    <div className="text-xs text-gray-600">Completed</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900">{stats.storageUsed}</div>
                    <div className="text-xs text-gray-600">Storage</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Full Name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                icon={<User className="w-5 h-5" />}
              />

              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                icon={<Mail className="w-5 h-5" />}
              />

              <div className="flex gap-3">
                <Button type="submit" variant="primary" loading={loading}>
                  Save Changes
                </Button>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="flex items-center justify-between p-6 bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl border border-primary-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Pro Plan</h3>
                  <p className="text-sm text-gray-600">500 images per month</p>
                </div>
              </div>
              <Button variant="primary" size="sm">
                Upgrade Plan
              </Button>
            </div>

            <div className="mt-6 grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Current Period</p>
                <p className="font-semibold text-gray-900">Jan 1 - Jan 31, 2024</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Next Billing Date</p>
                <p className="font-semibold text-gray-900">Feb 1, 2024</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Usage This Month</CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-0 space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Images Processed</span>
                <span className="text-sm font-medium text-gray-900">{stats.completedUploads} / 500</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-600 to-purple-600 transition-all"
                  style={{ width: `${(stats.completedUploads / 500) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Storage Used</span>
                <span className="text-sm font-medium text-gray-900">{stats.storageUsed} / {stats.storageLimit}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                  style={{ width: "24%" }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-0 space-y-4">
            <div className="p-4 bg-red-50 rounded-xl border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Delete Account</h4>
                  <p className="text-sm text-gray-600">
                    Permanently delete your account and all your data
                  </p>
                </div>
                <Button variant="danger" size="sm">
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

