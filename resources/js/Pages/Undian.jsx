import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

export default function Undian() {
    // Ambil data 'pemenang' yang dikirim dari Laravel (routes/web.php)
    const { auth, pemenang, tanggalUndian } = usePage().props;

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Pusat Undian" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">

                            {/* Bagian Status Undian */}
                            <div className="bg-sky-100 border-l-4 border-sky-500 text-sky-700 p-4 rounded-md mb-8" role="alert">
                                <p className="font-bold">Informasi</p>
                                <p>Pengundian berikutnya akan diadakan pada: <span className="font-semibold">{tanggalUndian}</span></p>
                            </div>

                            {/* Bagian Pemenang Sebelumnya */}
                            <h2 className="text-2xl font-bold mb-4">Pemenang Sebelumnya</h2>

                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Nomor Kupon
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Nama Pemenang
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Hadiah
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {pemenang.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {item.nomor_kupon}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item.nama}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item.hadiah}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
