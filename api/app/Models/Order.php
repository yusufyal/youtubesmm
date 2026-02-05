<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'user_id',
        'package_id',
        'guest_email',
        'target_link',
        'target_links',
        'quantity',
        'amount',
        'discount',
        'coupon_id',
        'status',
        'payment_status',
        'provider_order_id',
        'provider_response',
        'start_count',
        'current_count',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'discount' => 'decimal:2',
            'provider_response' => 'array',
            'target_links' => 'array',
            'completed_at' => 'datetime',
        ];
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            if (empty($order->order_number)) {
                $order->order_number = self::generateOrderNumber();
            }
        });
    }

    public static function generateOrderNumber(): string
    {
        $timestamp = now()->format('ymd');
        $random = strtoupper(Str::random(6));
        return "AYN-{$timestamp}-{$random}";
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeProcessing($query)
    {
        return $query->whereIn('status', ['processing', 'in_progress']);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopePaid($query)
    {
        return $query->where('payment_status', 'completed');
    }

    public function isPaid(): bool
    {
        return $this->payment_status === 'completed';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function canBeRefilled(): bool
    {
        if (!$this->package || !$this->package->refill_eligible) {
            return false;
        }

        $refillDeadline = $this->completed_at?->addDays($this->package->refill_days);
        return $refillDeadline && now()->lt($refillDeadline);
    }

    public function getProgressPercentage(): int
    {
        if ($this->current_count === null || $this->start_count === null) {
            return 0;
        }

        $delivered = $this->current_count - $this->start_count;
        if ($this->quantity <= 0) {
            return 0;
        }

        return min(100, (int) round(($delivered / $this->quantity) * 100));
    }

    public function getDeliveredCount(): int
    {
        if ($this->current_count === null || $this->start_count === null) {
            return 0;
        }

        return max(0, $this->current_count - $this->start_count);
    }
}
