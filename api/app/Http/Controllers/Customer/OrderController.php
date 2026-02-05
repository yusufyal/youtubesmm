<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Ticket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min($request->get('per_page', 10), 50);

        $orders = Order::with(['package.service'])
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->paginate($perPage);

        return $this->paginatedResponse($orders);
    }

    public function show(Request $request, Order $order): JsonResponse
    {
        if ($order->user_id !== $request->user()->id) {
            return $this->errorResponse('Order not found', 404);
        }

        $order->load(['package.service', 'payment', 'coupon']);

        return $this->successResponse($order);
    }

    public function requestRefill(Request $request, Order $order): JsonResponse
    {
        if ($order->user_id !== $request->user()->id) {
            return $this->errorResponse('Order not found', 404);
        }

        if (!$order->canBeRefilled()) {
            return $this->errorResponse('This order is not eligible for refill', 400);
        }

        // Create a support ticket for refill request
        $ticket = Ticket::create([
            'user_id' => $request->user()->id,
            'order_id' => $order->id,
            'subject' => "Refill Request - Order #{$order->order_number}",
            'message' => "Requesting refill for order #{$order->order_number}. Target: {$order->target_link}",
            'status' => 'open',
            'priority' => 'medium',
        ]);

        return $this->successResponse([
            'ticket_id' => $ticket->id,
            'message' => 'Refill request submitted successfully. Our team will process it shortly.',
        ]);
    }
}
