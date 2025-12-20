"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [selectedMenu, setSelectedMenu] = useState("Home");

    useEffect(() => {
        if (pathname?.includes("/userprofile")) {
            setSelectedMenu("User Profile");
        } else if (pathname?.includes("/linkedin-action")) {
            setSelectedMenu("LinkedIn Action");
        } else {
            setSelectedMenu("Home");
        }
    }, [pathname]);

    const handleNavigation = (label: string) => {
        setSelectedMenu(label);

        if (label === "Home") {
            router.push("/home");
        }
        if (label === "User Profile") {
            router.push("/userprofile");
        }
        if (label === "LinkedIn Action") {
            router.push("/linkedin-action");
        }

        if (onClose) {
            onClose();
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        if (onClose) {
            onClose();
        }
        window.location.href = '/';
    };

    const menuItems = [
        ["person", "User Profile"],
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`
                h-screen lg:h-full
                fixed lg:sticky top-0 left-0 z-50
                w-72 p-6
                shrink-0 self-start
                bg-white border-r border-gray-200 shadow-sm
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Mobile Close Button */}
                    <button
                        onClick={onClose}
                        className="lg:hidden absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition"
                    >
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>

                    {/* Logo - Properly Aligned & Sized */}
                    <div className="flex items-center justify-center">
                        <img
                            src="/magic_carpet_logo.png"
                            alt="Magic Carpet Logo"
                            className="w-48 h-auto object-contain transition-all duration-500 hover:scale-105 drop-shadow-sm"
                        />
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col gap-1">
                        {/* Dashboard */}
                        <a
                            onClick={() => handleNavigation("Home")}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-sm font-semibold transition-all duration-200
                                ${selectedMenu === "Home"
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }
                            `}
                        >
                            <span className={`material-symbols-outlined text-xl ${selectedMenu === "Home" ? "fill-current" : ""}`}>home</span>
                            <p>Home</p>
                        </a>

                        {/* Dynamic Menu Items */}
                        {menuItems.map(([icon, label]) => (
                            <a
                                key={label}
                                onClick={() => handleNavigation(label)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-sm font-semibold transition-all duration-200
                                    ${selectedMenu === label
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }
                                `}
                            >
                                <span className={`material-symbols-outlined text-xl ${selectedMenu === label ? "fill-current" : ""}`}>
                                    {icon}
                                </span>
                                <p>{label}</p>
                            </a>
                        ))}
                    </nav>

                    {/* Logout Button */}
                    <div className="mt-auto pt-4 border-t border-gray-100">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-sm font-semibold text-gray-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
                        >
                            <span className="material-symbols-outlined text-xl">
                                logout
                            </span>
                            <p>Logout</p>
                        </button>
                    </div>

                    {/* Upgrade Card */}
                    <div className="mt-6 p-5 rounded-3xl bg-blue-50 border border-blue-100">
                        <p className="text-sm font-bold text-gray-900">
                            Upgrade to Pro
                        </p>
                        <p className="text-xs text-gray-500 mt-1 mb-4 leading-relaxed">
                            Unlock elite reports and deep tactical insights.
                        </p>
                        <button className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-all active:scale-95 shadow-sm">
                            Upgrade Now
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
