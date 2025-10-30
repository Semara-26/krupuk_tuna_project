<?php

namespace App\Http\Controllers;

use Barryvdh\DomPDF\PDF;
use Carbon\Carbon;
use Illuminate\Http\Request;

class CouponPDFController extends Controller
{
    //
    public function createFile($coupon_codes, $num)
    {
        $pdf = app(PDF::class);
        $pdf->loadView('pdf.coupons-pdf', ['coupon_codes' => $coupon_codes]);
        $today = Carbon::now()->toDateString();
        return $pdf->download("$num-$today.pdf");
    }
}
