<?php

namespace App\Services;

use App\Models\Coupon;
use App\Models\Order;
use App\Models\Package;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CheckoutService
{
    public function calculateQuote(Package $package, int $quantity, ?string $couponCode = null): array
    {
        // Calculate base price - use package price as is (quantity already factored in)
        // If user wants more than package quantity, calculate proportionally
        if ($quantity === $package->quantity) {
            $subtotal = $package->price;
        } else {
            $pricePerUnit = $package->price / $package->quantity;
            $subtotal = $pricePerUnit * $quantity;
        }

        $discount = 0;
        $coupon = null;

        if ($couponCode) {
            $coupon = Coupon::where('code', $couponCode)->first();
            if ($coupon && $coupon->isValid()) {
                $discount = $coupon->calculateDiscount($subtotal);
            }
        }

        $total = max(0, $subtotal - $discount);

        return [
            'package' => $package,
            'quantity' => $quantity,
            'subtotal' => round($subtotal, 2),
            'discount' => round($discount, 2),
            'total' => round($total, 2),
            'currency' => 'USD',
            'coupon' => $coupon ? [
                'code' => $coupon->code,
                'type' => $coupon->type,
                'value' => $coupon->value,
            ] : null,
        ];
    }

    /**
     * Create order(s) from checkout data.
     * When multiple links are provided, creates separate Order records per link
     * sharing the same group_id and order_number.
     *
     * @return Order|array Returns first Order (for backward compat) or array with all order IDs
     */
    public function createOrder(array $data): Order
    {
        return DB::transaction(function () use ($data) {
            $package = Package::with('service')->findOrFail($data['package_id']);
            
            if (!$package->active) {
                throw new \Exception('This package is no longer available');
            }

            $quantity = $data['quantity'];
            
            // Validate quantity bounds
            if ($quantity < $package->min_quantity || $quantity > $package->max_quantity) {
                throw new \Exception("Quantity must be between {$package->min_quantity} and {$package->max_quantity}");
            }

            // Calculate price server-side (NEVER trust client price)
            $quote = $this->calculateQuote($package, $quantity, $data['coupon_code'] ?? null);
            
            $couponId = $quote['coupon'] ? Coupon::where('code', $quote['coupon']['code'])->first()?->id : null;

            $targetLinks = $data['target_links'] ?? null;
            $hasMultipleLinks = is_array($targetLinks) && count($targetLinks) > 1;

            if ($hasMultipleLinks) {
                // Multi-link order: create separate Order per link
                $groupId = Str::uuid()->toString();
                $orderNumber = Order::generateOrderNumber();
                $totalAmount = $quote['total'];
                $totalDiscount = $quote['discount'];
                $totalQuantity = array_sum(array_column($targetLinks, 'quantity'));
                $firstOrder = null;

                foreach ($targetLinks as $index => $link) {
                    $linkQuantity = $link['quantity'];
                    // Proportional amount based on quantity ratio
                    $ratio = $totalQuantity > 0 ? $linkQuantity / $totalQuantity : 1 / count($targetLinks);
                    $linkAmount = round($totalAmount * $ratio, 2);
                    $linkDiscount = round($totalDiscount * $ratio, 2);

                    $order = Order::create([
                        'order_number' => $orderNumber,
                        'group_id' => $groupId,
                        'user_id' => $data['user_id'] ?? null,
                        'package_id' => $package->id,
                        'guest_email' => $data['guest_email'] ?? null,
                        'target_link' => $link['url'],
                        'target_links' => $targetLinks,
                        'quantity' => $linkQuantity,
                        'amount' => $linkAmount,
                        'discount' => $linkDiscount,
                        'coupon_id' => $index === 0 ? $couponId : null, // Coupon only on first
                        'status' => 'pending',
                        'payment_status' => 'pending',
                    ]);

                    if ($index === 0) {
                        $firstOrder = $order;
                    }
                }

                // Increment coupon usage once
                if ($couponId) {
                    Coupon::find($couponId)->incrementUsage();
                }

                return $firstOrder->load('package.service');
            } else {
                // Single-link order (original behavior)
                $order = Order::create([
                    'user_id' => $data['user_id'] ?? null,
                    'package_id' => $package->id,
                    'guest_email' => $data['guest_email'] ?? null,
                    'target_link' => $data['target_link'],
                    'target_links' => $targetLinks,
                    'quantity' => $quantity,
                    'amount' => $quote['total'],
                    'discount' => $quote['discount'],
                    'coupon_id' => $couponId,
                    'status' => 'pending',
                    'payment_status' => 'pending',
                ]);

                // Increment coupon usage if used
                if ($order->coupon_id) {
                    Coupon::find($order->coupon_id)->incrementUsage();
                }

                return $order->load('package.service');
            }
        });
    }

    public function validateTargetLink(string $link, string $serviceType): bool
    {
        $patterns = [
            'views' => '/^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})(\S*)?$/',
            'subscribers' => '/^(https?:\/\/)?(www\.)?youtube\.com\/(channel\/UC[\w-]{22}|c\/[\w-]+|@[\w-]+|user\/[\w-]+)\/?$/',
            'watch_time' => '/^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})(\S*)?$/',
            'comments' => '/^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})(\S*)?$/',
            'likes' => '/^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})(\S*)?$/',
            'shares' => '/^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})(\S*)?$/',
        ];

        $pattern = $patterns[$serviceType] ?? $patterns['views'];
        
        return (bool) preg_match($pattern, $link);
    }
}
