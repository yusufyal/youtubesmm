'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Clock,
  Eye,
  MoreHorizontal,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatNumber } from '@/lib/utils';
import adminApi from '@/lib/api';

interface Summary {
  revenue: { today: number; yesterday: number; this_week: number; this_month: number };
  orders: { total: number; paid: number; pending: number; completed: number; processing: number };
  users: { total: number; new_today: number; new_this_week: number };
  conversion: { rate: number; total_orders: number; paid_orders: number };
}

// Loading Skeleton Component
function StatCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-6 border border-slate-100">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="h-3 w-20 skeleton" />
          <div className="h-8 w-28 skeleton" />
          <div className="h-3 w-16 skeleton" />
        </div>
        <div className="h-12 w-12 skeleton rounded-xl" />
      </div>
    </div>
  );
}

function OrderRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl">
      <div className="h-11 w-11 skeleton rounded-xl" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-32 skeleton" />
        <div className="h-3 w-24 skeleton" />
      </div>
      <div className="text-right space-y-2">
        <div className="h-4 w-16 skeleton" />
        <div className="h-5 w-14 skeleton rounded-full" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [topServices, setTopServices] = useState<
    { service_name: string; total_orders: number; total_revenue: number }[]
  >([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    try {
      const results = await Promise.allSettled([
        adminApi.getReportSummary(),
        adminApi.getTopServices(),
        adminApi.getOrders({ per_page: 5 }),
      ]);

      if (results[0].status === 'fulfilled') {
        setSummary(results[0].value);
      }
      if (results[1].status === 'fulfilled') {
        const servicesData = results[1].value;
        setTopServices(Array.isArray(servicesData) ? servicesData : []);
      }
      if (results[2].status === 'fulfilled') {
        const ordersData = results[2].value;
        setRecentOrders(ordersData?.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const revenueChange = summary?.revenue.yesterday
    ? ((summary.revenue.today - summary.revenue.yesterday) / summary.revenue.yesterday) * 100
    : 0;

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 skeleton mb-2" />
            <div className="h-4 w-64 skeleton" />
          </div>
          <div className="h-10 w-32 skeleton rounded-lg" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6">
            <div className="h-6 w-40 skeleton mb-6" />
            <div className="space-y-4">
              <OrderRowSkeleton />
              <OrderRowSkeleton />
              <OrderRowSkeleton />
              <OrderRowSkeleton />
              <OrderRowSkeleton />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="h-6 w-32 skeleton mb-6" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 skeleton" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back!</h1>
          <p className="text-slate-500">Here's what's happening with your store today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchData(true)}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button asChild size="sm" className="gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-lg shadow-pink-500/25">
            <Link href="/dashboard/analytics">
              <TrendingUp className="h-4 w-4" />
              View Analytics
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Today's Revenue */}
        <div className="stat-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Today's Revenue</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {formatCurrency(summary?.revenue.today || 0)}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                {revenueChange >= 0 ? (
                  <span className="flex items-center text-sm font-medium text-emerald-600">
                    <ArrowUpRight className="h-4 w-4" />
                    {revenueChange.toFixed(1)}%
                  </span>
                ) : (
                  <span className="flex items-center text-sm font-medium text-rose-600">
                    <ArrowDownRight className="h-4 w-4" />
                    {Math.abs(revenueChange).toFixed(1)}%
                  </span>
                )}
                <span className="text-sm text-slate-400">vs yesterday</span>
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-lg shadow-emerald-500/30">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="stat-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Monthly Revenue</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {formatCurrency(summary?.revenue.this_month || 0)}
              </p>
              <p className="text-sm text-slate-400 mt-2">
                This week: {formatCurrency(summary?.revenue.this_week || 0)}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-500 shadow-lg shadow-blue-500/30">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="stat-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Orders</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {formatNumber(summary?.orders.total || 0)}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="flex items-center gap-1 text-sm text-amber-600">
                  <Clock className="h-3.5 w-3.5" />
                  {formatNumber(summary?.orders.pending || 0)} pending
                </span>
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-violet-500 shadow-lg shadow-violet-500/30">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Customers */}
        <div className="stat-card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Customers</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {formatNumber(summary?.users.total || 0)}
              </p>
              <p className="text-sm mt-2">
                <span className="text-emerald-600 font-medium">+{summary?.users.new_today || 0}</span>
                <span className="text-slate-400"> new today</span>
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 shadow-lg shadow-orange-500/30">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <Card className="lg:col-span-2 border-slate-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900">Recent Orders</CardTitle>
              <CardDescription>Latest orders from customers</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild className="gap-2">
              <Link href="/dashboard/orders">
                <Eye className="h-4 w-4" />
                View All
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentOrders.map((order: any) => (
                  <Link
                    key={order.id}
                    href={`/dashboard/orders/${order.id}`}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 group-hover:from-pink-500 group-hover:to-rose-500 transition-colors">
                      <Package className="h-5 w-5 text-pink-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">
                        {order.package?.name || 'Unknown Package'}
                      </p>
                      <p className="text-sm text-slate-500 truncate">
                        {order.user?.email || order.guest_email || 'Guest'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">{formatCurrency(order.amount || 0)}</p>
                      <Badge
                        variant={
                          order.status === 'completed'
                            ? 'success'
                            : order.status === 'pending'
                            ? 'secondary'
                            : order.status === 'processing'
                            ? 'default'
                            : 'outline'
                        }
                        className="text-xs mt-1"
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Services */}
        <Card className="border-slate-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900">Top Services</CardTitle>
              <CardDescription>Best performers</CardDescription>
            </div>
            <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <MoreHorizontal className="h-5 w-5 text-slate-400" />
            </button>
          </CardHeader>
          <CardContent>
            {topServices.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500">No data available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {topServices.slice(0, 5).map((service, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${
                      index === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-lg shadow-amber-500/30' :
                      index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white shadow-lg shadow-slate-400/30' :
                      index === 2 ? 'bg-gradient-to-br from-orange-300 to-orange-400 text-white shadow-lg shadow-orange-400/30' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{service.service_name}</p>
                      <p className="text-xs text-slate-500">
                        {service.total_orders} orders
                      </p>
                    </div>
                    <p className="font-semibold text-slate-900">
                      {formatCurrency(service.total_revenue)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-slate-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100">
                <TrendingUp className="h-7 w-7 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Conversion Rate</p>
                <p className="text-2xl font-bold text-slate-900">{summary?.conversion.rate?.toFixed(1) || 0}%</p>
                <p className="text-xs text-slate-400">
                  {formatNumber(summary?.conversion.paid_orders || 0)} of {formatNumber(summary?.conversion.total_orders || 0)} orders
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100">
                <Clock className="h-7 w-7 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Processing Orders</p>
                <p className="text-2xl font-bold text-slate-900">{formatNumber(summary?.orders.processing || 0)}</p>
                <p className="text-xs text-slate-400">Currently being processed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100">
                <Package className="h-7 w-7 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Completed Orders</p>
                <p className="text-2xl font-bold text-slate-900">{formatNumber(summary?.orders.completed || 0)}</p>
                <p className="text-xs text-slate-400">Successfully delivered</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
