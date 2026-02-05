'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, RotateCcw } from 'lucide-react';
import type { Order, PaginatedResponse } from '@aynyoutube/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import api from '@/lib/api';

const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'outline'> = {
  pending: 'secondary',
  processing: 'default',
  in_progress: 'default',
  completed: 'success',
  partial: 'warning',
  canceled: 'destructive',
  refunded: 'destructive',
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    api.setToken(token);

    const fetchOrders = async () => {
      try {
        const response = await api.getMyOrders();
        // Handle both array and paginated response formats
        const ordersData = Array.isArray(response) ? response : (response?.data || []);
        setOrders(ordersData);
      } catch (err: any) {
        if (err.message?.includes('Unauthenticated')) {
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }
        setError(err.message || 'Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-red-500">{error}</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
        <p className="text-muted-foreground">View and manage your orders</p>
      </div>

      {(!orders || orders.length === 0) ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">You don't have any orders yet.</p>
            <Link href="/services">
              <Button className="mt-4">Browse Services</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">
                      Order #{order.order_number}
                    </CardTitle>
                    <CardDescription>
                      {order.package?.service?.name} - {order.package?.name}
                    </CardDescription>
                  </div>
                  <Badge variant={statusColors[order.status] || 'default'}>
                    {order.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">
                      Quantity: {order.quantity.toLocaleString()}
                    </p>
                    <p className="text-muted-foreground">
                      Created: {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold">{formatCurrency(order.amount)}</p>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/orders/${order.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="mr-1 h-4 w-4" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
