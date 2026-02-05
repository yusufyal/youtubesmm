<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class ServiceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Service::with('packages')->ordered();

        if ($request->has('platform')) {
            $query->byPlatform($request->platform);
        }

        if ($request->has('active')) {
            $query->where('active', $request->boolean('active'));
        }

        $services = $request->boolean('paginate', false)
            ? $query->paginate($request->get('per_page', 15))
            : $query->get();

        if ($request->boolean('paginate', false)) {
            return $this->paginatedResponse($services);
        }

        return $this->successResponse($services);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:services'],
            'platform' => ['required', 'in:youtube,instagram,tiktok,twitter'],
            'type' => ['required', 'in:views,subscribers,watch_time,comments,likes,shares'],
            'description' => ['nullable', 'string'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'icon' => ['nullable', 'string', 'max:100'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'schema_data' => ['nullable', 'array'],
            'active' => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $service = Service::create($validated);

        AuditLog::log('created', $service, null, $service->toArray());
        Cache::forget('public.services.*');

        return $this->successResponse($service, 'Service created successfully', 201);
    }

    public function show(Service $service): JsonResponse
    {
        $service->load('packages');
        return $this->successResponse($service);
    }

    public function update(Request $request, Service $service): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'slug' => ['sometimes', 'string', 'max:255', 'unique:services,slug,' . $service->id],
            'platform' => ['sometimes', 'in:youtube,instagram,tiktok,twitter'],
            'type' => ['sometimes', 'in:views,subscribers,watch_time,comments,likes,shares'],
            'description' => ['nullable', 'string'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'icon' => ['nullable', 'string', 'max:100'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'schema_data' => ['nullable', 'array'],
            'active' => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
        ]);

        $oldValues = $service->toArray();
        $service->update($validated);

        AuditLog::log('updated', $service, $oldValues, $service->toArray());
        Cache::forget("public.service.{$service->slug}");
        Cache::forget('public.services.*');

        return $this->successResponse($service, 'Service updated successfully');
    }

    public function destroy(Service $service): JsonResponse
    {
        if ($service->packages()->exists()) {
            return $this->errorResponse('Cannot delete service with packages. Delete packages first.', 400);
        }

        AuditLog::log('deleted', $service, $service->toArray(), null);
        
        $service->delete();
        Cache::forget('public.services.*');

        return $this->successResponse(null, 'Service deleted successfully');
    }

    public function reorder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'exists:services,id'],
            'items.*.sort_order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($validated['items'] as $item) {
            Service::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        Cache::forget('public.services.*');

        return $this->successResponse(null, 'Services reordered successfully');
    }
}
