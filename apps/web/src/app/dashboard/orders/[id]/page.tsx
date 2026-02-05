'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ExternalLink, RotateCcw } from 'lucide-react';
import type { Order } from '@aynyoutube/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
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

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = Number(params.id);
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRequestingRefill, setIsRequestingRefill] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    api.setToken(token);

    const fetchOrder = async () => {
      try {
        const response = await api.getMyOrder(orderId);
        setOrder(response);
      } catch (err: any) {
        if (err.message?.includes('Unauthenticated')) {
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }
        setError(err.message || 'Failed to load order');
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, router]);

  const handleRefillRequest = async () => {
    if (!order) return;
    
    setIsRequestingRefill(true);
    try {
      const result = await api.requestRefill(order.id);
      alert(result.message);
    } catch (err: any) {
      alert(err.message || 'Failed to request refill');
    } finally {
      setIsRequestingRefill(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-red-500">
          {error || 'Order not found'}
        </CardContent>
      </Card>
    );
  }

  const progress = order.start_count !== null && order.current_count !== null
    ? Math.min(100, Math.round(((order.current_count - order.start_count) / order.quantity) * 100))
    : null;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/dashboard/orders" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Orders
      </Link>

      {/* Order Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Order #{order.order_number}
          </h1>
          <p className="text-muted-foreground">
            Placed on {formatDateTime(order.created_at)}
          </p>
        </div>
        <Badge variant={statusColors[order.status] || 'default'} className="text-sm">
          {order.status.replace('_', ' ').toUpperCase()}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service</span>
                <span className="font-medium">{order.package?.service?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Package</span>
                <span className="font-medium">{order.package?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quantity</span>
                <span className="font-medium">{order.quantity.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">{formatCurrency(order.amount)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
            </div>

            {/* Target Link */}
            <div className="border-t pt-4">
              <p className="mb-2 text-sm text-muted-foreground">Target URL</p>
              <a
                href={order.target_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                {order.target_link}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Progress</CardTitle>
            <CardDescription>
              Track the progress of your order
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {progress !== null ? (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Count</span>
                    <span>{order.start_count?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Count</span>
                    <span>{order.current_count?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivered</span>
                    <span>
                      {((order.current_count || 0) - (order.start_count || 0)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <p className="py-4 text-center text-muted-foreground">
                Progress tracking will be available once your order starts processing.
              </p>
            )}

            {/* Refill Button */}
            {order.status === 'completed' && order.package?.refill_eligible && (
              <div className="border-t pt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleRefillRequest}
                  disabled={isRequestingRefill}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {isRequestingRefill ? 'Requesting...' : 'Request Refill'}
                </Button>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Refill available within {order.package.refill_days} days of completion
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
