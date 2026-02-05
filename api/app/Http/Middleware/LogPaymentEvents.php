<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class LogPaymentEvents
{
    public function handle(Request $request, Closure $next): Response
    {
        $requestId = $request->header('X-Request-ID', uniqid('req_'));
        
        // Log incoming payment request
        Log::channel('payments')->info('Payment request received', [
            'request_id' => $requestId,
            'method' => $request->method(),
            'path' => $request->path(),
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        $response = $next($request);

        // Log response
        Log::channel('payments')->info('Payment request completed', [
            'request_id' => $requestId,
            'status' => $response->getStatusCode(),
        ]);

        return $response;
    }
}
