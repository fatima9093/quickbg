"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Upload,
  Images,
  Settings,
  LogOut,
  Sparkles,
  User,
  Users,
  Shield,
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

const userNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Upload", href: "/dashboard/upload", icon: Upload },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

const adminNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Upload", href: "/dashboard/upload", icon: Upload },
  { name: "User Management", href: "/admin/users", icon: Users },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Get user info from session
  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "user@example.com";
  const userInitial = userName.charAt(0).toUpperCase();
  const userRole = (session?.user as any)?.role || "user";
  const isAdmin = userRole === "admin";

  // Choose navigation based on role
  const navigation = isAdmin ? adminNavigation : userNavigation;

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col",
        className
      )}
    >
      {/* Logo */}
      <div className="h-16 px-6 flex items-center border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center shadow-lg shadow-primary-600/30 group-hover:shadow-xl group-hover:scale-110 transition-all duration-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
            QuickBG
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {/* Role Badge */}
        {isAdmin && (
          <div className="mb-4 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl">
            <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
              <Shield className="w-4 h-4" />
              <span>Admin Access</span>
            </div>
          </div>
        )}

        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary-50 text-primary-700 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive && "text-primary-600")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
            {userInitial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
            <p className="text-xs text-gray-500 truncate">{userEmail}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full mt-2 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export function MobileSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white z-50 md:hidden animate-slide-in">
        <Sidebar />
      </aside>
    </>
  );
}

