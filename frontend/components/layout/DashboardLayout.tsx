"use client";

import { useState } from "react";
import { Sidebar, MobileSidebar } from "./Sidebar";
import { Menu } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="md:pl-64">
        {/* Mobile Header */}
        <div className="md:hidden h-16 bg-white border-b border-gray-200 flex items-center px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <span className="ml-4 text-lg font-semibold text-gray-900">QuickBG</span>
        </div>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-4rem)] md:min-h-screen p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

