import React from "react";

export default function AdminMakeCoupon({
}) {
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
                className="flex items-center border-b border-gray-500 bg-white px-6 shadow-sm z-10"
                style={{ gridArea: "header" }}
            >
                <h1 className="m-0 text-xl font-semibold text-gray-800">
                    Buat Kupon
                </h1>
            </header>

            <aside
                className="overflow-y-auto bg-gray-800 p-5 text-gray-100"
                style={{ gridArea: "sidebar" }}
            >
                <h2 className="mt-0 border-b border-gray-700 pb-2 text-lg font-bold text-white">
                    Navigation Panel
                </h2>
                <ul className="m-0 mt-5 list-none p-0">
                    <li>
                        <a
                            href="dashboard"
                            className="mb-1 block rounded-md p-3 font-bold text-gray-200  no-underline hover:bg-blue-700"
                        >
                            Dashboard
                        </a>
                    </li>
                    <li>
                        <a
                            href=""
                            className="mb-1 block rounded-md p-3 text-white no-underline transition-colors duration-150 bg-blue-500 "
                        >
                            Buat Kupon
                        </a>
                    </li>
                    <li>
                        <a
                            href=""
                            className="mb-1 block rounded-md p-3 text-gray-200 no-underline transition-colors duration-150 hover:bg-blue-700"
                        >
                            Undi Pemenang
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="mb-1 block rounded-md p-3 text-gray-200 no-underline transition-colors duration-150 hover:bg-blue-700"
                        >
                            Menu Super Admin
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="mb-1 block rounded-md p-3 text-gray-200 no-underline transition-colors duration-150 hover:bg-blue-700"
                        >
                            Log out
                        </a>
                    </li>
                </ul>
            </aside>

            <main
                className="overflow-y-auto bg-gray-100 p-8"
                style={{ gridArea: "content" }}
            >
                <h2 className="mt-0 text-2xl font-semibold text-gray-800">
                    Admin Datang!!!
                </h2>
                <p className="text-gray-600">Admin akan membuat Kupon</p>

                <div>
                </div>
            </main>
        </div>
    );
}
