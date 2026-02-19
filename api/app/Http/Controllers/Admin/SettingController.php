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

    private const KEY_GROUP_MAP = [
        'site_name' => 'general',
        'site_url' => 'general',
        'support_email' => 'general',
        'stripe_enabled' => 'payment',
        'stripe_public_key' => 'payment',
        'stripe_secret_key' => 'payment',
        'tap_enabled' => 'payment',
        'tap_public_key' => 'payment',
        'tap_secret_key' => 'payment',
        'default_seo_title' => 'seo',
        'default_meta_description' => 'seo',
        'google_analytics_id' => 'seo',
        'google_site_verification' => 'seo',
        'facebook_pixel_id' => 'seo',
        'order_notification_email' => 'notifications',
        'low_balance_alert' => 'notifications',
        'low_balance_threshold' => 'notifications',
    ];

    public function update(Request $request): JsonResponse
    {
        try {
            $settings = $request->input('settings');

            if (!is_array($settings)) {
                return $this->errorResponse('Settings must be an array', 422);
            }

            // Normalize: accept both flat object {key: value} and array [{key, value, group}]
            $isFlatObject = !empty($settings) && !array_is_list($settings);
            if ($isFlatObject) {
                $normalized = [];
                foreach ($settings as $key => $value) {
                    $normalized[] = [
                        'key' => (string) $key,
                        'value' => $value,
                        'group' => self::KEY_GROUP_MAP[$key] ?? 'general',
                    ];
                }
                $settings = $normalized;
            }

            foreach ($settings as $setting) {
                if (empty($setting['key']) || !is_string($setting['key'])) {
                    continue;
                }

                $key = $setting['key'];
                $value = $setting['value'] ?? '';
                $group = $setting['group'] ?? self::KEY_GROUP_MAP[$key] ?? 'general';

                Setting::set($key, $value, $group);

                try {
                    AuditLog::log('setting_updated', null, ['key' => $key], ['key' => $key, 'value' => is_scalar($value) ? $value : json_encode($value)]);
                } catch (\Throwable $e) {
                    // Don't let audit logging break the save
                }
            }

            try {
                Setting::clearCache();
            } catch (\Throwable $e) {
                // Don't let cache clearing break the response
            }

            return $this->successResponse(null, 'Settings updated successfully');
        } catch (\Throwable $e) {
            return $this->errorResponse('Failed to save settings: ' . $e->getMessage(), 500);
        }
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
