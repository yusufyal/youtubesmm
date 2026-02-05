'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatNumber } from '@/lib/utils';
import adminApi from '@/lib/api';

interface SalesData {
  date: string;
  orders: number;
  revenue: number;
}

export default function ReportsPage() {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [topServices, setTopServices] = useState<
    { service_name: string; total_orders: number; total_revenue: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sales, services] = await Promise.all([
          adminApi.getSalesReport(30),
          adminApi.getTopServices(),
        ]);
        setSalesData(sales);
        setTopServices(services);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalRevenue = salesData.reduce((sum, day) => sum + day.revenue, 0);
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Sales and performance analytics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>30-Day Revenue</CardTitle>
            <CardDescription>Total revenue in the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{formatCurrency(totalRevenue)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>30-Day Orders</CardTitle>
            <CardDescription>Total orders in the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{formatNumber(totalOrders)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Services */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Services</CardTitle>
          <CardDescription>Services ranked by revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topServices.map((service, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium">{service.service_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatNumber(service.total_orders)} orders
                    </p>
                  </div>
                </div>
                <p className="text-lg font-semibold">{formatCurrency(service.total_revenue)}</p>
              </div>
            ))}
            {topServices.length === 0 && (
              <p className="text-center text-muted-foreground">No data available</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Daily Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Sales</CardTitle>
          <CardDescription>Last 30 days breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-background">
                <tr className="border-b">
                  <th className="py-2 text-left text-sm font-medium">Date</th>
                  <th className="py-2 text-right text-sm font-medium">Orders</th>
                  <th className="py-2 text-right text-sm font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {salesData.map((day) => (
                  <tr key={day.date}>
                    <td className="py-2 text-sm">{day.date}</td>
                    <td className="py-2 text-right text-sm">{day.orders}</td>
                    <td className="py-2 text-right text-sm font-medium">
                      {formatCurrency(day.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
