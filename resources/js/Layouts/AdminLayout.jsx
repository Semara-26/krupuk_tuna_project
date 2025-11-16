import React from "react";
import { Link, useForm, usePage } from "@inertiajs/react";

export default function AdminLayout({ children }) {
    const { post } = useForm();
    const { props } = usePage();
    const admin = props.admin; // now this works!
    const role = props.auth.user;
    console.log("FULL PAGE PROPS:", props);
    console.log("ADMIN FROM PROPS:", admin);
    console.log("ADMIN ROLE:", admin?.role);

    // Fungsi untuk Log out
    // const handleLogout = (e) => {
    //     e.preventDefault();
    //     // Asumsi nama route logout-nya 'admin.logout'
    //     post(route("admin.logout"));
    // };

    return (
        <div
            className="grid h-screen grid-cols-[240px_1fr] grid-rows-[60px_1fr]"
            style={{
                gridTemplateAreas: `
          "header header"
          "sidebar content"
        `,
            }}
        >
            <header
                className="flex items-center justify-between border-b border-gray-500 bg-white px-6 shadow-sm z-10"
                style={{ gridArea: "header" }}
            >
                <h1 className="m-0 text-xl font-semibold text-gray-800">
                    Dashboard Admin
                </h1>
                <div className="text-sm text-gray-700">
                    Selamat datang,{" "}
                    <span className="font-bold">{admin ?? "Admin"}</span>!
                </div>
            </header>

            <aside
                className="overflow-y-auto bg-gray-800 p-5 text-gray-100"
                style={{ gridArea: "sidebar" }}
            >
                <h2 className="mt-0 border-b border-gray-700 pb-2 text-lg font-bold text-white">
                    Navigation Panel
                </h2>
                <ul className="m-0 mt-5 list-none p-0">
                    {/* Ganti <a> jadi <Link> Inertia */}
                    <li>
                        <Link
                            href={route("admin.dashboard")} // Asumsi nama route
                            className={`mb-1 block rounded-md p-3 font-bold no-underline transition-colors duration-150 ${
                                route().current("admin.dashboard")
                                    ? "bg-blue-500 text-white"
                                    : "text-gray-200 hover:bg-blue-700"
                            }`}
                        >
                            Dashboard
                        </Link>
                    </li>
                    {role.role === "superadmin" && (
                        <li>
                            <Link
                                href={route("admin.superadmin")}
                                className={`mb-1 block rounded-md p-3 font-bold no-underline transition-colors duration-150 ${
                                    route().current("admin.superadmin")
                                        ? "bg-blue-500 text-white"
                                        : "text-gray-200 hover:bg-blue-700"
                                }`}
                            >
                                Menu Super Admin
                            </Link>
                        </li>
                    )}
                    <li>
                        <Link
                            href={route("admin.manage-kupon")} // Asumsi nama route
                            className={`mb-1 block rounded-md p-3 font-bold no-underline transition-colors duration-150 ${
                                route().current("admin.manage-kupon")
                                    ? "bg-blue-500 text-white"
                                    : "text-gray-200 hover:bg-blue-700"
                            }`}
                        >
                            Manage Kupon
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={route("admin.event")} // Asumsi nama route
                            onClick={() =>
                                console.log(
                                    "Mencoba navigasi ke:",
                                    route("admin.event")
                                )
                            }
                            className={`mb-1 block rounded-md p-3 font-bold no-underline transition-colors duration-150 ${
                                route().current("admin.event")
                                    ? "bg-blue-500 text-white"
                                    : "text-gray-200 hover:bg-blue-700"
                            }`}
                        >
                            Undi Pemenang
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={route("admin.logout")}
                            method="post" //
                            as="button"
                            className="w-full text-left mb-1 block rounded-md p-3 text-gray-200 no-underline transition-colors duration-150 hover:bg-blue-700"
                        >
                            Log out
                        </Link>
                    </li>
                </ul>
            </aside>

            {/* Di sinilah konten halaman (children) akan ditampilkan */}
            <main
                className="overflow-y-auto bg-gray-100 p-8"
                style={{ gridArea: "content" }}
            >
                {children}
            </main>
        </div>
    );
}
