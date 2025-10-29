import { useState, useEffect } from "react";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import Swal from "sweetalert2";

export default function KuponModal({ show, onClose }) {
    //Setup form pakai useForm
    // DATA DUMMY
    const dummyProvinces = [
        { id: 1, name: "JAWA BARAT" },
        { id: 2, name: "BALI" },
        { id: 3, name: "MALUKU" },
    ];

    const dummyCitiesData = {
        1: [
            // Kota untuk Jawa Barat (ID 1)
            { id: 101, name: "Bandung" },
            { id: 102, name: "Bogor" },
            { id: 103, name: "Bekasi" },
        ],
        2: [
            // Kota untuk Bali (ID 2)
            { id: 201, name: "Denpasar" },
            { id: 202, name: "Badung" },
            { id: 203, name: "Gianyar" },
        ],
        3: [
            // Kota untuk Maluku (ID 3)
            { id: 301, name: "Ambon" },
            { id: 302, name: "Tual" },
        ],
    };
    // --- AKHIR DATA DUMMY ---

    const [provinces, setProvinces] = useState(dummyProvinces);
    const [cities, setCities] = useState([]);
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        recentlySuccessful,
    } = useForm({
        kupon: "",
        email: "",
        full_name: "",
        phone: "",
        province_id: "",
        city_id: "",
    });

    // --- DI-COMMENT: Matikan fetch data otomatis ---
    useEffect(() => {
        // Hanya fetch jika modal tampil DAN data provinsi kosong
        // if (show && provinces.length === 0) {
        //     const fetchProvinces = async () => {
        //         try {
        //             // !!! GANTI NAMA ROUTE ini sesuai info backend
        //             const res = await axios.get(route("wilayah.province.get"));
        //             // Asumsi struktur data sama: res.data.data.data
        //             // Sesuaikan jika beda
        //             if (
        //                 res.data &&
        //                 res.data.data &&
        //                 Array.isArray(res.data.data.data)
        //             ) {
        //                 setProvinces(res.data.data.data);
        //             } else {
        //                 // Atau mungkin strukturnya lebih simpel?
        //                 setProvinces(res.data.data);
        //             }
        //         } catch (err) {
        //             console.error("Failed to load provinces:", err);
        //         }
        //     };
        //     fetchProvinces();
        // }
    }, [show]); // 'show' jadi dependency

    // --- 6. Pinjam logic handleProvinceChange dari OrderModal ---
    const handleProvinceChange = async (e) => {
        const provinceId = e.target.value;
        setData("province_id", provinceId);

        // Reset city
        setCities([]);
        setData("city_id", "");

        // --- Logic baru (dummy) ---
        console.log("Mengambil data dummy kota untuk province ID:", provinceId);
        const fetchedCities = dummyCitiesData[provinceId] || [];
        setCities(fetchedCities);

        // Logic asli di comment dulu
        // if (provinceId) {
        //     try {
        //         // !!! GANTI NAMA ROUTE ini sesuai info backend
        //         const res = await axios.get(
        //             route("wilayah.city.get", { province_id: provinceId })
        //         );

        //         // Sesuaikan struktur data jika beda
        //         if (
        //             res.data &&
        //             res.data.data &&
        //             Array.isArray(res.data.data.data)
        //         ) {
        //             setCities(res.data.data.data);
        //         } else {
        //             setCities(res.data.data);
        //         }
        //     } catch (err) {
        //         console.error("Failed to load cities:", err);
        //         setCities([]);
        //     }
        // }
    };

    // 2. Fungsi untuk submit
    const handleSubmit = (e) => {
        e.preventDefault();

        // --- CUMA BUAT TESTING (UNTUK NGAKALIN) ---

        // 1. (Opsional) Cek datanya di konsol
        console.log("Data form (dummy submit):", data);

        // 2. Langsung panggil logic onSuccess
        Swal.fire({
            title: "Sukses! (Testing)",
            text: "Kupon Anda telah dicatat.",
            icon: "success",
            confirmButtonText: "Selesai",
            confirmButtonColor: "#dc2626",
        }).then((result) => {
            if (result.isConfirmed) {
                handleClose();
            }
        });

        // --- LOGIC ASLI (DI-COMMENT DULU SAMPAI ROUTE-NYA SIAP) ---
        // post(route("kupon.check"), {
        //     preserveScroll: true,
        //     onSuccess: () => {

        //         // Tampilkan SweetAlert
        //         Swal.fire({
        //             title: "Sukses!",
        //             text: "Kupon Anda telah dicatat.",
        //             icon: "success",
        //             confirmButtonText: "Selesai",
        //             confirmButtonColor: "#dc2626", // Opsional: Samain warna tombol (merah)
        //         }).then((result) => {
        //             // Tutup modal HANYA JIKA user klik tombol "Selesai"
        //             if (result.isConfirmed) {
        //                 handleClose();
        //             }
        //         });
        //     },
        //     onError: (errors) => {
        //         // 'errors' di sini adalah object berisi semua error
        //         // Contoh: { kupon: "Kupon wajib diisi", email: "Email tidak valid" }

        //         // Ambil semua pesan error dan format jadi list HTML
        //         const errorMessages = Object.values(errors);
        //         const htmlMessage = `
        //             <ul style="text-align: left; padding-left: 1.5rem; margin: 0;">
        //                 ${errorMessages
        //                     .map((msg) => `<li>${msg}</li>`)
        //                     .join("")}
        //             </ul>
        //         `;

        //         Swal.fire({
        //             title: "Oops! Ada yang Salah",
        //             html: htmlMessage,
        //             icon: "error",
        //             confirmButtonText: "Saya Mengerti",
        //             confirmButtonColor: "#dc2626",
        //         });

        //         // Buat "kamus" yang memetakan key error ke ID elemen
        //         const fieldIdMap = {
        //             kupon: "kupon",
        //             province_id: "province_kupon",
        //             city_id: "city_kupon",
        //             full_name: "full_name_kupon",
        //             email: "email_kupon",
        //             phone: "phone_kupon",
        //         };

        //         // Ambil 'key' error pertama
        //         const firstErrorKey = Object.keys(errors)[0];

        //         // Cari ID elemen yang sesuai di "kamus"
        //         const elementIdToFocus = fieldIdMap[firstErrorKey];

        //         // okus ke elemen itu jika ID-nya ada
        //         // Tanda tanya (?) (optional chaining) biar aman
        //         // kalau-kalau ID-nya ngga ketemu
        //         document.getElementById(elementIdToFocus)?.focus();
        //     },
        // });
    };

    const handleClose = () => {
        onClose();
        setTimeout(() => {
            reset();
            setCities([]);
        }, 300);
    };

    return (
        <Modal show={show} onClose={handleClose} maxWidth="md">
            <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-scroll">
                <h2 className="text-lg font-medium text-gray-900 mb-4 text-center border-b pb-2">
                    Input Kupon Undian
                </h2>
                <div className="space-y-4 pr-2">
                        <div>
                            <InputLabel
                                htmlFor="kupon"
                                value="Nomor Kupon Undian"
                            />
                            <TextInput
                                id="kupon"
                                value={data.kupon}
                                onChange={(e) =>
                                    setData("kupon", e.target.value)
                                }
                                className="mt-1 block w-full"
                                required
                                isFocused
                            />
                            <InputError
                                message={errors.kupon}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="province_kupon"
                                value="Provinsi"
                            />
                            <select
                                id="province_kupon"
                                value={data.province_id}
                                onChange={handleProvinceChange}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                required
                            >
                                <option value="">Pilih Provinsi</option>
                                {provinces.map((prov) => (
                                    <option key={prov.id} value={prov.id}>
                                        {prov.name}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.province_id}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="city_kupon"
                                value="Kota/Kabupaten"
                            />
                            <select
                                id="city_kupon"
                                key={data.province_id} // <-- Trik reset
                                value={data.city_id}
                                onChange={(e) =>
                                    setData("city_id", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                required
                                disabled={cities.length === 0}
                            >
                                <option value="">
                                    {cities.length === 0
                                        ? "Pilih Provinsi Dulu"
                                        : "Pilih Kota/Kabupaten"}
                                </option>
                                {cities.map((city) => (
                                    <option key={city.id} value={city.id}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.city_id}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="full_name_kupon"
                                value="Nama Sesuai KTP"
                            />
                            <TextInput
                                id="full_name_kupon"
                                value={data.full_name}
                                onChange={(e) =>
                                    setData("full_name", e.target.value)
                                }
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError
                                message={errors.full_name}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="email_kupon" value="Email" />
                            <TextInput
                                id="email_kupon"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                className="mt-1 block w-full"
                                required
                                placeholder="Contoh: Og8M7@example.com"
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="phone_kupon"
                                value="No Whatsapp"
                            />
                            <TextInput
                                id="phone_kupon"
                                type="tel"
                                value={data.phone}
                                onChange={(e) =>
                                    setData("phone", e.target.value)
                                }
                                className="mt-1 block w-full"
                                required
                                placeholder="Contoh: 08123456789"
                            />
                            <InputError
                                message={errors.phone}
                                className="mt-2"
                            />
                        </div>
                    </div>
                <div className="mt-6 flex justify-end">
                    <PrimaryButton disabled={processing}>
                        Simpan Kupon
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
