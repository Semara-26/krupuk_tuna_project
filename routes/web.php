<?php

use App\Http\Controllers\Admin\AdminCouponController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminEventController;
use App\Http\Controllers\Admin\AdminEventPageController;
use App\Http\Controllers\Admin\AdminLoginController;
use App\Http\Controllers\Admin\GachaController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\CouponConfirmationController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\CourierController;
use App\Http\Controllers\LandingPageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WinnerController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

Route::get('/', [LandingPageController::class, 'index'])->name('home');

//HADEH INI NGGA TAU MAU DIAPAIN
Route::controller(CourierController::class)->group(function () {
    Route::get('/get-province-data', 'getProvince')->name('province.get');
    //route buat ngambil data kota dari provinsi_id
    Route::get('/get-city-data/{province_id}', 'getCity')->name('city.get');
    //route buat ngambil data kabupaten dari city_id
    Route::get('/get-district-data/{city_id}', 'getDistrict')->name('district.get');
    //nah, ini ngambil list total jasa kurir ama mang kurirnya
    Route::get('/get-courier/{district_id}', 'getCourier')->name('cost.get');
});

Route::post('/customer/checkout', [CheckoutController::class, 'create'])->name('order.store.popup');

Route::post('/coupon/confirm', [CouponConfirmationController::class, 'store'])->name('coupon.confirm')->middleware('throttle:10,1');

Route::get("/undian", [WinnerController::class, 'index'])->name('undian');


Route::get('/lacak', function () {
    // Nanti, tim backend akan mencari data ini di database berdasarkan input.
    // Untuk sekarang, kita buat data pura-pura (dummy data).
    $statusPesanan = null;
    if (request()->has('nomor_pesanan') && request()->input('nomor_pesanan') === 'KT-12345') {
        $statusPesanan = [
            'nomor' => 'KT-12345',
            'status' => 'Sedang Dikemas',
            'estimasi' => '25 Oktober 2025',
            'detail' => 'Pesanan Anda sedang disiapkan di gudang kami.'
        ];
    } elseif (request()->has('nomor_pesanan')) {
        // Jika nomor pesanan ada tapi salah
        $statusPesanan = ['error' => 'Nomor pesanan tidak ditemukan.'];
    }

    // Siapkan data riwayat pesanan (dummy data)
    $riwayatPesanan = [];
    if (Auth::check()) { // Cek jika user sudah login
        $riwayatPesanan = [
            ['id' => 'KT-09876', 'tanggal' => '18 Okt 2025', 'status' => 'Selesai', 'total' => 'Rp 50.000'],
            ['id' => 'KT-09875', 'tanggal' => '15 Okt 2025', 'status' => 'Selesai', 'total' => 'Rp 25.000'],
        ];
    }

    return Inertia::render('Lacak', [
        'statusPesanan' => $statusPesanan,
        'input' => request()->only('nomor_pesanan'), // Kirim kembali input user
        'riwayatPesanan' => $riwayatPesanan
    ]);
})->name('lacak');


//cek kupon
Route::get('/coupon/check/{coupon}', [CouponConfirmationController::class, 'checkCoupon'])->name('check.coupon');



//admin
//disini harus login dulu
Route::middleware('auth:admin')->group(function () {
    //munculin dashboard
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index']);
    //bagian event
    //munculin tampilan menu event, tapi belum jadi.
    Route::get('/admin/event', [AdminEventPageController::class, 'index']);
    //buat cek kupon, bagian admin milih siapa pemenangnya. return id dan full name customer yang redeem
    Route::get('/admin/coupon/check/{coupon}', [AdminEventController::class, 'checkCoupon']);
    //nyimpen semua pemenang 
    Route::post('/admin/winners/store', [AdminEventController::class, 'storeWinners']);
    //random gacha, perlu event id sama total pemenang
    Route::get('/admin/draw/{event_id}/{num}', [AdminEventController::class, 'randomGacha']);
    //buat event baru
    Route::post('/admin/create-event', [AdminEventController::class, 'createGachaEvent']);
    //edit event yang udah dibuat
    Route::post('/admin/update-event', [AdminEventController::class, 'updateGachaEvent']);
    //selesaiin event
    Route::get('/admin/end-event/{event_id}', [AdminEventController::class, 'endGachaEvent']);
    //hapus event
    Route::get('/admin/delete-event/{event_id}', [AdminEventController::class, 'removeEvent']);



    Route::get('/admin/generate-coupons/{num}', [AdminCouponController::class, 'couponsGetter']);
});

Route::get('/admin/login', [AdminLoginController::class, 'index'])->name('login');
Route::post('/admin/login', [AdminLoginController::class, 'adminLogin'])->name('admin.login')->middleware('throttle:10,1');
Route::post('/admin/logout', [AdminLoginController::class, 'logout'])->name('admin.logout');




