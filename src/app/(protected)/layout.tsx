"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/SideBar';

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const router = useRouter();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    useEffect(() => {
        if (!token) {
            router.push('/signin');
        }
    }, [token, router]);

    if (!token) {
        return null;
    }

    return (
        <>
            <div className="flex min-h-screen h-screen w-full relative">
                {/* Mobile Menu Button */}
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden fixed top-4 left-4 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-neo-light-convex text-gray-700 hover:shadow-neo-light-concave transition"
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>

                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <div className="flex-1 overflow-y-auto w-full lg:w-auto h-full">
                    {children}
                </div>
            </div>
        </>
    );
}
