<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Coupons</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @page {
            size: A4;
            margin: 1cm;
        }
        .page-break {
            page-break-after: always;
        }
    </style>
</head>
<body class="bg-white">

    @foreach (array_chunk($coupon_codes, 8) as $chunk)
        <div class="grid grid-cols-2 gap-6 mb-6">
            @foreach ($chunk as $coupon)
                <div class="border-2 border-green-400 rounded-2xl p-4 flex flex-col items-center justify-center text-center w-full h-40">
                    <p class="text-sm text-gray-700 mb-1">Kode Kupon</p>
                    <h1 class="text-2xl font-bold tracking-wider mb-2">{{ $coupon['id'] }}</h1>
                    <hr class="w-4/5 border border-black mb-2">
                    <p class="text-sm text-gray-700">Masukkan kode kupon di website resmi kami:</p>
                    <p class="text-sm italic font-semibold text-black">www.rajatuna.com</p>
                </div>
            @endforeach
        </div>
        <div class="page-break"></div>
    @endforeach

</body>
</html>
