<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminMakeCoupon extends Controller
{
    //
        public function index(){
        
        return Inertia::render('Admin/AdminBuatKupon');
    }
}
