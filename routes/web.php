<?php

use App\Http\Controllers\AdminLoginController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\CouponConfirmationController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\CourierController;
use App\Http\Controllers\LandingPageController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

Route::get('/', [LandingPageController::class, 'index'])->name('home');


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

Route::post('/coupon/confirm', [CouponConfirmationController::class, 'store']);

Route::get('/undian', function () {
    // Untuk sekarang, kita kirim data pura-pura (dummy data) ke frontend.
    // Nanti tim backend yang akan ganti ini dengan data asli dari database.
    // Nanti, tim backend akan mengambil tanggal ini dari database.
    $tanggalBerikutnya = "Sabtu, 1 Desember 2025";
    return Inertia::render('Undian', [
        'tanggalUndian' => $tanggalBerikutnya,
        'pemenang' => [
            ['id' => 1, 'nomor_kupon' => 'KT-845621', 'nama' => 'Budi Santoso', 'hadiah' => 'Sepeda Motor'],
            ['id' => 2, 'nomor_kupon' => 'KT-778934', 'nama' => 'Ani Wijaya', 'hadiah' => 'Smartphone'],
            ['id' => 3, 'nomor_kupon' => 'KT-912345', 'nama' => 'Cahyo Aji', 'hadiah' => 'Voucher Belanja'],
        ]
    ]);
})->name('undian');

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




//admin
Route::get('/admin/login', [AdminLoginController::class, 'showAdminLogin'])->name('admin.login.view');
Route::post('/admin/login', [AdminLoginController::class, 'adminLogin'])->name('admin.login');
Route::middleware('auth');
Route::get('/admin/generate-coupons/{num}', [CouponController::class, 'couponsGetter']);
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth'])->name('dashboard');




require __DIR__ . '/auth.php';
