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

class ProcessOrderJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public array $backoff = [60, 300, 900]; // 1min, 5min, 15min

    public function __construct(
        public Order $order
    ) {}

    public function handle(ProviderService $providerService): void
    {
        // Reload order with relationships
        $this->order->load('package.provider');

        if ($this->order->payment_status !== 'completed') {
            Log::warning('ProcessOrderJob: Order not paid', ['order_id' => $this->order->id]);
            return;
        }

        if ($this->order->provider_order_id) {
            Log::info('ProcessOrderJob: Order already sent to provider', [
                'order_id' => $this->order->id,
                'provider_order_id' => $this->order->provider_order_id,
            ]);
            return;
        }

        try {
            Log::info('ProcessOrderJob: Sending order to provider', [
                'order_id' => $this->order->id,
            ]);

            $result = $providerService->sendOrderToProvider($this->order);

            $this->order->update([
                'provider_order_id' => $result['order_id'],
                'provider_response' => $result,
                'status' => 'processing',
            ]);

            Log::info('ProcessOrderJob: Order sent successfully', [
                'order_id' => $this->order->id,
                'provider_order_id' => $result['order_id'],
            ]);
        } catch (\Exception $e) {
            Log::error('ProcessOrderJob: Failed to process order', [
                'order_id' => $this->order->id,
                'error' => $e->getMessage(),
                'attempt' => $this->attempts(),
            ]);

            // Re-throw to trigger retry
            throw $e;
        }
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('ProcessOrderJob: All retries exhausted', [
            'order_id' => $this->order->id,
            'error' => $exception->getMessage(),
        ]);

        // Optionally notify admin or mark order for manual review
        $this->order->update([
            'provider_response' => [
                'error' => $exception->getMessage(),
                'failed_at' => now()->toIso8601String(),
            ],
        ]);
    }
}
