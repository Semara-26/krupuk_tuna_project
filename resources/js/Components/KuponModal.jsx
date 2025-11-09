import { useState, useEffect } from "react";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
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

    const purchaseTypeOptions = ["Offline", "Online"];
    const productOptions = [
        // Asumsi cuma 1 produk, bisa ditambah jika perlu
        { id: 1, name: "Paket Kerupuk Kulit Tuna" },
        { id: 2, name: "Paket Kerupuk Tuna Premium" },
    ];

    const [provinces, setProvinces] = useState(dummyProvinces);
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        recentlySuccessful,
    } = useForm({
        kupons: [""],
        email: "",
        full_name: "",
        phone: "",
        province_id: "",
        purchase_type: "",
        product_id: "",
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
    };

    const handleKuponChange = (index, value) => {
        // Buat salinan array kupons saat ini
        const updatedKupons = [...data.kupons];
        // Ubah nilai di index yang spesifik
        updatedKupons[index] = value;
        // Update state useForm
        setData("kupons", updatedKupons);
    };

    const addKuponField = () => {
        // Tambahkan satu string kosong baru ke array
        setData("kupons", [...data.kupons, ""]);
    };

    const removeKuponField = (index) => {
        // Hanya hapus jika ada lebih dari 1 field
        if (data.kupons.length > 1) {
            const updatedKupons = data.kupons.filter((_, i) => i !== index);
            setData("kupons", updatedKupons);
        }
    };

    // 2. Fungsi untuk submit
    const handleSubmit = (e) => {
        e.preventDefault();

        // --- CUMA BUAT TESTING (UNTUK NGAKALIN) ---

        // 1. (Opsional) Cek datanya di konsol
        console.log("Data form (dummy submit):", data);

        // (Opsional) Filter kupon yang kosong sebelum submit
        const kuponsToSubmit = data.kupons.filter(
            (kupon) => kupon.trim() !== ""
        );

        // Cek jika tidak ada kupon valid setelah filter
        if (kuponsToSubmit.length === 0) {
            Swal.fire({
                title: "Oops!",
                text: "Harap isi setidaknya satu nomor kupon.",
                icon: "warning",
                confirmButtonColor: "#dc2626",
            });
            // Fokus ke field kupon pertama
            document.getElementById("kupon-0")?.focus();
            return; // Hentikan submit
        }

        console.log("Data form (dummy submit):", {
            ...data,
            kupons: kuponsToSubmit,
        });
        // Langsung panggil logic onSuccess
        Swal.fire({
            title: "Sukses! (Testing)",
            text: `Kupon Anda (${kuponsToSubmit.join(", ")}) telah dicatat.`,
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
        //             text: `Kupon Anda (${kuponsToSubmit.join(", ")}) telah dicatat.`,
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
        //     onError: (errors) => handleFormError(errors)
    };

    const handleFormError = (errors) => {
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
        //            Jika ada error di 'kupons', fokus ke field pertama ('kupon-0')
        //             kupon: "kupon-0",
        //             province_id: "province_kupon",
        //             full_name: "full_name_kupon",
        //             email: "email_kupon",
        //             phone: "phone_kupon",
        //             purchase_type: 'purchase_type_kupon',
        //             product_id: 'product_id_kupon',
        //         };
        //         // Ambil 'key' error pertama
        //         const firstErrorKey = Object.keys(errors)[0];
        // Jika errornya adalah 'kupons.N' (misal kupons.1), anggap saja error 'kupons'
        // const errorKeyForFocus = firstErrorKey.startsWith('kupons.') ? 'kupons' : firstErrorKey;
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
        }, 300);
    };

    return (
        <Modal show={show} onClose={handleClose} maxWidth="md">
            <form
                onSubmit={handleSubmit}
                className="p-6 max-h-[80vh] overflow-y-scroll"
            >
                <h2 className="text-lg font-medium text-gray-900 mb-4 text-center border-b pb-2">
                    Input Kupon Undian
                </h2>
                <div className="space-y-4 pr-2">
                    {data.kupons.map((kuponValue, index) => (
                        <div key={index} className="flex items-end space-x-2">
                            <div className="flex-grow">
                                {/* Label hanya untuk field pertama */}
                                {index === 0 && (
                                    <InputLabel
                                        htmlFor={`kupon-${index}`}
                                        value="Nomor Kupon Undian"
                                    />
                                )}
                                <TextInput
                                    id={`kupon-${index}`} // ID unik pakai index
                                    value={kuponValue}
                                    onChange={(e) =>
                                        handleKuponChange(index, e.target.value)
                                    }
                                    className={`mt-1 block w-full ${
                                        index > 0 ? "mt-1" : ""
                                    }`} // Beri margin atas jika bukan yg pertama
                                    required // Tetap required (tapi kita filter yg kosong pas submit)
                                    // Fokus otomatis hanya untuk field pertama
                                    isFocused={index === 0}
                                    placeholder={`Contoh: AWRS2901`}
                                />
                                {/* Tampilkan error spesifik jika ada (misal dari backend: 'kupons.1') */}
                                <InputError
                                    message={errors[`kupons.${index}`]}
                                    className="mt-2"
                                />
                            </div>
                            {/* Tombol Hapus hanya muncul jika ada > 1 field & bukan field pertama */}
                            {data.kupons.length > 1 &&
                                index > -1 && ( // Diubah index > -1 biar muncul terus
                                    <SecondaryButton
                                        type="button"
                                        onClick={() => removeKuponField(index)}
                                        className="mb-1 h-10 flex-shrink-0" // mb-1 biar sejajar input
                                    >
                                        X
                                    </SecondaryButton>
                                )}
                        </div>
                    ))}

                    {/* Tampilkan error umum untuk 'kupons' jika ada */}
                    <InputError message={errors.kupons} className="mt-2" />

                    {/* Tombol Tambah Kupon */}
                    <div className="flex justify-start mt-2">
                        <button
                            type="button"
                            onClick={addKuponField}
                            className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
                        >
                            + Tambah Kupon Lain
                        </button>
                    </div>
                    <div>
                        <div>
                            <InputLabel
                                htmlFor="purchase_type_kupon"
                                value="Jenis Pembelian"
                            />
                            <select
                                id="purchase_type_kupon"
                                value={data.purchase_type}
                                onChange={(e) =>
                                    setData("purchase_type", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                required
                            >
                                <option value="">Pilih Jenis Pembelian</option>
                                {purchaseTypeOptions.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.purchase_type}
                                className="mt-2"
                            />
                        </div>

                        {/* TAMBAH: Dropdown Produk */}
                        <div>
                            <InputLabel
                                htmlFor="product_id_kupon"
                                value="Produk yang Dibeli"
                            />
                            <select
                                id="product_id_kupon"
                                value={data.product_id}
                                onChange={(e) =>
                                    setData("product_id", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                required
                            >
                                <option value="">Pilih Produk</option>
                                {productOptions.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.product_id}
                                className="mt-2"
                            />
                        </div>

                        <InputLabel htmlFor="province_kupon" value="Provinsi" />
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
                            placeholder="Contoh: John Doe"
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
                            onChange={(e) => setData("email", e.target.value)}
                            className="mt-1 block w-full"
                            required
                            placeholder="Contoh: Og8M7@example.com"
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="phone_kupon" value="No Whatsapp" />
                        <TextInput
                            id="phone_kupon"
                            type="tel"
                            value={data.phone}
                            onChange={(e) => setData("phone", e.target.value)}
                            className="mt-1 block w-full"
                            required
                            placeholder="Contoh: 08123456789"
                        />
                        <InputError message={errors.phone} className="mt-2" />
                    </div>
                </div>
                <div className="mt-6 text-xs text-center text-gray-500 bg-gray-50 p-3 rounded-lg border">
                    <p>
                        <strong>Catatan:</strong> Kupon yang di-submit setelah
                        hari{" "}
                        <strong className="text-gray-700">
                            Jumat, pkl 19.00 WITA
                        </strong>
                        , akan diikutkan pada undian minggu berikutnya.
                    </p>
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
