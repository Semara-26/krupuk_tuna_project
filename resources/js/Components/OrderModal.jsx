import { useState, useEffect } from "react";
import Modal from "@/Components/Modal"; // Kita pakai komponen Modal bawaan Breeze
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import { useForm } from "@inertiajs/react";

// Terima props: 'show' (apakah modal tampil), 'onClose' (fungsi menutup modal), 'quantity' (jumlah pesanan)
export default function OrderModal({ show, onClose, quantity, auth }) {
    //buat provincenya
    const [provinces, setProvinces] = useState([]);
    const [provData, setProvData] = useState([]);

    // State untuk mengontrol tampilan modal: 'form' atau 'paymentInfo'
    const [step, setStep] = useState("form");

    // --- Kalkulasi Harga & Kupon (Dummy) ---
    // Harga per item (nanti bisa diambil dari backend)
    const hargaPerPaket = 50000;
    const totalHargaProduk = hargaPerPaket * quantity;
    // Ongkir dummy (ini HARUS dikalkulasi backend nantinya berdasarkan courier & alamat)
    const ongkir = 25000; // Contoh ongkir
    // const totalTermasukOngkir = totalHargaProduk + ongkir;
    // Kupon dummy (misal 1 kupon per 2 paket)
    const kuponUndian = Math.floor(quantity / 2);

    // Siapkan form dengan useForm
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        recentlySuccessful,
    } = useForm({
        user_id: auth?.user?.id ?? null,
        full_name: "",
        phone: "",
        email: "",
        province: "",
        province_id:"",
        district: "",
        city: "",
        address: "",
        courier: "",
        quantity: quantity,
    });

    // Update quantity di form jika prop quantity berubah (misal user ganti di halaman utama)
    useEffect(() => {
        setData("quantity", quantity);
    }, [quantity]);

    // Fungsi saat form disubmit
    const handleFormSubmit = (e) => {
        e.preventDefault();
        // Kirim data ke route 'order.store.popup' yang sudah kita buat
        post(route("order.store.popup"), {
            preserveScroll: true, // Agar halaman tidak scroll ke atas
            onSuccess: () => {
                // Jika request ke backend sukses, pindah ke tampilan info pembayaran
                setStep("paymentInfo");
            },
            // onError: (errors) => { /* useForm otomatis menampilkan errors */ }
        });
    };

    // Fungsi untuk menutup modal dan mereset state
    const handleClose = () => {
        onClose(); // Panggil fungsi onClose dari props
        // Setelah jeda singkat (animasi modal selesai), reset form & step
        setTimeout(() => {
            reset();
            setStep("form");
        }, 300); // Sesuaikan durasi jika perlu
    };

    // Fungsi format Rupiah
    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    //bang ini aku pake axios, jadi pas webnya pertama dijalanin dia bakal ngefetch data province dulu,
    //harusnya ngefetch data yang lain ngga pake useeffect ntah sih frontend membuatku gila
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                //di data res ni ada data lain juga, bagus buat nampilin error
                const res = await axios.get(route("province.get"));
                console.log("Province response:", res);

                setProvinces(res.data.data.data);
            } catch (err) {
                console.error("Failed to load provinces:", err);
            }
        };

        fetchProvinces();
    }, []);

    //Ini ketrigger waktu user dah milih provincenya
    //nah ini untuk abang buat lanjutin, mataku dah perih bejir. routenya ada di Route.php

    const handleProvinceChange = async (e) => {
        console.log(e.target.options[e.target.selectedIndex].text);
        const provinceId = e.target.value;
        const provinceName = e.target.options[e.target.selectedIndex].text;
        setData("province_id", provinceId);
        setData("province", provinceName);
        // setCities([]);
        // setDistricts([]);
        // setCouriers([]);

        try {
            //yang ini abis ketemu id provinsinya dia bakal ke route ini
            //buat ngambil data kotanya
            const res = await axios.get(`/get-city-data/${provinceId}`);
            console.log("City response:", res.data);
            // setCities(res.data.data.data);
        } catch (err) {
            console.error("Failed to load cities:", err);
        }
    };
    return (
        <Modal show={show} onClose={handleClose} maxWidth="md">
            {/* Tampilkan konten berdasarkan nilai state 'step' */}
            {step === "form" ? (
                // --- Tampilan 1: Form Order ---
                <form
                    onSubmit={handleFormSubmit}
                    className="p-6 max-h-[80vh] overflow-y-auto"
                >
                    <h2 className="text-lg font-medium text-gray-900 mb-4 text-center border-b pb-2">
                        Form Order
                    </h2>

                    {/* Info Produk */}
                    <div className="mb-4 p-3 bg-gray-50 rounded border text-sm">
                        <p className="font-semibold">
                            Paket Kerupuk Kulit Tuna
                        </p>
                        <p>Harga @paket: {formatRupiah(hargaPerPaket)}</p>
                        <div className="flex justify-between mt-1">
                            <span>
                                Qty: <strong>{quantity}</strong>
                            </span>
                            <span>
                                Total Produk:{" "}
                                <strong>
                                    {formatRupiah(totalHargaProduk)}
                                </strong>
                            </span>
                        </div>
                    </div>

                    {/* Input Fields */}
                    <div className="space-y-3">
                        <div>
                            <InputLabel htmlFor="province" value="province" />
                            <select
                                id="province"
                                value={data.province_id}
                                onChange={handleProvinceChange}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                required
                            >
                                <option value="">Pilih province</option>
                                {provinces.map((prov) => (
                                    <option key={prov.id} value={prov.id}>
                                        {prov.name}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.province}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="district" value="district" />
                            <select
                                id="district"
                                value={data.district}
                                onChange={(e) =>
                                    setData("district", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                required
                            >
                                <option value="">Pilih district</option>
                                <option value="badung">Badung</option>
                                <option value="gianyar">Gianyar</option>
                                <option value="tabanan">Tabanan</option>
                                <option value="buleleng">Buleleng</option>
                                {/* Add more district as needed */}
                            </select>
                            <InputError
                                message={errors.district}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="city" value="city/Kecamatan" />
                            <select
                                id="city"
                                value={data.city}
                                onChange={(e) =>
                                    setData("city", e.target.value)
                                }
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                required
                            >
                                <option value="">Pilih city/Kecamatan</option>
                                <option value="denpasar">Denpasar</option>
                                <option value="kuta">Kuta</option>
                                <option value="ubud">Ubud</option>
                                <option value="sanur">Sanur</option>
                                {/* Add more cities as needed */}
                            </select>
                            <InputError
                                message={errors.city}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="address"
                                value="Alamat Lengkap"
                            />
                            <TextInput
                                id="address"
                                value={data.address}
                                onChange={(e) =>
                                    setData("address", e.target.value)
                                }
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError
                                message={errors.address}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            {/* Nanti ini bisa jadi <select> atau input autocomplete */}
                            <InputLabel
                                htmlFor="courier"
                                value="Pilih courier"
                            />
                            <TextInput
                                id="courier"
                                value={data.courier}
                                onChange={(e) =>
                                    setData("courier", e.target.value)
                                }
                                className="mt-1 block w-full"
                                placeholder="Contoh: JNE Reguler / SiCepat"
                                required
                            />
                            <InputError
                                message={errors.courier}
                                className="mt-2"
                            />
                        </div>
                        <hr className="my-4" />
                        <div>
                            <InputLabel
                                htmlFor="full_name"
                                value="Nama Sesuai KTP"
                            />
                            <TextInput
                                id="full_name"
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
                            <InputLabel htmlFor="phone" value="No Whatsapp" />
                            <TextInput
                                id="phone"
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
                        <div>
                            <InputLabel
                                htmlFor="email"
                                value="Email Aktif (Untuk Kupon)"
                            />
                            <TextInput
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    {/* Info Total Akhir & Kupon */}
                    <div className="mt-6 pt-4 border-t text-sm">
                        <p className="flex justify-between">
                            <span>Ongkos Kirim (Estimasi):</span>{" "}
                            <span>{formatRupiah(ongkir)}</span>
                        </p>
                        <p className="flex justify-between font-bold text-lg mt-2">
                            <span>Total Termasuk Ongkir:</span>{" "}
                            <span>{formatRupiah(75000)}</span>
                        </p>
                        <p className="flex justify-between text-green-600 mt-1">
                            <span>Free Kupon Undian:</span>{" "}
                            <span>{kuponUndian} Kupon</span>
                        </p>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <PrimaryButton disabled={processing}>
                            Proses
                        </PrimaryButton>
                    </div>
                </form>
            ) : (
                // Jika step bukan 'form', tampilkan info pembayaran
                // --- Tampilan 2: Info Pembayaran ---
                <div className="p-6 text-center">
                    <h2 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">
                        Pembayaran
                    </h2>
                    <p className="mb-2">
                        Silahkan Melakukan pembayaran Sejumlah:
                    </p>
                    {/* Tampilkan total dari kalkulasi sebelumnya */}
                    <p className="text-3xl font-bold text-red-600 mb-4">
                        {formatRupiah(75000)}
                    </p>

                    <div className="bg-gray-50 rounded-lg p-4 my-4 border text-left max-w-xs mx-auto text-sm">
                        <p className="mb-1 font-semibold">Rekening Tujuan:</p>
                        <p className="">Bank BCA</p>
                        <p className="font-mono tracking-wider">1234 5678 99</p>
                        <p className="">A/N: PT Apa Saja Bisa</p>
                    </div>

                    <p className="text-xs text-gray-500 mt-4 px-4">
                        Lakukan pengecekan email apabila telah melakukan
                        pembayaran. Informasi **nomor Kupon** akan dikirim
                        melalui email yang terdaftar. Status pesanan dapat dicek
                        di halaman **Lacak**.
                    </p>

                    <div className="mt-6 flex justify-center">
                        {/* Tombol untuk menutup modal */}
                        <button
                            type="button"
                            onClick={handleClose}
                            className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </Modal>
    );
}
