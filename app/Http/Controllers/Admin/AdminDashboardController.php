<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia; // <-- Pastikan Inertia di-import

class AdminDashboardController extends Controller
{
    /**
     * Menampilkan halaman dashboard admin.
     */
    public function index()
    {
        // TODO: Fitur dan logika pengambilan data akan ditambahkan nanti.

        // Me-render file: resources/js/Pages/Admin/AdminDashboard.jsx
        return Inertia::render('Admin/AdminDashboard');
    }
}