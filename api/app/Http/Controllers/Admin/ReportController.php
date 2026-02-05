<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function summary(): JsonResponse
    {
        $today = now()->startOfDay();
        $yesterday = now()->subDay()->startOfDay();
        $weekStart = now()->startOfWeek();
        $monthStart = now()->startOfMonth();

        $summary = [
            'revenue' => [
                'today' => Order::paid()->whereDate('created_at', $today)->sum('amount'),
                'yesterday' => Order::paid()->whereDate('created_at', $yesterday)->sum('amount'),
                'this_week' => Order::paid()->where('created_at', '>=', $weekStart)->sum('amount'),
                'this_month' => Order::paid()->where('created_at', '>=', $monthStart)->sum('amount'),
            ],
            'orders' => [
                'total' => Order::count(),
                'paid' => Order::paid()->count(),
                'pending' => Order::where('payment_status', 'pending')->count(),
                'completed' => Order::completed()->count(),
                'processing' => Order::processing()->count(),
            ],
            'users' => [
                'total' => User::where('role', 'customer')->count(),
                'new_today' => User::where('role', 'customer')->whereDate('created_at', $today)->count(),
                'new_this_week' => User::where('role', 'customer')->where('created_at', '>=', $weekStart)->count(),
            ],
            'conversion' => $this->calculateConversionRate(),
        ];

        return $this->successResponse($summary);
    }

    public function sales(Request $request): JsonResponse
    {
        $days = min($request->get('days', 30), 90);
        $startDate = now()->subDays($days)->startOfDay();

        $dailySales = Order::paid()
            ->where('created_at', '>=', $startDate)
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as orders'),
                DB::raw('SUM(amount) as revenue')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'orders' => (int) $item->orders,
                    'revenue' => (float) $item->revenue,
                ];
            });

        // Fill in missing dates with zeros
        $filledData = collect();
        $currentDate = $startDate->copy();
        $endDate = now();

        while ($currentDate <= $endDate) {
            $dateString = $currentDate->format('Y-m-d');
            $existingData = $dailySales->firstWhere('date', $dateString);
            
            $filledData->push([
                'date' => $dateString,
                'orders' => $existingData['orders'] ?? 0,
                'revenue' => $existingData['revenue'] ?? 0,
            ]);
            
            $currentDate->addDay();
        }

        return $this->successResponse($filledData);
    }

    public function topServices(Request $request): JsonResponse
    {
        $days = min($request->get('days', 30), 90);
        $limit = min($request->get('limit', 10), 20);
        $startDate = now()->subDays($days)->startOfDay();

        $topServices = Order::paid()
            ->where('orders.created_at', '>=', $startDate)
            ->join('packages', 'orders.package_id', '=', 'packages.id')
            ->join('services', 'packages.service_id', '=', 'services.id')
            ->select(
                'services.id',
                'services.name',
                'services.slug',
                DB::raw('COUNT(orders.id) as total_orders'),
                DB::raw('SUM(orders.amount) as total_revenue')
            )
            ->groupBy('services.id', 'services.name', 'services.slug')
            ->orderByDesc('total_revenue')
            ->limit($limit)
            ->get()
            ->map(function ($item) {
                return [
                    'service_id' => $item->id,
                    'service_name' => $item->name,
                    'service_slug' => $item->slug,
                    'total_orders' => (int) $item->total_orders,
                    'total_revenue' => (float) $item->total_revenue,
                ];
            });

        return $this->successResponse($topServices);
    }

    protected function calculateConversionRate(): array
    {
        $total = Order::count();
        $paid = Order::paid()->count();

        return [
            'rate' => $total > 0 ? round(($paid / $total) * 100, 2) : 0,
            'total_orders' => $total,
            'paid_orders' => $paid,
        ];
    }
}
