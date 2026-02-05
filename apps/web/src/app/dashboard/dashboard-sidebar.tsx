'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Package, Ticket, User, LogOut, LayoutDashboard } from 'lucide-react';
import api from '@/lib/api';

const sidebarItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Orders',
    href: '/dashboard/orders',
    icon: Package,
  },
  {
    name: 'Support',
    href: '/dashboard/tickets',
    icon: Ticket,
  },
  {
    name: 'Profile',
    href: '/dashboard/profile',
    icon: User,
  },
];

export function DashboardSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    try {
      await api.logout();
    } catch (error) {
      // Ignore logout errors
    } finally {
      localStorage.removeItem('token');
      api.setToken(null);
      router.push('/login');
    }
  };

  return (
    <aside className="lg:w-64 lg:shrink-0">
      <nav className="space-y-1 p-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 sticky top-28">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/dashboard' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-neon-pink/10 text-neon-pink'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </nav>
    </aside>
  );
}
