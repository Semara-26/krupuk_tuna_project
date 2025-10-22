import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, useForm } from "@inertiajs/react";
import { useState } from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";

export default function Lacak() {
    // Buat state untuk mengontrol visibilitas accordion
    const [riwayatTerbuka, setRiwayatTerbuka] = useState(false);

    //  Ambil data 'riwayatPesanan' dari props
    const { auth, statusPesanan, input, riwayatPesanan } = usePage().props;

    const { data, setData, get, processing, errors } = useForm({
        // 'data' menyimpan nilai input, 'nomor_pesanan' adalah nama inputnya
        // 'input.nomor_pesanan' digunakan agar input tidak kosong setelah submit
        nomor_pesanan: input.nomor_pesanan || "",
    });

    const submit = (e) => {
        e.preventDefault();
        // Kirim request GET ke route 'lacak' dengan data dari form
        get(route("lacak"));
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Lacak Pesanan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* --- BAGIAN RIWAYAT PESANAN (ACCORDION) --- */}
                    {auth.user && riwayatPesanan.length > 0 && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            {/* Buat tombol untuk membuka/menutup accordion */}
                            <button
                                onClick={() =>
                                    setRiwayatTerbuka(!riwayatTerbuka)
                                }
                                className="w-full p-6 text-left flex justify-between items-center focus:outline-none"
                            >
                                <h2 className="text-2xl font-bold">
                                    Riwayat Pesanan Anda
                                </h2>
                                <svg
                                    className={`w-6 h-6 transform transition-transform ${
                                        riwayatTerbuka ? "rotate-180" : ""
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 9l-7 7-7-7"
                                    ></path>
                                </svg>
                            </button>

                            {/* Konten yang bisa disembunyikan */}
                            <div
                                className={`transition-all duration-700 ease-in-out overflow-hidden ${
                                    riwayatTerbuka
                                        ? "max-h-[1000px]"
                                        : "max-h-0"
                                }`}
                            >
                                <div className="px-6 pb-6 border-t">
                                    <div className="space-y-4 mt-4">
                                        {riwayatPesanan.map((pesanan) => (
                                            <div
                                                key={pesanan.id}
                                                className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 transition"
                                            >
                                                <div>
                                                    <p className="font-bold text-lg text-indigo-600">
                                                        {pesanan.id}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {pesanan.tanggal}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                                                        {pesanan.status}
                                                    </span>
                                                    <p className="font-semibold mt-1">
                                                        {pesanan.total}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 md:p-10 text-gray-900">
                            <h2 className="text-2xl font-bold mb-2">
                                Lacak Pesanan Anda
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Masukkan nomor pesanan Anda di bawah ini untuk
                                melihat status pengiriman.
                            </p>

                            <form onSubmit={submit} className="max-w-lg">
                                <div>
                                    <TextInput
                                        id="order_id"
                                        name="order_id"
                                        value={data.nomor_pesanan} // Nilai input diambil dari state 'data'
                                        className="mt-1 block w-full"
                                        placeholder="Contoh: KT-12345678"
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData(
                                                "nomor_pesanan",
                                                e.target.value
                                            )
                                        } // Update state saat diketik
                                    />
                                    <InputError
                                        message={errors.nomor_pesanan}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="flex items-center mt-4">
                                    {/* 'processing' akan disable tombol saat request dikirim */}
                                    <PrimaryButton disabled={processing}>
                                        Lacak Sekarang
                                    </PrimaryButton>
                                </div>
                            </form>

                            {/* --- Bagian untuk Menampilkan Hasil --- */}
                            {/* Tampilkan blok ini hanya jika 'statusPesanan' ada isinya */}
                            {statusPesanan && (
                                <div className="border-t pt-6">
                                    {statusPesanan.error ? (
                                        // Jika backend mengirim error
                                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
                                            <p className="font-bold">Gagal</p>
                                            <p>{statusPesanan.error}</p>
                                        </div>
                                    ) : (
                                        // Jika pencarian berhasil
                                        <div>
                                            <h3 className="text-xl font-bold mb-4">
                                                Hasil Pelacakan
                                            </h3>
                                            <div className="space-y-3">
                                                <p>
                                                    <strong>
                                                        Nomor Pesanan:
                                                    </strong>{" "}
                                                    {statusPesanan.nomor}
                                                </p>
                                                <p>
                                                    <strong>Status:</strong>{" "}
                                                    <span className="font-semibold text-green-600">
                                                        {statusPesanan.status}
                                                    </span>
                                                </p>
                                                <p>
                                                    <strong>
                                                        Estimasi Tiba:
                                                    </strong>{" "}
                                                    {statusPesanan.estimasi}
                                                </p>
                                                <p>
                                                    <strong>Detail:</strong>{" "}
                                                    {statusPesanan.detail}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
