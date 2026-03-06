<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min($request->get('per_page', 12), 50);

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

        $posts = $query->paginate($perPage);

        return $this->paginatedResponse($posts);
    }

    public function show(Post $post): JsonResponse
    {
        if (!$post->isPublished()) {
            return $this->errorResponse('Post not found', 404);
        }

        $post->load(['category', 'tags', 'author:id,name']);

        return $this->successResponse($post);
    }
}
