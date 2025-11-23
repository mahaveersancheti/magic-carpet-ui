"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    setMounted(true);
    
    // Get initial theme from DOM
    const checkTheme = () => {
      if (typeof document !== 'undefined' && document.documentElement) {
        const isDark = document.documentElement.classList.contains("dark");
        setTheme(isDark ? "dark" : "light");
      }
    };
    
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

  const toggleTheme = () => {
    if (typeof document !== 'undefined' && document.documentElement) {
      const isDark = document.documentElement.classList.contains("dark");
      if (isDark) {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
        setTheme("light");
      } else {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
        setTheme("dark");
      }
    }
  };


  const viewDetails = (action:string) => {
    console.log("Action",action);
    if(action == 'visibility') router.push('/request/10');
  }

  if (!mounted) {
    return (
      <div className="flex min-h-screen w-full bg-background-light dark:bg-[#1c1f22]">
        <main className="flex-1 p-8">
          <div className="flex flex-col gap-8">
            <header className="flex items-center justify-between">
              <h1 className="text-4xl font-extrabold text-foreground dark:text-white tracking-tight">
                Home
              </h1>
            </header>
          </div>
        </main>
      </div>
    );
  }

  function ActionButtons() {
    return (
      <div className="flex items-center gap-1 sm:gap-2">
        {["link", "apartment", "play_arrow", "visibility"].map((i) => (
          <button
            onClick={() => viewDetails(i)}
            key={i}
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full shadow-neo-light-convex dark:shadow-neo-dark-convex hover:shadow-neo-light-concave transition bg-white dark:bg-[#2a2d31]"
          >
            <span className="material-symbols-outlined text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
              {i}
            </span>
          </button>
        ))}
      </div>
    );
  }
  
  return (
    <div className="flex w-full bg-background-light dark:bg-[#1c1f22] min-h-screen">
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 w-full pt-16 lg:pt-4">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground dark:text-white tracking-tight">
            Home
            </h1>

            <div className="flex items-center gap-3 sm:gap-5 w-full sm:w-auto">
              {/* Search Bar */}
              <label className="flex items-center gap-3 flex-1 sm:flex-initial sm:w-80 h-12 px-4 rounded-full shadow-neo-light-concave dark:shadow-neo-dark-concave bg-white dark:bg-[#2a2d31]">
                <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">
                  search
                </span>
                <input
                  placeholder="Search requests..."
                  className="flex-1 bg-transparent outline-none text-foreground dark:text-white placeholder-gray-500 dark:placeholder-gray-500"
                />
              </label>

              {/* Notification */}
              <HeaderIcon icon="notifications" />

              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full shadow-neo-light-convex dark:shadow-neo-dark-convex hover:shadow-neo-light-concave dark:hover:shadow-neo-dark-concave transition bg-white dark:bg-[#2a2d31] shrink-0"
              >
                <span className="material-symbols-outlined text-gray-700 dark:text-gray-300 text-lg sm:text-xl">
                  {theme === "light" ? "dark_mode" : "light_mode"}
                </span>
              </button>
            </div>
          </header>

          {/* Table Section */}
          <section 
          className="p-4 sm:p-6 rounded-2xl shadow-neo-light-convex dark:shadow-neo-dark-convex"
          style={{ backgroundColor: theme === 'dark' ? '#0f141b' : '#ffffff' }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-foreground dark:text-white mb-4">
              Active Search Requests
            </h2>

            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="w-full text-left min-w-[600px]">
                  <thead>
                    <tr className="text-foreground dark:text-white text-xs sm:text-sm">
                      <th className="pb-3 px-2 sm:px-4">S.No</th>
                      <th className="pb-3 px-2 sm:px-4">Person's Name</th>
                      <th className="pb-3 px-2 sm:px-4 hidden sm:table-cell">Company</th>
                      <th className="pb-3 px-2 sm:px-4">Status</th>
                      <th className="pb-3 px-2 sm:px-4 hidden md:table-cell">Date</th>
                      <th className="pb-3 px-2 sm:px-4">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="text-foreground dark:text-white">
                    {TABLE_ROWS.map((row) => (
                      <tr
                        key={row.id}
                        className="h-auto sm:h-[76px] border-t border-gray-200 dark:border-[#3a3f45] text-foreground dark:text-white"
                      >
                        <td className=" px-2 sm:px-4 py-3 text-xs sm:text-sm">{row.id}</td>
                        <td className="font-semibold text-foreground dark:text-white px-2 sm:px-4 py-3 text-xs sm:text-sm">{row.name}</td>
                        <td className=" px-2 sm:px-4 py-3 text-xs sm:text-sm hidden sm:table-cell">{row.company}</td>
                        <td className="px-2 sm:px-4 py-3">
                          <StatusPill status={row.status} />
                        </td>
                        <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm hidden md:table-cell">{row.date}</td>
                        <td className="px-2 sm:px-4 py-3">
                          <ActionButtons />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Add Request */}
          <section 
          className="p-4 sm:p-6 rounded-2xl shadow-neo-light-convex dark:shadow-neo-dark-convex"
          style={{ backgroundColor: theme === 'dark' ? '#0f141b' : '#ffffff' }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-foreground dark:text-white mb-4">
              Add New Search Request
            </h2>

            <form className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-end">
              <FormInput label="Name of Person" placeholder="e.g., John Doe" />
              <FormInput label="Company Name" placeholder="e.g., Innovate Inc." />

              <button className="h-12 px-6 sm:px-8 bg-[#1B7FE6] text-white rounded-full font-semibold text-sm sm:text-base shadow-[0_4px_12px_rgba(27,127,230,0.35)] hover:bg-[#176cc3] transition">
                Submit Request
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ——————————— SMALL COMPONENTS ——————————— */

function HeaderIcon({ icon }: { icon: string }) {
  return (
    <button className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full shadow-neo-light-convex dark:shadow-neo-dark-convex hover:shadow-neo-light-concave dark:hover:shadow-neo-dark-concave transition bg-white dark:bg-[#2a2d31]">
      <span className="material-symbols-outlined text-gray-700 dark:text-gray-300 text-lg sm:text-xl">{icon}</span>
    </button>
  );
}

function FormInput({ label, placeholder }:any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-foreground dark:text-white text-sm">{label}</label>
      <input
        placeholder={placeholder}
        className="h-12 px-5 rounded-full bg-white dark:bg-[#2a2d31] shadow-neo-light-concave dark:shadow-neo-dark-concave text-foreground dark:text-white outline-none placeholder-gray-500 dark:placeholder-gray-500"
      />
    </div>
  );
}

function StatusPill({ status }: any) {
  const map:any = {
    Complete: "bg-green-100 dark:bg-green-700/30 text-green-700 dark:text-green-300",
    Pending: "bg-yellow-100 dark:bg-yellow-700/30 text-yellow-700 dark:text-yellow-300",
    Failed: "bg-red-100 dark:bg-red-700/30 text-red-700 dark:text-red-300",
  };

  return (
    <span
      className={`inline-flex px-2 sm:px-4 h-6 sm:h-8 rounded-full items-center justify-center text-xs font-medium shadow-inner ${map[status]}`}
    >
      {status}
    </span>
  );
}

/* Table Data */
const TABLE_ROWS = [
  { id: 1, name: "John Doe", company: "Innovate Inc.", status: "Complete", date: "2023-10-26" },
  { id: 2, name: "Jane Smith", company: "Tech Solutions", status: "Pending", date: "2023-10-25" },
  { id: 3, name: "Mary Johnson", company: "Data Corp", status: "Failed", date: "2023-10-24" },
];
