<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    //
    public function index(){
        $all_coupon = Coupon::all();
        $expired_coupons = [];
        $active_coupons = [];
        foreach ($all_coupon as $coupon) {
            if($coupon->status){
                array_push($expired_coupons, $coupon);
            } else {
                array_push($active_coupons, $coupon);
            }
        }
        
        return Inertia::render('Admin/AdminDashboard', [
            "all_coupons" => count($all_coupon),
            "expired_coupons" => count($expired_coupons),
            "active_coupons" => count($active_coupons)
        ]);
    }
}
