<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ServiceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        // Skip cache in development or if no-cache header is present
        $skipCache = app()->environment('local') || $request->header('Cache-Control') === 'no-cache';
        $cacheKey = 'public.services.' . md5($request->fullUrl());
        
        $fetchServices = function () use ($request) {
            $query = Service::with(['activePackages' => function ($q) {
                    $q->orderBy('sort_order')->orderBy('price');
                }])
                ->active()
                ->ordered();
            
            if ($request->has('platform')) {
                $query->byPlatform($request->platform);
            }
            
            if ($request->has('type')) {
                $query->where('type', $request->type);
            }
            
            return $query->get()->map(function ($service) {
                $data = $service->toArray();
                // Map active_packages to packages for frontend compatibility
                $data['packages'] = $data['active_packages'] ?? [];
                unset($data['active_packages']);
                return $data;
            });
        };
        
        $services = $skipCache ? $fetchServices() : Cache::remember($cacheKey, 3600, $fetchServices);

        return $this->successResponse($services);
    }

    public function show(Service $service): JsonResponse
    {
        if (!$service->active) {
            return $this->errorResponse('Service not found', 404);
        }

        // Skip cache in development
        $skipCache = app()->environment('local');
        $cacheKey = "public.service.{$service->slug}";
        
        $fetchService = function () use ($service) {
            $service->load(['activePackages' => function ($q) {
                $q->orderBy('sort_order')->orderBy('price');
            }]);
            
            $data = $service->toArray();
            // Map active_packages to packages for frontend compatibility
            $data['packages'] = $data['active_packages'] ?? [];
            unset($data['active_packages']);
            return $data;
        };
        
        $serviceData = $skipCache ? $fetchService() : Cache::remember($cacheKey, 3600, $fetchService);

        return $this->successResponse($serviceData);
    }
}
