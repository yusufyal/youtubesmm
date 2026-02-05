<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $group = $request->get('group');

        if ($group) {
            $settings = Setting::getByGroup($group);
        } else {
            $settings = Setting::all()->groupBy('group')->map(function ($items) {
                return $items->pluck('value', 'key');
            });
        }

        return $this->successResponse($settings);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'settings' => ['required', 'array'],
            'settings.*.key' => ['required', 'string', 'max:100'],
            'settings.*.value' => ['required'],
            'settings.*.group' => ['nullable', 'string', 'max:50'],
        ]);

        foreach ($validated['settings'] as $setting) {
            $oldSetting = Setting::where('key', $setting['key'])->first();
            $oldValue = $oldSetting?->value;

            Setting::set(
                $setting['key'],
                $setting['value'],
                $setting['group'] ?? 'general'
            );

            AuditLog::log('setting_updated', null, ['key' => $setting['key'], 'value' => $oldValue], ['key' => $setting['key'], 'value' => $setting['value']]);
        }

        Setting::clearCache();

        return $this->successResponse(null, 'Settings updated successfully');
    }

    public function auditLogs(Request $request): JsonResponse
    {
        $perPage = min($request->get('per_page', 50), 100);

        $query = AuditLog::with('user:id,name,email')
            ->orderByDesc('created_at');

        if ($request->has('action')) {
            $query->byAction($request->action);
        }

        if ($request->has('user_id')) {
            $query->byUser($request->user_id);
        }

        if ($request->has('model_type')) {
            $query->where('model_type', $request->model_type);
        }

        if ($request->has('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $logs = $query->paginate($perPage);

        return $this->paginatedResponse($logs);
    }
}
