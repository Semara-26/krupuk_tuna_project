import React, { useState } from "react"; // 1. Impor { useState }
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";

const dummyAdmins = [
    { id: 1, username: "superadmin", role: "Super Admin" },
    { id: 2, username: "admin_kupon", role: "Admin" },
    { id: 3, username: "admin_penjualan", role: "Admin" },
];

export default function SuperAdminMenu({ auth }) {
    // 2. SEMUA LOGIKA HARUS ADA DI DALAM SINI
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const submitCreateAdmin = (e) => {
        e.preventDefault();
        alert(
            `Simulasi membuat admin:\nUsername: ${username}\nPassword: ${password}`
        );
        setUsername("");
        setPassword("");
    };

    const handleDelete = (adminId, adminUsername) => {
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus admin "${adminUsername}"? (Simulasi)`
            )
        ) {
            alert(`Simulasi HAPUS admin ID ${adminId}`);
        }
    };

    const filteredAdmins = dummyAdmins.filter((admin) =>
        admin.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // ----------------------------------------

    return (
        <AdminLayout user={auth.user}>
            <Head title="Super Admin" />

            <h2 className="mt-0 text-2xl font-semibold text-gray-800">
                Admin Sigma Datang!!!
            </h2>
            <p className="text-gray-600 mb-6">Buat dan kelola akun admin.</p>

            {/* Form "Buat Admin Baru" */}
            <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl">
                <h3 className="text-xl font-semibold mb-4">Buat Admin Baru</h3>
                <form onSubmit={submitCreateAdmin}>
                    <div className="mb-4">
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                            placeholder="username_admin_baru"
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="px-5 py-2 bg-emerald-600 text-white rounded-md font-medium hover:bg-emerald-700"
                    >
                        Buat Akun Admin
                    </button>
                </form>
            </div>

            {/* Daftar Admin */}
            <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Daftar Admin</h3>
                    <input
                        type="text"
                        placeholder="Cari username..."
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
                                    Username
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredAdmins.map((admin) => (
                                <tr key={admin.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {admin.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {admin.username}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                admin.role === "Super Admin"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : "bg-gray-100 text-gray-800"
                                            }`}
                                        >
                                            {admin.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    admin.id,
                                                    admin.username
                                                )
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
        </AdminLayout>
    );
}
