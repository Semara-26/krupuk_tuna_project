<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\CouponController;
use App\Models\Coupon;
use App\Models\CouponConfirmation;
use App\Models\Events;
use App\Models\GachaDate;
use App\Models\Prize;
use App\Models\Winner;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Symfony\Contracts\EventDispatcher\Event;

class AdminEventController extends Controller
{
    //
    public function randomGacha($event_id, $num)
    {
        try {
            $event_data = Events::find($event_id);
            if ($event_data === null || $event_data->status) {
                return response()->json([
                    'code' => 403,
                    'message' => 'Event tidak ditemukan',
                    'data' => []
                ]);
            }
            $winners = [];
            $confirmation_id = DB::table('coupon_confirmations as cc')
                ->join('coupons as c', 'c.id', "=", 'cc.coupon_code')
                ->where("c.status", "=", '0')
                ->where("cc.created_at", "<", $event_data->last_buy_date)
                ->select("cc.id", "cc.coupon_code")->get();

            $confirmation_array = $confirmation_id->pluck("id")->toArray();
            $coupon_code_array = $confirmation_id->pluck("coupon_code")->toArray();
            Cache::put("coupon_data", $coupon_code_array);

            if ($num > count($confirmation_array)) {
                return response()->json([
                    'code' => 400,
                    'message' => 'Jumlah kupon tidak cukup untuk mengundi',
                    'data' => []
                ], 400);
            }
            
            if ($num > 1) {
                $winner_keys = array_rand($confirmation_array, $num);
            } else {
                $winner_keys[] = array_rand($confirmation_array, $num);
            }

            foreach ($winner_keys as $key) {
                $winner = DB::table("coupon_confirmations")
                    ->select("id", "full_name", "coupon_code")
                    ->find($confirmation_array[$key]);
                $winners[] = $winner;
            }

            return response()->json([
                'code' => 200,
                'message' => 'success',
                'data' => $winners
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'code' => 500,
                'message' => 'error',
                'data' => $th->getMessage()
            ], 500);
        }
    }

    public function createGachaEvent(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "title" => "required|string",
            "start_date" => "required|date",
            "last_buy_date" => "required|date",
            "total_winners" => "required|integer",
            "prizes" => "required|array",
            "prizes.*.prize_name" => "required|string",
            "prizes.*.qty" => "required|integer|min:1",
            "prizes.*.prize_type" => "required",
        ], [
            "required" => "tidak boleh kosong",
        ]);
        if ($validator->fails()) {
            return response()->json([
                'code' => 400,
                'message' => 'error',
                'data' => $validator->errors()
            ], 400);
        }
        try {
            $validatedData = $validator->validated();
            $not_yet_ended_event = Events::where('status', '0')->exists();
            if ($not_yet_ended_event) {
                return response()->json([
                    'code' => 400,
                    'message' => 'Ada event yang belum selesai',
                    'data' => []
                ], 400);
            }

            $events = Events::create([
                "title" => $validatedData["title"],
                "start_date" => $validatedData["start_date"],
                "last_buy_date" => $validatedData["last_buy_date"],
                "total_winners" => $validatedData["total_winners"]
            ]);

            foreach ($validatedData["prizes"] as $prize) {
                $prize = Prize::create([
                    "prize_types_id" => $prize['prize_type'],
                    "prize_name" => $prize['prize_name'],
                    "qty" => $prize['qty'],
                    "events_id" => $events->id
                ]);
            }

            return response()->json([
                'code' => 200,
                'message' => 'store success',
                'data' => ["undian" => $events, "hadiah" => $prize]
            ]);
        } catch (\Throwable $th) {
            Events::find($events->id)->delete();
            return response()->json([
                'code' => 500,
                'message' => 'server error',
                'data' => $th->getMessage()
            ], 500);
        }
    }

    public function updateGachaEvent(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "id" => "required|integer|exists:events,id",
            "title" => "required|string",
            "start_date" => "required|date",
            "last_buy_date" => "required|date",
            "total_winners" => "required|integer",
            "prizes" => "required|array",
            "prizes.*.prize_name" => "required|string",
            "prizes.*.qty" => "required|integer|min:1",
            "prizes.*.prize_type" => "required",
        ], [
            "required" => "tidak boleh kosong",
            "exists" => "Event tidak ditemukan",
        ]);

        if ($validator->fails()) {
            return response()->json([
                'code' => 400,
                'message' => 'error',
                'data' => $validator->errors()
            ], 400);
        }

        try {
            $validatedData = $validator->validated();

            $event = Events::find($validatedData["id"]);

            if (!$event) {
                return response()->json([
                    'code' => 404,
                    'message' => 'Event tidak ditemukan',
                    'data' => []
                ], 404);
            }

            $event->update([
                "title" => $validatedData["title"],
                "start_date" => $validatedData["start_date"],
                "last_buy_date" => $validatedData["last_buy_date"],
                "total_winners" => $validatedData["total_winners"]
            ]);

            Prize::where("events_id", $event->id)->delete();

            $newPrizes = [];
            foreach ($validatedData["prizes"] as $p) {
                $newPrizes[] = Prize::create([
                    "prize_types_id" => $p['prize_type'],
                    "prize_name" => $p['prize_name'],
                    "qty" => $p['qty'],
                    "events_id" => $event->id
                ]);
            }

            return response()->json([
                'code' => 200,
                'message' => 'Update success',
                'data' => [
                    "event" => $event,
                    "prizes" => $newPrizes
                ]
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'code' => 500,
                'message' => 'server error',
                'data' => $th->getMessage()
            ], 500);
        }
    }

    public function storeWinners(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "events_id" => "required|integer|exists:events,id",
            "winners" => "required|array",
            "winners.*.coupon_code" => "required",
            "winners.*.prize_type" => "required"
        ], [
            "required" => "tidak boleh kosong",
            "exists" => "Event tidak ditemukan",
        ]);

        if ($validator->fails()) {
            return response()->json([
                'code' => 400,
                'message' => 'error',
                'data' => $validator->errors()
            ], 400);
        }
        try {
            $validatedData = $validator->validated();
            $event_res = Events::where("id", $validatedData["events_id"])->first();

            $event_res = Events::find($validatedData["events_id"]);
            if (!$event_res) {
                return response()->json([
                    "code" => 404,
                    "message" => "Event tidak ditemukan",
                    "data" => []
                ]);
            }

            $sent_total_winners = count($validatedData["winners"]);
            $res_winner = Winner::where('events_id', $validatedData["events_id"])->count();
            if ($sent_total_winners > $event_res->total_winners) {
                return response()->json([
                    "code" => 400,
                    "message" => "Total pemenang yang diset ($event_res->total_winners) tidak sesuai dengan yang dikirim ($sent_total_winners)",
                    "data" => []
                ], 400);
            } else if ($res_winner == $event_res->total_winners) {
                return response()->json([
                    "code" => 400,
                    "message" => "Total pemenang sudah mencukupi",
                    "data" => []
                ], 400);
            }

            $to_store_winners_data = [];
            $coupon_controller = new CouponController();
            foreach ($validatedData["winners"] as $winner) {
                $check_res = $coupon_controller->isCouponExists($winner["coupon_code"]);
                if ($check_res) {
                    $to_store_winners_data[] = [
                        "coupon_code" => $winner["coupon_code"],
                        "events_id" => $validatedData["events_id"],
                        "prize_types_id" => $winner["prize_type"],
                        "created_at" => Carbon::now(),
                        "updated_at" => Carbon::now()
                    ];
                } else {
                    return response()->json([
                        "code" => 404,
                        "message" => "Kupon tidak ditemukan",
                        "data" => [$winner["coupon_code"]]
                    ], 404);
                    break;
                }
            }
            // return response()->json([
            //     "data" => $to_store_winners_data
            // ]);
            //i'll save it with insert
            $store_res = Winner::insert($to_store_winners_data);
            return response()->json([
                "code" => 200,
                "message" => "success",
                "data" => $store_res
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                "code" => 500,
                "message" => "server error",
                "data" => $th->getMessage()
            ]);
        }
    }

    public function removeEvent($event_id)
    {
        try {
            $event_data = Events::find($event_id);
            if (!$event_data) {
                return response()->json([
                    "code" => 200,
                    "message" => "Event tidak ditemukan",
                    "data" => []
                ]);
            }
            $res = $event_data->delete();
            Cache::forget("coupon_data");
            return response()->json([
                "code" => 200,
                "message" => "success",
                "data" => $res
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                "code" => 500,
                "message" => "server error",
                "data" => $th->getMessage()
            ]);
        }
    }

    public function endGachaEvent($event_id)
    {
        $event_data = Events::find($event_id);
        try {
            if (!$event_data) {
                return response()->json([
                    "code" => 403,
                    "message" => "Event tidak ditemukan",
                    "data" => []
                ]);
            }
            $coupon_data_cache = Cache::get("coupon_data");
            if (!$coupon_data_cache) {
                return response()->json([
                    "code" => 403,
                    "message" => "Data pemenang tidak ditemukan",
                    "data" => []
                ]);
            }
            Coupon::whereIn("id", $coupon_data_cache)->chunkById(500, function ($coupons) {
                foreach ($coupons as $coupon) {
                    $coupon->update(["status" => '1']);
                }
            });
            $res = Events::find($event_id)->update(["status" => '1']);
            Cache::forget("coupon_data");
            return response()->json([
                "code" => 200,
                "message" => "success",
                "data" => $res
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                "code" => 500,
                "message" => "server error",
                "data" => $th->getMessage()
            ]);
        }
    }

    public function checkCoupon($cp_code)
    {
        $res = CouponConfirmation::where("coupon_code", $cp_code)->select("id", "full_name")->first();
        if (!$res) {
            return response()->json([
                'code' => 400,
                'message' => 'Pemilik kupon tidak ditemukan',
                'data' => [$cp_code]
            ]);
        }
        $res_winner = Winner::where("coupon_code", $cp_code)->exists();
        if ($res_winner) {
            return response()->json([
                'code' => 400,
                'message' => 'Pemilik kupon sudah menjadi pemenang',
                'data' => [$cp_code]
            ]);
        }
        return response()->json([
            'code' => 200,
            'message' => 'success',
            'data' => [$res]
        ]);
    }
}
