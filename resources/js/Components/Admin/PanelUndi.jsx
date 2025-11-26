import React, { useState, useEffect } from "react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import InputError from "@/Components/InputError";
import axios from "axios";
import Swal from "sweetalert2";
import Checkbox from "@/Components/Checkbox";

export default function PanelUndi({
    activeEvent,
    totalWinnersNeeded,
    // sisaPemenang, // Kita hitung sendiri aja di sini biar real-time
}) {
    // State untuk menyimpan daftar pemenang (Manual + Random)
    const [winners, setWinners] = useState([]);

    // State untuk mode (manual = true / random = false)
    const [isManual, setIsManual] = useState(true);

    // State untuk input manual
    const [couponCode, setCouponCode] = useState("");
    const [couponInfo, setCouponInfo] = useState(null);
    const [couponError, setCouponError] = useState("");

    // State untuk input random
    const [randomAmount, setRandomAmount] = useState(0);

    // State untuk hadiah yang dipilih
    const [selectedPrizeId, setSelectedPrizeId] = useState("");

    // --- LOGIC BARU: Hitung Sisa Pemenang Secara Real-time ---
    const winnersCount = winners.length;
    const winnersRemaining = Math.max(0, totalWinnersNeeded - winnersCount);

    // Update default randomAmount tiap kali jumlah pemenang berubah
    useEffect(() => {
        setRandomAmount(winnersRemaining);
    }, [winnersRemaining]);
    // ---------------------------------------------------------

    const handleModeChange = (mode) => {
        if (mode === "manual") {
            setIsManual(true);
        } else {
            setIsManual(false);
        }
        // Reset inputan form, TAPI JANGAN RESET 'winners'
        setCouponCode("");
        setCouponInfo(null);
    };

    const handleCheckCoupon = (e) => {
        e.preventDefault();
        setCouponError("");
        setCouponInfo(null);

        if (!couponCode) return;

        // Validasi: Cek apakah kupon ini udah ada di daftar 'winners' lokal
        const isAlreadyAdded = winners.some(w => w.coupon_code === couponCode);
        if (isAlreadyAdded) {
            Swal.fire("Gagal", "Kupon ini sudah Anda tambahkan ke daftar pemenang.", "warning");
            return;
        }

        Swal.fire({
            title: "Memeriksa Kupon...",
            text: "Sedang memverifikasi kode kupon",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
        });

        axios.get(route("admin.coupon.check", { coupon: couponCode }))
            .then((res) => {
                Swal.close();
                if (res.data.code === 200) {
                    setCouponInfo(res.data.data[0]);
                    Swal.fire({
                        icon: "success",
                        title: "Kupon Ditemukan!",
                        html: `<div style="text-align: left;">
                                <p><strong>Pemilik:</strong> ${res.data.data[0].full_name}</p>
                                <p><strong>Kode:</strong> ${couponCode}</p>
                               </div>`,
                        confirmButtonText: "OK",
                    });
                } else {
                    setCouponError(res.data.message);
                    Swal.fire("Gagal", res.data.message, "error");
                }
            })
            .catch((err) => {
                Swal.close();
                const msg = err.response?.data?.message || "Kupon tidak ditemukan";
                setCouponError(msg);
                Swal.fire("Error", msg, "error");
            });
    };

    const addManualWinner = () => {
        if (!selectedPrizeId) {
            Swal.fire("Oops!", "Pilih hadiahnya dulu.", "warning");
            return;
        }
        // Validasi Slot Penuh
        if (winnersRemaining <= 0) {
            Swal.fire("Penuh!", "Kuota pemenang untuk hadiah ini sudah penuh.", "warning");
            return;
        }

        const newWinner = {
            full_name: couponInfo.full_name,
            coupon_code: couponCode,
            prize_type: selectedPrizeId,
            source: 'manual' // Penanda buat UI (opsional)
        };
        
        // Tambah ke list (GABUNGKAN)
        setWinners([...winners, newWinner]);

        setCouponCode("");
        setCouponInfo(null);
        
        const Toast = Swal.mixin({
            toast: true, position: 'top-end', showConfirmButton: false, timer: 3000
        });
        Toast.fire({ icon: 'success', title: 'Pemenang manual ditambahkan' });
    };

    // --- LOGIC BARU: Generate Random Bertahap ---
    const handleGenerateRandom = () => {
        if (!selectedPrizeId) {
            Swal.fire("Oops!", "Pilih hadiahnya dulu.", "warning");
            return;
        }
        
        // Validasi input jumlah
        if (randomAmount <= 0) {
            Swal.fire("Eits!", "Jumlah pemenang harus lebih dari 0.", "warning");
            return;
        }
        if (randomAmount > winnersRemaining) {
            Swal.fire("Kelebihan!", `Sisa kuota cuma ${winnersRemaining}. Jangan serakah ya.`, "warning");
            return;
        }

        Swal.fire({
            title: "Mengundi...",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        axios.get(route("admin.draw", {
                event_id: activeEvent.id,
                num: randomAmount,
            }))
            .then((res) => {
                Swal.close();
                const randomWinners = res.data.data;
                
                const formattedWinners = randomWinners.map((w) => ({
                    ...w,
                    prize_type: selectedPrizeId, // Pakai hadiah yang dipilih admin
                    source: 'random'
                }));

                // GABUNGKAN dengan pemenang manual yg udah ada
                // Jangan ditimpa (setWinners(formattedWinners) -> SALAH)
                setWinners(prevWinners => [...prevWinners, ...formattedWinners]);

                Swal.fire("Sukses", `${randomWinners.length} pemenang random berhasil ditambahkan.`, "success");
            })
            .catch((err) => {
                Swal.close();
                Swal.fire("Error", err?.response?.data?.message || "Gagal mengundi random.", "error");
            });
    };

    // Fungsi Hapus Pemenang dari List Sementara
    const removeWinner = (index) => {
        setWinners(winners.filter((_, i) => i !== index));
    };

    const handleStoreWinners = () => {
        if (winners.length === 0) {
            Swal.fire({ icon: "error", title: "Daftar pemenang masih kosong" });
            return;
        }
        // Validasi akhir sebelum simpan ke DB
        if (winners.length !== totalWinnersNeeded) {
             Swal.fire({ 
                 icon: "warning", 
                 title: "Belum Selesai", 
                 text: `Anda baru memilih ${winners.length} dari ${totalWinnersNeeded} pemenang yang dibutuhkan.` 
            });
            return;
        }

        const payload = {
            events_id: activeEvent.id,
            winners: winners.map((w) => ({
                coupon_code: w.coupon_code,
                prize_type: w.prize_type,
            })),
        };

        Swal.fire({
            title: 'Simpan Pemenang?',
            text: "Pastikan data sudah benar. Aksi ini tidak bisa dibatalkan.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Simpan',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return axios.post(route("admin.winners.store"), payload)
                    .then((res) => {
                        return res;
                    })
                    .catch((err) => {
                        Swal.showValidationMessage(
                            `Request failed: ${err.response?.data?.message || err.message}`
                        )
                    });
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: "success",
                    title: "Tersimpan!",
                    text: "Pemenang berhasil disimpan.",
                    timer: 1500,
                    showConfirmButton: false,
                }).then(() => {
                    window.location.reload();
                });
            }
        });
    };

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                    Panel Undi Pemenang
                </h3>
                {/* Indikator Kuota */}
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${winnersRemaining === 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    Sisa Kuota: {winnersRemaining} Orang
                </span>
            </div>

            {/* 1. PILIH HADIAH (Berlaku untuk Manual & Random) */}
            <div className="mb-6">
                <InputLabel value="1. Pilih Hadiah yang Sedang Diundi" />
                <select
                    className="w-full mt-1 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    value={selectedPrizeId}
                    onChange={(e) => setSelectedPrizeId(e.target.value)}
                >
                    <option value="">-- Pilih Hadiah --</option>
                    {activeEvent.prizes.map((p) => (
                        <option key={p.id} value={p.prize_types_id}>
                            {p.prize_name} (Sisa: {p.qty})
                        </option>
                    ))}
                </select>
            </div>

            {/* 2. MODE CHECKBOX */}
            <div className="flex gap-6 mb-4">
                <label className="flex items-center cursor-pointer select-none">
                    <Checkbox
                        checked={isManual}
                        onChange={() => handleModeChange("manual")}
                    />
                    <span className="ml-2 text-gray-700 font-semibold">Mode Manual</span>
                </label>

                <label className="flex items-center cursor-pointer select-none">
                    <Checkbox
                        checked={!isManual}
                        onChange={() => handleModeChange("random")}
                    />
                    <span className="ml-2 text-gray-700 font-semibold">Mode Random</span>
                </label>
            </div>

            {/* 3. KONTEN PANEL */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                
                {/* --- UI MANUAL --- */}
                {isManual && (
                    <div className="space-y-4">
                        <div>
                            <InputLabel value="Cari Kupon Manual" />
                            <div className="flex mt-1">
                                <TextInput
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    className="flex-grow rounded-l-md"
                                    placeholder="Masukkan kode kupon..."
                                />
                                <SecondaryButton onClick={handleCheckCoupon} className="rounded-l-none h-10 border-l-0">
                                    Cek
                                </SecondaryButton>
                            </div>
                            {couponError && <InputError message={couponError} className="mt-1" />}
                        </div>

                        {couponInfo && (
                            <div className="mt-2 p-3 bg-white border border-green-300 rounded-md flex justify-between items-center shadow-sm">
                                <div>
                                    <p className="font-bold text-gray-800">{couponInfo.full_name}</p>
                                    <p className="text-xs text-gray-500 font-mono">{couponCode}</p>
                                </div>
                                <PrimaryButton onClick={addManualWinner} className="text-xs h-8" disabled={!selectedPrizeId}>
                                    + Tambah
                                </PrimaryButton>
                            </div>
                        )}
                    </div>
                )}

                {/* --- UI RANDOM --- */}
                {!isManual && (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                            Sistem akan memilih pemenang secara acak untuk mengisi sisa kuota.
                        </p>
                        <div className="flex items-end gap-2">
                            <div className="flex-grow">
                                <InputLabel value={`Jumlah yang diundi (Max: ${winnersRemaining})`} />
                                <TextInput
                                    type="number"
                                    value={randomAmount}
                                    onChange={(e) => setRandomAmount(e.target.value)}
                                    className="w-full mt-1"
                                    min="1"
                                    max={winnersRemaining}
                                />
                            </div>
                            <PrimaryButton onClick={handleGenerateRandom} disabled={!selectedPrizeId || winnersRemaining === 0}>
                                Generate Random
                            </PrimaryButton>
                        </div>
                    </div>
                )}
            </div>

            {/* 4. PREVIEW DAFTAR PEMENANG SEMENTARA (Wajib ada biar admin tau siapa aja yg udah masuk) */}
            {winners.length > 0 && (
                <div className="mt-6">
                    <h4 className="text-sm font-bold text-gray-700 mb-2">Daftar Pemenang Sementara:</h4>
                    <ul className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2 bg-gray-50">
                        {winners.map((w, i) => (
                            <li key={i} className="flex justify-between items-center p-2 bg-white border rounded shadow-sm text-sm">
                                <div>
                                    <span className="font-bold block text-gray-800">{w.full_name}</span>
                                    <span className="text-xs text-gray-500">{w.coupon_code} • <span className="text-blue-600 font-semibold">{w.source === 'manual' ? 'Manual' : 'Random'}</span></span>
                                </div>
                                <button onClick={() => removeWinner(i)} className="text-red-500 hover:text-red-700 font-bold px-2">
                                    &times;
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* 5. FOOTER */}
            <div className="mt-6 pt-4 border-t text-right">
                <PrimaryButton
                    onClick={handleStoreWinners}
                    className="w-full justify-center h-10 bg-green-600 hover:bg-green-700 disabled:opacity-50"
                    disabled={winnersRemaining > 0}
                >
                    {winnersRemaining > 0 
                        ? `Lengkapi ${winnersRemaining} Pemenang Lagi` 
                        : "SIMPAN SEMUA KE DATABASE"
                    }
                </PrimaryButton>
            </div>
        </div>
    );
}