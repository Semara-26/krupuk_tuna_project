<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('customer_coupon', function (Blueprint $table) {
            $table->id();
            $table->string('customer_id');
            $table->foreign('customer_id')->references('email')->on('customers');
            $table->unsignedBigInteger('checkout_history_id');
            $table->foreign('checkout_history_id')->references('id')->on('checkout_history');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_coupon');
    }
};
