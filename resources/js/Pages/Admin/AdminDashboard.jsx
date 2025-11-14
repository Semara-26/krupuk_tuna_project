import React from "react";
import AdminLayout from "@/Layouts/AdminLayout"; // <-- 1. Import layout baru
import { Head, router } from "@inertiajs/react"; // <-- 2. Import router
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

// Terima 'auth' dan props lain dari backend
export default function AdminDashboard({
    auth,
    expired_coupons,
    active_coupons,
    all_coupons,
    admin,
}) {
    const handleCheckCoupon = (event) => {
        event.preventDefault();
        const couponCode = event.target.elements.couponCode.value;

        // validasi input kosong
        if (!couponCode || couponCode.trim() === "") {
            Swal.fire({
                title: "Input Kosong",
                text: "Harap masukkan kode kupon terlebih dahulu.",
                icon: "warning",
                confirmButtonColor: "#3085d6",
            });
            event.target.reset(); // Reset form-nya aja
            return;
        }

        axios
            .get(route("admin.coupon.check", { coupon: couponCode }))
            .then((res) => {
                // Cek 'code' di dalam JSON, jangan cuma status HTTP
                if (
                    res.data.code === 200 &&
                    res.data.data &&
                    res.data.data[0]
                ) {
                    // Ini adalah SUKSES Beneran
                    Swal.fire({
                        title: "Kupon Ditemukan!",
                        html: `Kupon <b>${couponCode}</b> adalah milik:<br/><b>${res.data.data[0].full_name}</b>`,
                        icon: "success",
                        confirmButtonColor: "#3085d6",
                    });
                } else {
                    // Ini adalah 'sukses palsu' (backend ngirim code 400 di body)
                    Swal.fire({
                        title: "Error!",
                        text: res.data.message || "Kupon tidak ditemukan.", // Ambil pesan error dari backend
                        icon: "error",
                        confirmButtonColor: "#3085d6",
                    });
                }
            })
            .catch((err) => {
                // Ini untuk error server beneran (500) atau 404
                Swal.fire({
                    title: "Error!",
                    text:
                        err.response?.data?.message ||
                        "Gagal terhubung ke server.",
                    icon: "error",
                    confirmButtonColor: "#3085d6",
                });
            });

        event.target.reset();
    };

    return (
        // 3. Bungkus semua konten dengan <AdminLayout>
        <AdminLayout admin={admin} user={auth.user}>
            <Head title="Admin Dashboard" />

            {/* Ini adalah <main> yang lama, sekarang jadi 'children' */}
            <h2 className="mt-0 text-2xl font-semibold text-gray-800">
                Admin Datang!!!
            </h2>
            <p className="text-gray-600">Ringkasan Kupon</p>

            {/* ... (Konten 3 card) ... */}
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
                    <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500">
                        Jumlah Kupon yang Sudah Digunakan
                    </h3>
                    <span className="mt-2 block text-3xl font-bold text-gray-900">
                        {expired_coupons}
                    </span>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
                    <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500">
                        Jumlah Kupon yang Belum Digunakan
                    </h3>
                    <span className="mt-2 block text-3xl font-bold text-gray-900">
                        {active_coupons}
                    </span>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
                    <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500">
                        Jumlah Kupon yang Akan di Undi
                    </h3>
                    <span className="mt-2 block text-3xl font-bold text-gray-900">
                        {all_coupons}
                    </span>
                </div>
            </div>

            {/* ... (Form Cek Status Kupon) ... */}
            <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
                <h3 className="mt-0 text-xl font-semibold text-gray-800">
                    Cek Status Kupon
                </h3>
                <p className="mb-4 text-gray-600">
                    Masukkan kode kupon untuk melihat statusnya.
                </p>
                <form className="flex" onSubmit={handleCheckCoupon}>
                    <input
                        type="text"
                        name="couponCode"
                        placeholder="Masukkan kode kupon..."
                        className="flex-grow rounded-l-md border border-gray-300 px-4 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500"
                    />
                    <button
                        type="submit"
                        className="rounded-r-md bg-emerald-600 px-5 py-2 font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    >
                        Cek Kupon
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}
