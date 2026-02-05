<?php

namespace App\Http\Controllers\Checkout;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function __construct(
        protected PaymentService $paymentService
    ) {}

    public function createStripeIntent(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order_id' => ['required', 'exists:orders,id'],
        ]);

        $order = Order::findOrFail($validated['order_id']);

        // Verify ownership or guest order
        if ($order->user_id && $order->user_id !== $request->user()?->id) {
            return $this->errorResponse('Unauthorized', 403);
        }

        if ($order->payment_status === 'completed') {
            return $this->errorResponse('This order has already been paid', 400);
        }

        try {
            $intent = $this->paymentService->createStripePaymentIntent($order);
            return $this->successResponse($intent);
        } catch (\Exception $e) {
            Log::error('Stripe intent creation failed', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);
            return $this->errorResponse('Failed to create payment intent', 500);
        }
    }

    /**
     * Simulate payment completion in demo mode (for testing)
     */
    public function simulateDemoPayment(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order_id' => ['required', 'exists:orders,id'],
        ]);

        $order = Order::findOrFail($validated['order_id']);

        // Verify ownership or guest order
        if ($order->user_id && $order->user_id !== $request->user()?->id) {
            return $this->errorResponse('Unauthorized', 403);
        }

        if ($order->payment_status === 'completed') {
            return $this->errorResponse('This order has already been paid', 400);
        }

        if (!$this->paymentService->isDemoMode()) {
            return $this->errorResponse('Demo mode is not enabled', 400);
        }

        try {
            $this->paymentService->simulateDemoPayment($order);
            return $this->successResponse([
                'success' => true,
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'message' => 'Payment simulated successfully (demo mode)',
            ]);
        } catch (\Exception $e) {
            Log::error('Demo payment simulation failed', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function createTapCharge(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order_id' => ['required', 'exists:orders,id'],
        ]);

        $order = Order::findOrFail($validated['order_id']);

        if ($order->user_id && $order->user_id !== $request->user()?->id) {
            return $this->errorResponse('Unauthorized', 403);
        }

        if ($order->payment_status === 'completed') {
            return $this->errorResponse('This order has already been paid', 400);
        }

        try {
            $charge = $this->paymentService->createTapCharge($order);
            return $this->successResponse($charge);
        } catch (\Exception $e) {
            Log::error('Tap charge creation failed', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);
            return $this->errorResponse('Failed to create payment charge', 500);
        }
    }

    public function stripeWebhook(Request $request): JsonResponse
    {
        $payload = $request->getContent();
        $signature = $request->header('Stripe-Signature');

        if (!$signature) {
            return $this->errorResponse('Missing signature', 400);
        }

        try {
            $this->paymentService->handleStripeWebhook($payload, $signature);
            return response()->json(['received' => true]);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            Log::error('Stripe webhook signature verification failed', ['error' => $e->getMessage()]);
            return $this->errorResponse('Invalid signature', 400);
        } catch (\Exception $e) {
            Log::error('Stripe webhook processing failed', ['error' => $e->getMessage()]);
            return $this->errorResponse('Webhook processing failed', 500);
        }
    }

    public function tapWebhook(Request $request): JsonResponse
    {
        $payload = $request->all();

        // Verify webhook signature if configured
        $webhookSecret = config('services.tap.webhook_secret');
        if ($webhookSecret) {
            $signature = $request->header('Hashstring');
            // Add signature verification logic here
        }

        try {
            $this->paymentService->handleTapWebhook($payload);
            return response()->json(['received' => true]);
        } catch (\Exception $e) {
            Log::error('Tap webhook processing failed', ['error' => $e->getMessage()]);
            return $this->errorResponse('Webhook processing failed', 500);
        }
    }
}
