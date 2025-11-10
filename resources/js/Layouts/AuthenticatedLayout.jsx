import { useState, useEffect } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Footer from "@/Components/Footer";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import ActivityPopup from "@/Components/ActivityPopup";
import { Link } from "@inertiajs/react";
import Lottie from "lottie-react";
import fishJumping from "./Fish Jumping.json";
import { faker } from "@faker-js/faker";

// helper: censor name like "s***ra"
// --- Helper: censor name like "s***ra" ---
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

// --- Only one type of activity now: kupon ---
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
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const user = auth ? auth.user : null;

    const [currentActivity, setCurrentActivity] = useState(null);

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

        // Cleanup (wajib)
        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
        };
    }, []); // [] = Hanya jalan sekali

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
                                        {/* <NavLink
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
            {layoutVariant !== "undian" && (
                <>
                    <Footer />
                </>
            )}
            <ActivityPopup
                activity={currentActivity}
                onHide={() => setCurrentActivity(null)} // Biar bisa ditutup manual
            />
        </div>
    );
}
