import React, { useState, useEffect } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputError from '@/Components/InputError';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function PanelUndi({ activeEvent, totalWinnersNeeded }) {

    // State untuk menyimpan daftar pemenang yang akan disimpan
    const [winners, setWinners] = useState([]);
    
    // State untuk mode (manual / random)
    const [drawMode, setDrawMode] = useState('manual'); // 'manual' atau 'random'

    // State untuk input manual
    const [couponCode, setCouponCode] = useState('');
    const [couponInfo, setCouponInfo] = useState(null); // Info nama dari hasil cek
    const [couponError, setCouponError] = useState('');
    
    // State untuk input random
    const [randomAmount, setRandomAmount] = useState(totalWinnersNeeded);
    
    // State untuk hadiah yang dipilih
    // Admin HARUS pilih hadiah dulu sebelum milih pemenang
    const [selectedPrizeId, setSelectedPrizeId] = useState('');

    // Hitung sisa pemenang
    const winnersCount = winners.length;
    const winnersRemaining = totalWinnersNeeded - winnersCount;
    
    // Fungsi cek kupon (Manual)
    const handleCheckCoupon = (e) => {
        e.preventDefault();
        setCouponError('');
        setCouponInfo(null);
        axios.get(route('admin.coupon.check', { coupon: couponCode }))
            .then(res => {
                // Backend return data: [{ id, full_name }]
                setCouponInfo(res.data.data[0]); 
            })
            .catch(err => {
                setCouponError(err.response.data.message || 'Kupon tidak ditemukan');
            });
    };

    // Fungsi tambah pemenang manual ke list
    const addManualWinner = () => {
        if (!selectedPrizeId) {
            Swal.fire('Oops!', 'Pilih hadiahnya dulu sebelum menambah pemenang.', 'warning');
            return;
        }
        
        winners.push({
            full_name: couponInfo.full_name,
            coupon_code: couponCode,
            prize_type: selectedPrizeId 
        });

        // Reset form manual
        setCouponCode('');
        setCouponInfo(null);
    };

    // Fungsi generate pemenang random
    const handleGenerateRandom = () => {
        // Panggil API randomGacha
        axios.get(route('admin.draw', { event_id: activeEvent.id, num: randomAmount }))
            .then(res => {
                // Data dari backend: [{ id, full_name, coupon_code }]
                const randomWinners = res.data.data;
                
                // Di sini kita perlu "menebak" hadiahnya
                // Skenario simpel: Kita anggap semua ini Hadiah Hiburan (ID 2)
                const formattedWinners = randomWinners.map(w => ({
                    ...w,
                    prize_type: 2 // Asumsi Hadiah Hiburan
                }));

                setWinners(formattedWinners);
                Swal.fire('Sukses', `${randomWinners.length} pemenang random berhasil digenerate.`, 'success');
            })
            .catch(err => {
                Swal.fire('Error', 'Gagal mengundi random.', 'error');
            });
    };
    
    // Fungsi Simpan Semua Pemenang ke DB
    const handleStoreWinners = () => {
        // Validasi Req #3 (sesuai backend)
        if (winners.length !== totalWinnersNeeded) {
             Swal.fire({
                icon: 'error',
                title: 'Jumlah Tidak Sesuai',
                text: `Total pemenang yang diset di event (${totalWinnersNeeded}) tidak sesuai dengan jumlah yang ada di daftar (${winners.length}).`,
            });
            return;
        }

        const payload = {
            events_id: activeEvent.id,
            winners: winners.map(w => ({ // Format data sesuai API
                coupon_code: w.coupon_code,
                prize_type: w.prize_type
            }))
        };

        axios.post(route('admin.winners.store'), payload)
            .then(res => {
                Swal.fire('BERHASIL!', 'Semua pemenang telah disimpan ke database.', 'success');
                // Disarankan juga untuk memanggil 'endGachaEvent' di sini
            })
            .catch(err => {
                Swal.fire('Error', err.response.data.message || 'Gagal menyimpan pemenang.', 'error');
            });
    };

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">
                Panel Undi Pemenang
            </h3>

            {/* Pilihan Mode */}
            <div className="mt-4 flex gap-4">
                <button 
                    onClick={() => setDrawMode('manual')}
                    className={`px-4 py-2 rounded-md ${drawMode === 'manual' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                    Mode Manual
                </button>
                <button 
                    onClick={() => setDrawMode('random')}
                    className={`px-4 py-2 rounded-md ${drawMode === 'random' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                    Mode Random
                </button>
            </div>

            {/* --- UI UNTUK MODE MANUAL --- */}
            {drawMode === 'manual' && (
                <div className="mt-4 border-t pt-4">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Kolom pilih hadiah & kupon */}
                        <div>
                            <InputLabel value="1. Pilih Hadiah" />
                            <select 
                                className="w-full mt-1 rounded-md"
                                value={selectedPrizeId}
                                onChange={e => setSelectedPrizeId(e.target.value)}
                            >
                                <option value="">Pilih Hadiah...</option>
                                {activeEvent.prizes.map(p => (
                                    <option key={p.id} value={p.prize_types_id}>
                                        {p.prize_name} (Sisa: {p.qty})
                                    </option>
                                ))}
                            </select>

                            <InputLabel value="2. Cari Kupon" className="mt-4" />
                            <form onSubmit={handleCheckCoupon} className="flex mt-1">
                                <TextInput 
                                    value={couponCode} 
                                    onChange={e => setCouponCode(e.target.value)} 
                                    className="flex-grow rounded-l-md" 
                                    placeholder="Masukkan kode kupon..."
                                />
                                <SecondaryButton type="submit" className="rounded-l-none">Cek</SecondaryButton>
                            </form>
                            {couponError && <InputError message={couponError} className="mt-1" />}

                            {/* Info Kupon Hasil Cek */}
                            {couponInfo && (
                                <div className="mt-4 p-3 bg-green-50 border border-green-300 rounded-md">
                                    <p className="font-bold">{couponInfo.full_name}</p>
                                    <p className="text-sm text-gray-600">{couponCode}</p>
                                    <PrimaryButton onClick={addManualWinner} className="mt-2 text-xs">
                                        + Tambah ke Pemenang
                                    </PrimaryButton>
                                </div>
                            )}
                        </div>
                        {/* Kolom daftar pemenang */}
                        <div className="border-l pl-4">
                            <p className="font-bold">Daftar Pemenang ({winnersCount} / {totalWinnersNeeded})</p>
                            <ul className="mt-2 space-y-2 text-sm max-h-60 overflow-y-auto">
                                {winners.map((w, i) => (
                                    <li key={i} className="p-2 bg-gray-50 rounded">
                                        <span className="font-bold block">{w.full_name}</span>
                                        <span className="text-gray-600">{w.coupon_code}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
            
            {/* --- UI UNTUK MODE RANDOM --- */}
            {drawMode === 'random' && (
                <div className="mt-4 border-t pt-4">
                    <p className="text-sm text-gray-600">
                        Mode ini akan mengundi semua pemenang sekaligus secara random. Daftar pemenang manual akan ditimpa.
                    </p>
                    <div className="flex items-end gap-2 mt-2">
                        <div>
                            <InputLabel value="Total Pemenang" />
                            <TextInput type="number" value={randomAmount} onChange={e => setRandomAmount(e.target.value)} className="w-32 mt-1" />
                        </div>
                         <PrimaryButton onClick={handleGenerateRandom}>
                            Generate Pemenang Random
                        </PrimaryButton>
                    </div>
                </div>
            )}
            
            {/* Tombol Simpan (Selalu Tampil) */}
            <div className="mt-6 border-t pt-4 text-right">
                <PrimaryButton 
                    onClick={handleStoreWinners} 
                    disabled={winnersRemaining > 0}
                    className="bg-green-600 hover:bg-green-700"
                >
                    Simpan {winnersCount} Pemenang
                </PrimaryButton>
                {winnersRemaining > 0 && (
                    <p className="text-xs text-red-500 mt-1">
                        Masih butuh {winnersRemaining} pemenang lagi.
                    </p>
                )}
            </div>

        </div>
    );
}