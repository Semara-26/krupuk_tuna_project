import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react"; // DIHAPUS: Hapus 'router' yang sudah tidak dipakai
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import OrderModal from "@/Components/OrderModal"; // 1. Impor komponen modal yang baru dibuat

export default function Welcome({ auth }) {
    const [quantity, setQuantity] = useState(1);
    // 2. Tambahkan state baru untuk mengontrol kapan modal muncul
    const [showOrderModal, setShowOrderModal] = useState(false);

    // ... (fungsi handleQuantityChange, increment, decrement tidak berubah)
    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setQuantity(isNaN(value) || value < 1 ? 1 : value);
    };
    const incrementQuantity = () => setQuantity((q) => q + 1);
    const decrementQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

    const handleBeliSekarang = () => {
        // 3. DIUBAH: Fungsi ini sekarang hanya membuka modal
        setShowOrderModal(true);
    };

    // 4. Tambahkan fungsi untuk menutup modal
    const closeModal = () => {
        setShowOrderModal(false);
    };

    const bannerImages = [
        "/images/ikan-home.avif",
        "/images/banner2.jpg",
        "/images/banner4.png",
    ];

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Selamat Datang di Krupuk Tuna" />

            {/* ... (bagian Swiper tidak berubah) ... */}
            <div className="relative">
                <Swiper
                    modules={[Navigation, Autoplay, Pagination]}
                    spaceBetween={0}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    loop={true}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    className="w-full h-[32rem]"
                >
                    {bannerImages.map((image, index) => (
                        <SwiperSlide
                            key={index}
                            className="relative bg-black overflow-hidden"
                        >
                            <div
                                style={{ backgroundImage: `url(${image})` }}
                                className="absolute inset-0 w-full h-full bg-cover bg-center filter blur-xl scale-110"
                            ></div>
                            <div className="absolute inset-0 bg-black opacity-40"></div>
                            <img
                                src={image}
                                alt={`Banner ${index + 1}`}
                                className="relative w-full h-full object-contain"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className="max-w-7xl mx-auto py-16 px-4">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                    Pesan Krupuk Tuna Sekarang!
                </h2>
                <div className="max-w-md mx-auto flex flex-col items-center space-y-4">
                    {/* ... (bagian quantity selector tidak berubah) ... */}
                    <div className="flex items-center justify-center space-x-4">
                        <button
                            onClick={decrementQuantity}
                            className="w-10 h-10 bg-gray-200 text-gray-800 font-bold rounded-full text-lg hover:bg-gray-300 transition"
                        >
                            -
                        </button>
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={quantity}
                            onChange={handleQuantityChange}
                            className="text-2xl font-bold w-24 text-center border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                        />
                        <button
                            onClick={incrementQuantity}
                            className="w-10 h-10 bg-gray-200 text-gray-800 font-bold rounded-full text-lg hover:bg-gray-300 transition"
                        >
                            +
                        </button>
                    </div>

                    <button
                        onClick={handleBeliSekarang} // 5. Tombol ini sekarang memanggil fungsi untuk buka modal
                        className="px-8 py-3 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition duration-300"
                    >
                        Order Sekarang {/* Ganti teks tombol sesuai PDF */}
                    </button>
                </div>
            </div>

            {/* 6. Panggil komponen modal di sini */}
            {/* Berikan state dan fungsi yang dibutuhkan sebagai props */}
            <OrderModal
                show={showOrderModal}
                onClose={closeModal}
                quantity={quantity}
            />
        </AuthenticatedLayout>
    );
}
