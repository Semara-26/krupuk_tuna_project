<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

use function Symfony\Component\Clock\now;

class LiveDrawPageController extends Controller
{
    //
    public function index($event_id)
    {
        if (Cache::has("winners")) {
            $winners = Cache::get("winners");
        } else {
            $winners = DB::table("winners as w")->select("w.coupon_code", "cc.full_name", "w.prize_types_id")
                ->join("coupon_confirmations as cc", "w.coupon_code", "cc.coupon_code")
                ->where("w.events_id", $event_id)
                ->get();
        }
        $event_data = DB::table("events")->select("title")->where('id', "$event_id")->first();
        $prizes = DB::table("prizes")->select("id", "prize_name", "qty", "prize_types_id")->where("events_id", $event_id)->get();


        return Inertia::render("Admin/LiveDraw", ["event" => ["id" => $event_id, "title" => $event_data->title], "prizes" => $prizes, "winners" => $winners ?? []]);
    }

    public function storeCache(Request $request)
    {
        Cache::forget("winners");
        Cache::put("winners", $request->winners, Carbon::now()->addMinutes(30));
    }
}
