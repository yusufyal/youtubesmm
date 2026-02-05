'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import api from '@/lib/api';
import { CreditCard, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: number;
  amount: number;
}

function PaymentForm({
  orderId,
  amount,
  onSuccess,
}: {
  orderId: number;
  amount: number;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || 'Payment failed');
        setIsLoading(false);
        return;
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/complete?order_id=${orderId}`,
        },
      });

      if (confirmError) {
        setError(confirmError.message || 'Payment failed');
      } else {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={!stripe || isLoading}
      >
        {isLoading ? 'Processing...' : `Pay ${formatCurrency(amount)}`}
      </Button>
    </form>
  );
}

function DemoPaymentForm({
  orderId,
  amount,
  onSuccess,
  onError,
}: {
  orderId: number;
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Call demo payment simulation endpoint
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888/api'}/payments/demo/simulate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ order_id: orderId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Payment simulation failed');
      }

      onSuccess();
    } catch (err: any) {
      onError(err.message || 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Demo Mode Banner */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
        <div>
          <strong>Demo Mode:</strong> Use any test card details below
        </div>
      </div>

      {/* Card Number */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Card Number</label>
        <div className="relative">
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            placeholder="4242 4242 4242 4242"
            maxLength={19}
            className="w-full px-4 py-3 pl-12 rounded-lg border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
          />
          <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        </div>
      </div>

      {/* Expiry and CVC */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Expiry</label>
          <input
            type="text"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            placeholder="MM/YY"
            maxLength={5}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">CVC</label>
          <input
            type="text"
            value={cvc}
            onChange={(e) => setCvc(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="123"
            maxLength={4}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
          />
        </div>
      </div>

      {/* Test Card Hint */}
      <p className="text-xs text-slate-500">
        Use <code className="px-1 py-0.5 bg-slate-100 rounded">4242 4242 4242 4242</code> with any future expiry and CVC
      </p>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5 mr-2" />
            Pay {formatCurrency(amount)}
          </>
        )}
      </Button>
    </form>
  );
}

export function PaymentDialog({
  open,
  onOpenChange,
  orderId,
  amount,
}: PaymentDialogProps) {
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (open && orderId) {
      setIsLoading(true);
      setError(null);
      setIsSuccess(false);

      api
        .createPaymentIntent(orderId)
        .then((response: any) => {
          setClientSecret(response.client_secret);
          setIsDemoMode(response.demo_mode === true);
        })
        .catch((err) => {
          setError(err.message || 'Failed to initialize payment');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [open, orderId]);

  const handleSuccess = () => {
    setIsSuccess(true);
    setTimeout(() => {
      router.push(`/checkout/complete?order_id=${orderId}`);
    }, 1500);
  };

  const handleError = (err: string) => {
    setError(err);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isSuccess ? (
              <>
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                Payment Successful
              </>
            ) : (
              'Complete Your Payment'
            )}
          </DialogTitle>
          <DialogDescription>
            {isSuccess
              ? 'Your order has been placed successfully!'
              : 'Enter your payment details to complete your order.'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-500 border-t-transparent" />
            </div>
          )}

          {isSuccess && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              </div>
              <p className="text-slate-600">Redirecting to order confirmation...</p>
            </div>
          )}

          {error && !isSuccess && (
            <div className="rounded-lg bg-red-50 p-4 text-center text-red-600 mb-4">
              {error}
            </div>
          )}

          {!isLoading && !isSuccess && clientSecret && (
            <>
              {isDemoMode ? (
                <DemoPaymentForm
                  orderId={orderId}
                  amount={amount}
                  onSuccess={handleSuccess}
                  onError={handleError}
                />
              ) : (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: 'stripe',
                      variables: {
                        colorPrimary: '#dc2626',
                      },
                    },
                  }}
                >
                  <PaymentForm
                    orderId={orderId}
                    amount={amount}
                    onSuccess={handleSuccess}
                  />
                </Elements>
              )}
            </>
          )}
        </div>

        {!isSuccess && (
          <div className="text-center text-xs text-muted-foreground">
            <p>
              {isDemoMode
                ? 'Demo Mode - No real payments processed'
                : 'Secure payment powered by Stripe'}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
