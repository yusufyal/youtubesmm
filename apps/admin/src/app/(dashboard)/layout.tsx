'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  Users,
  Tag,
  FileText,
  HelpCircle,
  Settings,
  Server,
  BarChart3,
  TrendingUp,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import adminApi from '@/lib/api';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp },
  { name: 'Services', href: '/dashboard/services', icon: Package },
  { name: 'Packages', href: '/dashboard/packages', icon: Boxes },
  { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
  { name: 'Users', href: '/dashboard/users', icon: Users },
  { name: 'Coupons', href: '/dashboard/coupons', icon: Tag },
  { name: 'Providers', href: '/dashboard/providers', icon: Server },
  { name: 'Blog Posts', href: '/dashboard/posts', icon: FileText },
  { name: 'FAQs', href: '/dashboard/faqs', icon: HelpCircle },
  { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const token = adminApi.getToken();
    if (!token) {
      router.push('/login');
      return;
    }

    adminApi
      .getUser()
      .then(setUser)
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

  const handleLogout = async () => {
    try {
      await adminApi.logout();
    } catch (e) {
      // Ignore errors
    }
    router.push('/login');
  };

  // Get current page title
  const currentPage = navigation.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform admin-sidebar transition-transform duration-300 lg:relative lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-5">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg shadow-pink-500/30">
              <span className="text-xl font-bold text-white">A</span>
            </div>
            <div>
              <span className="text-lg font-bold text-white">AYN Admin</span>
              <span className="block text-xs text-slate-400">YouTube Services</span>
            </div>
          </Link>
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-slate-400"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-thin">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'sidebar-nav-item group',
                  isActive ? 'sidebar-nav-item-active' : 'sidebar-nav-item-inactive'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className={cn('h-5 w-5', isActive ? 'text-white' : 'text-slate-400 group-hover:text-white')} />
                <span className="flex-1">{item.name}</span>
                {isActive && <ChevronRight className="h-4 w-4 opacity-50" />}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 text-sm font-semibold text-white">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'Admin'}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email || 'admin@ayn.yt'}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-400 hover:text-white hover:bg-white/10"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-4 lg:px-8">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6 text-slate-600" />
          </button>

          {/* Page Title */}
          <div className="hidden lg:block">
            <h1 className="text-lg font-semibold text-slate-900">
              {currentPage?.name || 'Dashboard'}
            </h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-auto lg:mx-0 lg:ml-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500" />
            </button>
            <div className="hidden sm:flex items-center gap-3 ml-2 pl-4 border-l border-slate-200">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-sm font-semibold text-white">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">{children}</main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
