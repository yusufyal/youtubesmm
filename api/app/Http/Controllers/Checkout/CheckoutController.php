<?php

namespace App\Http\Controllers\Checkout;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\Package;
use App\Services\CheckoutService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CheckoutController extends Controller
{
    public function __construct(
        protected CheckoutService $checkoutService
    ) {}

    public function quote(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'package_id' => ['required', 'exists:packages,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'coupon_code' => ['nullable', 'string'],
        ]);

        $package = Package::with('service')->findOrFail($validated['package_id']);
        
        if (!$package->active) {
            return $this->errorResponse('This package is not available', 400);
        }

        // Validate quantity bounds
        if ($validated['quantity'] < $package->min_quantity || $validated['quantity'] > $package->max_quantity) {
            return $this->errorResponse(
                "Quantity must be between {$package->min_quantity} and {$package->max_quantity}",
                400
            );
        }

        $quote = $this->checkoutService->calculateQuote(
            $package,
            $validated['quantity'],
            $validated['coupon_code'] ?? null
        );

        return $this->successResponse($quote);
    }

    public function createOrder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'package_id' => ['required', 'exists:packages,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            // Support both single link and multiple links
            'target_link' => ['nullable', 'url', 'max:500', 'required_without:links'],
            'links' => ['nullable', 'array', 'min:1', 'max:10', 'required_without:target_link'],
            'links.*.url' => ['required_with:links', 'url', 'max:500'],
            'links.*.quantity' => ['required_with:links', 'integer', 'min:1'],
            'coupon_code' => ['nullable', 'string'],
            'guest_email' => ['nullable', 'email', 'required_without:user_id'],
        ]);

        $package = Package::with('service')->findOrFail($validated['package_id']);
        
        // Validate links
        if (isset($validated['links']) && is_array($validated['links'])) {
            // Multi-link mode: validate each link
            foreach ($validated['links'] as $index => $link) {
                if (!$this->checkoutService->validateTargetLink($link['url'], $package->service->type)) {
                    return $this->errorResponse("Invalid YouTube URL at position " . ($index + 1), 400);
                }
            }
            
            // Validate total quantity matches
            $totalLinkQuantity = array_sum(array_column($validated['links'], 'quantity'));
            if ($totalLinkQuantity !== $validated['quantity']) {
                return $this->errorResponse(
                    "Total link quantities ({$totalLinkQuantity}) must equal package quantity ({$validated['quantity']})", 
                    400
                );
            }
            
            $targetLink = $validated['links'][0]['url']; // Primary link
            $targetLinks = $validated['links'];
        } else {
            // Single link mode (backward compatible)
            if (!$this->checkoutService->validateTargetLink($validated['target_link'], $package->service->type)) {
                return $this->errorResponse('Invalid YouTube URL for this service type', 400);
            }
            
            $targetLink = $validated['target_link'];
            $targetLinks = [
                ['url' => $validated['target_link'], 'quantity' => $validated['quantity']]
            ];
        }

        try {
            $order = $this->checkoutService->createOrder([
                'package_id' => $validated['package_id'],
                'quantity' => $validated['quantity'],
                'target_link' => $targetLink,
                'target_links' => $targetLinks,
                'coupon_code' => $validated['coupon_code'] ?? null,
                'guest_email' => $validated['guest_email'] ?? null,
                'user_id' => $request->user()?->id,
            ]);

            return $this->successResponse([
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'amount' => $order->amount,
                'currency' => 'USD',
                'links_count' => count($targetLinks),
            ], 'Order created successfully', 201);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    public function validateCoupon(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string'],
            'amount' => ['required', 'numeric', 'min:0'],
        ]);

        $coupon = Coupon::where('code', $validated['code'])->first();

        if (!$coupon) {
            return $this->errorResponse('Coupon not found', 404);
        }

        if (!$coupon->isValid()) {
            return $this->errorResponse('This coupon is not valid or has expired', 400);
        }

        $discount = $coupon->calculateDiscount($validated['amount']);

        return $this->successResponse([
            'code' => $coupon->code,
            'type' => $coupon->type,
            'value' => $coupon->value,
            'discount' => $discount,
            'valid' => true,
        ]);
    }

    /**
     * Confirm payment for an order (called from success page after external payment gateway redirect).
     * Updates the order's payment_status to 'completed' and status to 'processing'.
     * Only works on orders that are still in 'pending' payment status.
     */
    public function confirmPayment(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order_id' => ['required', 'integer', 'exists:orders,id'],
        ]);

        $order = Order::find($validated['order_id']);

        if (!$order) {
            return $this->errorResponse('Order not found', 404);
        }

        // Only confirm if payment is still pending (idempotent - already confirmed orders are fine)
        if ($order->payment_status === 'completed') {
            return $this->successResponse([
                'order_id' => $order->id,
                'payment_status' => $order->payment_status,
                'status' => $order->status,
            ], 'Payment already confirmed');
        }

        if ($order->payment_status !== 'pending') {
            return $this->errorResponse('Order payment cannot be confirmed in its current state', 400);
        }

        $order->update([
            'payment_status' => 'completed',
            'status' => 'processing',
        ]);

        Log::info('Payment confirmed via external gateway', [
            'order_id' => $order->id,
            'order_number' => $order->order_number,
            'amount' => $order->amount,
        ]);

        return $this->successResponse([
            'order_id' => $order->id,
            'payment_status' => $order->payment_status,
            'status' => $order->status,
        ], 'Payment confirmed successfully');
    }
}
