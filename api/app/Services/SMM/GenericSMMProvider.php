<?php

namespace App\Services\SMM;

use App\Models\Provider;
use App\Services\SMM\Contracts\ProviderInterface;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Log;

class GenericSMMProvider implements ProviderInterface
{
    protected Client $client;
    protected string $apiKey;
    protected string $apiUrl;

    public function __construct(Provider $provider)
    {
        $this->apiUrl = rtrim($provider->api_url, '/');
        $this->apiKey = $provider->api_key;
        
        $this->client = new Client([
            'base_uri' => $this->apiUrl,
            'timeout' => 30,
            'headers' => [
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ],
        ]);
    }

    public function createOrder(array $data): array
    {
        try {
            $response = $this->client->post('/api/v2', [
                'form_params' => [
                    'key' => $this->apiKey,
                    'action' => 'add',
                    'service' => $data['service'],
                    'link' => $data['link'],
                    'quantity' => $data['quantity'],
                ],
            ]);

            $result = json_decode($response->getBody()->getContents(), true);

            if (isset($result['error'])) {
                throw new \Exception($result['error']);
            }

            return [
                'order_id' => $result['order'] ?? null,
                'status' => 'pending',
                'raw_response' => $result,
            ];
        } catch (GuzzleException $e) {
            Log::error('SMM Provider API error', [
                'action' => 'createOrder',
                'error' => $e->getMessage(),
            ]);
            throw new \Exception('Failed to create order with provider: ' . $e->getMessage());
        }
    }

    public function getOrderStatus(string $orderId): array
    {
        try {
            $response = $this->client->post('/api/v2', [
                'form_params' => [
                    'key' => $this->apiKey,
                    'action' => 'status',
                    'order' => $orderId,
                ],
            ]);

            $result = json_decode($response->getBody()->getContents(), true);

            if (isset($result['error'])) {
                throw new \Exception($result['error']);
            }

            return [
                'status' => $result['status'] ?? 'unknown',
                'start_count' => $result['start_count'] ?? null,
                'remains' => $result['remains'] ?? null,
                'currency' => $result['currency'] ?? 'USD',
                'charge' => $result['charge'] ?? null,
                'raw_response' => $result,
            ];
        } catch (GuzzleException $e) {
            Log::error('SMM Provider API error', [
                'action' => 'getOrderStatus',
                'order_id' => $orderId,
                'error' => $e->getMessage(),
            ]);
            throw new \Exception('Failed to get order status: ' . $e->getMessage());
        }
    }

    public function getBalance(): float
    {
        try {
            $response = $this->client->post('/api/v2', [
                'form_params' => [
                    'key' => $this->apiKey,
                    'action' => 'balance',
                ],
            ]);

            $result = json_decode($response->getBody()->getContents(), true);

            return (float) ($result['balance'] ?? 0);
        } catch (GuzzleException $e) {
            Log::error('SMM Provider API error', [
                'action' => 'getBalance',
                'error' => $e->getMessage(),
            ]);
            return 0;
        }
    }

    public function getServices(): array
    {
        try {
            $response = $this->client->post('/api/v2', [
                'form_params' => [
                    'key' => $this->apiKey,
                    'action' => 'services',
                ],
            ]);

            $result = json_decode($response->getBody()->getContents(), true);

            if (!is_array($result)) {
                return [];
            }

            return array_map(function ($service) {
                return [
                    'id' => $service['service'] ?? $service['id'] ?? null,
                    'name' => $service['name'] ?? '',
                    'type' => $service['type'] ?? '',
                    'category' => $service['category'] ?? '',
                    'rate' => $service['rate'] ?? 0,
                    'min' => $service['min'] ?? 0,
                    'max' => $service['max'] ?? 0,
                    'description' => $service['description'] ?? '',
                ];
            }, $result);
        } catch (GuzzleException $e) {
            Log::error('SMM Provider API error', [
                'action' => 'getServices',
                'error' => $e->getMessage(),
            ]);
            return [];
        }
    }
}
