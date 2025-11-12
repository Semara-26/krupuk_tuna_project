import React, { useState, useEffect } from "react";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import Swal from "sweetalert2";

// Opsi Tipe Hadiah (sesuai controller)
const prizeTypes = [
    { id: 1, name: "Hadiah Utama" },
    { id: 2, name: "Hadiah Hiburan" },
    // { id: 3, name: 'Hadiah Apresiasi' }, // Bisa ditambah jika backend support
];

export default function ModalEvent({ show, onClose, eventData }) {
    // Tentukan mode: 'edit' jika ada eventData, 'create' jika tidak
    const isEditMode = eventData !== null;

    // Kita pakai useForm untuk data utamanya
    const { data, setData, post, processing, errors, reset } = useForm({
        id: eventData?.id || null, //
        title: eventData?.title || "", //
        start_date: eventData?.start_date
            ? eventData.start_date.substring(0, 16)
            : "", //
        last_buy_date: eventData?.last_buy_date
            ? eventData.last_buy_date.substring(0, 16)
            : "", //
    });

    // --- State terpisah untuk Hadiah (karena dinamis) ---
    // Sesuai permintaan klien: 1 Hadiah Utama
    const [hadiahUtama, setHadiahUtama] = useState({
        prize_name: "",
        qty: 1,
        prize_type: 1,
    });
    // Banyak Hadiah Hiburan (pakai logic KuponModal)
    const [hadiahHiburan, setHadiahHiburan] = useState([
        { prize_name: "", qty: 1, prize_type: 2 },
    ]);

    // State untuk total pemenang (otomatis kalkulasi)
    const [totalWinners, setTotalWinners] = useState(1);

    // Efek untuk ngisi form saat mode 'edit'
    useEffect(() => {
        if (isEditMode && eventData.prizes) {
            // Pisahkan hadiah utama dan hiburan dari data yg ada
            const utama = eventData.prizes.find((p) => p.prize_types_id === 1);
            const hiburan = eventData.prizes.filter(
                (p) => p.prize_types_id === 2
            );

            if (utama) setHadiahUtama(utama);
            if (hiburan.length > 0) setHadiahHiburan(hiburan);
            else setHadiahHiburan([{ prize_name: "", qty: 1, prize_type: 2 }]); // Default
        } else {
            // Reset form jika mode 'create'
            reset();
            setHadiahUtama({ prize_name: "", qty: 1, prize_type: 1 });
            setHadiahHiburan([{ prize_name: "", qty: 1, prize_type: 2 }]);
        }
    }, [eventData, show]);

    // Efek untuk kalkulasi total pemenang
    useEffect(() => {
        // Jumlahkan 'qty' dari hadiah utama + semua hadiah hiburan
        const totalHiburan = hadiahHiburan.reduce(
            (acc, prize) => acc + (parseInt(prize.qty, 10) || 0),
            0
        );
        const totalUtama = parseInt(hadiahUtama.qty, 10) || 0;
        setTotalWinners(totalUtama + totalHiburan);
    }, [hadiahUtama, hadiahHiburan]);

    // --- Logic dinamis tambah/ubah Hadiah Hiburan (Req #9) ---
    const handleHiburanChange = (index, field, value) => {
        const updated = [...hadiahHiburan];
        updated[index][field] = value;
        setHadiahHiburan(updated);
    };

    const addHiburanField = () => {
        setHadiahHiburan([
            ...hadiahHiburan,
            { prize_name: "", qty: 1, prize_type: 2 },
        ]);
    };

    const removeHiburanField = (index) => {
        if (hadiahHiburan.length > 1) {
            setHadiahHiburan(hadiahHiburan.filter((_, i) => i !== index));
        }
    };
    // --- Akhir logic dinamis ---

    const handleSubmit = (e) => {
        e.preventDefault();

        // Gabungkan semua hadiah
        const allPrizes = [hadiahUtama, ...hadiahHiburan];

        // Siapkan data lengkap untuk dikirim
        const payload = {
            ...data,
            total_winners: totalWinners, //
            prizes: allPrizes, //
        };

        // Tentukan URL API (Create atau Update)
        const url = isEditMode
            ? route("admin.update-event")
            : route("admin.create-event");

        axios
            .post(url, payload)
            .then((res) => {
                Swal.fire(
                    "Sukses!",
                    `Event berhasil ${isEditMode ? "diperbarui" : "dibuat"}.`,
                    "success"
                );
                onClose();
                window.location.reload(); // Auto-refresh halaman event
            })
            .catch((err) => {
                console.error("Kesalahan Submit Event:", err.response); // <-- TAMBAH LOG INI

                let errorTitle = "Oops... Terjadi Kesalahan";
                let errorMsg = "Terjadi kesalahan server. Cek konsol.";

                if (err.response && err.response.status === 400) {
                    // Cek error 'Event Aktif'
                    if (
                        err.response.data.message ===
                        "Ada event yang belum selesai"
                    ) {
                        errorTitle = "Event Masih Aktif";
                        errorMsg =
                            "Masih ada event yang sedang aktif! Selesaikan dulu event tersebut sebelum membuat yang baru.";

                        // Cek error validasi
                    } else if (
                        err.response.data.data &&
                        Array.isArray(err.response.data.data)
                    ) {
                        errorTitle = "Data Tidak Valid";
                        const errors = err.response.data.data[0]; // Ambil object errors
                        const errorList = Object.values(errors)
                            .map((msg) => `<li>${msg[0]}</li>`)
                            .join("");
                        errorMsg = `<ul style="text-align: left; padding-left: 1.5rem;">${errorList}</ul>`;
                    }
                }

                Swal.fire({
                    icon: "error",
                    title: errorTitle,
                    html: errorMsg, // Tampilkan pesan error yang lebih spesifik
                    confirmButtonColor: "#3085d6",
                });
            });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl closeable={false}">
            <form onSubmit={handleSubmit} className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                    {isEditMode ? "Edit Event" : "Buat Event Baru"}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Kolom Kiri: Detail Event */}
                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="title" value="Judul Event" />
                            <TextInput
                                id="title"
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                className="w-full mt-1"
                                required
                            />
                            <InputError
                                message={errors.title}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="start_date"
                                value="Mulai Undian (Waktu Gacha)"
                            />
                            <TextInput
                                id="start_date"
                                type="datetime-local"
                                value={data.start_date}
                                onChange={(e) =>
                                    setData("start_date", e.target.value)
                                }
                                className="w-full mt-1"
                                required
                            />
                            <InputError
                                message={errors.start_date}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="last_buy_date"
                                value="Batas Akhir Input Kupon"
                            />
                            <TextInput
                                id="last_buy_date"
                                type="datetime-local"
                                value={data.last_buy_date}
                                onChange={(e) =>
                                    setData("last_buy_date", e.target.value)
                                }
                                className="w-full mt-1"
                                required
                            />
                            <InputError
                                message={errors.last_buy_date}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="total_winners"
                                value="Total Pemenang"
                            />
                            <TextInput
                                id="total_winners"
                                type="number"
                                value={totalWinners}
                                className="w-full mt-1 bg-gray-100"
                                readOnly
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Otomatis dihitung dari jumlah Hadiah.
                            </p>
                        </div>
                    </div>

                    {/* Kolom Kanan: Hadiah */}
                    <div className="space-y-4">
                        {/* Hadiah Utama (Sesuai Req Klien) */}
                        <div>
                            <InputLabel
                                value="Hadiah Utama (1 Pemenang)"
                                className="font-bold"
                            />
                            <div className="flex space-x-2 mt-1">
                                <TextInput
                                    placeholder="Cth: Sepeda Motor"
                                    className="w-full"
                                    value={hadiahUtama.prize_name}
                                    onChange={(e) =>
                                        setHadiahUtama({
                                            ...hadiahUtama,
                                            prize_name: e.target.value,
                                        })
                                    }
                                    required
                                />
                                <TextInput
                                    type="number"
                                    className="w-20 bg-gray-100"
                                    value={hadiahUtama.qty}
                                    readOnly
                                />
                            </div>
                        </div>

                        {/* Hadiah Hiburan (Dinamis) */}
                        <div>
                            <InputLabel
                                value="Hadiah Hiburan (Banyak Pemenang)"
                                className="font-bold"
                            />
                            {hadiahHiburan.map((prize, index) => (
                                <div
                                    key={index}
                                    className="flex space-x-2 mt-2"
                                >
                                    <TextInput
                                        placeholder={`Hadiah Hiburan ${
                                            index + 1
                                        }`}
                                        className="w-full"
                                        value={prize.prize_name}
                                        onChange={(e) =>
                                            handleHiburanChange(
                                                index,
                                                "prize_name",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <TextInput
                                        type="number"
                                        className="w-20"
                                        value={prize.qty}
                                        min="1"
                                        onChange={(e) =>
                                            handleHiburanChange(
                                                index,
                                                "qty",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <SecondaryButton
                                        type="button"
                                        onClick={() =>
                                            removeHiburanField(index)
                                        }
                                        className="h-10"
                                    >
                                        X
                                    </SecondaryButton>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addHiburanField}
                                className="text-sm text-blue-600 hover:text-blue-800 mt-2"
                            >
                                + Tambah Hadiah Hiburan
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-4">
                    {" "}
                    <SecondaryButton type="button" onClick={onClose}>
                        Batal
                    </SecondaryButton>
                    <PrimaryButton disabled={processing}>
                        Simpan Event
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
