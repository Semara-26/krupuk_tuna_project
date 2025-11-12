import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";

export default function AdminMakeCoupon({ auth }) {
    return (
        <AdminLayout user={auth.user}>
            <Head title="Buat Kupon" />

            <h2 className="mt-0 text-2xl font-semibold text-gray-800">
                Admin Datang!!!
            </h2>
            <p className="text-gray-600">Admin akan membuat Kupon</p>

            <div>
                {/* Nanti form buat generate kupon bisa ditaruh di sini */}
            </div>
        </AdminLayout>
    );
}
