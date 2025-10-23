<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    //
    protected $primaryKey = 'email';
    protected $fillable = [
        'full_name',
        'email',
        'user_id',
        'reseller_id',
        'email',
        'province',
        'phone',
        'district',
        'city',
        'address',
        'marker'
    ];
}
