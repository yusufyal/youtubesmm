<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class PageController extends Controller
{
    public function show(Page $page): JsonResponse
    {
        if (!$page->active) {
            return $this->errorResponse('Page not found', 404);
        }

        $cacheKey = "public.page.{$page->slug}";
        
        $pageData = Cache::remember($cacheKey, 3600, function () use ($page) {
            return $page;
        });

        return $this->successResponse($pageData);
    }
}
