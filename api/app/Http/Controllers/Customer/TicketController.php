<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\TicketReply;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min($request->get('per_page', 10), 50);

        $tickets = Ticket::with('order:id,order_number')
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->paginate($perPage);

        return $this->paginatedResponse($tickets);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
            'order_id' => ['nullable', 'exists:orders,id'],
            'priority' => ['nullable', 'in:low,medium,high,urgent'],
        ]);

        // Verify order belongs to user if provided
        if ($validated['order_id'] ?? false) {
            $orderBelongsToUser = $request->user()->orders()
                ->where('id', $validated['order_id'])
                ->exists();
            
            if (!$orderBelongsToUser) {
                return $this->errorResponse('Invalid order', 400);
            }
        }

        $ticket = Ticket::create([
            'user_id' => $request->user()->id,
            'order_id' => $validated['order_id'] ?? null,
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'status' => 'open',
            'priority' => $validated['priority'] ?? 'medium',
        ]);

        return $this->successResponse($ticket, 'Ticket created successfully', 201);
    }

    public function show(Request $request, Ticket $ticket): JsonResponse
    {
        if ($ticket->user_id !== $request->user()->id) {
            return $this->errorResponse('Ticket not found', 404);
        }

        $ticket->load(['replies.user:id,name', 'order:id,order_number']);

        return $this->successResponse($ticket);
    }

    public function reply(Request $request, Ticket $ticket): JsonResponse
    {
        if ($ticket->user_id !== $request->user()->id) {
            return $this->errorResponse('Ticket not found', 404);
        }

        if (!$ticket->isOpen()) {
            return $this->errorResponse('This ticket is closed', 400);
        }

        $validated = $request->validate([
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $reply = TicketReply::create([
            'ticket_id' => $ticket->id,
            'user_id' => $request->user()->id,
            'message' => $validated['message'],
            'is_admin' => false,
        ]);

        return $this->successResponse($reply, 'Reply added successfully', 201);
    }
}
