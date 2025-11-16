<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $all_coupons = Coupon::all();
        $expired_coupons = 0;
        $active_coupons = 0;
        foreach ($all_coupons as $coupon) {
            if($coupon->status){
                $expired_coupons ++;
            } else {
                $active_coupons++;
            }
        }        

        return Inertia::render('Admin/AdminDashboard', [
            "all_coupons" => count($all_coupons),
            "expired_coupons" => $expired_coupons,
            "active_coupons" => $active_coupons,
        ]);
    }

}