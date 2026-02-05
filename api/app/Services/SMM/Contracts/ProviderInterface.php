<?php

namespace App\Services\SMM\Contracts;

interface ProviderInterface
{
    /**
     * Create a new order with the SMM provider
     *
     * @param array $data ['service' => string, 'link' => string, 'quantity' => int]
     * @return array ['order_id' => string, 'status' => string, ...]
     */
    public function createOrder(array $data): array;

    /**
     * Get the status of an order
     *
     * @param string $orderId The provider's order ID
     * @return array ['status' => string, 'start_count' => int, 'remains' => int, ...]
     */
    public function getOrderStatus(string $orderId): array;

    /**
     * Get account balance
     *
     * @return float
     */
    public function getBalance(): float;

    /**
     * Get list of available services from provider
     *
     * @return array
     */
    public function getServices(): array;
}
