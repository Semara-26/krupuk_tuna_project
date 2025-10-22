import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import InputError from "@/Components/InputError";

export default function Checkout() {
    // Ambil data 'auth' dan 'quantity' yang dikirim dari route
    const { auth, quantity } = usePage().props;

    // Siapkan state untuk form menggunakan useForm
    const { data, setData, post, processing, errors } = useForm({
        user_id: auth.user.id || null,
        data: {
            nama_lengkap: auth.user.name || "", // Ambil nama dari data user jika ada
            no_hp: "",
            provinsi: "",
            kota: "",
            kabupaten: "",
            alamat_lengkap: "",
            penanda_jalan: "",
        },
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("customer.create"));
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Checkout" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 md:p-8 text-gray-900">
                            <h2 className="text-2xl font-bold mb-2">
                                Detail Pengiriman
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Harap isi data diri dan alamat pengiriman Anda
                                dengan benar.
                            </p>

                            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                                <p className="font-semibold">
                                    Produk: Krupuk Tuna
                                </p>
                                <p className="font-semibold">
                                    Jumlah: {quantity} pcs
                                </p>
                            </div>

                            <form onSubmit={submit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Nama Lengkap */}
                                    <div>
                                        <InputLabel
                                            htmlFor="nama_lengkap"
                                            value="Nama Lengkap"
                                        />
                                        <TextInput
                                            id="nama_lengkap"
                                            className="mt-1 block w-full"
                                            value={data.nama_lengkap}
                                            onChange={(e) =>
                                                setData(
                                                    "nama_lengkap",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.nama_lengkap}
                                            className="mt-2"
                                        />
                                    </div>

                                    {/* No HP */}
                                    <div>
                                        <InputLabel
                                            htmlFor="no_hp"
                                            value="No. HP"
                                        />
                                        <TextInput
                                            id="no_hp"
                                            type="tel"
                                            className="mt-1 block w-full"
                                            value={data.no_hp}
                                            onChange={(e) =>
                                                setData("no_hp", e.target.value)
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.no_hp}
                                            className="mt-2"
                                        />
                                    </div>

                                    {/* Provinsi, Kota, Kabupaten bisa dibuat dropdown nanti */}
                                    <div>
                                        <InputLabel
                                            htmlFor="provinsi"
                                            value="Provinsi"
                                        />
                                        <TextInput
                                            id="provinsi"
                                            className="mt-1 block w-full"
                                            value={data.provinsi}
                                            onChange={(e) =>
                                                setData(
                                                    "provinsi",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                    <div>
                                        <InputLabel
                                            htmlFor="kota"
                                            value="Kota"
                                        />
                                        <TextInput
                                            id="kota"
                                            className="mt-1 block w-full"
                                            value={data.kota}
                                            onChange={(e) =>
                                                setData("kota", e.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                    <div>
                                        <InputLabel
                                            htmlFor="kabupaten"
                                            value="Kabupaten"
                                        />
                                        <TextInput
                                            id="kabupaten"
                                            className="mt-1 block w-full"
                                            value={data.kabupaten}
                                            onChange={(e) =>
                                                setData(
                                                    "kabupaten",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </div>

                                    {/* Alamat Lengkap */}
                                    <div className="md:col-span-2">
                                        <InputLabel
                                            htmlFor="alamat_lengkap"
                                            value="Alamat Lengkap"
                                        />
                                        <TextInput
                                            id="alamat_lengkap"
                                            className="mt-1 block w-full"
                                            value={data.alamat_lengkap}
                                            onChange={(e) =>
                                                setData(
                                                    "alamat_lengkap",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </div>

                                    {/* Penanda Jalan */}
                                    <div className="md:col-span-2">
                                        <InputLabel
                                            htmlFor="penanda_jalan"
                                            value="Penanda Jalan (Contoh: Sebelah masjid, rumah warna biru)"
                                        />
                                        <TextInput
                                            id="penanda_jalan"
                                            className="mt-1 block w-full"
                                            value={data.penanda_jalan}
                                            onChange={(e) =>
                                                setData(
                                                    "penanda_jalan",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-end mt-8">
                                    <PrimaryButton disabled={processing}>
                                        Lanjutkan ke Pembayaran
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
