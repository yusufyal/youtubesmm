<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('package_id')->constrained()->restrictOnDelete();
            $table->string('guest_email')->nullable();
            $table->string('target_link');
            $table->integer('quantity');
            $table->decimal('amount', 10, 2);
            $table->decimal('discount', 10, 2)->default(0);
            $table->foreignId('coupon_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('status', [
                'pending',
                'processing',
                'in_progress',
                'completed',
                'partial',
                'canceled',
                'refunded'
            ])->default('pending');
            $table->enum('payment_status', [
                'pending',
                'processing',
                'completed',
                'failed',
                'refunded'
            ])->default('pending');
            $table->string('provider_order_id')->nullable();
            $table->json('provider_response')->nullable();
            $table->integer('start_count')->nullable();
            $table->integer('current_count')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            
            $table->index(['user_id', 'status']);
            $table->index(['order_number']);
            $table->index(['payment_status']);
            $table->index(['created_at']);
            $table->index(['guest_email']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
