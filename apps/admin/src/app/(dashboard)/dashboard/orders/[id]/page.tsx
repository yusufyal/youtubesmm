'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  RotateCcw,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Package,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import adminApi from '@/lib/api';
import type { Order } from '@aynyoutube/types';

const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'success' | 'warning'> = {
  pending: 'secondary',
  processing: 'default',
  in_progress: 'default',
  completed: 'success',
  partial: 'warning',
  canceled: 'destructive',
  refunded: 'destructive',
};

const paymentStatusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'success' | 'warning'> = {
  pending: 'warning',
  paid: 'success',
  failed: 'destructive',
  refunded: 'secondary',
};

const orderStatuses = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'partial', label: 'Partial' },
  { value: 'canceled', label: 'Canceled' },
];

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = Number(params.id);

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isRefunding, setIsRefunding] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await adminApi.getOrder(orderId);
      setOrder(response);
    } catch (err: any) {
      setError(err.message || 'Failed to load order');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!order || !newStatus) return;
    setIsUpdating(true);

    try {
      await adminApi.updateOrder(order.id, { status: newStatus });
      setOrder({ ...order, status: newStatus });
      setIsStatusDialogOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResend = async () => {
    if (!order) return;
    if (!confirm('Are you sure you want to resend this order to the provider?')) return;

    setIsResending(true);
    try {
      await adminApi.resendOrder(order.id);
      alert('Order resent to provider successfully');
      fetchOrder();
    } catch (err: any) {
      alert(err.message || 'Failed to resend order');
    } finally {
      setIsResending(false);
    }
  };

  const handleRefund = async () => {
    if (!order) return;
    setIsRefunding(true);

    try {
      await adminApi.refundOrder(order.id);
      setIsRefundDialogOpen(false);
      fetchOrder();
    } catch (err: any) {
      alert(err.message || 'Failed to refund order');
    } finally {
      setIsRefunding(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
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
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Card>
          <CardContent className="py-8 text-center text-red-500">
            {error || 'Order not found'}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Order #{order.order_number}
            </h1>
            <p className="text-muted-foreground">
              Created {formatDate(order.created_at)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant={statusColors[order.status]} className="text-sm">
            {order.status.replace('_', ' ')}
          </Badge>
          <Badge variant={paymentStatusColors[order.payment_status || 'pending']} className="text-sm">
            Payment: {order.payment_status || 'pending'}
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Service Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Service</p>
                  <p className="font-medium">{order.package?.service?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Package</p>
                  <p className="font-medium">{order.package?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="font-medium">{order.quantity?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium text-lg">{formatCurrency(order.amount || 0)}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-2">Target Link</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-2 bg-muted rounded text-sm break-all">
                    {order.target_link}
                  </code>
                  <Button variant="outline" size="sm" asChild>
                    <a href={order.target_link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{order.start_count?.toLocaleString() || 0}</p>
                  <p className="text-sm text-muted-foreground">Start Count</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{order.current_count?.toLocaleString() || 0}</p>
                  <p className="text-sm text-muted-foreground">Current Count</p>
                </div>
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <p className="text-2xl font-bold text-primary">
                    {((order.current_count || 0) - (order.start_count || 0)).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Delivered</p>
                </div>
              </div>

              {order.provider_order_id && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Provider Order ID</p>
                  <p className="font-mono">{order.provider_order_id}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full"
                onClick={() => {
                  setNewStatus(order.status);
                  setIsStatusDialogOpen(true);
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Update Status
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleResend}
                disabled={isResending}
              >
                {isResending ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Resend to Provider
              </Button>
              {order.payment_status === 'paid' && order.status !== 'refunded' && (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => setIsRefundDialogOpen(true)}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Refund Order
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.user ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{order.user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{order.user.email}</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href={`/dashboard/users?search=${order.user.email}`}>
                      View Customer
                    </Link>
                  </Button>
                </>
              ) : (
                <div>
                  <p className="text-sm text-muted-foreground">Guest Order</p>
                  <p className="font-medium">{order.guest_email || 'No email'}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={paymentStatusColors[order.payment_status || 'pending']}>
                  {order.payment_status || 'Pending'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="text-xl font-bold">{formatCurrency(order.amount || 0)}</p>
              </div>
              {order.coupon_code && (
                <div>
                  <p className="text-sm text-muted-foreground">Coupon Used</p>
                  <code className="px-2 py-1 bg-muted rounded text-sm">{order.coupon_code}</code>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Update Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>Change the status of this order</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>New Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {orderStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus} disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Refund Dialog */}
      <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refund Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to refund this order? This will refund{' '}
              {formatCurrency(order.amount || 0)} to the customer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRefundDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRefund} disabled={isRefunding}>
              {isRefunding ? 'Processing...' : 'Confirm Refund'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
