import React, { useState, useEffect, useRef } from "react";
import { Head } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import ReactConfetti from "react-confetti"; // Biar meriah pas menang!
import Swal from "sweetalert2";
import axios from "axios"; // Nanti dipakai buat nembak backend

export default function LiveDraw({ event, prizes }) {
    // --- STATE UTAMA ---
    const [selectedPrize, setSelectedPrize] = useState(prizes[0]?.id || ""); // Hadiah yang mau diundi
    const [isRolling, setIsRolling] = useState(false); // Status animasi
    const [displayNumber, setDisplayNumber] = useState("XXXX-XXXXXX"); // Angka yang tampil di layar
    const [winner, setWinner] = useState(null); // Data pemenang (kalau udah dapet)
    const [showConfetti, setShowConfetti] = useState(false); // Efek konfeti

    // Ref untuk interval animasi (biar bisa di-stop)
    const rollingInterval = useRef(null);

    // --- FUNGSI: MENGACAK NOMOR (EFEK VISUAL) ---
    const startRollingEffect = () => {
        // Ini cuma efek visual biar kelihatan "ngacak"
        // Kita ganti-ganti angka setiap 50ms
        rollingInterval.current = setInterval(() => {
            // Bikin nomor kupon acak pura-pura
            const randomPart = Math.floor(100000 + Math.random() * 900000);
            setDisplayNumber(`KT-2025-${randomPart}`);
        }, 50);
    };

    // --- FUNGSI UTAMA: TOMBOL "MULAI ACAK" ---
    const handleStartDraw = async () => {
        if (!selectedPrize) {
            Swal.fire(
                "Pilih Hadiah",
                "Silakan pilih hadiah yang akan diundi dulu.",
                "warning"
            );
            return;
        }

        // 1. Mulai animasi visual dulu
        setIsRolling(true);
        setWinner(null);
        setShowConfetti(false);
        startRollingEffect();

        try {
            // 2. Panggil Backend untuk minta 1 pemenang (Logic Hybrid)
            // NANTI: Ganti ini dengan axios.post ke API backend beneran
            // const res = await axios.post(route('admin.draw-single-winner'), {
            //    event_id: event.id,
            //    prize_id: selectedPrize
            // });
            // const realWinner = res.data;

            // --- SIMULASI BACKEND (DUMMY) ---
            // Kita pura-pura nunggu 2 detik seolah-olah backend lagi mikir
            await new Promise((resolve) => setTimeout(resolve, 2000));

            const realWinner = {
                coupon_code: "KT-2025-WINNER",
                name: "Budi Santoso",
                city: "Denpasar",
            };
            // --------------------------------

            // 3. Setelah dapet pemenang dari backend, kita stop animasi
            stopRollingEffect(realWinner);
        } catch (error) {
            console.error("Gagal mengundi:", error);
            clearInterval(rollingInterval.current);
            setIsRolling(false);
            setDisplayNumber("ERROR");
            Swal.fire("Error", "Gagal mengambil data pemenang.", "error");
        }
    };

    // --- FUNGSI: STOP ANIMASI & TAMPILKAN PEMENANG ---
    const stopRollingEffect = (winnerData) => {
        // Jangan langsung berhenti mendadak, kasih delay dikit biar smooth
        setTimeout(() => {
            clearInterval(rollingInterval.current); // Stop acak angka

            setDisplayNumber(winnerData.coupon_code); // Tampilkan nomor asli pemenang
            setWinner(winnerData); // Simpan data lengkap pemenang
            setIsRolling(false); // Update status
            setShowConfetti(true); // Tampilkan konfeti!

            // Matikan konfeti otomatis setelah 7 detik
            setTimeout(() => setShowConfetti(false), 7000);
        }, 1000); // Delay 1 detik sebelum angka berhenti total
    };

    // Cari nama hadiah yang lagi dipilih buat ditampilkan
    const currentPrizeObj = prizes.find((p) => p.id == selectedPrize);

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center relative overflow-hidden font-sans">
            <Head title={`Live Draw - ${event.title}`} />

            {showConfetti && <ReactConfetti recycle={true} />}

            {/* HEADER */}
            <div className="w-full p-6 flex justify-between items-center z-20 relative">
                {/* Logo kiri */}
                <div className="flex items-center gap-4">
                    <img
                        src="/images/logo1.png"
                        alt="Logo"
                        className="h-12 md:h-16 bg-white rounded-lg p-2 shadow-lg"
                    />
                </div>

                {/* Judul Tengah (Hidden di mobile, muncul di desktop) */}
                <h1 className="hidden md:block text-2xl md:text-4xl font-black text-yellow-400 uppercase tracking-widest drop-shadow-md">
                    {event.title}
                </h1>

                {/* Spacer kanan biar seimbang */}
                <div className="w-12 md:w-16"></div>
            </div>

            {/* KONTEN TENGAH (Flex Grow biar ngisi ruang sisa) */}
            <div className="flex-grow flex flex-col items-center justify-center w-full max-w-6xl px-4 z-10 -mt-10">
                {/* 1. Judul Hadiah */}
                <div className="mb-6 md:mb-10 text-center">
                    <p className="text-slate-400 text-sm md:text-xl mb-2 uppercase tracking-[0.2em] font-semibold">
                        Memperebutkan Hadiah:
                    </p>
                    <div className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-900 px-6 md:px-12 py-2 md:py-4 rounded-full text-xl md:text-4xl font-black shadow-2xl transform hover:scale-105 transition-transform duration-300">
                        {currentPrizeObj
                            ? currentPrizeObj.prize_name
                            : "Pilih Hadiah..."}
                    </div>
                </div>

                {/* 2. Kotak Nomor Kupon */}
                <div className="bg-white text-slate-900 rounded-3xl p-8 md:p-16 shadow-[0_0_50px_rgba(255,255,255,0.1)] border-8 border-slate-700 mb-8 w-full max-w-4xl mx-auto transform transition-all duration-300 relative overflow-hidden group">
                    {/* Efek kilau di background kotak */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-slate-100 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>

                    <div
                        className={`font-mono font-black tracking-widest text-center transition-all duration-100 
                        ${
                            isRolling
                                ? "text-5xl md:text-8xl opacity-50 blur-[2px]"
                                : "text-6xl md:text-9xl scale-110 text-slate-800"
                        }`}
                    >
                        {displayNumber}
                    </div>
                </div>

                {/* 3. Data Pemenang */}
                {winner && !isRolling && (
                    <div className="bg-green-600 bg-opacity-90 backdrop-blur-sm border-2 border-green-400 rounded-2xl p-6 md:p-8 mb-8 text-center animate-bounce-in shadow-2xl w-full max-w-2xl">
                        <h2 className="text-xl md:text-2xl font-bold text-green-100 mb-2 uppercase tracking-wider">
                            Selamat Kepada
                        </h2>
                        <p className="text-3xl md:text-5xl font-black text-white mb-2 drop-shadow-md">
                            {winner.name}
                        </p>
                        <p className="text-lg md:text-2xl text-green-200 font-semibold flex items-center justify-center gap-2">
                            <span className="opacity-75">📍</span> {winner.city}
                        </p>
                    </div>
                )}

                {/* 4. Kontrol Admin (Di Bawah) */}
                <div className="flex flex-col md:flex-row gap-4 items-end bg-slate-800/50 p-4 rounded-2xl backdrop-blur-md border border-slate-700">
                    <div className="text-left w-full md:w-auto">
                        <label className="block text-xs text-slate-400 mb-1 uppercase font-bold tracking-wider">
                            Hadiah
                        </label>
                        <select
                            value={selectedPrize}
                            onChange={(e) => {
                                setSelectedPrize(e.target.value);
                                setWinner(null);
                                setDisplayNumber("XXXX-XXXXXX");
                            }}
                            disabled={isRolling}
                            className="bg-slate-700 border-slate-600 text-white rounded-lg px-4 py-2 w-full md:w-64 focus:ring-yellow-500 focus:border-yellow-500 shadow-inner"
                        >
                            {prizes.map((prize) => (
                                <option key={prize.id} value={prize.id}>
                                    {prize.prize_name} (Sisa: {prize.qty})
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={handleStartDraw}
                        disabled={isRolling}
                        className={`w-full md:w-auto px-8 py-2.5 rounded-lg font-bold text-lg shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
                            isRolling
                                ? "bg-slate-600 text-slate-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white hover:shadow-red-600/50 ring-2 ring-red-400/20"
                        }`}
                    >
                        {isRolling ? (
                            <>
                                <span className="animate-spin">↻</span>{" "}
                                MENGACAK...
                            </>
                        ) : (
                            <>🎲 MULAI ACAK</>
                        )}
                    </button>
                </div>
            </div>

            {/* Background Decoration (Tetap sama) */}
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>
        </div>
    );
}
