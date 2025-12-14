import { useState, useEffect } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Footer from "@/Components/Footer";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import ActivityPopup from "@/Components/ActivityPopup";
import { Link, usePage } from "@inertiajs/react";
import Lottie from "lottie-react";
import fishJumping from "./Fish Jumping.json";
import { faker } from "@faker-js/faker";
import AboutProductModal from "@/Components/AboutProductModal";
import EventInfoModal from "@/Components/EventInfoModal";

function censorName(name) {
    if (!name) return name;
    const plain = name.trim();
    if (plain.length <= 3)
        return plain[0] + "*".repeat(Math.max(0, plain.length - 1));
    const first = plain[0];
    const lastTwo = plain.slice(-2);
    const stars = "*".repeat(Math.max(1, plain.length - 3));
    return `${first}${stars}${lastTwo}`;
}

const activityActions = {
    kupon: (count) => `baru saja menukarkan ${count} kupon!`,
};

// --- Generator for random activity ---
function getRandomActivity() {
    const fullName = faker.person.firstName() + " " + faker.person.lastName();
    const shortName = censorName(faker.person.firstName().toLowerCase());

    const count = faker.number.int({ min: 1, max: 5 });
    return {
        type: "kupon",
        user: shortName,
        action: activityActions.kupon(count),
        timestamp: Date.now(),
    };
}

export default function AuthenticatedLayout({
    auth,
    header,
    children,
    layoutVariant = "default",
}) {
    const { globalEvent } = usePage().props;
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const user = auth ? auth.user : null;

    const [currentActivity, setCurrentActivity] = useState(null);

    const [showAboutModal, setShowAboutModal] = useState(false);
    const [showEventInfoModal, setShowEventInfoModal] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        // Fungsi untuk ganti notifikasi
        // --- BLOK LAMA (DUMMY) ---
        const cycleActivity = () => {
            // Sembunyikan notifikasi yang lama (memicu animasi 'exit')
            setCurrentActivity(null);

            // Tunggu 3 detik (biar animasi 'exit' selesai)
            setTimeout(() => {
                // Ambil data acak baru
                const newActivityData = getRandomActivity();
                const newActivity = {
                    ...newActivityData,
                    timestamp: Date.now(), // Tambahkan 'timestamp'
                };
                // Tampilkan notifikasi baru (memicu animasi 'enter')
                setCurrentActivity(newActivity);
            }, 3000); // Jeda 3 detik
        };

        // --- BLOK BARU (PAKAI API) ---
        // const fetchActivity = async () => {
        //     try {
        // 1. Sembunyikan pop-up lama (jika ada)
        //         setCurrentActivity(null);

        // 2. Ambil data baru dari API
        //         const res = await axios.get('/api/recent-activity'); // <-- Panggil API backend

        // 3. (PENTING) Tunggu 1 detik biar animasi 'exit' selesai
        //         await new Promise(resolve => setTimeout(resolve, 1000));

        // 4. Tampilkan data baru
        // Pastikan data backend punya 'timestamp' asli
        //         setCurrentActivity(res.data);

        //     } catch (err) {
        // Kalau error, ya jangan tampilkan apa-apa
        //         console.error("Gagal fetch activity:", err);
        //         setCurrentActivity(null);
        //     }
        // };

        // 1. Tampilkan notifikasi pertama setelah 10 detik
        const initialTimeout = setTimeout(cycleActivity, 10000);

        // 2. Ganti notifikasi setiap 30 detik
        const interval = setInterval(cycleActivity, 30000);

        // debug====
        // console.log("=== DEBUG POPUP EVENT ===");
        // console.log("Data Event:", globalEvent); // Apakah null?
        // console.log(
        //     "Status User:",
        //     user ? "Login sebagai " + user.name : "Guest / Belum Login"
        // );

        // let eventTimer;

        // // KITA HAPUS SYARAT '!user' SEMENTARA BIAR MUNCUL TERUS BUAT NGETES
        // if (globalEvent) {
        //     console.log("✅ Syarat terpenuhi, timer dijalankan...");
        //     eventTimer = setTimeout(() => {
        //         setShowEventInfoModal(true);
        //     }, 1000);
        // } else {
        //     console.log("❌ Pop-up gagal: Data Event kosong.");
        // }
        // debug=====

        let eventTimer;
        if (globalEvent && !user) {
            eventTimer = setTimeout(() => {
                setShowEventInfoModal(true);
            }, 1000);
        }

        // 3. Scroll Listener
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };
        window.addEventListener("scroll", handleScroll);

        // Cleanup (wajib)
        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
            if (eventTimer) clearTimeout(eventTimer);
            window.removeEventListener("scroll", handleScroll);
        };
    }, [user, globalEvent]); // [] = Hanya jalan sekali
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

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
                                    <ApplicationLogo className="block h-16 w-auto object-contain" />
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
                                        <button
                                            onClick={() =>
                                                setShowAboutModal(true)
                                            }
                                            className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out"
                                        >
                                            About Product
                                        </button>
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

                                <button
                                    onClick={() => {
                                        setShowAboutModal(true);
                                        setShowingNavigationDropdown(false);
                                    }}
                                    className="w-full text-start block ps-3 pe-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none transition duration-150 ease-in-out"
                                >
                                    About Product
                                </button>
                                {/* <ResponsiveNavLink
                                    href={route("lacak")}
                                    active={route().current("lacak")}
                                >
                                    Lacak
                                </ResponsiveNavLink> */}
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
            {layoutVariant !== "undian" && <Footer />}
            {/* === GLOBAL COMPONENTS === */}

            {/* 1. Activity Popup (Kiri Bawah) */}
            <ActivityPopup
                activity={currentActivity}
                onHide={() => setCurrentActivity(null)}
            />

            {/* 2. Scroll To Top Button (Kanan Bawah) */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-6 right-6 bg-yellow-500 hover:bg-yellow-400 text-slate-900 p-3 rounded-full shadow-2xl z-50 transition-all duration-300 transform ${
                    showScrollTop
                        ? "translate-y-0 opacity-100 scale-100"
                        : "translate-y-20 opacity-0 scale-75"
                }`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                </svg>
            </button>

            {/* 3. MODAL: About Product (Modular) */}
            <AboutProductModal
                show={showAboutModal}
                onClose={() => setShowAboutModal(false)}
            />

            {/* 4. MODAL: Event Info Dinamis (Modular) */}
            <EventInfoModal
                show={showEventInfoModal}
                onClose={() => setShowEventInfoModal(false)}
                event={globalEvent}
            />
        </div>
    );
}
