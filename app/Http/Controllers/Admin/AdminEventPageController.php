<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Events;

class AdminEventPageController extends Controller
{
    //
    public function index() {
        // TAMBAH RETURN INI
        // (Pastikan kamu punya file 'Event.jsx' di folder 'resources/js/Pages/Admin/')
        // (Kita juga kirim 'activeEvent' (misal 'null' dulu) 
        //  sesuai rencana kita sebelumnya)
        
       $activeEvent = Events::with('prizes')
                            ->where('status', '0')
                            ->first(); // Ambil 1 event aktif

        // 3. KIRIM DATA ASLINYA
        return Inertia::render('Admin/Event', [
             'activeEvent' => $activeEvent 
        ]);
    }
}
