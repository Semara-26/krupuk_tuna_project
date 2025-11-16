<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use App\Models\CouponFile;
use Spatie\LaravelPdf\Facades\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Spatie\Browsershot\Browsershot;

class CouponPDFController extends Controller
{
    //
    public function createFile($coupon_codes, $title)
    {
        $today = Carbon::now()->toDateString();
        return Pdf::view('pdf.coupons-pdf', ['coupon_codes' => $coupon_codes])
            ->format('a4')
            ->download("$title.pdf");
    }

    public function downloadExistingFile($id)
    {
        $res = Coupon::where("coupon_files_id", $id)->get();
        $cp_file = CouponFile::find($id);
        $title = $cp_file->title;
        $coupon_codes = $res->map(function($c){
            return ['id'=>$c->id];
        })->toArray();
        return Pdf::view('pdf.coupons-pdf', ['coupon_codes' => $coupon_codes])
            ->format('a4')
            ->download("$title.pdf");
    }
}
