<?php

namespace App\Jobs;

use App\Models\Order;
use App\Services\ProviderService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SyncOrderStatusJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 1;
    public int $timeout = 300; // 5 minutes max

    public function handle(ProviderService $providerService): void
    {
        Log::info('SyncOrderStatusJob: Starting order status sync');

        // Get all orders that need status check
        $orders = Order::with('package.provider')
            ->whereNotNull('provider_order_id')
            ->whereIn('status', ['processing', 'in_progress'])
            ->where('payment_status', 'completed')
            ->orderBy('created_at', 'asc')
            ->limit(100) // Process in batches
            ->get();

        Log::info('SyncOrderStatusJob: Found orders to sync', ['count' => $orders->count()]);

        foreach ($orders as $order) {
            try {
                $providerService->syncOrderStatus($order);
                
                // Small delay to avoid rate limiting
                usleep(100000); // 100ms
            } catch (\Exception $e) {
                Log::error('SyncOrderStatusJob: Failed to sync order', [
                    'order_id' => $order->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        Log::info('SyncOrderStatusJob: Completed');
    }
}
