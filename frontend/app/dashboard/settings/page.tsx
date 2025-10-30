"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Lock, Bell, Palette, Globe, Key, Shield } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your preferences and security</p>
        </div>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <Lock className="w-5 h-5 text-red-600" />
              </div>
              <CardTitle>Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0 space-y-6">
            <div className="space-y-4">
              <Input label="Current Password" type="password" placeholder="••••••••" />
              <Input label="New Password" type="password" placeholder="••••••••" />
              <Input label="Confirm New Password" type="password" placeholder="••••••••" />
            </div>
            <Button variant="primary" onClick={handleSave} loading={loading}>
              Update Password
            </Button>
          </CardContent>
        </Card>

        {/* Two-Factor Authentication */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <CardTitle>Two-Factor Authentication</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">2FA Status</h4>
                <p className="text-sm text-gray-600">Add an extra layer of security</p>
              </div>
              <Button variant="outline" size="sm">
                Enable 2FA
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <CardTitle>Notifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0 space-y-4">
            {[
              { label: "Email notifications", description: "Receive email updates about your uploads" },
              { label: "Processing complete", description: "Get notified when processing is done" },
              { label: "Marketing emails", description: "Receive tips and product updates" },
              { label: "Security alerts", description: "Important security notifications" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-medium text-gray-900">{item.label}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={index < 2} />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Palette className="w-5 h-5 text-purple-600" />
              </div>
              <CardTitle>Preferences</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Export Format
              </label>
              <select className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none">
                <option>PNG (Transparent)</option>
                <option>JPEG (White Background)</option>
                <option>WebP</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Quality
              </label>
              <select className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none">
                <option>High (Original)</option>
                <option>Medium (Compressed)</option>
                <option>Low (Small File)</option>
              </select>
            </div>

            <Button variant="primary" onClick={handleSave} loading={loading}>
              Save Preferences
            </Button>
          </CardContent>
        </Card>

        {/* API Keys */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                <Key className="w-5 h-5 text-yellow-600" />
              </div>
              <CardTitle>API Keys</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">API Access</h4>
                  <p className="text-sm text-gray-600">Generate API keys for programmatic access</p>
                </div>
                <Button variant="outline" size="sm">
                  Generate Key
                </Button>
              </div>
              <div className="text-xs text-gray-500 font-mono bg-gray-100 p-3 rounded-lg">
                No API keys generated yet
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

