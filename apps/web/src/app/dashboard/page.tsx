'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, AlertCircle, ArrowRight, Zap, TrendingUp } from 'lucide-react';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalSpent: number;
}

interface RecentOrder {
  id: number;
  service_name: string;
  quantity: number;
  status: string;
  created_at: string;
  total: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalSpent: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Set token for API calls
    api.setToken(token);

    const fetchDashboardData = async () => {
      try {
        // Get user info
        const user = await api.getUser();
        setUserName(user.name);

        // Get orders - handle both array and paginated response formats
        const ordersResponse = await api.getMyOrders(1);
        const orders = Array.isArray(ordersResponse) ? ordersResponse : (ordersResponse?.data || []);

        // Calculate stats with safety checks
        const pending = orders.filter((o: any) => ['pending', 'processing'].includes(o.status)).length;
        const completed = orders.filter((o: any) => o.status === 'completed').length;
        const totalSpent = orders.reduce((sum: number, o: any) => sum + (parseFloat(o.total) || 0), 0);

        setStats({
          totalOrders: orders.length,
          pendingOrders: pending,
          completedOrders: completed,
          totalSpent,
        });

        setRecentOrders(orders.slice(0, 5));
      } catch (error: any) {
        console.error('Failed to fetch dashboard data:', error);
        // If unauthorized, redirect to login
        if (error.message?.includes('Unauthenticated') || error.message?.includes('Unauthorized')) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'processing':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-pink" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-neon-pink to-neon-purple p-8"
      >
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Welcome back, {userName || 'User'}!
          </h1>
          <p className="text-white/80">
            Track your orders and manage your YouTube growth from here.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10">
          <TrendingUp className="w-48 h-48" />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: stats.totalOrders, icon: Package, color: 'from-neon-pink to-rose-500' },
          { label: 'Pending', value: stats.pendingOrders, icon: Clock, color: 'from-yellow-500 to-orange-500' },
          { label: 'Completed', value: stats.completedOrders, icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
          { label: 'Total Spent', value: formatCurrency(stats.totalSpent), icon: Zap, color: 'from-neon-purple to-violet-500' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5"
          >
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link href="/services">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:border-neon-pink/30 dark:hover:border-neon-pink/30 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Browse Services
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Explore our YouTube growth services
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-neon-pink group-hover:translate-x-1 transition-all" />
            </div>
          </motion.div>
        </Link>

        <Link href="/dashboard/tickets">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:border-neon-purple/30 dark:hover:border-neon-purple/30 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Need Help?
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Create a support ticket
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-neon-purple group-hover:translate-x-1 transition-all" />
            </div>
          </motion.div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Orders
          </h2>
          <Link
            href="/dashboard/orders"
            className="text-sm text-neon-pink hover:text-neon-pink/80 transition-colors flex items-center gap-1"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="space-y-3">
            {recentOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/dashboard/orders/${order.id}`}>
                  <div className="p-4 rounded-xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {order.service_name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Order #{order.id} • {order.quantity} units
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <div className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                          {formatCurrency(order.total)}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
            <AlertCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              No orders yet
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Start growing your YouTube channel today!
            </p>
            <Link href="/services">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-neon-pink to-neon-purple text-white font-medium shadow-glow-sm"
              >
                Browse Services
              </motion.button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
