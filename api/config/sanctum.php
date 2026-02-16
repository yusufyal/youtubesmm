<?php

use Laravel\Sanctum\Sanctum;

$statefulDomains = env('SANCTUM_STATEFUL_DOMAINS', sprintf(
    '%s%s%s%s',
    'localhost,localhost:4200,localhost:4300,localhost:8888,127.0.0.1,127.0.0.1:4200,127.0.0.1:4300,127.0.0.1:8888,::1',
    ',website-production-f74a.up.railway.app,adminpanel-production-b348.up.railway.app,youtubesmm-production.up.railway.app',
    ',growmediafans.com,www.growmediafans.com,admin.growmediafans.com,panel.growmediafans.com,backend.growmediafans.com,api.growmediafans.com',
    ',' . Sanctum::currentApplicationUrlWithPort()
));

return [
    'stateful' => explode(',', $statefulDomains),

    'guard' => ['web'],

    'expiration' => null,

    'token_prefix' => env('SANCTUM_TOKEN_PREFIX', ''),

    'middleware' => [
        'authenticate_session' => Laravel\Sanctum\Http\Middleware\AuthenticateSession::class,
        'encrypt_cookies' => Illuminate\Cookie\Middleware\EncryptCookies::class,
        'validate_csrf_token' => Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
    ],
];
