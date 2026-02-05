<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\FAQ;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class FAQController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $cacheKey = 'public.faqs.' . md5($request->fullUrl());
        
        $faqs = Cache::remember($cacheKey, 3600, function () use ($request) {
            $query = FAQ::active()->ordered();
            
            if ($request->has('category')) {
                $query->byCategory($request->category);
            }
            
            return $query->get();
        });

        // Group by category if requested
        if ($request->boolean('grouped', true)) {
            $grouped = $faqs->groupBy('category')->map(function ($items, $category) {
                return [
                    'category' => $category ?: 'General',
                    'items' => $items,
                ];
            })->values();
            
            return $this->successResponse($grouped);
        }

        return $this->successResponse($faqs);
    }
}
