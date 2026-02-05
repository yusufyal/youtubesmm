<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpFoundation\Response;

class VerifyTurnstile
{
    public function handle(Request $request, Closure $next): Response
    {
        // Skip in development if no secret configured
        if (!config('services.turnstile.secret')) {
            return $next($request);
        }

        $token = $request->input('turnstile_token') ?? $request->header('X-Turnstile-Token');

        if (!$token) {
            return response()->json([
                'message' => 'Bot verification required.',
            ], 422);
        }

        $response = Http::asForm()->post('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
            'secret' => config('services.turnstile.secret'),
            'response' => $token,
            'remoteip' => $request->ip(),
        ]);

        if (!$response->successful() || !$response->json('success')) {
            return response()->json([
                'message' => 'Bot verification failed. Please try again.',
            ], 422);
        }

        return $next($request);
    }
}
