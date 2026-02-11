'use client';

import { useEffect, useState } from 'react';
import {
  RefreshCw,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from 'lucide-react';
import type { Order, OrderStatus, PaginatedResponse } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDateTime, formatNumber } from '@/lib/utils';
import adminApi from '@/lib/api';

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
  pending: 'secondary',
  processing: 'default',
  completed: 'success',
  failed: 'destructive',
  refunded: 'warning',
};

function truncateLink(link: string, maxLen: number = 40): string {
  if (link.length <= maxLen) return link;
  return link.substring(0, maxLen) + '...';
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button onClick={handleCopy} className="text-muted-foreground hover:text-foreground transition-colors" title="Copy link">
      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

function OrderDetailRow({ order }: { order: Order }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [status, setStatus] = useState(order.status);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setIsUpdating(true);
    try {
      await adminApi.updateOrder(order.id, { status: newStatus });
      setStatus(newStatus);
    } catch (err) {
      console.error('Failed to update order:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <tr className="bg-muted/30 border-b">
      <td colSpan={10} className="px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          {/* Order Info */}
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Order Details</h4>
            <div className="space-y-1 text-muted-foreground">
              <p>Order #: <span className="text-foreground font-medium">{order.order_number}</span></p>
              <p>Package: <span className="text-foreground">{order.package?.name}</span></p>
              <p>Service: <span className="text-foreground">{order.package?.service?.name}</span></p>
              {order.group_id && <p>Group: <span className="text-foreground font-mono text-xs">{order.group_id.substring(0, 8)}...</span></p>}
            </div>
          </div>

          {/* Customer Info */}
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Customer</h4>
            <div className="space-y-1 text-muted-foreground">
              <p>Email: <span className="text-foreground">{order.user?.email || order.guest_email || 'N/A'}</span></p>
              {order.user?.name && <p>Name: <span className="text-foreground">{order.user.name}</span></p>}
              <p>Payment: <Badge variant={paymentStatusColors[order.payment_status]}>{order.payment_status}</Badge></p>
              {order.discount > 0 && <p>Discount: <span className="text-green-500">-{formatCurrency(order.discount)}</span></p>}
            </div>
          </div>

          {/* Provider Info & Actions */}
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Provider & Actions</h4>
            <div className="space-y-1 text-muted-foreground">
              {order.provider_order_id && <p>Provider ID: <span className="text-foreground font-mono">{order.provider_order_id}</span></p>}
              <p>Progress: <span className="text-foreground">{order.start_count ?? 0} / {order.current_count ?? 0}</span></p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <select
                className="rounded-md border bg-background px-2 py-1.5 text-xs"
                value={status}
                onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                disabled={isUpdating}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="partial">Partial</option>
                <option value="canceled">Canceled</option>
                <option value="refunded">Refunded</option>
              </select>
              {isUpdating && <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />}
            </div>
          </div>
        </div>

        {/* Full Link */}
        <div className="mt-4 pt-3 border-t">
          <p className="text-xs text-muted-foreground mb-1">Full Link:</p>
          <div className="flex items-center gap-2">
            <code className="text-xs bg-muted px-2 py-1 rounded flex-1 overflow-hidden text-ellipsis">{order.target_link}</code>
            <CopyButton text={order.target_link} />
            <a href={order.target_link} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </td>
    </tr>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse<Order>['meta'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  const fetchOrders = async (page: number = 1, status?: string) => {
    setIsLoading(true);
    try {
      const response = await adminApi.getOrders({
        page,
        status: status || undefined,
      });
      setOrders(Array.isArray(response?.data) ? response.data : []);
      setMeta(response?.meta || null);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage, statusFilter);
  }, [currentPage, statusFilter]);

  const filteredOrders = searchQuery
    ? orders.filter(
        (o) =>
          o.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.guest_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.target_link?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          String(o.id).includes(searchQuery)
      )
    : orders;

  const getRemains = (order: Order): number | string => {
    if (order.start_count === null || order.start_count === undefined) return order.quantity;
    if (order.current_count === null || order.current_count === undefined) return order.quantity;
    const delivered = order.current_count - order.start_count;
    return Math.max(0, order.quantity - delivered);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground">
            {meta ? `${meta.total} total orders` : 'Manage customer orders'}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => fetchOrders(currentPage, statusFilter)}>
          <RefreshCw className="mr-2 h-3.5 w-3.5" />
          Refresh
        </Button>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search ID, email, link..."
            className="rounded-md border bg-background pl-8 pr-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-ring"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="rounded-md border bg-background px-3 py-1.5 text-sm"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="partial">Partial</option>
          <option value="canceled">Canceled</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-3 border-primary border-t-transparent" />
          </div>
        ) : !filteredOrders || filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            No orders found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">ID</th>
                  <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">User</th>
                  <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Charge</th>
                  <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Link</th>
                  <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Start</th>
                  <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Quantity</th>
                  <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Service</th>
                  <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Remains</th>
                  <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredOrders.map((order) => {
                  const isExpanded = expandedOrder === order.id;
                  return (
                    <>
                      <tr
                        key={order.id}
                        className={`hover:bg-muted/50 cursor-pointer transition-colors ${isExpanded ? 'bg-muted/30' : ''}`}
                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      >
                        <td className="px-3 py-2.5 font-medium">{order.id}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">
                          <span className="max-w-[140px] block truncate" title={order.user?.email || order.guest_email || 'Guest'}>
                            {order.user?.email || order.guest_email || 'Guest'}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 font-medium">{formatCurrency(order.amount)}</td>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-1.5 max-w-[200px]">
                            <span className="truncate text-muted-foreground text-xs" title={order.target_link}>
                              {truncateLink(order.target_link, 30)}
                            </span>
                            <a
                              href={order.target_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-foreground flex-shrink-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-muted-foreground">{order.start_count ?? 0}</td>
                        <td className="px-3 py-2.5">{formatNumber(order.quantity)}</td>
                        <td className="px-3 py-2.5">
                          <span className="max-w-[120px] block truncate text-xs" title={order.package?.service?.name}>
                            {order.package?.service?.name || '-'}
                          </span>
                        </td>
                        <td className="px-3 py-2.5">
                          <Badge variant={statusColors[order.status]} className="text-xs">
                            {order.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="px-3 py-2.5 text-muted-foreground">{getRemains(order)}</td>
                        <td className="px-3 py-2.5 text-muted-foreground text-xs whitespace-nowrap">
                          {formatDateTime(order.created_at)}
                        </td>
                      </tr>
                      {isExpanded && <OrderDetailRow key={`detail-${order.id}`} order={order} />}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing {meta.from} to {meta.to} of {meta.total}
          </p>
          <div className="flex gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            {Array.from({ length: Math.min(meta.last_page, 5) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === meta.last_page}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
