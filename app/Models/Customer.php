<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    //
    protected $fillable = [
        'full_name',
        'email',
        'user_id',
        'reseller_id',
        'email',
        'province',
        'phone',
        'regency',
        'city',
        'address',
        'marker'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts()
    {
        return [
            'password'=>'hashed'
        ];
    }
}
