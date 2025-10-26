<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerCoupon extends Model
{
    //
    protected $fillable = [
        'customer_id',
        'checkout_history_id',
        'coupon_code'
    ];
}
