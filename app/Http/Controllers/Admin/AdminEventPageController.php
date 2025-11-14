<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Events;
use App\Models\PrizeType;
use App\Models\Winner;
use Illuminate\Support\Facades\Auth;

class AdminEventPageController extends Controller
{
    //
    public function index()
    {

        $total_events = Events::all()->count();
        $next_events_num = $total_events + 1;
        $activeEvent = Events::with('prizes')
            ->where('status', '0')
            ->first();
        $prize_types = PrizeType::all();
        if ($activeEvent) {
            $total_winners = $activeEvent->total_winners;
            $current_total_winners = Winner::where("events_id", $activeEvent->id)->count();
            $total_winners_left = $total_winners - $current_total_winners;
            return Inertia::render('Admin/Event', [
                'activeEvent' => $activeEvent,
                'sisaPemenang' => $total_winners_left
            ]);
        }
        $admin = Auth::guard('admin')->user()->username;
        return  Inertia::render('Admin/Event', [
            'prizeTypes' => $prize_types,
            'undianTitle' => "Undian $next_events_num",
        ]);
    }
}
