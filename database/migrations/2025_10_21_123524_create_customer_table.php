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
        Schema::create('customers', function (Blueprint $table) {
            $table->id()->index();
            $table->string('full_name');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnUpdate();
            $table->unsignedBigInteger('reseller_id')->nullable();
            $table->foreign('reseller_id')->references('id')->on('resellers')->cascadeOnUpdate();
            $table->string('email')->unique()->index();
            $table->string('province');
            $table->string('phone');
            $table->string('regency');
            $table->string('city');
            $table->text('address');
            $table->string('marker');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer');
    }
};
