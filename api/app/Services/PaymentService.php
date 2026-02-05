<?php

namespace App\Services;

use App\Jobs\ProcessOrderJob;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Stripe\PaymentIntent;
use Stripe\Stripe;
use Stripe\Webhook;

class PaymentService
{
    protected bool $demoMode = false;

    public function __construct()
    {
        $stripeSecret = config('services.stripe.secret');
        
        // Check if we're in demo mode (no valid Stripe keys)
        if (empty($stripeSecret) || $stripeSecret === 'sk_test_xxx' || !str_starts_with($stripeSecret, 'sk_')) {
            $this->demoMode = true;
        } else {
            Stripe::setApiKey($stripeSecret);
        }
    }

    public function isDemoMode(): bool
    {
        return $this->demoMode;
    }

    public function createStripePaymentIntent(Order $order): array
    {
        if ($order->payment_status === 'completed') {
            throw new \Exception('Order has already been paid');
        }

        // Demo mode: return a fake client secret for testing
        if ($this->demoMode) {
            $demoIntentId = 'demo_pi_' . Str::random(24);
            
            Payment::updateOrCreate(
                ['order_id' => $order->id],
                [
                    'provider' => 'stripe',
                    'payment_intent_id' => $demoIntentId,
                    'amount' => $order->amount,
                    'currency' => 'USD',
                    'status' => 'pending',
                ]
            );

            return [
                'client_secret' => 'demo_secret_' . Str::random(24),
                'payment_intent_id' => $demoIntentId,
                'demo_mode' => true,
            ];
        }

        $paymentIntent = PaymentIntent::create([
            'amount' => (int) ($order->amount * 100), // Stripe uses cents
            'currency' => 'usd',
            'metadata' => [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
            ],
        ]);

        // Create or update payment record
        Payment::updateOrCreate(
            ['order_id' => $order->id],
            [
                'provider' => 'stripe',
                'payment_intent_id' => $paymentIntent->id,
                'amount' => $order->amount,
                'currency' => 'USD',
                'status' => 'pending',
            ]
        );

        return [
            'client_secret' => $paymentIntent->client_secret,
            'payment_intent_id' => $paymentIntent->id,
            'demo_mode' => false,
        ];
    }

    /**
     * Simulate a successful payment in demo mode
     */
    public function simulateDemoPayment(Order $order): bool
    {
        if (!$this->demoMode) {
            throw new \Exception('Demo payment simulation only available in demo mode');
        }

        $payment = Payment::where('order_id', $order->id)->first();
        
        if (!$payment) {
            throw new \Exception('Payment record not found');
        }

        $payment->update([
            'status' => 'completed',
            'reference' => 'demo_' . Str::random(16),
            'metadata' => [
                'demo_mode' => true,
                'simulated_at' => now()->toIso8601String(),
            ],
        ]);

        $order->update([
            'payment_status' => 'completed',
            'status' => 'processing',
        ]);

        Log::info('Demo payment simulated', [
            'order_id' => $order->id,
            'order_number' => $order->order_number,
            'amount' => $payment->amount,
        ]);

        return true;
    }

    public function handleStripeWebhook(string $payload, string $signature): void
    {
        $event = Webhook::constructEvent(
            $payload,
            $signature,
            config('services.stripe.webhook_secret')
        );

        Log::info('Stripe webhook received', ['type' => $event->type]);

        switch ($event->type) {
            case 'payment_intent.succeeded':
                $this->handlePaymentSucceeded($event->data->object);
                break;
            case 'payment_intent.payment_failed':
                $this->handlePaymentFailed($event->data->object);
                break;
        }
    }

    protected function handlePaymentSucceeded($paymentIntent): void
    {
        $payment = Payment::where('payment_intent_id', $paymentIntent->id)->first();
        
        if (!$payment) {
            Log::warning('Payment not found for intent', ['intent_id' => $paymentIntent->id]);
            return;
        }

        $payment->update([
            'status' => 'completed',
            'reference' => $paymentIntent->id,
            'metadata' => [
                'stripe_payment_method' => $paymentIntent->payment_method,
                'stripe_status' => $paymentIntent->status,
            ],
        ]);

        $order = $payment->order;
        $order->update([
            'payment_status' => 'completed',
            'status' => 'processing',
        ]);

        // Dispatch job to send order to SMM provider
        ProcessOrderJob::dispatch($order);

        Log::info('Payment completed', [
            'order_id' => $order->id,
            'order_number' => $order->order_number,
            'amount' => $payment->amount,
        ]);
    }

    protected function handlePaymentFailed($paymentIntent): void
    {
        $payment = Payment::where('payment_intent_id', $paymentIntent->id)->first();
        
        if (!$payment) {
            return;
        }

        $payment->update([
            'status' => 'failed',
            'metadata' => [
                'error' => $paymentIntent->last_payment_error?->message ?? 'Payment failed',
            ],
        ]);

        $payment->order->update([
            'payment_status' => 'failed',
        ]);

        Log::warning('Payment failed', [
            'order_id' => $payment->order_id,
            'error' => $paymentIntent->last_payment_error?->message,
        ]);
    }

    public function createTapCharge(Order $order): array
    {
        // Tap Payments implementation for GCC/Kuwait
        $client = new \GuzzleHttp\Client();
        
        $response = $client->post(config('services.tap.url', 'https://api.tap.company/v2') . '/charges', [
            'headers' => [
                'Authorization' => 'Bearer ' . config('services.tap.secret'),
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'amount' => $order->amount,
                'currency' => 'USD',
                'customer_initiated' => true,
                'threeDSecure' => true,
                'save_card' => false,
                'description' => "Order {$order->order_number}",
                'metadata' => [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                ],
                'reference' => [
                    'transaction' => $order->order_number,
                    'order' => $order->order_number,
                ],
                'redirect' => [
                    'url' => config('app.frontend_url') . '/checkout/complete?order=' . $order->order_number,
                ],
                'post' => [
                    'url' => config('app.url') . '/api/payments/tap/webhook',
                ],
            ],
        ]);

        $data = json_decode($response->getBody()->getContents(), true);

        Payment::updateOrCreate(
            ['order_id' => $order->id],
            [
                'provider' => 'tap',
                'payment_intent_id' => $data['id'],
                'amount' => $order->amount,
                'currency' => 'USD',
                'status' => 'pending',
            ]
        );

        return [
            'charge_id' => $data['id'],
            'redirect_url' => $data['transaction']['url'] ?? null,
        ];
    }

    public function handleTapWebhook(array $payload): void
    {
        $chargeId = $payload['id'] ?? null;
        
        if (!$chargeId) {
            return;
        }

        $payment = Payment::where('payment_intent_id', $chargeId)->first();
        
        if (!$payment) {
            Log::warning('Payment not found for Tap charge', ['charge_id' => $chargeId]);
            return;
        }

        $status = $payload['status'] ?? 'UNKNOWN';

        if ($status === 'CAPTURED') {
            $payment->update([
                'status' => 'completed',
                'reference' => $payload['reference']['payment'] ?? $chargeId,
                'metadata' => $payload,
            ]);

            $order = $payment->order;
            $order->update([
                'payment_status' => 'completed',
                'status' => 'processing',
            ]);

            ProcessOrderJob::dispatch($order);
        } elseif (in_array($status, ['DECLINED', 'FAILED', 'CANCELLED'])) {
            $payment->update([
                'status' => 'failed',
                'metadata' => $payload,
            ]);

            $payment->order->update([
                'payment_status' => 'failed',
            ]);
        }
    }

    public function refundPayment(Order $order): bool
    {
        $payment = $order->payment;
        
        if (!$payment || $payment->status !== 'completed') {
            throw new \Exception('No completed payment found for this order');
        }

        if ($payment->provider === 'stripe') {
            $refund = \Stripe\Refund::create([
                'payment_intent' => $payment->payment_intent_id,
            ]);

            if ($refund->status === 'succeeded') {
                $payment->update(['status' => 'refunded']);
                $order->update([
                    'status' => 'refunded',
                    'payment_status' => 'refunded',
                ]);
                return true;
            }
        }

        return false;
    }
}
