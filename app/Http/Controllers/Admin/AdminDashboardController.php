<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // ... (Kode data dummy Anda tetap di sini)
        $all_coupons_count = 600;
        $expired_coupons = 150;
        $active_coupons = 450; 

        return Inertia::render('Admin/AdminDashboard', [
            "all_coupons" => $all_coupons_count,
            "expired_coupons" => $expired_coupons,
            "active_coupons" => $active_coupons
        ]);
    }

    // ==========================================================
    // TAMBAHKAN METHOD BARU INI
    // ==========================================================
    /**
     * Mengecek status kupon dan me-redirect kembali dengan hasil.
     */
    public function checkCoupon(Request $request)
    {
        // 1. Validasi input dari form
        $request->validate([
            'code' => 'required|string|max:255',
        ]);

        // 2. Ambil data kupon dari database
        // (Pastikan Anda meng-uncomment 'use App\Models\Coupon;' di atas)
        $coupon = Coupon::where('code', $request->code)->first();

        $result = []; // Siapkan array hasil

        // 3. INI ADALAH IF STATEMENT ANDA (di Backend)
        if (!$coupon) {
            // KUPON TIDAK DITEMUKAN
            $result = [
                'status' => 'not_found',
                'message' => 'Kupon "' . $request->code . '" tidak ditemukan.'
            ];
        } else if ($coupon->status) { // Asumsi status 1 = expired
            // KUPON DITEMUKAN TAPI SUDAH DIGUNAKAN
            $result = [
                'status' => 'used',
                'message' => 'Kupon "' . $coupon->code . '" ditemukan, tapi SUDAH DIGUNAKAN.'
            ];
        } else { // Asumsi status 0 = aktif
            // KUPON DITEMUKAN DAN AKTIF
            $result = [
                'status' => 'active',
                'message' => 'Kupon "' . $coupon->code . '" AKTIF dan siap digunakan!'
            ];
        }

        // 4. Redirect kembali ke halaman dashboard
        //    dan "flash" (kirim) data 'checkResult' ke sesi
        return redirect()->back()->with('checkResult', $result);
    }
}