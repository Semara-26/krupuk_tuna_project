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
    totalWinnersNeeded, // Total kuota (misal 16)
    sisaPemenang,      // Sisa kuota dari DB (misal 16, atau 5 kalau udah ada yg disimpen)
}) {
    // State untuk menyimpan daftar pemenang BARU yang akan disimpan (belum ada di DB)
    const [winners, setWinners] = useState([]);

    const [isManual, setIsManual] = useState(true);
    const [couponCode, setCouponCode] = useState("");
    const [couponInfo, setCouponInfo] = useState(null);
    const [couponError, setCouponError] = useState("");
    
    // Default random amount adalah sisa kuota real-time
    const [randomAmount, setRandomAmount] = useState(0);
    const [selectedPrizeId, setSelectedPrizeId] = useState("");

    // --- LOGIC BARU: Hitung Sisa Kuota Real-time ---
    // Sisa Slot = (Sisa dari DB) - (Yang baru kita input di sesi ini)
    const currentWinnersCount = winners.length;
    const realTimeRemaining = Math.max(0, sisaPemenang - currentWinnersCount);

    // Update default input random setiap kali sisa berubah
    useEffect(() => {
        setRandomAmount(realTimeRemaining);
    }, [realTimeRemaining]);
    // ------------------------------------------------

    const handleModeChange = (mode) => {
        if (mode === "manual") setIsManual(true);
        else setIsManual(false);
        
        setCouponCode("");
        setCouponInfo(null);
    };

    const handleCheckCoupon = (e) => {
        e.preventDefault();
        setCouponError("");
        setCouponInfo(null);

        if (!couponCode) return;

        // Validasi: Cek duplikasi di list lokal
        if (winners.some(w => w.coupon_code === couponCode)) {
            Swal.fire("Gagal", "Kupon ini barusan Anda masukkan.", "warning");
            return;
        }

        Swal.fire({
            title: "Memeriksa Kupon...",
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
                        title: "Ditemukan!",
                        text: `Pemilik: ${res.data.data[0].full_name}`,
                        timer: 1000,
                        showConfirmButton: false
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
        // Validasi Slot Penuh (Berdasarkan sisa real-time)
        if (realTimeRemaining <= 0) {
            Swal.fire("Penuh!", "Kuota pemenang sudah habis untuk saat ini. Simpan dulu jika ingin melanjutkan.", "warning");
            return;
        }

        const newWinner = {
            full_name: couponInfo.full_name,
            coupon_code: couponCode,
            prize_type: selectedPrizeId,
            source: 'manual'
        };
        setWinners([...winners, newWinner]);
        setCouponCode("");
        setCouponInfo(null);
    };

    const handleGenerateRandom = () => {
        if (!selectedPrizeId) {
            Swal.fire("Oops!", "Pilih hadiahnya dulu.", "warning");
            return;
        }
        if (randomAmount <= 0) {
            Swal.fire("Eits!", "Jumlah harus lebih dari 0.", "warning");
            return;
        }
        // Validasi tidak boleh melebihi sisa kuota real-time
        if (randomAmount > realTimeRemaining) {
            Swal.fire("Kelebihan!", `Sisa kuota tinggal ${realTimeRemaining}.`, "warning");
            return;
        }

        Swal.fire({ title: "Mengundi...", didOpen: () => Swal.showLoading() });

        axios.get(route("admin.draw", {
                event_id: activeEvent.id,
                num: randomAmount,
            }))
            .then((res) => {
                Swal.close();
                const randomWinners = res.data.data;
                const formattedWinners = randomWinners.map((w) => ({
                    ...w,
                    prize_type: selectedPrizeId,
                    source: 'random'
                }));
                
                setWinners(prev => [...prev, ...formattedWinners]);
                Swal.fire("Sukses", `${randomWinners.length} pemenang ditambahkan.`, "success");
            })
            .catch((err) => {
                Swal.close();
                Swal.fire("Error", "Gagal mengundi random.", "error");
            });
    };

    const removeWinner = (index) => {
        setWinners(winners.filter((_, i) => i !== index));
    };

    // --- REVISI: Fungsi Simpan (Bisa Partial Save) ---
    const handleStoreWinners = () => {
        if (winners.length === 0) {
            Swal.fire({ icon: "error", title: "Belum ada pemenang baru yang dipilih" });
            return;
        }
        
        // HAPUS validasi "harus penuh". Sekarang boleh simpan berapapun.

        const payload = {
            events_id: activeEvent.id,
            winners: winners.map((w) => ({
                coupon_code: w.coupon_code,
                prize_type: w.prize_type,
            })),
        };

        Swal.fire({
            title: `Simpan ${winners.length} Pemenang?`,
            text: "Data akan disimpan ke database dan tidak bisa diubah lagi.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Simpan',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return axios.post(route("admin.winners.store"), payload)
                    .then((res) => { return res; })
                    .catch((err) => {
                        Swal.showValidationMessage(err.response?.data?.message || err.message);
                    });
            }
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: "success",
                    title: "Tersimpan!",
                    timer: 1500,
                    showConfirmButton: false,
                }).then(() => {
                    window.location.reload(); // Refresh halaman untuk update sisa kuota dari DB
                });
            }
        });
    };

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h3 className="text-lg font-bold text-gray-800">Panel Undi Pemenang</h3>
                {/* Indikator Sisa Kuota Real-time */}
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${realTimeRemaining === 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    Sisa Slot: {realTimeRemaining} / {totalWinnersNeeded}
                </span>
            </div>

            {/* Pilih Hadiah */}
            <div className="mb-6">
                <InputLabel value="1. Pilih Hadiah" />
                <select
                    className="w-full mt-1 rounded-md border-gray-300"
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

            {/* Mode Checkbox */}
            <div className="flex gap-6 mb-4">
                <label className="flex items-center cursor-pointer select-none">
                    <Checkbox checked={isManual} onChange={() => handleModeChange("manual")} />
                    <span className="ml-2 text-gray-700 font-semibold">Mode Manual</span>
                </label>
                <label className="flex items-center cursor-pointer select-none">
                    <Checkbox checked={!isManual} onChange={() => handleModeChange("random")} />
                    <span className="ml-2 text-gray-700 font-semibold">Mode Random</span>
                </label>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                {/* UI MANUAL */}
                {isManual && (
                    <div className="space-y-4">
                        <div>
                            <InputLabel value="Cari Kupon" />
                            <div className="flex mt-1">
                                <TextInput
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    className="flex-grow rounded-l-md"
                                    placeholder="Masukkan kode kupon..."
                                />
                                <SecondaryButton onClick={handleCheckCoupon} className="rounded-l-none">Cek</SecondaryButton>
                            </div>
                            {couponError && <InputError message={couponError} className="mt-1" />}
                        </div>
                        {couponInfo && (
                            <div className="mt-2 p-3 bg-white border border-green-300 rounded-md flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-gray-800">{couponInfo.full_name}</p>
                                    <p className="text-xs text-gray-500 font-mono">{couponCode}</p>
                                </div>
                                <PrimaryButton onClick={addManualWinner} className="text-xs" disabled={realTimeRemaining <= 0}>
                                    + Tambah
                                </PrimaryButton>
                            </div>
                        )}
                    </div>
                )}

                {/* UI RANDOM */}
                {!isManual && (
                    <div className="space-y-4">
                        <div className="flex items-end gap-2">
                            <div className="flex-grow">
                                <InputLabel value={`Jumlah (Max: ${realTimeRemaining})`} />
                                <TextInput
                                    type="number"
                                    value={randomAmount}
                                    onChange={(e) => setRandomAmount(e.target.value)}
                                    className="w-full mt-1"
                                    min="1"
                                    max={realTimeRemaining}
                                />
                            </div>
                            <PrimaryButton onClick={handleGenerateRandom} disabled={!selectedPrizeId || realTimeRemaining <= 0}>
                                Generate
                            </PrimaryButton>
                        </div>
                    </div>
                )}
            </div>

            {/* Preview Pemenang Baru */}
            {winners.length > 0 && (
                <div className="mt-6">
                    <h4 className="text-sm font-bold text-gray-700 mb-2">Pemenang Baru (Belum Disimpan):</h4>
                    <ul className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2 bg-yellow-50">
                        {winners.map((w, i) => (
                            <li key={i} className="flex justify-between items-center p-2 bg-white border rounded shadow-sm text-sm">
                                <div>
                                    <span className="font-bold block text-gray-800">{w.full_name}</span>
                                    <span className="text-xs text-gray-500">{w.coupon_code} • {w.source}</span>
                                </div>
                                <button onClick={() => removeWinner(i)} className="text-red-500 font-bold px-2">&times;</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Footer */}
            <div className="mt-6 border-t pt-4">
                <PrimaryButton
                    onClick={handleStoreWinners}
                    className="w-full justify-center bg-green-600 hover:bg-green-700"
                    disabled={winners.length === 0}
                >
                    Simpan {winners.length} Pemenang ke Database
                </PrimaryButton>
                {/* Tampilkan status kalau sudah selesai */}
                {realTimeRemaining === 0 && winners.length === 0 && (
                    <p className="text-center text-green-600 font-bold mt-2">Semua kuota pemenang sudah terisi!</p>
                )}
            </div>
        </div>
    );
}