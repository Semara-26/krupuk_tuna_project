<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LandingPageController extends Controller
{
    //
    public function index()
    {
        $user = Auth::user();
        // dd($user);
        return Inertia::render('Welcome', ['auth' => ['user' => $user]]);
    }
}
