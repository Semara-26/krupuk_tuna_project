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
        Schema::create('checkout_history', function (Blueprint $table) {
            $table->id();
            $table->string('customer_id');
            $table->foreign('customer_id')->references('email')->on('customers');
            $table->integer('qty');
            $table->enum('payment_status', ['pending', 'completed', 'cancelled'])->default('pending');
            $table->string('tracking_status')->nullable();
            $table->string('district_id');
            $table->string('courier_code');
            $table->string('courier_service');
            $table->integer('courier_price');
            $table->integer('grand_total');
            $table->string('order_no')->index();
            $table->string('awb')->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('checkout_history');
    }
};
