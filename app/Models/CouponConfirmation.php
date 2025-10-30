<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CouponConfirmation extends Model
{
    //
    protected $fillable = [
        'coupon_code',
        'full_name',
        'email',
        'province',
        'district',
        'buy_platform',
        'product_id',
        'phone'
    ];
}
