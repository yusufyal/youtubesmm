'use client';

import { useEffect, useState } from 'react';
import { Search, User as UserIcon, Mail, ShoppingBag, DollarSign } from 'lucide-react';
import type { PaginatedResponse } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import adminApi from '@/lib/api';

interface Customer {
  id: number | null;
  name: string;
  email: string;
  role: string;
  customer_type: 'registered' | 'guest';
  orders_count: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse<Customer>['meta'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, debouncedSearch]);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await adminApi.getCustomers({
        page: currentPage,
        search: debouncedSearch || undefined,
      });
      setCustomers(response.data || []);
      setMeta(response.meta);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Summary stats
  const totalCustomers = meta?.total || 0;
  const registeredCount = customers.filter((c) => c.customer_type === 'registered').length;
  const guestCount = customers.filter((c) => c.customer_type === 'guest').length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
          <p className="text-sm text-muted-foreground">
            {meta ? `${meta.total} total customers` : 'Registered users and guest orders'}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <UserIcon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalCustomers}</p>
              <p className="text-xs text-muted-foreground">Total Customers</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div>
              <p className="text-2xl font-bold">{registeredCount}</p>
              <p className="text-xs text-muted-foreground">Registered (this page)</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <p className="text-2xl font-bold">{guestCount}</p>
              <p className="text-xs text-muted-foreground">Guests (this page)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="rounded-md border bg-background pl-8 pr-3 py-1.5 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-ring"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-3 border-primary border-t-transparent" />
          </div>
        ) : customers.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            No customers found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Customer</th>
                  <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Email</th>
                  <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Type</th>
                  <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Orders</th>
                  <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Total Spent</th>
                  <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Since</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {customers.map((customer, index) => (
                  <tr key={customer.email + '-' + index} className="hover:bg-muted/50">
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
                          customer.customer_type === 'registered'
                            ? 'bg-blue-500/10 text-blue-500'
                            : 'bg-orange-500/10 text-orange-500'
                        }`}>
                          {customer.name?.charAt(0)?.toUpperCase() || customer.email?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <span className="font-medium">
                          {customer.name || 'Guest'}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">{customer.email}</td>
                    <td className="px-3 py-2.5">
                      <Badge
                        variant={customer.customer_type === 'registered' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {customer.customer_type === 'registered' ? 'Registered' : 'Guest'}
                      </Badge>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="font-medium">{customer.orders_count}</span>
                      <span className="text-muted-foreground"> orders</span>
                    </td>
                    <td className="px-3 py-2.5 font-medium">{formatCurrency(customer.total_spent)}</td>
                    <td className="px-3 py-2.5 text-muted-foreground text-xs">
                      {formatDate(customer.created_at)}
                    </td>
                  </tr>
                ))}
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
            <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={currentPage === meta.last_page} onClick={() => setCurrentPage(currentPage + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
