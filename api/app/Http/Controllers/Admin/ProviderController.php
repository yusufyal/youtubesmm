<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Provider;
use App\Services\ProviderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProviderController extends Controller
{
    public function __construct(
        protected ProviderService $providerService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $query = Provider::withCount('packages')->orderBy('name');

        if ($request->has('active')) {
            $query->where('active', $request->boolean('active'));
        }

        $providers = $query->get();

        // Get balance for active providers
        foreach ($providers as $provider) {
            if ($provider->active) {
                try {
                    $provider->balance = $this->providerService->getProviderBalance($provider);
                } catch (\Exception $e) {
                    $provider->balance = null;
                }
            }
        }

        return $this->successResponse($providers);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:providers'],
            'api_url' => ['required', 'url', 'max:500'],
            'api_key' => ['required', 'string'],
            'active' => ['boolean'],
            'settings' => ['nullable', 'array'],
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $provider = Provider::create($validated);

        AuditLog::log('created', $provider, null, $provider->makeHidden('api_key')->toArray());

        return $this->successResponse($provider->makeHidden('api_key'), 'Provider created successfully', 201);
    }

    public function show(Provider $provider): JsonResponse
    {
        $provider->loadCount('packages');
        return $this->successResponse($provider->makeHidden('api_key'));
    }

    public function update(Request $request, Provider $provider): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'slug' => ['sometimes', 'string', 'max:255', 'unique:providers,slug,' . $provider->id],
            'api_url' => ['sometimes', 'url', 'max:500'],
            'api_key' => ['sometimes', 'string'],
            'active' => ['boolean'],
            'settings' => ['nullable', 'array'],
        ]);

        $oldValues = $provider->makeHidden('api_key')->toArray();
        $provider->update($validated);

        AuditLog::log('updated', $provider, $oldValues, $provider->makeHidden('api_key')->toArray());

        return $this->successResponse($provider->makeHidden('api_key'), 'Provider updated successfully');
    }

    public function destroy(Provider $provider): JsonResponse
    {
        if ($provider->packages()->exists()) {
            return $this->errorResponse('Cannot delete provider with associated packages', 400);
        }

        AuditLog::log('deleted', $provider, $provider->makeHidden('api_key')->toArray(), null);
        
        $provider->delete();

        return $this->successResponse(null, 'Provider deleted successfully');
    }

    public function test(Provider $provider): JsonResponse
    {
        try {
            $balance = $this->providerService->getProviderBalance($provider);

            return $this->successResponse([
                'success' => true,
                'balance' => $balance,
                'message' => 'Connection successful',
            ]);
        } catch (\Exception $e) {
            return $this->errorResponse('Connection failed: ' . $e->getMessage(), 400);
        }
    }

    public function fetchServices(Provider $provider): JsonResponse
    {
        try {
            $services = $this->providerService->getProviderServices($provider);

            return $this->successResponse($services);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to fetch services: ' . $e->getMessage(), 400);
        }
    }
}
