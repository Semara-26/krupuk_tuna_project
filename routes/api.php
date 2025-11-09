<?php

use App\Http\Controllers\Admin\AdminEventController;
use App\Http\Controllers\Admin\AdminLoginController;
use App\Http\Controllers\Admin\GachaController;
use App\Http\Controllers\CouponConfirmationController;
use App\Http\Controllers\CouponController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/coupon/confirm', [CouponConfirmationController::class, 'store']);

Route::get('/coupon/check/{coupon}', [CouponController::class, 'checkCoupon']);

Route::get('/admin/coupon/check/{coupon}', [AdminEventController::class, 'checkCoupon']);
Route::post('/admin/winners/store', [AdminEventController::class, 'storeWinners']);
Route::get('/admin/draw/{event_id}/{num}', [AdminEventController::class, 'randomGacha']);
Route::post('/admin/create-event', [AdminEventController::class, 'createGachaEvent']);
Route::post('/admin/update-event', [AdminEventController::class, 'updateGachaEvent']);
Route::get('/admin/end-event/{event_id}', [AdminEventController::class, 'endGachaEvent']);
Route::get('/admin/delete-event/{event_id}', [AdminEventController::class, 'removeEvent']);

// Route::post('/admin/login', [AdminLoginController::class, 'adminLogin']);