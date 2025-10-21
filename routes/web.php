<?php

use App\Http\Controllers\Controller;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        // --- TAMBAHAN ---
        // Kirim data user (atau null jika guest) ke frontend
        // Ini dibutuhkan oleh AuthenticatedLayout.jsx untuk menampilkan "Profile" atau "Login"
        'auth' => [
            'user' => Auth::user(), // Ini data user (atau null kalau belum login)
        ],
    ]);
})->name('home');;

Route::get('/coba', [CustomerController::class, 'getData']);

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
    if (request() -> has('nomor_pesanan') && request()->input('nomor_pesanan') === 'KT-12345') {
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

    return Inertia::render('Lacak', [
        'statusPesanan' => $statusPesanan,
        'input' => request()->only('nomor_pesanan'), // Kirim kembali input user
    ]);
})->name('lacak');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
