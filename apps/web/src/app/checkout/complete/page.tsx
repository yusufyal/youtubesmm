import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Order Complete',
  description: 'Your order has been successfully placed.',
  robots: {
    index: false,
    follow: false,
  },
};

interface CheckoutCompletePageProps {
  searchParams: Promise<{ order_id?: string }>;
}

export default async function CheckoutCompletePage({
  searchParams,
}: CheckoutCompletePageProps) {
  const { order_id: orderId } = await searchParams;

  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-12">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
          <CardDescription>
            Thank you for your purchase. Your order is being processed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {orderId && (
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="text-lg font-semibold">#{orderId}</p>
            </div>
          )}

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>We've sent a confirmation email with your order details.</p>
            <p>
              Your order will start processing shortly. Delivery typically
              begins within 0-6 hours.
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <Link href="/dashboard/orders">
              <Button className="w-full">View My Orders</Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
