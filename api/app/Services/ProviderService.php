<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Provider;
use App\Services\SMM\Contracts\ProviderInterface;
use App\Services\SMM\ProviderFactory;
use Illuminate\Support\Facades\Log;

class ProviderService
{
    public function __construct(
        protected ProviderFactory $factory
    ) {}

    public function sendOrderToProvider(Order $order): array
    {
        $package = $order->package;
        
        if (!$package->provider_id || !$package->provider_service_id) {
            throw new \Exception('Package has no provider configured');
        }

        $provider = Provider::findOrFail($package->provider_id);
        
        if (!$provider->active) {
            throw new \Exception('Provider is not active');
        }

        $adapter = $this->factory->make($provider);

        Log::info('Sending order to provider', [
            'order_id' => $order->id,
            'provider' => $provider->slug,
            'service_id' => $package->provider_service_id,
        ]);

        $response = $adapter->createOrder([
            'service' => $package->provider_service_id,
            'link' => $order->target_link,
            'quantity' => $order->quantity,
        ]);

        Log::info('Provider response', [
            'order_id' => $order->id,
            'response' => $response,
        ]);

        return $response;
    }

    public function getOrderStatus(Order $order): array
    {
        if (!$order->provider_order_id) {
            throw new \Exception('Order has no provider order ID');
        }

        $package = $order->package;
        $provider = Provider::findOrFail($package->provider_id);
        $adapter = $this->factory->make($provider);

        return $adapter->getOrderStatus($order->provider_order_id);
    }

    public function syncOrderStatus(Order $order): void
    {
        try {
            $status = $this->getOrderStatus($order);

            $updateData = [
                'provider_response' => $status,
            ];

            // Map provider status to our status
            $providerStatus = strtolower($status['status'] ?? '');
            
            switch ($providerStatus) {
                case 'completed':
                case 'complete':
                    $updateData['status'] = 'completed';
                    $updateData['completed_at'] = now();
                    break;
                case 'partial':
                    $updateData['status'] = 'partial';
                    break;
                case 'in progress':
                case 'inprogress':
                case 'processing':
                    $updateData['status'] = 'in_progress';
                    break;
                case 'canceled':
                case 'cancelled':
                    $updateData['status'] = 'canceled';
                    break;
                case 'refunded':
                    $updateData['status'] = 'refunded';
                    break;
            }

            // Update counts if available
            if (isset($status['start_count'])) {
                $updateData['start_count'] = (int) $status['start_count'];
            }
            if (isset($status['remains'])) {
                $updateData['current_count'] = $order->start_count + ($order->quantity - (int) $status['remains']);
            }

            $order->update($updateData);

            Log::info('Order status synced', [
                'order_id' => $order->id,
                'status' => $updateData['status'] ?? $order->status,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to sync order status', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function getProviderBalance(Provider $provider): float
    {
        $adapter = $this->factory->make($provider);
        return $adapter->getBalance();
    }

    public function getProviderServices(Provider $provider): array
    {
        $adapter = $this->factory->make($provider);
        return $adapter->getServices();
    }
}
