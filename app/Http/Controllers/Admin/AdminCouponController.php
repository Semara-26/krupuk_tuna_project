<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\CouponPDFController;
use App\Models\Coupon;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;

class AdminCouponController extends Controller
{
    //
    protected $coupon_length = 8;

    public function couponsGetter(Int $num)
    {
        try {
            $cp_pdf_cntrl = new CouponPDFController();
            $res = $this->generateCoupons($num);
            return $cp_pdf_cntrl->createFile($res, $num);
        } catch (QueryException $e) {
            if ($e->errorInfo[1] == 1062) {
                $this->generateCoupons($num);
            } else {
                return response()->json([
                    'code' => 500,
                    'message' => 'server error',
                    'data' => $e->getMessage()
                ]);
            }
        }
    }

    public function generateCoupons(Int $num): array
    {
        $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
        $coupon_code_arr = [];

        for ($x = 0; $x < $num; $x++) {
            $coupon_code = '';
            for ($i = 0; $i < $this->coupon_length; $i++) {
                $rand_int = random_int(0, strlen($chars) - 1);
                $coupon_code .= $chars[$rand_int];
            }
            $timestamps = Carbon::now();
            array_push($coupon_code_arr, ["id" => $coupon_code, 'created_at' => $timestamps, 'updated_at' => $timestamps]);
        }
        Coupon::insert($coupon_code_arr);
        return $coupon_code_arr;
    }
}
