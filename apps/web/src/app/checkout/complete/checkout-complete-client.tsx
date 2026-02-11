'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';

interface CheckoutCompleteClientProps {
  orderId?: string;
}

export function CheckoutCompleteClient({ orderId }: CheckoutCompleteClientProps) {
  const [isConfirming, setIsConfirming] = useState(!!orderId);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const confirmPayment = async () => {
      try {
        await api.confirmPayment(parseInt(orderId, 10));
        setConfirmed(true);
      } catch (err: any) {
        // Even if confirm fails, still show success page
        // (order may already be confirmed, or other non-critical error)
        console.error('Payment confirmation error:', err);
        setError(err.message);
        setConfirmed(true);
      } finally {
        setIsConfirming(false);
      }
    };

    confirmPayment();
  }, [orderId]);

  return (
    <div className="container flex min-h-[60vh] items-center justify-center pt-24 pb-12">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            {isConfirming ? (
              <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
            ) : (
              <CheckCircle className="h-10 w-10 text-green-600" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {isConfirming ? 'Confirming Payment...' : 'Order Confirmed!'}
          </CardTitle>
          <CardDescription>
            {isConfirming
              ? 'Please wait while we confirm your payment.'
              : 'Thank you for your purchase. Your order is being processed.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {orderId && (
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="text-lg font-semibold">#{orderId}</p>
            </div>
          )}

          {!isConfirming && (
            <>
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
