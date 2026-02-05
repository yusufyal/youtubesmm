<?php

namespace App\Services\SMM;

use App\Models\Provider;
use App\Services\SMM\Contracts\ProviderInterface;

class ProviderFactory
{
    /**
     * Provider adapter mapping
     */
    protected array $adapters = [
        'generic' => GenericSMMProvider::class,
        // Add specific provider adapters here
        // 'smmpanel' => SMMPanelProvider::class,
        // 'smmworld' => SMMWorldProvider::class,
    ];

    /**
     * Create a provider adapter instance
     */
    public function make(Provider $provider): ProviderInterface
    {
        $adapterClass = $this->adapters[$provider->slug] ?? $this->adapters['generic'];

        return new $adapterClass($provider);
    }

    /**
     * Register a new provider adapter
     */
    public function register(string $slug, string $adapterClass): void
    {
        if (!is_subclass_of($adapterClass, ProviderInterface::class)) {
            throw new \InvalidArgumentException(
                "Adapter class must implement " . ProviderInterface::class
            );
        }

        $this->adapters[$slug] = $adapterClass;
    }
}
