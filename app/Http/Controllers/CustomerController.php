<?php

namespace App\Http\Controllers;

use App\Http\Resources\Resource;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use phpDocumentor\Reflection\PseudoTypes\False_;

class CustomerController extends Controller
{
    //
    public function create(Request $request){
        $validatedData = $request->validate([
           'data.full_name' => 'required|max:255',
           'data.email' => 'required|email',
           'user_id'=>'nullable|integer',
           'data.reseller_id'=>'nullable|integer',
           'data.province'=>'required|string',
           'data.phone'=>'required',
           'data.regency'=>'required',
           'data.city'=>'required',
           'data.address'=>'required',
           'data.marker'=>'nullable'
        ], [
            'required' => ':attribute tidak boleh kosong!',
            'data.email.email' => 'Gunakan email yang valid'
        ]);

        try {
            Customer::create($validatedData);
            new Resource(201, True, "Customer created successfully", [], $validatedData);
        } catch (\Throwable $th) {
            new Resource(400, False, "Customer error", $th->getMessage(), []);

        }

    }
    
}
