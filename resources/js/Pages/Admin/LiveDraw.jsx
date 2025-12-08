import React, { useState, useEffect, useRef } from "react";
import { Head, usePage } from "@inertiajs/react"; // usePage buat cek auth
import ReactConfetti from "react-confetti";
import Swal from "sweetalert2";
import axios from "axios";

export default function LiveDraw({ event, prizes, isAdmin }) {
    // Ambil info user login dari Inertia (Shared Props)
    // const { auth } = usePage().props;
    // const isAdmin = auth?.user?.role === 'admin' || auth?.admin; // Sesuaikan logic cek adminmu

    // --- CONFIG STATE (Poin 5) ---
    const [animDuration, setAnimDuration] = useState(3000); // Lama acak angka (ms)
    const [intermissionDelay, setIntermissionDelay] = useState(3000); // Jeda antar pemenang (ms)

    // --- STATE UTAMA ---
    const [selectedPrizeType, setSelectedPrizeType] = useState(
        prizes[0]?.prize_types_id || ""
    );
    const [isRolling, setIsRolling] = useState(false);
    const [displayNumber, setDisplayNumber] = useState("XXXXXXXX");
    const [currentWinner, setCurrentWinner] = useState(null);
    const [winnersHistory, setWinnersHistory] = useState([]);
    const [showConfetti, setShowConfetti] = useState(false);

    // State buat nyimpen ID pemenang terakhir biar ga animasi ulang
    const lastWinnerIdRef = useRef(null);
    const rollingInterval = useRef(null);

    // --- VISUAL EFFECT HELPERS ---
    const startVisualRolling = () => {
        setIsRolling(true);
        setShowConfetti(false);
        setCurrentWinner(null);

        if (rollingInterval.current) clearInterval(rollingInterval.current);

        rollingInterval.current = setInterval(() => {
            const chars = "0123456789ABCDEFGHJKLMNOPQRSTVWXYZ";
            let randomCode = "";
            for (let i = 0; i < 8; i++)
                randomCode += chars.charAt(
                    Math.floor(Math.random() * chars.length)
                );
            setDisplayNumber(randomCode);
        }, 50);
    };

    const stopVisualRolling = (winnerData) => {
        clearInterval(rollingInterval.current);
        setDisplayNumber(winnerData.coupon_code); // Pastikan fieldnya 'coupon_code'
        setCurrentWinner(winnerData);
        setIsRolling(false);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
    };

    // --- POIN 3: MIRRORING UTK USER (POLLING) ---
    useEffect(() => {
        // Kalau Admin, gak perlu polling (karena dia yang nge-trigger)
        if (isAdmin) return;

        const pollInterval = setInterval(async () => {
            try {
                const res = await axios.get(
                    route("api.livedraw.status", { event_id: event.id })
                );
                const data = res.data;
                const winner = data.latest_winner;

                // Logic: Jika ada pemenang baru yang beda dari sebelumnya
                if (winner && winner.id !== lastWinnerIdRef.current) {
                    lastWinnerIdRef.current = winner.id;

                    // Mainkan animasi seolah-olah real time
                    startVisualRolling();

                    // Tunggu sebentar (simulasi durasi animasi) lalu munculkan
                    setTimeout(() => {
                        stopVisualRolling(winner);
                    }, 3000);
                }
            } catch (error) {
                console.error("Polling error:", error);
            }
        }, 3000); // Cek tiap 3 detik

        return () => clearInterval(pollInterval);
    }, [event.id, isAdmin]);

    // --- POIN 4: FUNGSI ADMIN AUTO LOOP ---
    const handleStartAutoDraw = async () => {
        if (!selectedPrizeType) return Swal.fire("Pilih Hadiah Dulu");

        // Konfirmasi awal
        const result = await Swal.fire({
            title: "Mulai Pengundian Otomatis?",
            text: `Sistem akan mengundi satu per satu dengan jeda ${
                intermissionDelay / 1000
            } detik.`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Gas, Mulai!",
            cancelButtonText: "Ga Jadi Deh",
        });

        if (!result.isConfirmed) return;

        let keepDrawing = true;

        // LOOPING SAMPAI HABIS / ERROR
        while (keepDrawing) {
            try {
                // 1. Mulai Visual
                startVisualRolling();

                // --- PERBAIKAN LOGIC PARALEL (Biar sesuai request temenmu) ---
                // Kita jalanin Timer Animasi & Request API secara BERSAMAAN
                // Jadi API di-hit saat animasi sedang jalan.

                const animationPromise = new Promise((r) =>
                    setTimeout(r, animDuration)
                );

                // Request API (langsung jalan, gak nunggu delay dulu)
                const apiPromise = axios.post("/api/draw-winner", {
                    event_id: event.id,
                    prize_types_id: selectedPrizeType,
                });

                // Tunggu keduanya selesai (paling lambat)
                const [_, res] = await Promise.all([
                    animationPromise,
                    apiPromise,
                ]);
                // -------------------------------------------------------------

                // 3. Tampilkan Pemenang
                const newWinner = res.data.winner;
                stopVisualRolling(newWinner);
                lastWinnerIdRef.current = newWinner.id;
                setWinnersHistory((prev) => [...prev, newWinner]);

                // 4. Cek Sisa (Dari response backend)
                if (res.data.remaining <= 0) {
                    keepDrawing = false; // Stop loop
                    await Swal.fire(
                        "Selesai!",
                        "Semua hadiah untuk kategori ini sudah habis.",
                        "success"
                    );
                    break;
                }

                // 5. Delay Intermission (Jeda antar undian)
                await new Promise((r) => setTimeout(r, intermissionDelay));
            } catch (error) {
                console.log("Error response:", error.response);

                // 1. Matikan Loop (Wajib)
                keepDrawing = false;

                // 2. Siapkan Pesan
                const errorMessage =
                    error.response?.data?.message ||
                    "Terjadi kesalahan sistem.";
                const isDataEmpty = error.response?.status === 404;

                // 3. Tampilkan Popup & Reload setelah klik OK
                Swal.fire({
                    icon: isDataEmpty ? "warning" : "error",
                    title: isDataEmpty ? "Perhatian" : "Gagal",
                    text: errorMessage,
                    confirmButtonText: "OK, Reset",
                }).then((result) => {
                    // Kode ini baru jalan SETELAH admin klik tombol OK
                    if (result.isConfirmed || result.isDismissed) {
                        window.location.reload(); // Refresh halaman biar bersih
                    }
                });
            }
        }
    };

    // Helper cari nama hadiah
    const currentPrizeObj = prizes.find(
        (p) => p.prize_types_id == selectedPrizeType
    );

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center relative overflow-hidden font-sans">
            <Head title={`Live Draw - ${event.title}`} />
            {showConfetti && <ReactConfetti recycle={true} />}

            {/* HEADER & LOGO (Sama kayak code lama mu) */}
            <div className="w-full p-6 flex items-center z-20 relative">
                <img
                    src="/images/DESIGN LOGO RAJATUNA.png"
                    alt="Logo"
                    className="h-16 rounded-lg p-2 "
                />
            </div>

            {/* WRAPPER UTAMA: Ganti Grid jadi Flex biar lebih fleksibel */}
            <div className="flex-grow w-full px-4 lg:px-8 z-10 -mt-10 flex flex-col lg:flex-row items-start gap-6">
                {/* === KOLOM KIRI (Area Undian Utama) === */}
                {/* Pakai 'flex-1' biar dia ambil semua sisa ruang yang ada (Dominan) */}
                <div className="flex-1 flex flex-col items-center w-full min-w-0 pt-4">
                    <h1 className="text-3xl md:text-5xl font-black text-yellow-400 uppercase tracking-widest mb-6 text-center drop-shadow-lg">
                        {event.title}
                    </h1>
                    {/* 1. Judul Hadiah */}
                    <div className="mb-10 text-center">
                        <p className="text-slate-400 text-xl mb-2 uppercase tracking-[0.2em]">
                            Memperebutkan Hadiah:
                        </p>
                        <div className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-900 px-12 py-4 rounded-full text-4xl font-black shadow-2xl">
                            {currentPrizeObj
                                ? currentPrizeObj.prize_name
                                : "..."}
                        </div>
                    </div>

                    {/* 2. Kotak Nomor */}
                    <div className="bg-white text-slate-900 rounded-3xl p-16 shadow-[0_0_50px_rgba(255,255,255,0.1)] border-8 border-slate-700 mb-8 w-full max-w-5xl relative overflow-hidden text-center">
                        <div
                            className={`font-mono font-black tracking-widest text-center transition-all ${
                                isRolling
                                    ? "text-8xl opacity-50 blur-[2px]"
                                    : "text-9xl scale-110 text-slate-800"
                            }`}
                        >
                            {displayNumber}
                        </div>
                    </div>

                    {/* 3. Data Pemenang (Muncul dibawah kotak) */}
                    {currentWinner && !isRolling && (
                        <div className="bg-green-600 border-4 border-green-400 rounded-2xl p-8 mb-8 text-center animate-bounce-in shadow-2xl w-full max-w-3xl text-white">
                            <h2 className="text-2xl font-bold mb-2 uppercase">
                                Selamat Kepada
                            </h2>
                            <p className="text-5xl font-black mb-2">
                                {currentWinner.name}
                            </p>
                            <p className="text-2xl">
                                🎟️ {currentWinner.coupon_code}
                            </p>
                        </div>
                    )}

                    {/* 4. Kontrol Admin (HANYA MUNCUL JIKA ADMIN) */}
                    {isAdmin ? (
                        <div className="bg-slate-800/80 p-6 rounded-2xl backdrop-blur-md border border-slate-600 w-full max-w-4xl">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                {/* Input Animasi */}
                                <div>
                                    <label className="text-xs text-slate-400 uppercase font-bold">
                                        Animasi (ms)
                                    </label>
                                    <input
                                        type="number"
                                        value={animDuration}
                                        onChange={(e) =>
                                            setAnimDuration(
                                                Number(e.target.value)
                                            )
                                        }
                                        className="w-full bg-slate-700 text-white rounded px-2 py-2"
                                    />
                                </div>
                                {/* Input Jeda */}
                                <div>
                                    <label className="text-xs text-slate-400 uppercase font-bold">
                                        Jeda (ms)
                                    </label>
                                    <input
                                        type="number"
                                        value={intermissionDelay}
                                        onChange={(e) =>
                                            setIntermissionDelay(
                                                Number(e.target.value)
                                            )
                                        }
                                        className="w-full bg-slate-700 text-white rounded px-2 py-2"
                                    />
                                </div>
                                {/* Pilih Hadiah */}
                                <div>
                                    <label className="text-xs text-slate-400 uppercase font-bold">
                                        Hadiah
                                    </label>
                                    <select
                                        value={selectedPrizeType}
                                        onChange={(e) => {
                                            setSelectedPrizeType(
                                                e.target.value
                                            );
                                            setCurrentWinner(null);
                                            setDisplayNumber("XXXXXXXX");
                                        }}
                                        disabled={isRolling}
                                        className="w-full bg-slate-700 text-white rounded px-2 py-2"
                                    >
                                        {prizes.map((p) => (
                                            <option
                                                key={p.id}
                                                value={p.prize_types_id}
                                            >
                                                {p.prize_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {/* Tombol Auto Loop */}
                                <button
                                    onClick={handleStartAutoDraw}
                                    disabled={isRolling}
                                    className={`w-full py-2.5 rounded-lg font-bold text-lg shadow-lg ${
                                        isRolling
                                            ? "bg-slate-600 cursor-not-allowed"
                                            : "bg-red-600 hover:bg-red-500 text-white"
                                    }`}
                                >
                                    {isRolling ? "MENGUNDI..." : "🎲 AUTO DRAW"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-slate-500 text-sm mt-8 animate-pulse">
                            Menunggu pengundian dimulai oleh panitia...
                        </div>
                    )}
                </div>

                {/* === KOLOM KANAN (Riwayat Pemenang) === */}
                {/* Fix Width w-96 (sekitar 380px), dan flex-none biar gak melar/menyusut */}
                <div className="w-full lg:w-96 flex-none bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-700 p-6 h-fit max-h-[80vh] overflow-y-auto custom-scrollbar shadow-2xl sticky top-4">
                    <h3 className="text-yellow-400 font-black text-xl mb-6 flex items-center gap-2 border-b border-slate-600 pb-4 sticky top-0 bg-slate-800/50 backdrop-blur-md z-10">
                        📜 Riwayat Pemenang
                    </h3>

                    {winnersHistory.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-slate-500 opacity-50">
                            <span className="text-4xl mb-2">🤷‍♂️</span>
                            <p className="italic text-sm">Belum ada pemenang</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {winnersHistory.map((winner, index) => (
                                <div
                                    key={index}
                                    className="bg-slate-700 p-3 rounded-xl flex items-center justify-between border-l-4 border-yellow-500 animate-fade-in-down shadow-md hover:bg-slate-600 transition-colors"
                                >
                                    <div className="overflow-hidden">
                                        <p className="text-white font-bold text-md truncate">
                                            {winner.name}
                                        </p>
                                        <p className="text-slate-400 text-[10px] uppercase tracking-wider flex items-center gap-1">
                                            🎟️ {winner.coupon_code}
                                        </p>
                                    </div>
                                    <div className="text-yellow-400 font-mono font-bold text-lg opacity-80">
                                        #{winnersHistory.length - index}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
