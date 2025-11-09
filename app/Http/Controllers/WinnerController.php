<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class WinnerController extends Controller
{
    //
    public function index()
    {
        $recent_winner = $this->getRecentWinners();
        $recent_gacha_dates = $this->getRecentGachaDates();
        dd($recent_winner);
        return Inertia::render("Undian", ["pemenang" => json_encode($recent_winner), "tanggalUndian" => json_encode($recent_gacha_dates)]);
    }

    public function getRecentWinners()
    {
        $recent_date = DB::table("winners")->max("created_at");
        $res = DB::table("winners as w")->join("coupon_confirmations as cc", "cc.id", "w.coupon_confirmations_id")
            ->select("cc.full_name", "cc.coupon_code")
            ->whereDate('w.created_at', date('Y-m-d', strtotime($recent_date)))
            ->get();
        return $res;
    }

    public function getRecentGachaDates() {
        $res = DB::table("gacha_dates")->select('*')
        ->orderByDesc("created_at")->first();
        return $res;
    }
}
