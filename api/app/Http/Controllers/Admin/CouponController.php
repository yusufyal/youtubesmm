<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Coupon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CouponController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min($request->get('per_page', 15), 100);

        $query = Coupon::withCount('orders')->orderByDesc('created_at');

        if ($request->has('active')) {
            $query->where('active', $request->boolean('active'));
        }

        if ($request->has('code')) {
            $query->where('code', 'like', '%' . $request->code . '%');
        }

        $coupons = $query->paginate($perPage);

        return $this->paginatedResponse($coupons);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => ['nullable', 'string', 'max:50', 'unique:coupons'],
            'type' => ['required', 'in:percentage,fixed'],
            'value' => ['required', 'numeric', 'min:0'],
            'min_order' => ['nullable', 'numeric', 'min:0'],
            'max_discount' => ['nullable', 'numeric', 'min:0'],
            'usage_limit' => ['nullable', 'integer', 'min:1'],
            'starts_at' => ['nullable', 'date'],
            'expires_at' => ['nullable', 'date', 'after:starts_at'],
            'active' => ['boolean'],
        ]);

        if (empty($validated['code'])) {
            $validated['code'] = strtoupper(Str::random(8));
        }

        // Validate percentage is not over 100
        if ($validated['type'] === 'percentage' && $validated['value'] > 100) {
            return $this->errorResponse('Percentage discount cannot exceed 100%', 400);
        }

        $coupon = Coupon::create($validated);

        AuditLog::log('created', $coupon, null, $coupon->toArray());

        return $this->successResponse($coupon, 'Coupon created successfully', 201);
    }

    public function show(Coupon $coupon): JsonResponse
    {
        $coupon->loadCount('orders');
        return $this->successResponse($coupon);
    }

    public function update(Request $request, Coupon $coupon): JsonResponse
    {
        $validated = $request->validate([
            'code' => ['sometimes', 'string', 'max:50', 'unique:coupons,code,' . $coupon->id],
            'type' => ['sometimes', 'in:percentage,fixed'],
            'value' => ['sometimes', 'numeric', 'min:0'],
            'min_order' => ['nullable', 'numeric', 'min:0'],
            'max_discount' => ['nullable', 'numeric', 'min:0'],
            'usage_limit' => ['nullable', 'integer', 'min:1'],
            'starts_at' => ['nullable', 'date'],
            'expires_at' => ['nullable', 'date'],
            'active' => ['boolean'],
        ]);

        $type = $validated['type'] ?? $coupon->type;
        $value = $validated['value'] ?? $coupon->value;

        if ($type === 'percentage' && $value > 100) {
            return $this->errorResponse('Percentage discount cannot exceed 100%', 400);
        }

        $oldValues = $coupon->toArray();
        $coupon->update($validated);

        AuditLog::log('updated', $coupon, $oldValues, $coupon->toArray());

        return $this->successResponse($coupon, 'Coupon updated successfully');
    }

    public function destroy(Coupon $coupon): JsonResponse
    {
        if ($coupon->orders()->exists()) {
            return $this->errorResponse('Cannot delete coupon that has been used. Consider deactivating instead.', 400);
        }

        AuditLog::log('deleted', $coupon, $coupon->toArray(), null);
        
        $coupon->delete();

        return $this->successResponse(null, 'Coupon deleted successfully');
    }
}
