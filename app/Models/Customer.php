<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    //
    protected $primaryKey = 'email';
    public $incrementing = false;      // It's NOT an integer auto-increment
    protected $keyType = 'string';     // The key type is string
    protected $fillable = [
        'email',
    ];
}
