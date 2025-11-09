<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8" />
<title>Template Cetak Kupon</title>
<style>
    :root {
        --gap-horizontal: 8mm;  /* Gap between columns */
        --gap-vertical: 2mm;    /* Gap between rows */
        --coupon-height: 35mm;  /* Height of each coupon */
        --border-radius: 8px;   /* Corner roundness */
    }

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
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        align-content: flex-start;
        page-break-after: always;
        gap: var(--gap-vertical) var(--gap-horizontal);
    }

    .coupon {
        width: calc(50% - (var(--gap-horizontal) / 2));
        height: var(--coupon-height);
        border: 1px solid #00ff00; /* bright green outline */
        border-radius: var(--border-radius);
        margin-bottom: 0;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
        box-sizing: border-box;
        background: #fff;
    }

    .coupon-content {
        text-align: center;
        padding: 4px 8px;
    }

    .label {
        font-size: 10px;
        color: #333;
        margin-bottom: 2px;
    }

    .code {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 3px;
    }

    .divider {
        width: 100%;
        height: 1px;
        background: #000;
        margin: 2px 0 4px 0;
    }

    .info {
        font-size: 10px;
        color: #333;
        line-height: 1.2;
    }

    .website {
        font-size: 12px;
        font-weight: bold;
        font-style: italic;
        margin-top: 2px;
    }

    .empty { visibility: hidden; }
</style>
</head>
<body>

@foreach (array_chunk($coupon_codes, 12) as $page)
    <div class="page">
        @foreach ($page as $coupon)
            <div class="coupon">
                <div class="coupon-content">
                    <div class="label">Kode Kupon</div>
                    <div class="code">{{ $coupon['id'] }}</div>
                    <div class="divider"></div>
                    <div class="info">Masukkan kode kupon di website resmi kami:</div>
                    <div class="website">www.rajatuna.com</div>
                </div>
            </div>
        @endforeach
        @for ($i = count($page); $i < 12; $i++)
            <div class="coupon empty"></div>
        @endfor
    </div>
@endforeach

</body>
</html>