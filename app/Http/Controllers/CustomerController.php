<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    //
    public function getData(){
        return Inertia::render('coba', ['data' => "hello world"]);
    }
    
}
