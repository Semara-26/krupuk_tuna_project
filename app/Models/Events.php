<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Events extends Model
{
    //
    protected $fillable= [
        "title",
        "total_winners",
        "start_date",
        "last_buy_date",
        "status"
    ];
}
