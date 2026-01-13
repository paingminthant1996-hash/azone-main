"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Settings, 
  ArrowLeft,
  Menu,
  X,
  User
} from "lucide-react";
import { getSession, isAdmin } from "@/lib/auth/auth";
import { motion } from "framer-motion";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Overview", href: "/admin/overview", icon: LayoutDashboard },
  { name: "Templates", href: "/admin/templates", icon: FileText },
  { name: "Inquiries", href: "/admin/purchases", icon: MessageSquare },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check if user is admin
  useEffect(() => {
    async function checkAuth() {
      try {
        const { user: sessionUser } = await getSession();
        if (sessionUser) {
          const admin = await isAdmin();
          if (admin) {
            setUser(sessionUser);
            setIsAuthorized(true);
          } else {
            router.push("/admin/login");
          }
        } else {
          // Redirect to login if not on login page
          if (pathname !== "/admin/login") {
            router.push("/admin/login");
          }
        }
      } catch (error) {
        // Better error handling
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Auth check failed:", errorMessage);
        if (pathname !== "/admin/login") {
          router.push("/admin/login");
        }
      } finally {
        setIsChecking(false);
      }
    }
    checkAuth();
  }, [pathname, router]);

  // Don't show sidebar on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (isChecking) {
    return (
      <div className="min-h-screen bg-azone-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-azone-purple mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized && pathname !== "/admin/login") {
    // Don't render anything, middleware will redirect
    return null;
  }

  return (
    <div className="min-h-screen bg-azone-black flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-gray-900/50 backdrop-blur-sm border-r border-gray-800
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <Link href="/" className="flex items-center gap-2 text-azone-purple hover:text-azone-purple/80 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="text-lg font-bold">Templates</span>
              </Link>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${
                      isActive
                        ? "bg-azone-purple/20 text-white border border-azone-purple/50"
                        : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
              <div className="w-10 h-10 bg-azone-purple/20 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-azone-purple" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Admin</p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.email || "admin@templates.io"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1 max-w-md mx-4">
              {/* Search bar - only show on templates page */}
              {pathname.includes("/admin/templates") && (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search templates..."
                    className="w-full px-4 py-2 pl-10 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-azone-purple focus:border-transparent"
                  />
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              )}
            </div>
            {/* Add New Template Button - only show on templates page */}
            {pathname.includes("/admin/templates") && (
              <Link
                href="/admin/upload"
                className="px-4 py-2 bg-azone-purple hover:bg-azone-purple/80 text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-2"
              >
                <span className="text-lg">+</span>
                Add New Template
              </Link>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
