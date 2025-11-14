import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";

const dummyCoupons = [
    { id: 1, code: "HEMAT123", status: 0 },
    { id: 2, code: "DISKON50K", status: 1 },
    { id: 3, code: "FREEONGKIR", status: 0 },
];

export default function AdminManageCoupon({ auth }) {
    const [code, setCode] = useState("");
    const [status, setStatus] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");

    const submitCreateCoupon = (e) => {
        e.preventDefault();
        alert(
            `Simulasi membuat kupon:\nKode: ${code}\nStatus: ${
                status === 0 ? "Aktif" : "Expired"
            }`
        );
        setCode("");
        setStatus(0);
    };

    const handleDelete = (couponId) => {
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus kupon ID ${couponId}? (Simulasi)`
            )
        ) {
            alert(`Simulasi HAPUS kupon ID ${couponId}`);
        }
    };

    const handleUpdate = (couponId) => {
        alert(`Simulasi UPDATE kupon ID ${couponId}`);
    };

    const filteredCoupons = dummyCoupons.filter((coupon) =>
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout user={auth.user}>
            <Head title="Manage Kupon" />

            <h2 className="mt-0 text-2xl font-semibold text-gray-800">
                Admin Datang!!!
            </h2>
            <p className="text-gray-600">Admin akan membuat Kupon</p>

            <div>
                <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl">
                    <h3 className="text-xl font-semibold mb-4">
                        Buat Kupon Baru
                    </h3>
                    <form onSubmit={submitCreateCoupon}>
                        <div className="mb-4">
                            <label
                                htmlFor="code"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Kode Kupon (Biarkan kosong untuk generate
                                otomatis)
                            </label>
                            <input
                                type="text"
                                id="code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                placeholder="Contoh: HEMAT100K"
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="status"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Status Awal
                            </label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                            >
                                <option value="0">
                                    Aktif (Belum Digunakan)
                                </option>
                                <option value="1">
                                    Expired (Sudah Digunakan)
                                </option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="px-5 py-2 bg-emerald-600 text-white rounded-md font-medium hover:bg-emerald-700"
                        >
                            Simpan Kupon
                        </button>
                    </form>
                </div>

                <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 flex justify-between items-center">
                        <h3 className="text-xl font-semibold">Daftar Kupon</h3>
                        <input
                            type="text"
                            placeholder="Cari kode kupon..."
                            className="rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kode Kupon
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredCoupons.map((coupon) => (
                                    <tr key={coupon.id}>
                                        <td className="px-6 py-4 whitespace-nowkrap text-sm text-gray-900">
                                            {coupon.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {coupon.code}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {coupon.status ? (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                    Expired
                                                </span>
                                            ) : (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Aktif
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <button
                                                onClick={() =>
                                                    handleUpdate(coupon.id)
                                                }
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                Update
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(coupon.id)
                                                }
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
