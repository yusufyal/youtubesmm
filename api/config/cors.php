<?php

$allowedOrigins = array_filter([
    env('FRONTEND_URL', 'http://localhost:4200'),
    env('ADMIN_URL', 'http://localhost:4300'),
    'http://localhost:4200',
    'http://localhost:4300',
    'http://127.0.0.1:4200',
    'http://127.0.0.1:4300',
    'https://growmediafans.com',
    'https://www.growmediafans.com',
    'https://admin.growmediafans.com',
    'https://panel.growmediafans.com',
    'https://backend.growmediafans.com',
    'https://api.growmediafans.com',
]);

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => $allowedOrigins,

    'allowed_origins_patterns' => [
        '#^https://.*\.up\.railway\.app$#',
        '#^https://.*\.railway\.app$#',
        '#^https://.*\.growmediafans\.com$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
