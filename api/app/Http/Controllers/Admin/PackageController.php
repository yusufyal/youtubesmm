<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Package;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class PackageController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Package::with(['service', 'provider'])->ordered();

        if ($request->has('service_id')) {
            $query->where('service_id', $request->service_id);
        }

        if ($request->has('active')) {
            $query->where('active', $request->boolean('active'));
        }

        $packages = $request->boolean('paginate', false)
            ? $query->paginate($request->get('per_page', 15))
            : $query->get();

        if ($request->boolean('paginate', false)) {
            return $this->paginatedResponse($packages);
        }

        return $this->successResponse($packages);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'service_id' => ['required', 'exists:services,id'],
            'name' => ['required', 'string', 'max:255'],
            'quantity' => ['required', 'integer', 'min:1'],
            'price' => ['required', 'numeric', 'min:0'],
            'original_price' => ['nullable', 'numeric', 'min:0'],
            'estimated_time' => ['nullable', 'string', 'max:100'],
            'min_quantity' => ['nullable', 'integer', 'min:1'],
            'max_quantity' => ['nullable', 'integer', 'min:1'],
            'refill_eligible' => ['boolean'],
            'refill_days' => ['nullable', 'integer', 'min:0'],
            'provider_id' => ['nullable', 'exists:providers,id'],
            'provider_service_id' => ['nullable', 'string', 'max:100'],
            'active' => ['boolean'],
            'features' => ['nullable', 'array'],
            'sort_order' => ['integer', 'min:0'],
        ]);

        $package = Package::create($validated);

        AuditLog::log('created', $package, null, $package->toArray());
        $this->clearServiceCache($package->service_id);

        return $this->successResponse($package->load('service'), 'Package created successfully', 201);
    }

    public function show(Package $package): JsonResponse
    {
        $package->load(['service', 'provider']);
        return $this->successResponse($package);
    }

    public function update(Request $request, Package $package): JsonResponse
    {
        $validated = $request->validate([
            'service_id' => ['sometimes', 'exists:services,id'],
            'name' => ['sometimes', 'string', 'max:255'],
            'quantity' => ['sometimes', 'integer', 'min:1'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'original_price' => ['nullable', 'numeric', 'min:0'],
            'estimated_time' => ['nullable', 'string', 'max:100'],
            'min_quantity' => ['nullable', 'integer', 'min:1'],
            'max_quantity' => ['nullable', 'integer', 'min:1'],
            'refill_eligible' => ['boolean'],
            'refill_days' => ['nullable', 'integer', 'min:0'],
            'provider_id' => ['nullable', 'exists:providers,id'],
            'provider_service_id' => ['nullable', 'string', 'max:100'],
            'active' => ['boolean'],
            'features' => ['nullable', 'array'],
            'sort_order' => ['integer', 'min:0'],
        ]);

        $oldValues = $package->toArray();
        $package->update($validated);

        AuditLog::log('updated', $package, $oldValues, $package->toArray());
        $this->clearServiceCache($package->service_id);

        return $this->successResponse($package->load('service'), 'Package updated successfully');
    }

    public function destroy(Package $package): JsonResponse
    {
        if ($package->orders()->exists()) {
            return $this->errorResponse('Cannot delete package with existing orders', 400);
        }

        AuditLog::log('deleted', $package, $package->toArray(), null);
        
        $serviceId = $package->service_id;
        $package->delete();
        $this->clearServiceCache($serviceId);

        return $this->successResponse(null, 'Package deleted successfully');
    }

    public function reorder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'exists:packages,id'],
            'items.*.sort_order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($validated['items'] as $item) {
            Package::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        Cache::forget('public.services.*');

        return $this->successResponse(null, 'Packages reordered successfully');
    }

    protected function clearServiceCache(int $serviceId): void
    {
        $service = \App\Models\Service::find($serviceId);
        if ($service) {
            Cache::forget("public.service.{$service->slug}");
        }
        Cache::forget('public.services.*');
    }
}
