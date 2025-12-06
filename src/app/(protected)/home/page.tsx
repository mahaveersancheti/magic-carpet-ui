"use client";
import { UploadModal } from "@/app/components/UploadModal";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Linkedin, Instagram, Twitter, Globe, Plus, Loader2 } from "lucide-react";
import { AddRequestModal } from "@/app/components/AddRequestFormModal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";
import { fetchProfiles } from "../../redux/slices/ProfileSlice";
import toast from "react-hot-toast";

type StatusType = "Complete" | "Pending" | "Failed";

interface TableRow {
  id: string; // Changed to string to match API
  name: string;
  company: string;
  email: string;
  phone: string;
  status: string; // Relaxed type for mapping
  date: string;
}

// const RAW_TABLE_ROWS: TableRow[] = [
//   { id: 1, name: "John Doe", company: "Innovate Inc.", email: "john@innovate.com", phone: "+1 555-0101", status: "Complete", date: "2023-10-26" },
//   { id: 2, name: "Jane Smith", company: "Tech Solutions", email: "jane@techsol.com", phone: "+1 555-0102", status: "Pending", date: "2023-10-25" },
//   { id: 3, name: "Mary Johnson", company: "Data Corp", email: "mary@datacorp.com", phone: "+1 555-0103", status: "Failed", date: "2023-10-24" },
//   { id: 4, name: "Alex Brown", company: "Future Labs", email: "alex@futurelabs.ai", phone: "+1 555-0104", status: "Complete", date: "2023-10-22" },
//   { id: 5, name: "Sarah Lee", company: "NexGen AI", email: "sarah@nexgen.ai", phone: "+1 555-0105", status: "Pending", date: "2023-10-20" },
// ];

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { profiles, loading, error } = useSelector((state: RootState) => state.profiles);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAddRequestModalOpen, setIsAddRequestModalOpen] = useState(false);
  const [openSocialRowId, setOpenSocialRowId] = useState<string | null>(null); // Lifted state for single open menu

  useEffect(() => {
    dispatch(fetchProfiles());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Sorting & Filtering State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<keyof TableRow>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const viewDetails = (action: string, id: string) => {
    if (action === "visibility") {
      router.push(`/request/${id}`);
    } else if (action === "upload") {
      setIsUploadModalOpen(true);
    }
  };

  // Sorting Handler
  const handleSort = (key: keyof TableRow) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  // Filtered & Sorted Data
  const filteredAndSortedRows = useMemo(() => {
    // Map API profiles to TableRow format
    const mappedRows: TableRow[] = profiles.map(p => ({
      id: p.id, // Ensure ID type matches (string vs number) - adjusting TableRow interface below might be needed if ID is string
      name: p.name,
      company: p.currentCompanyName || 'N/A',
      email: p.email,
      phone: p.phone || 'N/A',
      status: (p.status === 'NEW' ? 'Pending' : p.status) as StatusType || 'Pending', // Mapping status
      date: p.createdAt ? p.createdAt.substring(0, 10) : 'N/A'
    }));

    let filtered = mappedRows;

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(row =>
        row.name.toLowerCase().includes(term) ||
        row.company.toLowerCase().includes(term) ||
        row.status.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(row => row.status === statusFilter);
    }

    // Sorting
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [searchTerm, statusFilter, sortKey, sortOrder]);

  // Sort Icon Component
  const SortIcon = ({ column }: { column: keyof TableRow }) => {
    if (sortKey !== column) return <ArrowUpDown className="w-4 h-4 opacity-40" />;
    return sortOrder === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };


  function ActionButtons({ row }: { row: TableRow }) {
    const isSocialOpen = openSocialRowId === row.id;

    const originalActions = [
      { icon: "visibility", label: "View Details" },
      { icon: "upload", label: "Upload Document" },
      { icon: "download", label: "Download" },
    ];

    const socialLinks = [
      { icon: Linkedin, color: "text-[#0A66C2]", label: "LinkedIn", url: `https://linkedin.com/in/${row.name.toLowerCase().replace(" ", "-")}` },
      { icon: Instagram, color: "text-pink-600", label: "Instagram", url: `https://instagram.com/${row.name.toLowerCase().replace(" ", ".")}` },
      { icon: Twitter, color: "text-black", label: "X (Twitter)", url: `https://x.com/${row.name.toLowerCase().replace(" ", "")}` },
      { icon: Globe, color: "text-purple-600", label: "Website", url: `https://facebook.com/${row.name.toLowerCase().replace(" ", ".")}` },
    ];

    const toggleSocial = (e: React.MouseEvent) => {
      e.stopPropagation();
      setOpenSocialRowId(isSocialOpen ? null : row.id);
    };

    // Close when clicking outside
    useEffect(() => {
      const handleClickOutside = () => setOpenSocialRowId(null);
      if (isSocialOpen) {
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
      }
    }, [isSocialOpen]);

    return (
      <div className="flex items-center gap-1 sm:gap-2 relative">
        {/* Original 3 buttons */}
        {originalActions.map((action) => (
          <button
            key={action.icon}
            onClick={() => viewDetails(action.icon, row.id)}
            title={action.label}
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full shadow-neo-light-convex hover:shadow-neo-light-concave transition bg-white group relative"
          >
            <span className="material-symbols-outlined text-gray-700 text-xs sm:text-sm">
              {action.icon}
            </span>
            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-50">
              {action.label}
            </span>
          </button>
        ))}

        {/* Social FAB Button */}
        <div className="relative">
          {/* Social Icons - Open to the LEFT */}
          <div
            style={{ zIndex: 10, backgroundColor: '#ffffff' }}
            className={`absolute right-full top-1/2 -translate-y-1/2 mr-3 flex items-center gap-1 transition-all duration-400 origin-right ${isSocialOpen
              ? "opacity-100 scale-100"
              : "opacity-0 scale-0 pointer-events-none"
              }`}
          // style={{  }}
          >
            {socialLinks.map((social, i) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full shadow-neo-light-convex hover:shadow-neo-light-concave transition-all bg-white group"
                style={{
                  animation: isSocialOpen ? `popInLeft 0.3s ease-out ${i * 70}ms both` : "",
                }}
              >
                <social.icon className={`w-5 h-5 ${social.color}`} strokeWidth={2.5} />
                <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-50 shadow-lg">
                  {social.label}
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 border-8 border-transparent border-b-black"></span>
                </span>
              </a>
            ))}
          </div>

          {/* Main + Button */}
          <button
            onClick={toggleSocial}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full shadow-neo-light-convex hover:shadow-neo-light-concave transition bg-gradient-to-br from-blue-500 to-blue-600 text-white group z-10"
            title="Social Profiles"
          >
            <Plus
              className={`w-5 h-5 transition-transform duration-300 ${isSocialOpen ? "rotate-45" : ""}`}
              strokeWidth={3}
            />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full bg-background-light min-h-screen">
      <main className="flex-1 p-4 md:p-8 w-full pt-16 lg:pt-4">
        <div className="flex flex-col gap-8">

          {/* Header */}
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Home
            </h1>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">

              {/* Search + Status Filter */}
              <div className="flex flex-col sm:flex-row gap-3">
                <label className="flex items-center gap-3 flex-1 h-12 px-4 rounded-full shadow-neo-light-concave bg-white">
                  <span className="material-symbols-outlined text-gray-500">search</span>
                  <input
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-foreground placeholder-gray-500"
                  />
                </label>
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="text-foreground h-12 px-4 rounded-full shadow-neo-light-concave outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="Complete">Complete</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>

              <button
                onClick={() => setIsAddRequestModalOpen(true)}
                className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full shadow-neo-light-convex hover:shadow-neo-light-concave transition bg-white group relative"
                title="Add New Request"
              >
                <span className="material-symbols-outlined text-gray-700 text-lg sm:text-xl">
                  add
                </span>

                {/* Tooltip at BOTTOM */}
                <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none z-50 shadow-lg">
                  Add New Request
                  {/* Little triangle pointer */}
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 border-8 border-transparent border-b-black"></span>
                </span>
              </button>

              <div className="flex items-center gap-3">
                <HeaderIcon icon="notifications" />
              </div>
            </div>
          </header>

          {/* Table Section */}
          <section
            className="p-4 sm:p-6 rounded-2xl shadow-neo-light-convex overflow-visible" // Changed to overflow-visible to prevent clipping
            style={{ backgroundColor: '#ffffff' }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
              Active Search Requests ({filteredAndSortedRows.length})
            </h2>

            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="w-full text-left min-w-[600px]">
                  <thead>
                    <tr className="text-foreground text-xs sm:text-sm">
                      <th className="pb-3 px-2 sm:px-4">
                        <button onClick={() => handleSort("id")} className="flex items-center gap-1 hover:text-blue-600">
                          S.No <SortIcon column="id" />
                        </button>
                      </th>
                      <th className="pb-3 px-2 sm:px-4">
                        <button onClick={() => handleSort("name")} className="flex items-center gap-1 hover:text-blue-600">
                          Person's Name <SortIcon column="name" />
                        </button>
                      </th>
                      <th className="pb-3 px-2 sm:px-4 hidden lg:table-cell">
                        <button onClick={() => handleSort("company")} className="flex items-center gap-1 hover:text-blue-600">
                          Company <SortIcon column="company" />
                        </button>
                      </th>
                      <th className="pb-3 px-2 sm:px-4 hidden xl:table-cell">
                        Email
                      </th>
                      <th className="pb-3 px-2 sm:px-4 hidden xl:table-cell">
                        Phone
                      </th>
                      <th className="pb-3 px-2 sm:px-4">Status</th>
                      <th className="pb-3 px-2 sm:px-4 hidden md:table-cell">
                        <button onClick={() => handleSort("date")} className="flex items-center gap-1 hover:text-blue-600">
                          Date <SortIcon column="date" />
                        </button>
                      </th>
                      <th className="pb-3 px-2 sm:px-4">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="text-foreground">
                    {filteredAndSortedRows.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-12 text-gray-500">
                          No requests found matching your filters.
                        </td>
                      </tr>
                    ) : (
                      filteredAndSortedRows.map((row) => (
                        <tr
                          key={row.id}
                          className="h-auto sm:h-[76px] border-t border-gray-200"
                        >
                          <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm">{row.id}</td>
                          <td className="font-semibold px-2 sm:px-4 py-3 text-xs sm:text-sm">{row.name}</td>
                          <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm hidden lg:table-cell">{row.company}</td>
                          <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm hidden xl:table-cell">
                            <a href={`mailto:${row.email}`} className="text-blue-600 hover:underline">
                              {row.email}
                            </a>
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm hidden xl:table-cell">
                            <a href={`tel:${row.phone}`} className="text-blue-600 hover:underline">
                              {row.phone}
                            </a>
                          </td>
                          <td className="px-2 sm:px-4 py-3">
                            <StatusPill status={row.status} />
                          </td>
                          <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm hidden md:table-cell">{row.date}</td>
                          <td className="px-2 sm:px-4 py-3">
                            <ActionButtons row={row} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-neo-light-convex flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-gray-700 font-medium">Loading Profiles...</p>
          </div>
        </div>
      )}

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setSelectedFile(null);
        }}
        onUpload={(file) => {
          console.log("Uploading file:", file);
          alert(`Uploaded: ${file.name}`);
        }}
      />

      <AddRequestModal
        isOpen={isAddRequestModalOpen}
        onClose={() => setIsAddRequestModalOpen(false)}
      />
    </div>
  );
}

/* Small Components (unchanged) */
function HeaderIcon({ icon }: { icon: string }) {
  return (
    <button className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full shadow-neo-light-convex hover:shadow-neo-light-concave transition bg-white">
      <span className="material-symbols-outlined text-gray-700 text-lg sm:text-xl">{icon}</span>
    </button>
  );
}

function FormInput({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div className="flex flex-col gap-2 text-start">
      <label className="text-foreground text-sm">{label}</label>
      <input
        placeholder={placeholder}
        className="border border-gray-200 h-12 px-5 rounded-full bg-white shadow-neo-light-concave text-foreground outline-none placeholder-gray-500"
      />
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    Complete: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Failed: "bg-red-100 text-red-700",
  };

  return (
    <span className={`inline-flex px-2 sm:px-4 h-6 sm:h-8 rounded-full items-center justify-center text-xs font-medium shadow-inner ${map[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}