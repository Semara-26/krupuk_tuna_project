import { useState, useEffect } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Footer from "@/Components/Footer";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link } from "@inertiajs/react";
import Lottie from "lottie-react";
import fishJumping from "./Fish Jumping.json";

export default function AuthenticatedLayout({
    auth,
    header,
    children,
    layoutVariant = "default",
}) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const user = auth ? auth.user : null;

    return (
        <div
            className={`min-h-screen bg-gray-100 flex flex-col ${
                layoutVariant === "undian" ? "overflow-x-hidden" : ""
            }`}
        >
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href={route("home")}>
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                {layoutVariant !== "undian" && (
                                    <>
                                        <NavLink
                                            href={route("home")}
                                            active={route().current("home")}
                                        >
                                            Home
                                        </NavLink>
                                        <NavLink
                                            href={route("lacak")}
                                            active={route().current("lacak")}
                                        >
                                            Lacak
                                        </NavLink>
                                        {/* <NavLink
                                    href={route("undian")}
                                    active={route().current("undian")}
                                >
                                    Undian
                                </NavLink> */}
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ms-6">
                            {/* Jika user (admin) login, tampilkan dropdown */}
                            {user ? (
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {user.name}
                                                {/* ... (SVG dropdown) ... */}
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            ) : (
                                // Jika user GUEST (di halaman manapun),
                                // tampilkan Lottie
                                <div className="flex items-center">
                                    <Lottie
                                        animationData={fishJumping}
                                        loop={true}
                                        // Ganti ukurannya jadi pas
                                        style={{ height: 120, width: 160 }}
                                    />
                                </div>
                            )}
                        </div>

                        {layoutVariant !== "undian" && (
                            <div className="-me-2 flex items-center sm:hidden">
                                <button
                                    onClick={() =>
                                        setShowingNavigationDropdown(
                                            (previousState) => !previousState
                                        )
                                    }
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                                >
                                    <svg
                                        className="h-6 w-6"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            className={
                                                !showingNavigationDropdown
                                                    ? "inline-flex"
                                                    : "hidden"
                                            }
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                        <path
                                            className={
                                                showingNavigationDropdown
                                                    ? "inline-flex"
                                                    : "hidden"
                                            }
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div
                    className={`sm:hidden transition-all duration-500 ease-in-out overflow-hidden ${
                        showingNavigationDropdown ? "max-h-screen" : "max-h-0"
                    }`}
                >
                    {/* Menu Utama Mobile */}
                    <div className="pt-2 pb-3 space-y-1">
                        {layoutVariant !== "undian" && (
                            <>
                                <ResponsiveNavLink
                                    href={route("home")}
                                    active={route().current("home")}
                                >
                                    Home
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route("lacak")}
                                    active={route().current("lacak")}
                                >
                                    Lacak
                                </ResponsiveNavLink>
                                {/* <ResponsiveNavLink
                            href={route("undian")}
                            active={route().current("undian")}
                        >
                            Undian
                        </ResponsiveNavLink> */}
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <main className="flex-grow">{children}</main>
            {layoutVariant !== "undian" && (
                <>
                    <Footer />
                </>
            )}
        </div>
    );
}
