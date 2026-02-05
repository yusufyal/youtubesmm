<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\FAQ;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class FAQController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = FAQ::ordered();

        if ($request->has('active')) {
            $query->where('active', $request->boolean('active'));
        }

        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        $faqs = $query->get();

        return $this->successResponse($faqs);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'question' => ['required', 'string', 'max:500'],
            'answer' => ['required', 'string'],
            'category' => ['nullable', 'string', 'max:100'],
            'sort_order' => ['integer', 'min:0'],
            'active' => ['boolean'],
        ]);

        $faq = FAQ::create($validated);

        AuditLog::log('created', $faq, null, $faq->toArray());
        Cache::forget('public.faqs.*');

        return $this->successResponse($faq, 'FAQ created successfully', 201);
    }

    public function show(FAQ $faq): JsonResponse
    {
        return $this->successResponse($faq);
    }

    public function update(Request $request, FAQ $faq): JsonResponse
    {
        $validated = $request->validate([
            'question' => ['sometimes', 'string', 'max:500'],
            'answer' => ['sometimes', 'string'],
            'category' => ['nullable', 'string', 'max:100'],
            'sort_order' => ['integer', 'min:0'],
            'active' => ['boolean'],
        ]);

        $oldValues = $faq->toArray();
        $faq->update($validated);

        AuditLog::log('updated', $faq, $oldValues, $faq->toArray());
        Cache::forget('public.faqs.*');

        return $this->successResponse($faq, 'FAQ updated successfully');
    }

    public function destroy(FAQ $faq): JsonResponse
    {
        AuditLog::log('deleted', $faq, $faq->toArray(), null);
        
        $faq->delete();
        Cache::forget('public.faqs.*');

        return $this->successResponse(null, 'FAQ deleted successfully');
    }

    public function reorder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'exists:faqs,id'],
            'items.*.sort_order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($validated['items'] as $item) {
            FAQ::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        Cache::forget('public.faqs.*');

        return $this->successResponse(null, 'FAQs reordered successfully');
    }
}
