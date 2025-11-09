<?php

namespace App\Http\Controllers;

use Spatie\LaravelPdf\Facades\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Spatie\Browsershot\Browsershot;

class CouponPDFController extends Controller
{
    //
    public function createFile($coupon_codes, $num)
    {
        $today = Carbon::now()->toDateString();
        return Pdf::view('pdf.coupons-pdf', ['coupon_codes' => $coupon_codes])
            ->format('a4')
            ->save("kupon-$num-$today.pdf");
    }
}
