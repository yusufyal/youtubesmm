<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Page;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class PageController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Page::orderBy('title');

        if ($request->has('active')) {
            $query->where('active', $request->boolean('active'));
        }

        $pages = $query->get();

        return $this->successResponse($pages);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:pages'],
            'content' => ['required', 'string'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'active' => ['boolean'],
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $page = Page::create($validated);

        AuditLog::log('created', $page, null, $page->toArray());

        return $this->successResponse($page, 'Page created successfully', 201);
    }

    public function show(Page $page): JsonResponse
    {
        return $this->successResponse($page);
    }

    public function update(Request $request, Page $page): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'slug' => ['sometimes', 'string', 'max:255', 'unique:pages,slug,' . $page->id],
            'content' => ['sometimes', 'string'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'active' => ['boolean'],
        ]);

        $oldValues = $page->toArray();
        $page->update($validated);

        AuditLog::log('updated', $page, $oldValues, $page->toArray());
        Cache::forget("public.page.{$page->slug}");

        return $this->successResponse($page, 'Page updated successfully');
    }

    public function destroy(Page $page): JsonResponse
    {
        // Protect certain essential pages
        $protectedSlugs = ['privacy-policy', 'terms-of-service', 'refund-policy'];
        if (in_array($page->slug, $protectedSlugs)) {
            return $this->errorResponse('Cannot delete protected pages', 400);
        }

        AuditLog::log('deleted', $page, $page->toArray(), null);
        
        $page->delete();

        return $this->successResponse(null, 'Page deleted successfully');
    }
}
