<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LandingPageController extends Controller
{
    //
    public function index(){
        return Inertia::render('Welcome');
    }
}
