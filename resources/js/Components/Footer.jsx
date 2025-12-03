import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white mt-16">
            <div className="max-w-3xl mx-auto py-6   px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center">
                    {/* Logo */}
                    <Link href="/">
                        {/* Kita gunakan versi logo yang berbeda agar kontras dengan latar gelap */}
                        <ApplicationLogo className="h-20 w-auto" />
                    </Link>

                    {/* Navigasi Footer */}
                    <div className="mt-6 flex space-x-6">
                        <Link href={route('home')} className="text-sm text-gray-300 hover:text-white">
                            Home
                        </Link>
                        {/* <Link href={route('lacak')} className="text-sm text-gray-300 hover:text-white">
                            Lacak
                        </Link> */}
                        {/* <Link href={route('undian')} className="text-sm text-gray-300 hover:text-white">
                            Undian
                        </Link> */}
                    </div>
                </div>
            </div>

            {/* Garis pemisah */}
            <div className="border-t border-gray-700">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    {/* Copyright */}
                    <p className="text-center text-sm text-gray-400">
                        &copy; {new Date().getFullYear()} Raja Tuna. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
