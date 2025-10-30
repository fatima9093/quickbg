"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { adminApi, type AdminUser } from "@/lib/admin-api";
import {
  Search,
  Users,
  Mail,
  Calendar,
  Shield,
  Trash2,
  Eye,
  MoreVertical,
} from "lucide-react";

export default function UsersManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getUsers(0, 100);
      setUsers(data);
    } catch (err: any) {
      console.error("Failed to fetch users:", err);
      if (err.response?.status !== 401) {
        alert("Failed to load users");
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      await adminApi.deleteUser(userId);
      setUsers(users.filter((u) => u.id !== userId));
      alert("User deleted successfully");
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Failed to delete user");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600 mt-1">Manage all registered users</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-gray-900">{users.length}</p>
          <p className="text-sm text-gray-600">Total Users</p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <Input
                placeholder="Search users by email or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-5 h-5" />}
              />
            </div>

            {/* Stats */}
            <div className="flex gap-4">
              <div className="text-center px-4">
                <div className="text-2xl font-bold text-gray-900">
                  {users.filter((u) => u.role === "admin").length}
                </div>
                <div className="text-xs text-gray-600">Admins</div>
              </div>
              <div className="text-center px-4">
                <div className="text-2xl font-bold text-gray-900">
                  {users.filter((u) => u.role === "user").length}
                </div>
                <div className="text-xs text-gray-600">Users</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <EmptyState
              icon={Users}
              title={searchQuery ? "No users found" : "No users yet"}
              description={
                searchQuery
                  ? "Try adjusting your search query"
                  : "Users will appear here once they register"
              }
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-purple-400 flex items-center justify-center text-white font-semibold">
                            {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.name || "No name"}
                            </div>
                            <div className="text-sm text-gray-600 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={user.role === "admin" ? "info" : "default"}
                        >
                          {user.role === "admin" ? (
                            <>
                              <Shield className="w-3 h-3 mr-1" />
                              Admin
                            </>
                          ) : (
                            "User"
                          )}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(user.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<Eye className="w-4 h-4" />}
                          >
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            icon={<Trash2 className="w-4 h-4" />}
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <div key={user.id} className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-purple-400 flex items-center justify-center text-white font-semibold text-lg">
                        {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.name || "No name"}
                        </div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                      </div>
                    </div>
                    <Badge variant={user.role === "admin" ? "info" : "default"}>
                      {user.role}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(user.created_at).toLocaleDateString()}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

