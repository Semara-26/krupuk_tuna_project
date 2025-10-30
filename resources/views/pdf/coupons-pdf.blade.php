<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8" />
<title>Template Cetak Kupon</title>
<style>
    @page {
        size: A4 portrait;
        margin: 10mm;
    }

    body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 10mm;
        background-color: #fff;
    }

    .page {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        page-break-after: always;
    }

    /* Ukuran sedikit lebih kecil dari versi asli */
    .coupon {
        width: 80mm;   /* dari 85 → 80mm */
        height: 48mm;  /* dari 53 → 48mm */
        border: 2px solid #333;
        border-radius: 15px;
        margin-bottom: 8mm;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        page-break-inside: avoid;
        background: #fff;
    }

    .coupon-top {
        flex: 1;
        padding: 4mm;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .coupon-top .label {
        font-size: 10px;
        color: #555;
        text-transform: uppercase;
    }

    .coupon-top .code {
        font-family: 'Courier New', Courier, monospace;
        font-size: 20px;
        font-weight: bold;
        color: #000;
        letter-spacing: 1px;
        margin-top: 4px;
    }

    .coupon-bottom {
        flex: 1;
        padding: 4mm;
        text-align: center;
        border-top: 2px solid #333;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .coupon-bottom .info {
        font-size: 10px;
        color: #555;
    }

    .coupon-bottom .website {
        font-size: 12px;
        font-weight: bold;
        color: #000;
        margin-top: 4px;
    }

    .empty { visibility: hidden; }
</style>
</head>
<body>

@foreach (array_chunk($coupon_codes, 6) as $page)
    <div class="page">
        @foreach ($page as $coupon)
            <div class="coupon">
                <div class="coupon-top">
                    <div class="label">Kode Kupon</div>
                    <div class="code">{{ $coupon['id'] }}</div>
                </div>
                <div class="coupon-bottom">
                    <div class="info">Masukkan kode kupon di website resmi kami:</div>
                    <div class="website">www.rajatuna.com</div>
                </div>
            </div>
        @endforeach
        @for ($i = count($page); $i < 6; $i++)
            <div class="coupon empty"></div>
        @endfor
    </div>
@endforeach

</body>
</html>
