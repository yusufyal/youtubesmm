<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min($request->get('per_page', 15), 100);

        $query = User::withCount('orders')->orderByDesc('created_at');

        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->paginate($perPage);

        return $this->paginatedResponse($users);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', Password::min(8)->mixedCase()->numbers()],
            'phone' => ['nullable', 'string', 'max:20'],
            'role' => ['required', 'in:customer,admin,super_admin,support'],
        ]);

        // Only super_admin can create other super_admins
        if ($validated['role'] === 'super_admin' && !$request->user()->isSuperAdmin()) {
            return $this->errorResponse('Only super admins can create other super admins', 403);
        }

        $validated['password'] = Hash::make($validated['password']);
        $user = User::create($validated);

        AuditLog::log('created', $user, null, $user->makeHidden('password')->toArray());

        return $this->successResponse($user, 'User created successfully', 201);
    }

    public function show(User $user): JsonResponse
    {
        $user->loadCount('orders');
        $user->load('orders', function ($query) {
            $query->latest()->limit(10);
        });

        return $this->successResponse($user);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'password' => ['sometimes', Password::min(8)->mixedCase()->numbers()],
            'phone' => ['nullable', 'string', 'max:20'],
            'role' => ['sometimes', 'in:customer,admin,super_admin,support'],
        ]);

        // Only super_admin can change roles to/from super_admin
        if (isset($validated['role'])) {
            if (($validated['role'] === 'super_admin' || $user->role === 'super_admin') 
                && !$request->user()->isSuperAdmin()) {
                return $this->errorResponse('Only super admins can modify super admin roles', 403);
            }
        }

        $oldValues = $user->makeHidden('password')->toArray();

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        AuditLog::log('updated', $user, $oldValues, $user->makeHidden('password')->toArray());

        return $this->successResponse($user, 'User updated successfully');
    }

    /**
     * Get all customers: registered users with role=customer + guest emails from orders.
     */
    public function customers(Request $request): JsonResponse
    {
        $perPage = min($request->get('per_page', 15), 100);
        $search = $request->get('search');

        // Get registered customers
        $registeredQuery = User::where('role', 'customer')
            ->withCount('orders')
            ->withSum('orders', 'amount')
            ->select('id', 'name', 'email', 'role', 'created_at', 'updated_at')
            ->selectRaw("'registered' as customer_type");

        if ($search) {
            $registeredQuery->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Get guest customers (unique guest_email from orders where user_id is null)
        $guestQuery = Order::whereNull('user_id')
            ->whereNotNull('guest_email')
            ->groupBy('guest_email')
            ->select(
                DB::raw('MIN(id) as id'),
                DB::raw("'' as name"),
                'guest_email as email',
                DB::raw("'customer' as role"),
                DB::raw('MIN(created_at) as created_at'),
                DB::raw('MAX(updated_at) as updated_at'),
                DB::raw('COUNT(*) as orders_count'),
                DB::raw('COALESCE(SUM(amount), 0) as orders_sum_amount'),
                DB::raw("'guest' as customer_type"),
            );

        if ($search) {
            $guestQuery->where('guest_email', 'like', "%{$search}%");
        }

        // Combine both: get registered first, then guests
        $registered = $registeredQuery->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'customer_type' => 'registered',
                'orders_count' => $user->orders_count ?? 0,
                'total_spent' => (float) ($user->orders_sum_amount ?? 0),
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ];
        });

        $guests = $guestQuery->get()->map(function ($row) {
            return [
                'id' => null,
                'name' => 'Guest',
                'email' => $row->email,
                'role' => 'customer',
                'customer_type' => 'guest',
                'orders_count' => (int) $row->orders_count,
                'total_spent' => (float) $row->orders_sum_amount,
                'created_at' => $row->created_at,
                'updated_at' => $row->updated_at,
            ];
        });

        // Merge and paginate manually
        $allCustomers = $registered->merge($guests)->sortByDesc('created_at')->values();
        $total = $allCustomers->count();
        $page = max(1, (int) $request->get('page', 1));
        $items = $allCustomers->slice(($page - 1) * $perPage, $perPage)->values();

        return response()->json([
            'data' => $items,
            'meta' => [
                'current_page' => $page,
                'last_page' => max(1, (int) ceil($total / $perPage)),
                'per_page' => $perPage,
                'total' => $total,
                'from' => $total > 0 ? (($page - 1) * $perPage) + 1 : null,
                'to' => min($page * $perPage, $total),
            ],
            'links' => [],
        ]);
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        if ($user->id === $request->user()->id) {
            return $this->errorResponse('Cannot delete yourself', 400);
        }

        if ($user->isSuperAdmin() && !$request->user()->isSuperAdmin()) {
            return $this->errorResponse('Only super admins can delete other super admins', 403);
        }

        if ($user->orders()->exists()) {
            // Soft delete or just deactivate instead
            return $this->errorResponse('Cannot delete user with orders. Consider deactivating instead.', 400);
        }

        AuditLog::log('deleted', $user, $user->makeHidden('password')->toArray(), null);
        
        $user->delete();

        return $this->successResponse(null, 'User deleted successfully');
    }
}
