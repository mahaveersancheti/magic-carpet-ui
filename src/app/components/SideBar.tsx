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
        setSelectedMenu(label); // highlight selected item

        if (label == "Home") {
            router.push("/home");
        }

        if (label == "User Profile") {
            router.push("/userprofile");
        }

        if (label === "LinkedIn Action") {
            router.push("/linkedin-action");
        }

        // Close mobile menu after navigation
        if (onClose) {
            onClose();
        }
    };

    const handleLogout = () => {
        // Clear token from localStorage
        localStorage.removeItem('token');

        // Close mobile menu if open
        if (onClose) {
            onClose();
        }
        window.location.href = '/';
    };

    const menuItems = [
        // ["settings", "LinkedIn Action"],
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
                w-64 sm:w-80 p-2 sm:p-3 
                shrink-0 self-start overflow-y-auto
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div
                    className="flex flex-col h-full rounded-2xl shadow-neo-light-convex p-4 sm:p-5 bg-white"
                >
                    {/* Mobile Close Button */}
                    <button
                        onClick={onClose}
                        className="lg:hidden absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                    >
                        <span className="material-symbols-outlined text-lg">close</span>
                    </button>

                    {/* Logo */}
                    <div className="flex items-center gap-3 p-2 mb-6 sm:mb-10">
                        <div
                            className="size-9 sm:size-11 rounded-full bg-cover bg-center shadow-neo-light-convex shrink-0"
                            style={{
                                backgroundImage:
                                    'url("/icon.png")',
                            }}
                        />
                        <h1 className="text-lg sm:text-xl font-semibold text-foreground">Magic Carpet</h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col gap-2 sm:gap-3">

                        {/* Dashboard */}
                        <a
                            onClick={() => handleNavigation("Home")}
                            className={`flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl cursor-pointer text-sm sm:text-base
                                ${selectedMenu === "Home"
                                    ? "bg-[#1B7FE6] text-white shadow-[0_4px_10px_rgba(27,127,230,0.35)]"
                                    : "text-foreground"
                                }
                            `}
                        >
                            <span className="material-symbols-outlined text-xl sm:text-2xl">Home</span>
                            <p>Home</p>
                        </a>

                        {/* Dynamic Menu Items */}
                        {menuItems.map(([icon, label]) => (
                            <a
                                key={label}
                                onClick={() => handleNavigation(label)}
                                className={`flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl cursor-pointer transition text-sm sm:text-base
                                    ${selectedMenu === label
                                        ? "bg-[#1B7FE6] text-white shadow-[0_4px_12px_rgba(27,127,230,0.35)]"
                                        : "text-foreground hover:shadow-neo-light-concave"
                                    }
                                `}
                            >
                                <span className="material-symbols-outlined text-xl sm:text-2xl">
                                    {icon}
                                </span>
                                <p>{label}</p>
                            </a>
                        ))}
                    </nav>

                    {/* Logout Button */}
                    <div className="mt-4">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl w-full text-foreground hover:bg-red-50 hover:text-red-600 transition text-sm sm:text-base border border-gray-200"
                        >
                            <span className="material-symbols-outlined text-xl sm:text-2xl">
                                logout
                            </span>
                            <p>Logout</p>
                        </button>
                    </div>

                    {/* Upgrade Card */}
                    {/* <div
                        className="border border-gray-200 mt-auto p-4 sm:p-5 rounded-2xl shadow-neo-light-concave bg-gray-100"
                    >
                        <p className="text-xs sm:text-sm font-semibold text-foreground text-center">
                            Upgrade to Pro
                        </p>
                        <p className="text-xs text-foreground mt-1 text-center">
                            Get access to all features and enhance your search capabilities.
                        </p>
                        <button className="mt-3 sm:mt-4 w-full py-2 rounded-xl bg-[#1B7FE6] text-white font-semibold text-sm sm:text-base shadow-[0_4px_12px_rgba(27,127,230,0.35)] hover:bg-[#176cc3] transition">
                            Upgrade Now
                        </button>
                    </div> */}
                </div>
            </aside>
        </>
    );
}
