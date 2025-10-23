import { useState, useEffect } from "react";
import Modal from "@/Components/Modal"; // Kita pakai komponen Modal bawaan Breeze
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import { useForm } from "@inertiajs/react";
import axios from "axios";

// Terima props: 'show' (apakah modal tampil), 'onClose' (fungsi menutup modal), 'quantity' (jumlah pesanan)
export default function OrderModal({ show, onClose, quantity }) {
    //buat provinsinya
    const [provinces, setProvinces] = useState([]);
    // State untuk data kota & kecamatan (akan diisi nanti)
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    // State untuk pilihan kurir (akan diisi nanti)
    const [couriers, setCouriers] = useState([]);

    const [selectedOngkir, setSelectedOngkir] = useState(0); // <-- 1. TAMBAH STATE BARU

    // State untuk mengontrol tampilan modal: 'form' atau 'paymentInfo'
    const [step, setStep] = useState("form");

    // --- Kalkulasi Harga & Kupon (Dummy) ---
    // Harga per item (nanti bisa diambil dari backend)
    const hargaPerPaket = 50000;
    const totalHargaProduk = hargaPerPaket * quantity;
    // Ongkir dummy (ini HARUS dikalkulasi backend nantinya berdasarkan kurir & alamat)
    // const ongkir = 25000; // Contoh ongkir
    const totalTermasukOngkir = totalHargaProduk + selectedOngkir;
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
        nama_lengkap: "",
        no_hp: "",
        email: "",
        provinsi: "",
        kabupaten: "",
        kota: "",
        alamat_lengkap: "",
        kurir: "", // Field baru sesuai PDF
        quantity: quantity,
        total_harga: totalTermasukOngkir, // Kirim total akhir ke backend
    });

    // Update quantity di form jika prop quantity berubah (misal user ganti di halaman utama)
    // TAMBAHKAN INI: Update total_harga di form saat ongkir berubah
    useEffect(() => {
        setData("total_harga", totalTermasukOngkir);
    }, [totalTermasukOngkir]); // <-- Trigger-nya adalah state kalkulasi

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

    //bang ini aku pake axios, jadi pas webnya pertama dijalanin dia bakal ngefetch data provinsi dulu,
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

    //Ini ketrigger waktu user dah milih provinsinya
    //nah ini untuk abang buat lanjutin, mataku dah perih bejir. routenya ada di Route.php

    const handleProvinceChange = async (e) => {
        // console.log(e.target.value)
        const provinceId = e.target.value;
        setData("provinsi", provinceId);
        setCities([]);
        setDistricts([]);
        setCouriers([]);
        setData("kabupaten", "");
        setData("kota", "");
        setData("kurir", "");
        setSelectedOngkir(0);

        // Jika provinsi dipilih (bukan option "Pilih Provinsi")
        if (provinceId) {
            // Lanjutkan untuk fetch data kota berdasarkan provinceId
            try {
                const res = await axios.get(
                    route("city.get", { province_id: provinceId })
                );
                console.log("City response:", res.data);
                if (
                    res.data &&
                    res.data.data &&
                    Array.isArray(res.data.data.data)
                ) {
                    setCities(res.data.data.data);
                } else {
                    console.error("Unexpected city data format:", res.data);
                    setCities([]);
                }
            } catch (err) {
                console.error("Failed to load cities:", err);
                setCities([]);
            }
        }
    };

    // Fungsi yang ter-trigger saat KABUPATEN/KOTA dipilih
    const handleCityChange = async (e) => {
        const cityId = e.target.value;
        console.log("Selected City ID:", cityId);
        setData("kabupaten", cityId); // Simpan ID KOTA ke state 'kabupaten'
        // Reset kecamatan & kurir
        setData("kota", "");
        setDistricts([]);
        setCouriers([]);
        setData("kurir", "");
        setSelectedOngkir(0);

        if (cityId) {
            // Fetch data kecamatan berdasarkan cityId
            try {
                const res = await axios.get(
                    route("district.get", { city_id: cityId })
                );
                console.log("District response:", res.data);
                if (
                    res.data &&
                    res.data.data &&
                    Array.isArray(res.data.data.data)
                ) {
                    setDistricts(res.data.data.data);
                } else {
                    console.error("Unexpected district data format:", res.data);
                    setDistricts([]);
                }
            } catch (err) {
                console.error("Failed to load districts:", err);
                setDistricts([]);
            }
        }
    };
    // Fungsi yang ter-trigger saat KECAMATAN dipilih
    const handleDistrictChange = async (e) => {
        const districtId = e.target.value;
        console.log("Selected District ID:", districtId);
        setData("kota", districtId); // Simpan ID KECAMATAN ke state 'kota'
        // Reset kurir
        setData("kurir", "");
        setSelectedOngkir(0);
        setCouriers([]);

        if (districtId) {
            // Fetch data kurir/ongkir berdasarkan districtId
            try {
                // Ganti route() dengan URL endpoint kurir jika namanya beda
                const res = await axios.get(
                    route("cost.get", { district_id: districtId })
                );
                console.log("Courier/Cost response:", res.data);
                // Sesuaikan bagian ini berdasarkan struktur response API kurir/ongkir
                // Contoh: Jika response adalah array of objects kurir
                if (
                    res.data &&
                    res.data.data &&
                    Array.isArray(res.data.data.data) // <-- UBAH DI SINI
                ) {
                    setCouriers(res.data.data.data); // <-- UBAH DI SINI
                } else {
                    console.error("Unexpected courier data format:", res.data);
                    setCouriers([]);
                }
            } catch (err) {
                console.error("Failed to load couriers:", err);
                setCouriers([]);
            }
        }
    };

    const handleCourierChange = (e) => {
        // 1. Ini isinya 'uniqueKey' (misal: "jne-REG")
        const uniqueValue = e.target.value;

        // 2. Simpan uniqueValue ke form (atau 'code'-nya saja, terserah backend)
        //    Untuk amannya, kita simpan 'uniqueValue'
        setData("kurir", uniqueValue);

        if (!uniqueValue) {
            setSelectedOngkir(0);
            return;
        }

        // 3. Ubah logika .find()
        const selected = couriers.find(
            (c) => `${c.code}-${c.service}` == uniqueValue
        );

        // 4. Kode di bawah ini sekarang aman dan tidak perlu diubah
        if (selected && typeof selected.cost === "number") {
            setSelectedOngkir(selected.cost);
        } else {
            console.error("Courier cost not found or invalid:", selected);
            setSelectedOngkir(0);
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
                            <InputLabel htmlFor="provinsi" value="Provinsi" />
                            <select
                                id="provinsi"
                                value={data.provinsi}
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
                                message={errors.provinsi}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="kabupaten"
                                value="Kabupaten/Kota"
                            />
                            <select
                                id="kabupaten"
                                value={data.kabupaten}
                                // DIUBAH: Panggil handleCityChange, bukan cuma setData
                                onChange={handleCityChange}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                required
                                // TAMBAHAN: Disable jika provinsi belum dipilih
                                disabled={cities.length === 0}
                            >
                                <option value="">
                                    {/* Logika untuk teks placeholder */}
                                    {provinces.length === 0
                                        ? "Loading..."
                                        : cities.length === 0
                                        ? "Pilih Provinsi Dulu"
                                        : "Pilih Kabupaten/Kota"}
                                </option>

                                {/* DIUBAH: Hapus opsi hardcode, ganti dengan map dari state 'cities' */}
                                {cities.map((city) => (
                                    <option key={city.id} value={city.id}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.kabupaten}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="kota" value="Kota/Kecamatan" />
                            <select
                                id="kota"
                                value={data.kota}
                                // DIUBAH: Panggil handleDistrictChange, bukan cuma setData
                                onChange={handleDistrictChange}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                required
                                // TAMBAHAN: Disable jika kabupaten belum dipilih
                                disabled={districts.length === 0}
                            >
                                <option value="">
                                    {districts.length === 0
                                        ? "Pilih Kabupaten Dulu"
                                        : "Pilih Kota/Kecamatan"}
                                </option>

                                {/* DIUBAH: Hapus opsi hardcode, ganti dengan map dari state 'districts' */}
                                {districts.map((district) => (
                                    <option
                                        key={district.id}
                                        value={district.id}
                                    >
                                        {district.name}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.kota}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="alamat_lengkap"
                                value="Alamat Lengkap"
                            />
                            <TextInput
                                id="alamat_lengkap"
                                value={data.alamat_lengkap}
                                onChange={(e) =>
                                    setData("alamat_lengkap", e.target.value)
                                }
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError
                                message={errors.alamat_lengkap}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="kurir" value="Pilih Kurir" />
                            {/* DIUBAH: Ganti TextInput menjadi <select> */}
                            <select
                                id="kurir"
                                value={data.kurir}
                                onChange={handleCourierChange}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                required
                                disabled={couriers.length === 0}
                            >
                                <option value="">
                                    {couriers.length === 0
                                        ? "Pilih Kecamatan Dulu"
                                        : "Pilih Kurir"}
                                </option>
                                {couriers.map((courier) => {
                                    // 1. Buat ID unik, contoh: "jne-REG"
                                    const uniqueKey = `${courier.code}-${courier.service}`;

                                    return (
                                        <option
                                            key={uniqueKey}
                                            value={uniqueKey}
                                        >
                                            {/* Tampilkan nama dan service-nya */}
                                            {courier.name} ({courier.service}) -{" "}
                                            {formatRupiah(courier.cost)}
                                        </option>
                                    );
                                })}
                            </select>
                            <InputError
                                message={errors.kurir}
                                className="mt-2"
                            />
                        </div>

                        <hr className="my-4" />
                        <div>
                            <InputLabel
                                htmlFor="nama_lengkap"
                                value="Nama Sesuai KTP"
                            />
                            <TextInput
                                id="nama_lengkap"
                                value={data.nama_lengkap}
                                onChange={(e) =>
                                    setData("nama_lengkap", e.target.value)
                                }
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError
                                message={errors.nama_lengkap}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="no_hp" value="No Whatsapp" />
                            <TextInput
                                id="no_hp"
                                type="tel"
                                value={data.no_hp}
                                onChange={(e) =>
                                    setData("no_hp", e.target.value)
                                }
                                className="mt-1 block w-full"
                                required
                                placeholder="Contoh: 08123456789"
                            />
                            <InputError
                                message={errors.no_hp}
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
                            <span>{formatRupiah(selectedOngkir)}</span>
                        </p>
                        <p className="flex justify-between font-bold text-lg mt-2">
                            <span>Total Termasuk Ongkir:</span>{" "}
                            <span>{formatRupiah(totalTermasukOngkir)}</span>
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
                        {formatRupiah(totalTermasukOngkir)}
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
