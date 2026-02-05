<?php

namespace App\Services;

use App\Models\Coupon;
use App\Models\Order;
use App\Models\Package;
use Illuminate\Support\Facades\DB;

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
            
            $order = Order::create([
                'user_id' => $data['user_id'] ?? null,
                'package_id' => $package->id,
                'guest_email' => $data['guest_email'] ?? null,
                'target_link' => $data['target_link'],
                'target_links' => $data['target_links'] ?? null,
                'quantity' => $quantity,
                'amount' => $quote['total'],
                'discount' => $quote['discount'],
                'coupon_id' => $quote['coupon'] ? Coupon::where('code', $quote['coupon']['code'])->first()?->id : null,
                'status' => 'pending',
                'payment_status' => 'pending',
            ]);

            // Increment coupon usage if used
            if ($order->coupon_id) {
                Coupon::find($order->coupon_id)->incrementUsage();
            }

            return $order->load('package.service');
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
