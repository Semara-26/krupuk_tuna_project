<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Events;
use App\Models\PrizeType;
use App\Models\Winner;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB; // Tambahkan ini untuk query builder

class AdminEventPageController extends Controller
{
    public function index()
    {
        $total_events = Events::all()->count();
        $next_events_num = $total_events + 1;
        
        // Ambil event aktif beserta hadiahnya
        $activeEvent = Events::with('prizes')
            ->where('status', '0')
            ->first();
            
        $prize_types = PrizeType::all();
        
        // Data default yang akan dikirim ke Inertia
        $data = [
            'prizeTypes' => $prize_types, // Selalu kirim ini biar aman untuk Modal Edit
            'undianTitle' => "Undian $next_events_num",
            'activeEvent' => null,
            'sisaPemenang' => 0
        ];

        if ($activeEvent) {
            $total_winners = $activeEvent->total_winners;
            $current_total_winners = Winner::where("events_id", $activeEvent->id)->count();
            $total_winners_left = $total_winners - $current_total_winners;
            
            // Update data jika ada event aktif
            $data['activeEvent'] = $activeEvent;
            $data['sisaPemenang'] = $total_winners_left;
        }

        // Ambil username admin (opsional, kalau mau ditampilkan)
        // $admin = Auth::guard('admin')->user()->username; 

        return Inertia::render('Admin/Event', $data);
    }

    /**
     * Fungsi baru untuk Halaman Daftar Pemenang
     */
    public function winners()
    {
        // Query untuk mengambil data pemenang lengkap dengan nama user & event
        $winnersData = DB::table('winners')
            ->join('coupon_confirmations', 'winners.coupon_code', '=', 'coupon_confirmations.coupon_code')
            ->join('events', 'winners.events_id', '=', 'events.id')
            ->select(
                'coupon_confirmations.full_name as nama',
                'winners.coupon_code as kupon',
                'events.title as event',
                'winners.created_at as tanggal',
                'winners.prize_types_id as tipe_hadiah' // 1 = Utama, 2 = Hiburan
            )
            ->orderBy('winners.created_at', 'desc')
            ->get();

        return Inertia::render('Admin/WinnerList', [
            'winners' => $winnersData
        ]);
    }
}