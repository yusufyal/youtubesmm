<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Public\ServiceController as PublicServiceController;
use App\Http\Controllers\Public\PostController as PublicPostController;
use App\Http\Controllers\Public\FAQController as PublicFAQController;
use App\Http\Controllers\Public\PageController as PublicPageController;
use App\Http\Controllers\Checkout\CheckoutController;
use App\Http\Controllers\Checkout\PaymentController;
use App\Http\Controllers\Customer\OrderController as CustomerOrderController;
use App\Http\Controllers\Customer\TicketController as CustomerTicketController;
use App\Http\Controllers\Customer\ProfileController;
use App\Http\Controllers\Admin\ServiceController as AdminServiceController;
use App\Http\Controllers\Admin\PackageController as AdminPackageController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\CouponController as AdminCouponController;
use App\Http\Controllers\Admin\PostController as AdminPostController;
use App\Http\Controllers\Admin\FAQController as AdminFAQController;
use App\Http\Controllers\Admin\PageController as AdminPageController;
use App\Http\Controllers\Admin\ProviderController as AdminProviderController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\SettingController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Health Check (for Railway/Docker)
|--------------------------------------------------------------------------
*/

Route::get('health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toIso8601String(),
    ]);
});

/*
|--------------------------------------------------------------------------
| Public Routes (No Auth Required)
|--------------------------------------------------------------------------
*/

// Public Service Routes
Route::prefix('public')->group(function () {
    Route::get('services', [PublicServiceController::class, 'index']);
    Route::get('services/{service:slug}', [PublicServiceController::class, 'show']);
    
    Route::get('posts', [PublicPostController::class, 'index']);
    Route::get('posts/{post:slug}', [PublicPostController::class, 'show']);
    
    Route::get('faqs', [PublicFAQController::class, 'index']);
    
    Route::get('pages/{page:slug}', [PublicPageController::class, 'show']);
});

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/

Route::prefix('auth')->middleware('throttle:auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('reset-password', [AuthController::class, 'resetPassword']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('user', [AuthController::class, 'user']);
    });
});

/*
|--------------------------------------------------------------------------
| Checkout Routes
|--------------------------------------------------------------------------
*/

Route::prefix('checkout')->middleware('throttle:checkout')->group(function () {
    Route::post('quote', [CheckoutController::class, 'quote']);
    Route::post('create-order', [CheckoutController::class, 'createOrder']);
    Route::post('validate-coupon', [CheckoutController::class, 'validateCoupon']);
});

// Payment Routes
Route::prefix('payments')->group(function () {
    // Payment intent creation - allow guest checkout (no auth required)
    Route::middleware(['throttle:checkout'])->group(function () {
        Route::post('stripe/create-intent', [PaymentController::class, 'createStripeIntent']);
        Route::post('tap/create-charge', [PaymentController::class, 'createTapCharge']);
        // Demo payment simulation (for testing without real Stripe keys)
        Route::post('demo/simulate', [PaymentController::class, 'simulateDemoPayment']);
    });
    
    // Webhooks (no auth, signature verified in controller)
    Route::post('stripe/webhook', [PaymentController::class, 'stripeWebhook'])
        ->withoutMiddleware(['throttle:api']);
    Route::post('tap/webhook', [PaymentController::class, 'tapWebhook'])
        ->withoutMiddleware(['throttle:api']);
});

/*
|--------------------------------------------------------------------------
| Customer Routes (Auth Required)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    // Profile
    Route::get('me', [ProfileController::class, 'show']);
    Route::put('me', [ProfileController::class, 'update']);
    Route::put('me/password', [ProfileController::class, 'updatePassword']);
    
    // Orders
    Route::prefix('my')->group(function () {
        Route::get('orders', [CustomerOrderController::class, 'index']);
        Route::get('orders/{order}', [CustomerOrderController::class, 'show']);
        Route::post('orders/{order}/refill', [CustomerOrderController::class, 'requestRefill']);
        
        // Tickets
        Route::get('tickets', [CustomerTicketController::class, 'index']);
        Route::post('tickets', [CustomerTicketController::class, 'store']);
        Route::get('tickets/{ticket}', [CustomerTicketController::class, 'show']);
        Route::post('tickets/{ticket}/reply', [CustomerTicketController::class, 'reply']);
    });
});

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

Route::prefix('admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
    // Services
    Route::apiResource('services', AdminServiceController::class);
    Route::post('services/reorder', [AdminServiceController::class, 'reorder']);
    
    // Packages
    Route::apiResource('packages', AdminPackageController::class);
    Route::post('packages/reorder', [AdminPackageController::class, 'reorder']);
    
    // Orders
    Route::get('orders', [AdminOrderController::class, 'index']);
    Route::get('orders/{order}', [AdminOrderController::class, 'show']);
    Route::patch('orders/{order}', [AdminOrderController::class, 'update']);
    Route::post('orders/{order}/resend', [AdminOrderController::class, 'resendToProvider']);
    Route::post('orders/{order}/refund', [AdminOrderController::class, 'refund']);
    
    // Users
    Route::apiResource('users', AdminUserController::class);
    
    // Coupons
    Route::apiResource('coupons', AdminCouponController::class);
    
    // Content Management
    Route::apiResource('posts', AdminPostController::class);
    Route::apiResource('faqs', AdminFAQController::class);
    Route::post('faqs/reorder', [AdminFAQController::class, 'reorder']);
    Route::apiResource('pages', AdminPageController::class);
    
    // Providers
    Route::apiResource('providers', AdminProviderController::class);
    Route::post('providers/{provider}/test', [AdminProviderController::class, 'test']);
    Route::get('providers/{provider}/services', [AdminProviderController::class, 'fetchServices']);
    
    // Reports
    Route::prefix('reports')->group(function () {
        Route::get('summary', [ReportController::class, 'summary']);
        Route::get('sales', [ReportController::class, 'sales']);
        Route::get('top-services', [ReportController::class, 'topServices']);
    });
    
    // Settings
    Route::get('settings', [SettingController::class, 'index']);
    Route::post('settings', [SettingController::class, 'update']);
    
    // Audit Logs
    Route::get('audit-logs', [SettingController::class, 'auditLogs']);
});
