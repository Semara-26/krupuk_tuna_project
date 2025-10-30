<?php

use App\Http\Controllers\CouponConfirmationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/coupon/confirm', [CouponConfirmationController::class, 'store']);