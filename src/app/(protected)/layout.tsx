"use client";
import { useEffect, useState } from 'react';
import Sidebar from '../components/SideBar';

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            <div className="flex min-h-screen h-screen w-full relative">
                {/* Mobile Menu Button */}
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden fixed top-4 left-4 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-[#2a2d31] shadow-neo-light-convex dark:shadow-neo-dark-convex text-gray-700 dark:text-gray-300 hover:shadow-neo-light-concave dark:hover:shadow-neo-dark-concave transition"
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
