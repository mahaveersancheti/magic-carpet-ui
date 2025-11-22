"use client";
import { useRouter } from "next/navigation";
import React from "react";

export default function DashboardPage() {

  const router = useRouter();


  const viewDetails = (action:string) => {
    console.log("Action",action);
    if(action == 'visibility') router.push('/request/10');
  }

  function ActionButtons() {
    return (
      <div className="flex items-center gap-2">
        {["link", "apartment", "play_arrow", "visibility"].map((i) => (
          <button
            onClick={() => viewDetails(i)}
            key={i}
            className="w-8 h-8 flex items-center justify-center rounded-full shadow-neo-light-convex dark:shadow-neo-dark-convex hover:shadow-neo-light-concave transition"
          >
            <span className="material-symbols-outlined text-gray-300 text-sm">
              {i}
            </span>
          </button>
        ))}
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen w-full bg-[#2f343a] dark:bg-[#1c1f22]">
      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <header className="flex items-center justify-between">
            <h1 className="text-4xl font-extrabold text-white tracking-tight">
              Visitor Search Dashboard
            </h1>

            <div className="flex items-center gap-5">
              {/* Search Bar */}
              <label className="flex items-center gap-3 w-80 h-12 px-4 rounded-full shadow-neo-light-concave dark:shadow-neo-dark-concave bg-[#2a2d31]">
                <span className="material-symbols-outlined text-gray-400">
                  search
                </span>
                <input
                  placeholder="Search requests..."
                  className="flex-1 bg-transparent outline-none text-white placeholder-gray-500"
                />
              </label>

              {/* Notification */}
              <HeaderIcon icon="notifications" />

              {/* Theme */}
              <HeaderIcon icon="dark_mode" />
            </div>
          </header>

          {/* Table Section */}
          <section className="p-6 rounded-2xl shadow-neo-light-convex dark:shadow-neo-dark-convex bg-[#25282c]">
            <h2 className="text-2xl font-bold text-white mb-4">
              Active Search Requests
            </h2>

            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-300 text-sm">
                  <th className="pb-3">S.No</th>
                  <th className="pb-3">Person's Name</th>
                  <th className="pb-3">Company</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>

              <tbody className="text-gray-200">
                {TABLE_ROWS.map((row) => (
                  <tr
                    key={row.id}
                    className="h-[76px] border-t border-[#3a3f45]"
                  >
                    <td>{row.id}</td>
                    <td className="font-semibold text-white">{row.name}</td>
                    <td>{row.company}</td>
                    <td>
                      <StatusPill status={row.status} />
                    </td>
                    <td>{row.date}</td>
                    <td>
                      <ActionButtons />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Add Request */}
          <section className="p-6 rounded-2xl shadow-neo-light-convex dark:shadow-neo-dark-convex bg-[#25282c]">
            <h2 className="text-2xl font-bold text-white mb-4">
              Add New Search Request
            </h2>

            <form className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <FormInput label="Name of Person" placeholder="e.g., John Doe" />
              <FormInput label="Company Name" placeholder="e.g., Innovate Inc." />

              <button className="h-12 px-8 bg-[#1B7FE6] text-white rounded-full font-semibold shadow-[0_4px_12px_rgba(27,127,230,0.35)] hover:bg-[#176cc3] transition">
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
    <button className="w-12 h-12 flex items-center justify-center rounded-full shadow-neo-light-convex dark:shadow-neo-dark-convex hover:shadow-neo-light-concave dark:hover:shadow-neo-dark-concave transition">
      <span className="material-symbols-outlined text-gray-300">{icon}</span>
    </button>
  );
}

function FormInput({ label, placeholder }:any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-white text-sm">{label}</label>
      <input
        placeholder={placeholder}
        className="h-12 px-5 rounded-full bg-[#2a2d31] shadow-neo-light-concave dark:shadow-neo-dark-concave text-white outline-none placeholder-gray-500"
      />
    </div>
  );
}

function StatusPill({ status }: any) {
  const map:any = {
    Complete: "bg-green-700/30 text-green-300",
    Pending: "bg-yellow-700/30 text-yellow-300",
    Failed: "bg-red-700/30 text-red-300",
  };

  return (
    <span
      className={`inline-flex px-4 h-8 rounded-full items-center justify-center text-xs font-medium shadow-inner ${map[status]}`}
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
