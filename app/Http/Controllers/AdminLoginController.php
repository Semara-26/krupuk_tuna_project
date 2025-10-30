<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminLoginController extends Controller
{
    //
    public function showAdminLogin()
    {
        return Inertia::render('admin.adminlogin');
    }

    public function adminLogin(Request $request)
    {
        $validateData = $request->validate([
            'username' => 'required|min:3',
            'password' => 'required|min:8'
        ]);

        $success = Auth::attempt($validateData);
        if (!$success) {
            return response()->json(
                [
                    'status'  => 400,
                    'message' => 'user tidak ditemukan'
                ]

            );
        }

        $request->session()->regenerate();
        return Inertia::render('admin.admindashboard');
    }
}
