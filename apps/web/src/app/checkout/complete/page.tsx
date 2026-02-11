import { Metadata } from 'next';
import { CheckoutCompleteClient } from './checkout-complete-client';

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

  return <CheckoutCompleteClient orderId={orderId} />;
}
