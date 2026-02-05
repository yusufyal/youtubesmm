<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'package_id' => ['required', 'exists:packages,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'target_link' => ['required', 'url', 'max:500', 'regex:/youtube\.com|youtu\.be/i'],
            'coupon_code' => ['nullable', 'string', 'max:50'],
            'guest_email' => ['nullable', 'email', 'max:255'],
            'turnstile_token' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'target_link.regex' => 'Please enter a valid YouTube URL.',
            'package_id.exists' => 'The selected package is not available.',
        ];
    }
}
