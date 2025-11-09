<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    //
        public function index(){
        $all_coupon = Coupon::all();
        $expired_coupons = 0;
        $active_coupons = 0;
        foreach ($all_coupon as $coupon) {
            if($coupon->status){
                $expired_coupons ++;
            } else {
                $active_coupons++;
            }
        }
        
        return Inertia::render('Admin/AdminDashboard', [
            "all_coupons" => count($all_coupon),
            "expired_coupons" => $expired_coupons,
            "active_coupons" => $active_coupons
        ]);
    }
}
