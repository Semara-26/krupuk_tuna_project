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
        'online_marketplace_id',
        'product_id'
    ];
}
