import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";

// 'auth' akan otomatis dikirim oleh Laravel dari routes/web.php
export default function Welcome({ auth }) {
    // Buat state untuk menyimpan jumlah kuantitas, defaultnya 1
    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value, 10);
        // Jika input kosong atau bukan angka, set ke 1
        // Jika angka kurang dari 1, set ke 1
        setQuantity(isNaN(value) || value < 1 ? 1 : value);
    };

    // Fungsi untuk menambah kuantitas
    const incrementQuantity = () => {
        setQuantity((prevQuantity) => prevQuantity + 1);
    };

    // Fungsi untuk mengurangi kuantitas, minimal 1
    const decrementQuantity = () => {
        setQuantity((prevQuantity) =>
            prevQuantity > 1 ? prevQuantity - 1 : 1
        );
    };

    const handleBeliSekarang = () => {
        // Cek apakah user sudah login atau belum
        if (!auth.user) {
            // Jika belum, arahkan ke halaman login
            router.get(route("login"));
        } else {
            // Arahkan ke halaman checkout sambil membawa data kuantitas
            // 'router.get' akan berpindah halaman tanpa full refresh
            router.get(route('checkout'), { quantity: quantity });
        }
    };

    const bannerImages = [
        "/images/ikan-home.avif",
        "/images/banner2.jpg",
        "/images/banner4.png",
    ];

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Selamat Datang di Kerupuk Tuna" />

            <div className="relative">
                <Swiper
                    modules={[Navigation, Autoplay, Pagination]} // Aktifkan modul navigasi, autoplay, dan pagination
                    spaceBetween={0}
                    slidesPerView={1}
                    navigation // Tampilkan tombol panah kiri-kanan
                    pagination={{ clickable: true }} // Tampilkan titik-titik di bawah
                    loop={true} // Buat slider berputar terus
                    autoplay={{
                        delay: 3000, // Pindah slide setiap 3 detik
                        disableOnInteraction: false,
                    }}
                    className="w-full h-[32rem]"
                >
                    {bannerImages.map((image, index) => (
                        <SwiperSlide
                            key={index}
                            className="relative bg-black overflow-hidden"
                        >
                            {/* Lapisan Latar Belakang (Gambar yang di-blur) */}
                            <div
                                style={{ backgroundImage: `url(${image})` }}
                                className="absolute inset-0 w-full h-full bg-cover bg-center filter blur-xl scale-110"
                            ></div>
                            {/* Lapisan Gradasi Gelap (opsional, tapi membuat gambar utama lebih menonjol) */}
                            <div className="absolute inset-0 bg-black opacity-40"></div>

                            {/* Gambar Utama (object-contain) */}
                            <img
                                src={image}
                                alt={`Banner ${index + 1}`}
                                className="relative w-full h-full object-contain" // Gambar utama tetap contain
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* --- Bagian Order (Quantity) --- */}
            <div className="max-w-7xl mx-auto py-16 px-4 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Pesan Kerupuk Tuna Sekarang!
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                    Renyah, gurih, dan dibuat dari bahan-bahan pilihan terbaik.
                </p>

                {/* ===== KOMPONEN INTERAKTIF DIMULAI DI SINI ===== */}
                <div className="max-w-md mx-auto flex flex-col items-center space-y-6">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                            onClick={decrementQuantity}
                            className="px-4 py-2 text-xl font-bold text-gray-700 bg-gray-200 rounded-l-lg hover:bg-gray-300 disabled:opacity-50"
                            disabled={quantity <= 1}
                        >
                            -
                        </button>
                        <input
                            type="text"
                            inputMode="numeric" // Memunculkan keyboard angka di mobile
                            pattern="[0-9]*" // Pola untuk memastikan hanya angka yang valid
                            value={quantity}
                            onChange={handleQuantityChange}
                            className="text-2xl font-bold w-24 text-center border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                            min="1" // Atribut HTML untuk validasi dasar
                        />

                        <button
                            onClick={incrementQuantity}
                            className="px-4 py-2 text-xl font-bold text-gray-700 bg-gray-200 rounded-r-lg hover:bg-gray-300"
                        >
                            +
                        </button>
                    </div>

                    <button
                        onClick={handleBeliSekarang}
                        className="w-full px-8 py-3 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition duration-300"
                    >
                        Beli Sekarang
                    </button>
                </div>
                {/* ===== SELESAI KOMPONEN INTERAKTIF ===== */}
            </div>
        </AuthenticatedLayout>
    );
}
