<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
