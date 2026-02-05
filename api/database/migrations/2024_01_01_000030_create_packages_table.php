<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->integer('quantity');
            $table->decimal('price', 10, 2);
            $table->decimal('original_price', 10, 2)->nullable();
            $table->string('estimated_time')->default('24-48 hours');
            $table->integer('min_quantity')->default(100);
            $table->integer('max_quantity')->default(100000);
            $table->boolean('refill_eligible')->default(false);
            $table->integer('refill_days')->default(30);
            $table->foreignId('provider_id')->nullable()->constrained()->nullOnDelete();
            $table->string('provider_service_id')->nullable();
            $table->boolean('active')->default(true);
            $table->json('features')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            
            $table->index(['service_id', 'active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};
