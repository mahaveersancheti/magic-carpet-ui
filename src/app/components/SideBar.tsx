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
    const [isCollapsed, setIsCollapsed] = useState(true);

    useEffect(() => {
        if (pathname?.includes("/userprofile")) {
            setSelectedMenu("User Profile");
        } else if (pathname?.includes("/products")) {
            setSelectedMenu("Products");
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
        if (label === "Products") {
            router.push("/products");
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
        ["inventory_2", "Products"],
        // ["share", "LinkedIn Action"],
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
                h-screen fixed lg:sticky top-0 left-0 z-[70]
                flex flex-col bg-white dark:bg-[#1a2530] border-r border-slate-200 dark:border-slate-800 shadow-xl
                transition-all duration-300 ease-in-out
                ${isCollapsed ? 'w-18' : 'w-64'}
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Mobile Close Button */}
                    <button
                        onClick={onClose}
                        className="lg:hidden absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 transition"
                    >
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>

                    {/* Logo Section */}
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-6'} py-8`}>
                        <div className={`flex items-center ${isCollapsed ? '' : 'gap-3'} overflow-hidden animate-in fade-in duration-500`}>
                            <img
                                src="/magic_carpet_logo.png"
                                alt="Magic Carpet"
                                className="h-10 w-auto object-contain transition-all hover:scale-105"
                            />
                            {!isCollapsed && (
                                <div className="flex flex-col animate-in fade-in slide-in-from-left-4 duration-500">
                                    <h1 className="text-lg font-bold leading-none text-[#0d141c] dark:text-white truncate">
                                        Magic Carpet
                                    </h1>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">
                                        Strategic Intel
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className={`flex-1 ${isCollapsed ? 'px-3 overflow-visible' : 'px-4 overflow-y-auto'} space-y-1.5 mt-2 no-scrollbar`}>
                        {/* Home Button */}
                        <div className="relative group">
                            <button
                                onClick={() => handleNavigation("Home")}
                                className={`flex items-center w-full transition-all duration-200 rounded-xl
                                    ${isCollapsed ? 'h-12 justify-center' : 'gap-3 px-3 py-2.5'}
                                    ${selectedMenu === "Home"
                                        ? "bg-blue-50 dark:bg-primary/10 text-[#258cf4]"
                                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    }
                                `}
                            >
                                <span className={`material-symbols-outlined ${selectedMenu === "Home" ? "fill-1" : ""}`}>home</span>
                                {!isCollapsed && <span className="text-sm font-semibold truncate animate-in fade-in duration-300">Home</span>}
                            </button>
                            {isCollapsed && (
                                <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-[100] shadow-2xl translate-x-1 group-hover:translate-x-0 border border-slate-700 dark:border-slate-600 flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                                    Home
                                </div>
                            )}
                        </div>

                        {/* Dynamic Items */}
                        {menuItems.map(([icon, label]) => (
                            <div key={label} className="relative group">
                                <button
                                    onClick={() => handleNavigation(label)}
                                    className={`flex items-center w-full transition-all duration-200 rounded-xl
                                        ${isCollapsed ? 'h-12 justify-center' : 'gap-3 px-3 py-2.5'}
                                        ${selectedMenu === label
                                            ? "bg-blue-50 dark:bg-primary/10 text-[#258cf4]"
                                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                        }
                                    `}
                                >
                                    <span className={`material-symbols-outlined ${selectedMenu === label ? "fill-1" : ""}`}>
                                        {icon}
                                    </span>
                                    {!isCollapsed && <span className="text-sm font-semibold truncate animate-in fade-in duration-300">{label}</span>}
                                </button>
                                {isCollapsed && (
                                    <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-[100] shadow-2xl translate-x-1 group-hover:translate-x-0 border border-slate-700 dark:border-slate-600 flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                                        {label}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Bottom Section */}
                    <div className="p-4 space-y-4">
                        {/* Collapse Toggle */}
                        <div className="relative group">
                            <button
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className="hidden lg:flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 h-10 text-[#0d141c] dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            >
                                <span className={`material-symbols-outlined text-sm transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
                                    keyboard_double_arrow_left
                                </span>
                                {!isCollapsed && <span className="animate-in fade-in duration-300">Collapse</span>}
                            </button>
                            {isCollapsed && (
                                <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-[100] shadow-2xl translate-x-1 group-hover:translate-x-0 border border-slate-700 dark:border-slate-600 flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                                    Expand
                                </div>
                            )}
                        </div>

                        {/* Theme Toggle & Logout Container */}
                        <div className={`pt-4 border-t border-slate-100 dark:border-slate-800 flex ${isCollapsed ? 'flex-col items-center' : 'justify-between'} gap-4`}>
                            {/* Dark Mode Toggle */}
                            {/* <button
                                onClick={() => document.documentElement.classList.toggle('dark')}
                                className={`flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-[#258cf4] hover:bg-slate-200 dark:hover:bg-slate-700 transition-all ${isCollapsed ? 'w-10 h-10' : 'flex-1 h-10'}`}
                            >
                                <span className="material-symbols-outlined text-lg">dark_mode</span>
                            </button> */}

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className={`flex items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/20 text-red-500 hover:bg-red-500 hover:text-white transition-all ${isCollapsed ? 'w-10 h-10' : 'flex-1 h-10'}`}
                            >
                                <span className="material-symbols-outlined text-lg">logout</span>
                            </button>
                        </div>

                        {/* Upgrade to Pro */}
                        <div className="relative group">
                            <button className={`
                                w-full bg-[#258cf4] text-white rounded-xl shadow-lg shadow-blue-500/20 hover:brightness-110 transition-all flex items-center justify-center
                                ${isCollapsed ? 'h-12' : 'p-4 flex-col gap-2'}
                            `}>
                                <span className="material-symbols-outlined">workspace_premium</span>
                                {!isCollapsed && (
                                    <div className="text-center animate-in fade-in duration-300">
                                        <p className="text-xs font-bold">Upgrade to Pro</p>
                                        <p className="text-[10px] text-blue-100">Unlock elite reports</p>
                                    </div>
                                )}
                            </button>
                            {isCollapsed && (
                                <div className="absolute left-full bottom-0 ml-2 px-3 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-[100] shadow-2xl translate-x-1 group-hover:translate-x-0 border border-slate-700 dark:border-slate-600 flex flex-col">
                                    <p className="text-xs font-bold flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                                        Upgrade to Pro
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">Unlock elite reports</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
