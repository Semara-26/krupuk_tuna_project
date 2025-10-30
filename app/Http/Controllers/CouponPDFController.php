<?php

namespace App\Http\Controllers;

use Barryvdh\DomPDF\PDF;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Spatie\Browsershot\Browsershot;

class CouponPDFController extends Controller
{
    //
    public function createFile($coupon_codes, $num)
    {
        $today = Carbon::now()->toDateString();
        $pdf = Browsershot::html('pdf.coupons-pdf', ['coupon_codes' => $coupon_codes])
            ->savePdf("$num-$today.pdf");

    }
}
