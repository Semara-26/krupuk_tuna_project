<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CouponConfirmationController extends Controller
{
    //
    public function store(Request $request){
        $validator = Validator::make($request->all(), [
            'coupon_code' => 'required|min:8',
            'full_name' => 'required',
            'email' => 'required|email',
            'province' => 'required',
            'online_marketplace_id' => 'nullable|integer',
            'product_id' => 'required|integer'
        ], [
            'required'=> 'tidak boleh kosong',
            'email.email' => 'Bukan email',
            'coupon_code.min' => 'Kode kupon minimal 8 digit'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message'=>'error',
                'data' => $validator->errors()
            ], 400);
        }

        try {
            $validatedData = $validator->validated();
            $res = $this->checkCoupon($validatedData['coupon_code']);
        } catch (\Throwable $th) {
            //throw $th;
        }

    }

    public function checkCoupon($coupon_code) : bool{
        $res = Coupon::find($coupon_code);
        dd($res);

        return true;
    }
}
