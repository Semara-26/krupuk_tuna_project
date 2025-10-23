<?php

namespace App\Http\Controllers;

use App\Http\Resources\Resource;
use App\Models\Customer;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    //
    public function create(Request $request)
    {
        dd($request);
        $validatedData = $request->validate([
            'full_name' => 'required|max:255',
            'email' => 'required|email|unique:customers,email',
            'user_id' => 'nullable|integer',
            'province' => 'required|string',
            'phone' => 'required',
            'district' => 'required',
            'city' => 'required',
            'address' => 'required',
        ]);

        try {
            Customer::firstOrCreate(['email' => $validatedData['email']], $validatedData);
            $this->createHistoryCheckout($request);
            return new Resource(201, True, "Customer created successfully", [], $validatedData);
        } catch (\Throwable $th) {
            return new Resource(400, False, "Customer error", $th->getMessage(), []);
        }
    }

    public function createHistoryCheckout(Request $request)
    {
        $validatedData = $request->validate([
            'quantity' => 'required|min:1',
            'email' => 'required|email|unique',
            'district_id' => 'required',
            'courier_code' => 'required',
            'courier_service' => 'required',

        ]);

        $this->createCoupon();
    }

    public function createCoupon()
    {
        
        $this->createCustomerCouponRelation();
    }

    public function createCustomerCouponRelation() {}
}
