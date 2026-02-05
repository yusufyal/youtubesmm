<?php

return [
    'stripe' => [
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
    ],

    'tap' => [
        'key' => env('TAP_PUBLISHABLE_KEY'),
        'secret' => env('TAP_SECRET_KEY'),
        'webhook_secret' => env('TAP_WEBHOOK_SECRET'),
    ],

    'smm_provider' => [
        'url' => env('SMM_PROVIDER_URL'),
        'api_key' => env('SMM_PROVIDER_API_KEY'),
    ],

    'turnstile' => [
        'secret' => env('TURNSTILE_SECRET_KEY'),
    ],
];
