import { useState } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Footer from "@/Components/Footer";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link } from "@inertiajs/react";

export default function AuthenticatedLayout({ auth, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const user = auth ? auth.user : null;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href={route("home")}>
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            {/* ===== PERUBAHAN UTAMA DI SINI (DESKTOP) ===== */}
                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
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
                                <NavLink
                                    href={route("undian")}
                                    active={route().current("undian")}
                                >
                                    Undian
                                </NavLink>
                            </div>
                            {/* ===== SELESAI PERUBAHAN DESKTOP ===== */}
                        </div>

                        {/* Tampilkan Login/Register jika user belum login */}
                        {!user && (
                            <div className="hidden sm:flex sm:items-center sm:ms-6">
                                <Link
                                    href={route("login")}
                                    className="font-semibold text-gray-600 hover:text-gray-900 focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route("register")}
                                    className="ms-4 font-semibold text-gray-600 hover:text-gray-900 focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
                                >
                                    Register
                                </Link>
                            </div>
                        )}

                        {/* Tampilkan Dropdown Profile jika user SUDAH login */}
                        {user && (
                            <div className="hidden sm:flex sm:items-center sm:ms-6">
                                <div className="ms-3 relative">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                                >
                                                    {user.name}
                                                    <svg
                                                        className="ms-2 -me-0.5 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
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
                                </div>
                            </div>
                        )}

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
                    </div>
                </div>

                {/* --- PERUBAHAN UTAMA DI SINI (MOBILE MENU) --- */}
                 <div className={`sm:hidden transition-all duration-500 ease-in-out overflow-hidden ${showingNavigationDropdown ? 'max-h-screen' : 'max-h-0'}`}>
                    {/* Menu Utama Mobile */}
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink href={route('home')} active={route().current('home')}>Home</ResponsiveNavLink>
                        <ResponsiveNavLink href={route('lacak')} active={route().current('lacak')}>Lacak</ResponsiveNavLink>
                        <ResponsiveNavLink href={route('undian')} active={route().current('undian')}>Undian</ResponsiveNavLink>
                    </div>

                    {/* Menu User Mobile */}
                    <div className="pt-4 pb-1 border-t border-gray-200">
                        {user ? (
                            // Jika SUDAH login
                            <>
                                <div className="px-4">
                                    <div className="font-medium text-base text-gray-800">{user.name}</div>
                                    <div className="font-medium text-sm text-gray-500">{user.email}</div>
                                </div>
                                <div className="mt-3 space-y-1">
                                    <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                                    <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                        Log Out
                                    </ResponsiveNavLink>
                                </div>
                            </>
                        ) : (
                            // Jika BELUM login
                            <div className="space-y-1">
                                <ResponsiveNavLink href={route('login')} active={route().current('login')}>
                                    Log In
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('register')} active={route().current('register')}>
                                    Register
                                </ResponsiveNavLink>
                            </div>
                        )}
                    </div>
                </div>
                 {/* --- SELESAI PERUBAHAN MOBILE MENU --- */}
            </nav>

            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    );
}
