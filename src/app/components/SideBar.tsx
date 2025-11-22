export default function Sidebar() {
    return (
        <>
            {/* Sidebar */}
            <aside className="w-64 p-4">
                <div className="flex flex-col h-full rounded-2xl shadow-neo-light-convex dark:shadow-neo-dark-convex p-5 bg-[#25282c] dark:bg-[#111315]">
                    {/* Logo */}
                    <div className="flex items-center gap-3 p-2 mb-10">
                        <div
                            className="size-11 rounded-full bg-cover bg-center shadow-neo-light-convex dark:shadow-neo-dark-convex"
                            style={{
                                backgroundImage:
                                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD8GfqTO1JesMaHQ9vmnYnPY_KR16CBayMpwMoOTdBJackbKjHcSMUz_A4_fAxYmdY-dZMMzMnn4BN1a-Tn5lDAW9OTXxJTYQ05M4b6nAOnRSrwBkeW5kaB2qOg9TOHvzA0oj75ei0VWjFB6ybDP-whRqADCG7D7xenLVUbcdoXsY6lOmO4QAlDKUNveNSXqDbj5W0lDFUH86Ar9I7dAvpwQMXtK_GCkQE2n_7slNoZqPn6ouhQp0pfd617JoFV_4oaFWvMmDkGoFK7")',
                            }}
                        />
                        <h1 className="text-xl font-semibold text-white">SearchApp</h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col gap-3">
                        <a className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#1B7FE6] text-white font-medium shadow-[0_4px_10px_rgba(27,127,230,0.35)]">
                            <span className="material-symbols-outlined">dashboard</span>
                            Dashboard
                        </a>

                        {[
                            ["settings", "Settings"],
                            ["person", "Profile"],
                        ].map(([icon, label]) => (
                            <a
                                key={label}
                                className="flex items-center gap-3 px-5 py-3 rounded-xl hover:shadow-neo-light-concave dark:hover:shadow-neo-dark-concave transition"
                            >
                                <span className="material-symbols-outlined text-gray-300">
                                    {icon}
                                </span>
                                <p className="text-gray-200">{label}</p>
                            </a>
                        ))}
                    </nav>

                    {/* Upgrade Card */}
                    <div className="mt-auto p-5 rounded-2xl shadow-neo-light-concave dark:shadow-neo-dark-concave bg-[#2b2f34]">
                        <p className="text-sm font-semibold text-white text-center">
                            Upgrade to Pro
                        </p>
                        <p className="text-xs text-gray-300 mt-1 text-center">
                            Get access to all features and enhance your search capabilities.
                        </p>
                        <button className="mt-4 w-full py-2 rounded-xl bg-[#1B7FE6] text-white font-semibold shadow-[0_4px_12px_rgba(27,127,230,0.35)] hover:bg-[#176cc3] transition">
                            Upgrade Now
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}