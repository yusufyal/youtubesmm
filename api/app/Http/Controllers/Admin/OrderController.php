<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessOrderJob;
use App\Models\AuditLog;
use App\Models\Order;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min($request->get('per_page', 15), 100);

        $query = Order::with(['user:id,name,email', 'package.service', 'coupon'])
            ->orderByDesc('created_at');

        // Filters
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('order_number')) {
            $query->where('order_number', 'like', '%' . $request->order_number . '%');
        }

        if ($request->has('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $orders = $query->paginate($perPage);

        return $this->paginatedResponse($orders);
    }

    public function show(Order $order): JsonResponse
    {
        $order->load(['user', 'package.service', 'payment', 'coupon']);
        return $this->successResponse($order);
    }

    public function update(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['sometimes', 'in:pending,processing,in_progress,completed,partial,canceled,refunded'],
            'start_count' => ['nullable', 'integer', 'min:0'],
            'current_count' => ['nullable', 'integer', 'min:0'],
        ]);

        $oldValues = $order->only(['status', 'start_count', 'current_count']);
        
        if (isset($validated['status']) && $validated['status'] === 'completed') {
            $validated['completed_at'] = now();
        }

        $order->update($validated);

        AuditLog::log('updated', $order, $oldValues, $order->only(['status', 'start_count', 'current_count']));

        return $this->successResponse($order->fresh(['package.service']), 'Order updated successfully');
    }

    public function resendToProvider(Order $order): JsonResponse
    {
        if ($order->payment_status !== 'completed') {
            return $this->errorResponse('Cannot resend unpaid order', 400);
        }

        // Reset provider order ID to allow resending
        $order->update([
            'provider_order_id' => null,
            'status' => 'processing',
        ]);

        ProcessOrderJob::dispatch($order);

        AuditLog::log('resent_to_provider', $order);

        return $this->successResponse(null, 'Order queued for resending to provider');
    }

    public function refund(Request $request, Order $order, PaymentService $paymentService): JsonResponse
    {
        if ($order->payment_status !== 'completed') {
            return $this->errorResponse('Cannot refund unpaid order', 400);
        }

        if ($order->status === 'refunded') {
            return $this->errorResponse('Order already refunded', 400);
        }

        try {
            $refunded = $paymentService->refundPayment($order);

            if ($refunded) {
                AuditLog::log('refunded', $order);
                return $this->successResponse($order->fresh(), 'Order refunded successfully');
            }

            return $this->errorResponse('Refund failed', 500);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }
}
