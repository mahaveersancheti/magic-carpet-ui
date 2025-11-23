"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
    const router = useRouter();
    const [selectedMenu, setSelectedMenu] = useState("Home");
    const [mounted, setMounted] = useState(false);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined') return;
        
        setMounted(true);
        
        // Get initial theme from DOM
        const checkTheme = () => {
            if (typeof document !== 'undefined' && document.documentElement) {
                const hasDarkClass = document.documentElement.classList.contains("dark");
                setIsDark(hasDarkClass);
            }
        };
        
        // Check theme immediately
        checkTheme();
        
        // Watch for changes to the dark class on html element
        let observer: MutationObserver | null = null;
        if (typeof document !== 'undefined' && document.documentElement) {
            observer = new MutationObserver(checkTheme);
            observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ["class"],
            });
        }

        return () => {
            if (observer) {
                observer.disconnect();
            }
        };
    }, []);

    const handleNavigation = (label: string) => {
        setSelectedMenu(label); // highlight selected item

        if(label == "Home"){
            router.push("/home");
        }

        if(label == "User Profile"){
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

    const menuItems = [
        // ["settings", "LinkedIn Action"],
        ["person", "User Profile"],
    ];

    if (!mounted) {
        return (
            <aside className="w-80 p-3 h-full">
                <div className="flex flex-col h-full rounded-2xl shadow-neo-light-convex dark:shadow-neo-dark-convex p-5 bg-white dark:bg-[#111315]">
                    <div className="h-full" />
                </div>
            </aside>
        );
    }

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
                    className="flex flex-col h-full rounded-2xl shadow-neo-light-convex dark:shadow-neo-dark-convex p-4 sm:p-5 bg-white dark:bg-[#111315]"
                    style={{ backgroundColor: isDark ? '#111315' : '#ffffff' }}
                >
                    {/* Mobile Close Button */}
                    <button
                        onClick={onClose}
                        className="lg:hidden absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-[#2b2f34] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#3a3f45] transition"
                    >
                        <span className="material-symbols-outlined text-lg">close</span>
                    </button>

                    {/* Logo */}
                    <div className="flex items-center gap-3 p-2 mb-6 sm:mb-10">
                        <div
                            className="size-9 sm:size-11 rounded-full bg-cover bg-center shadow-neo-light-convex dark:shadow-neo-dark-convex shrink-0"
                            style={{
                                backgroundImage:
                                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD8GfqTO1JesMaHQ9vmnYnPY_KR16CBayMpwMoOTdBJackbKjHcSMUz_A4_fAxYmdY-dZMMzMnn4BN1a-Tn5lDAW9OTXxJTYQ05M4b6nAOnRSrwBkeW5kaB2qOg9TOHvzA0oj75ei0VWjFB6ybDP-whRqADCG7D7xenLVUbcdoXsY6lOmO4QAlDKUNveNSXqDbj5W0lDFUH86Ar9I7dAvpwQMXtK_GCkQE2n_7slNoZqPn6ouhQp0pfd617JoFV_4oaFWvMmDkGoFK7")',
                            }}
                        />
                        <h1 className="text-lg sm:text-xl font-semibold text-foreground dark:text-white">Magic Carpet</h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col gap-2 sm:gap-3">

                        {/* Dashboard */}
                        <a
                            onClick={() => handleNavigation("Home")}
                            className={`flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl cursor-pointer text-sm sm:text-base
                                ${selectedMenu === "Home"
                                    ? "bg-[#1B7FE6] text-white shadow-[0_4px_10px_rgba(27,127,230,0.35)]"
                                    : "text-foreground dark:text-white"
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
                                        : "text-foreground dark:text-white hover:shadow-neo-light-concave dark:hover:shadow-neo-dark-concave"
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

                    {/* Upgrade Card */}
                    <div 
                    className={`border border-gray-200 dark:border-gray-700 mt-auto p-4 sm:p-5 rounded-2xl ${isDark ? 'shadow-neo-light-concave' : 'shadow-neo-dark-concave'} bg-gray-100 dark:bg-[#2b2f34]`}
                    style={{ backgroundColor: isDark ? '#111315' : '#ffffff' }}
                    >
                        <p className="text-xs sm:text-sm font-semibold text-foreground dark:text-white text-center">
                            Upgrade to Pro
                        </p>
                        <p className="text-xs text-foreground dark:text-white mt-1 text-center">
                            Get access to all features and enhance your search capabilities.
                        </p>
                        <button className="mt-3 sm:mt-4 w-full py-2 rounded-xl bg-[#1B7FE6] text-white font-semibold text-sm sm:text-base shadow-[0_4px_12px_rgba(27,127,230,0.35)] hover:bg-[#176cc3] transition">
                            Upgrade Now
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
