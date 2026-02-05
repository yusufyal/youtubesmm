<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class PostController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min($request->get('per_page', 12), 50);
        $cacheKey = 'public.posts.' . md5($request->fullUrl());
        
        $posts = Cache::remember($cacheKey, 1800, function () use ($request, $perPage) {
            $query = Post::with(['category', 'author:id,name'])
                ->published()
                ->ordered();
            
            if ($request->has('category')) {
                $query->whereHas('category', function ($q) use ($request) {
                    $q->where('slug', $request->category);
                });
            }
            
            if ($request->has('tag')) {
                $query->whereHas('tags', function ($q) use ($request) {
                    $q->where('slug', $request->tag);
                });
            }
            
            return $query->paginate($perPage);
        });

        return $this->paginatedResponse($posts);
    }

    public function show(Post $post): JsonResponse
    {
        if (!$post->isPublished()) {
            return $this->errorResponse('Post not found', 404);
        }

        $cacheKey = "public.post.{$post->slug}";
        
        $postData = Cache::remember($cacheKey, 1800, function () use ($post) {
            return $post->load(['category', 'tags', 'author:id,name']);
        });

        return $this->successResponse($postData);
    }
}
