"use client";
import { UploadModal } from "@/app/components/UploadModal";
import { ConfirmationDialog } from "@/app/components/ConfirmationDialog";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";
import { Linkedin, Instagram, Twitter, Globe, Loader2 } from "lucide-react";
// import { UserGuide, GuideStep } from "@/app/components/UserGuide";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";
import { fetchNotifications, fetchProfiles, deleteProfile } from "../../redux/slices/ProfileSlice";
import toast from "react-hot-toast";
import { api } from "../../services/apiService";
import { endpoints } from "../../lib/endpoints";

type StatusType = "Complete" | "Pending" | "Failed";

interface TableRow {
  id: string; // Changed to string to match API
  name: string;
  company: string;
  email: string;
  phone: string;
  status: string; // Relaxed type for mapping
  date: string;
  warmCallScore: number;
  linkedinUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
}

interface Notification {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { profiles, notificationsData, loading, error } = useSelector((state: RootState) => state.profiles);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [openSocialRowId, setOpenSocialRowId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Delete Confirmation State
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    id: string | null;
    name: string | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    id: null,
    name: null,
    isLoading: false
  });

  // User Guide State
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    setNotifications(notificationsData);
  }, [notificationsData]);

  useEffect(() => {
    // Check if user has seen the guide
    const hasSeenGuide = localStorage.getItem('hasSeenDashboardGuide_v1');
    if (!hasSeenGuide) {
      // Small delay to ensure UI is ready
      setTimeout(() => setShowGuide(true), 1000);
    }
  }, []);

  const handleGuideComplete = () => {
    localStorage.setItem('hasSeenDashboardGuide_v1', 'true');
    setShowGuide(false);
  };

  useEffect(() => {
    dispatch(fetchProfiles());
    dispatch(fetchNotifications());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Sorting & Filtering State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<keyof TableRow | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset page when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const viewDetails = (action: string, id: string) => {
    if (action === "visibility") {
      router.push(`/request?id=${id}`);
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

  const filteredAndSortedRows = useMemo(() => {
    const mappedRows: TableRow[] = profiles.map(p => {
      let status = "Pending";
      const originalStatus = p.status?.toUpperCase();
      
      if (originalStatus === "COMPLETED" || originalStatus === "COMPLETE") {
        status = "Complete";
      } else if (originalStatus === "FAILED") {
        status = "Failed";
      }
      
      return {
        id: p.id,
        name: p.name,
        company: p.currentCompanyName || "N/A",
        email: p.email,
        phone: p.phone || "N/A",
        status: status,
        date: p.createdAt ? p.createdAt.substring(0, 10) : "N/A",
        warmCallScore: parseInt((p as any).warmCallScore || "0", 10),
        linkedinUrl: (p as any).linkedinUrl || (p as any).linkedinProfileLink || "",
        instagramUrl: (p as any).instagramUrl || "",
        twitterUrl: (p as any).twitterUrl || "",
        websiteUrl: (p as any).websiteUrl || "",
      };
    });

    let filtered = mappedRows;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(row =>
        row?.name?.toLowerCase()?.includes(term) ||
        row?.company?.toLowerCase()?.includes(term) ||
        row?.status?.toLowerCase()?.includes(term)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(row => row.status === statusFilter);
    }

    if (!sortKey) return filtered;

    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey] ?? "";
      const bVal = b[sortKey] ?? "";

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortOrder === "asc" ? (aVal < bVal ? -1 : 1) : (aVal > bVal ? -1 : 1);
    });
  }, [profiles, searchTerm, statusFilter, sortKey, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedRows.length / itemsPerPage);
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedRows.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedRows, currentPage]);

  // Calculate statistics for dashboard cards
  const stats = useMemo(() => {
    const total = filteredAndSortedRows.length;
    const red = filteredAndSortedRows.filter(r => r.warmCallScore >= 0 && r.warmCallScore <= 25).length;
    const orange = filteredAndSortedRows.filter(r => r.warmCallScore > 25 && r.warmCallScore <= 50).length;
    const yellow = filteredAndSortedRows.filter(r => r.warmCallScore > 50 && r.warmCallScore <= 75).length;
    const green = filteredAndSortedRows.filter(r => r.warmCallScore > 75 && r.warmCallScore <= 100).length;

    return {
      totalLeads: total,
      activeProspects: filteredAndSortedRows.filter(r => r.status === "PROFILE_EXTRACTED" || r.status === "Pending").length,
      conversionRate: total > 0 ? ((filteredAndSortedRows.filter(r => r.status === "COMPLETED").length / total) * 100).toFixed(1) : "0.0",
      avgScore: total > 0 ? Math.round(filteredAndSortedRows.reduce((sum, r) => sum + r.warmCallScore, 0) / total) : 0,
      categories: [
        { label: "Critical", range: "0-25", count: red, color: "red", bg: "bg-red-50", text: "text-red-700", border: "border-red-200", icon: "🔴" },
        { label: "Below Avg", range: "26-50", count: orange, color: "orange", bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", icon: "🟠" },
        { label: "Average", range: "51-75", count: yellow, color: "yellow", bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", icon: "🟡" },
        { label: "Optimal", range: "76-100", count: green, color: "green", bg: "bg-green-50", text: "text-green-700", border: "border-green-200", icon: "🟢" },
      ]
    };
  }, [filteredAndSortedRows]);

  const SortIcon = ({ column }: { column: keyof TableRow }) => {
    if (sortKey !== column) return <span className="material-symbols-outlined text-sm opacity-30">unfold_more</span>;
    return <span className="material-symbols-outlined text-sm">{sortOrder === "asc" ? "arrow_upward" : "arrow_downward"}</span>;
  };


  return (
    <div className="flex w-full h-screen overflow-hidden bg-background-light dark:bg-background-dark transition-colors duration-200">
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-50 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {/* Mobile Menu Button Placeholder */}
            <div className="w-10 lg:hidden shrink-0"></div>
            {/* <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-lg">leaderboard</span>
            </div> */}
            {/* <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">LeadPulse</h1> */}
          </div>
          <div className="flex items-center gap-3">
            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400">
              <span className="material-symbols-outlined text-xl">help</span>
            </button>
            <div className="relative group/notify">
              <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 relative">
                <span className="material-symbols-outlined text-xl">notifications</span>
                {notifications.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[9px] font-bold px-1 rounded-full border border-white dark:border-slate-900">
                    {notifications.length > 9 ? '9+' : notifications.length}
                  </span>
                )}
              </button>
              {/* Notification Dropdown */}
              <div className="absolute right-0 top-full pt-1 opacity-0 invisible group-hover/notify:opacity-100 group-hover/notify:visible transition-all duration-300 z-50 w-72">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col">
                  <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-wider">Notifications</span>
                    {notifications.length > 0 && <span className="text-[9px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">{notifications.length} New</span>}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.slice(0, 5).map((notif) => (
                        <div key={notif.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0">
                          <div className="flex items-start gap-3">
                            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-xs text-primary">
                                {notif.type === 'alert' ? 'warning' : 'info'}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate">{notif.title}</p>
                                <span className="text-[9px] text-slate-500 shrink-0">{getRelativeTime(notif.createdAt)}</span>
                              </div>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight font-medium line-clamp-2">{notif.description}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 flex flex-col items-center justify-center text-slate-500">
                        <span className="material-symbols-outlined text-xl opacity-20 mb-1">notifications_off</span>
                        <p className="text-[9px] font-bold uppercase tracking-widest">No notifications yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
            {/* <button 
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400" 
              onClick={() => document.documentElement.classList.toggle('dark')}
            >
              <span className="material-symbols-outlined text-xl">dark_mode</span>
            </button> */}
            <div className="flex items-center gap-2 ml-1">
              <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden ring-1 ring-slate-100 dark:ring-slate-800">
                <img alt="Admin Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTARnqqcH5HFBuJBIYfcK2R7b0uCXIkVN7CTaCzZ0C7ID_aqoR42PlArasOTtQC1OlfcuzyLG5bR6j6SMRZpltlJxmDHQ02kKB6GoYtKy1MoOWzLLth06dsIX-9v7QXHINF1axEp7ZbkXiOdIIBrTK-viXWs-6n8rwlQSIIYNB-yzA_YEx7qU-YjlM4OfeLAutX1cLMhGtZSZykH1ytteZPP9xgMU0JfOJmiVG3iT-wPCBB1YI8K7bKyIrSrYoXaE3NH4gohQy24RU"/>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col min-h-0 w-full p-4 gap-4 overflow-hidden">
          {/* Stats Summary Card */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 shrink-0">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Lead Management</h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 truncate">Global performance metrics and lead distribution across categories.</p>
            </div>
            
            <div className="flex items-center gap-6 bg-slate-50/50 dark:bg-slate-800/50 p-3 pr-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-inner">
              <div className="relative w-16 h-16">
                <StatsDonut stats={stats} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-slate-900 dark:text-white leading-none">{stats.totalLeads}</span>
                  <span className="text-[8px] uppercase tracking-tight text-slate-500 font-bold mt-0.5">Total</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {stats.categories.map((cat) => (
                  <div key={cat.label} className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${cat.color === 'red' ? 'bg-red-500' : cat.color === 'orange' ? 'bg-orange-500' : cat.color === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                    <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {cat.label} <span className="text-slate-400 dark:text-slate-500 font-medium">({cat.range})</span>: <span className="text-slate-900 dark:text-white ml-0.5">{cat.count}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="flex flex-col min-h-0 max-h-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            {/* Table Actions */}
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 shrink-0">
              <div className="relative w-full md:w-80 group">
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-lg">search</span>
                <input 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border-none rounded-lg focus:ring-1 focus:ring-primary text-xs dark:text-white placeholder-slate-500 transition-all" 
                  placeholder="Search leads..." 
                  type="text"
                />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-xs py-1.5 pl-3 pr-8 focus:ring-1 focus:ring-primary dark:text-white cursor-pointer appearance-none transition-all"
                >
                  <option value="all">All Status</option>
                  <option value="Complete">Complete</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                </select>
                <button 
                  onClick={() => router.push('/add-lead')}
                  className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-[0.98] shadow-md shadow-primary/10"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  New Lead
                </button>
                <button 
                  onClick={() => dispatch(fetchProfiles())}
                  className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:rotate-180 duration-500"
                >
                  <span className="material-symbols-outlined text-lg">refresh</span>
                </button>
              </div>
            </div>

            {/* Table Body with internal scrolling */}
            <div className="flex-1 overflow-auto bg-white dark:bg-slate-900 min-h-0">
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead className="sticky top-0 z-30 bg-white dark:bg-slate-900 shadow-sm border-b border-slate-100 dark:border-slate-800">
                  <tr className="bg-slate-50/95 dark:bg-slate-800/95 backdrop-blur-sm text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <th className="px-4 py-2.5 w-32">Lead ID</th>
                    <th className="px-4 py-2.5 min-w-[180px]">
                      <button onClick={() => handleSort("name")} className="flex items-center gap-1 hover:text-primary transition-colors">
                        Name & Company <SortIcon column="name" />
                      </button>
                    </th>
                    <th className="px-4 py-2.5 w-24">
                      <button onClick={() => handleSort("warmCallScore")} className="flex items-center gap-1 hover:text-primary transition-colors">
                        Score <SortIcon column="warmCallScore" />
                      </button>
                    </th>
                    <th className="px-4 py-2.5 w-32">
                      <button onClick={() => handleSort("status")} className="flex items-center gap-1 hover:text-primary transition-colors">
                        Status <SortIcon column="status" />
                      </button>
                    </th>
                    <th className="px-4 py-2.5 w-32">
                      <button onClick={() => handleSort("date")} className="flex items-center gap-1 hover:text-primary transition-colors">
                        Updated <SortIcon column="date" />
                      </button>
                    </th>
                    <th className="px-4 py-2.5 text-center w-36">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paginatedRows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
                          <span className="material-symbols-outlined text-5xl opacity-20 mb-3">inbox</span>
                          <p className="text-xs font-medium">No leads found matching your criteria</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedRows.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
                              {row.id ? `${row.id.substring(0, 8).toUpperCase()}...` : "N/A"}
                            </span>
                            <CopyButton text={row.id} />
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-700/10 hover:bg-blue-700/70 rounded-lg flex items-center justify-center text-primary font-bold text-sm shrink-0">
                              {row.name?.charAt(0) || "?"}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-[12px] text-slate-900 dark:text-white truncate">{row.name}</p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{row.company}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <span className={`text-sm font-bold ${getScoreColor(row.warmCallScore)}`}>
                            {row.warmCallScore}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <StatusPill status={row.status} />
                        </td>
                        <td className="px-4 py-2">
                          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{getRelativeTime(row.date)}</span>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center justify-center gap-0.5">
                            <button 
                              onClick={() => viewDetails("visibility", row.id)}
                              className="p-1 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all active:scale-95"
                              title="View Details"
                            >
                              <span className="material-symbols-outlined text-lg">visibility</span>
                            </button>
                            <button 
                              onClick={() => router.push(`/add-lead?id=${row.id}`)}
                              className="p-1 text-slate-400 hover:text-green-500 hover:bg-green-500/10 rounded-lg transition-all active:scale-95"
                              title="Edit Lead"
                            >
                              <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                            <button 
                              onClick={() => setDeleteConfirmation({ isOpen: true, id: row.id, name: row.name, isLoading: false })}
                              className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all active:scale-95"
                              title="Delete Lead"
                            >
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                            <ActionButtons row={row} />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            </div>

            {/* Pagination */}
            <div className="px-4 py-2 bg-slate-50/30 dark:bg-slate-800/20 flex items-center justify-between shrink-0 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Showing <span className="text-slate-900 dark:text-white font-bold">{paginatedRows.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-{Math.min(currentPage * itemsPerPage, filteredAndSortedRows.length)}</span> of <span className="text-slate-900 dark:text-white font-bold">{filteredAndSortedRows.length}</span> results
              </p>
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center px-3 py-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 disabled:text-slate-300 dark:disabled:text-slate-600 disabled:cursor-not-allowed group transition-all hover:text-primary"
                >
                  <span className="material-symbols-outlined text-base mr-1 group-hover:-translate-x-1 transition-transform">chevron_left</span>
                  Prev
                </button>
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button 
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-6 h-6 rounded-lg text-[10px] font-bold transition-all hover:scale-105 active:scale-95 ${currentPage === i + 1 ? 'bg-blue-700 text-white shadow-md shadow-primary/10' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="flex items-center px-3 py-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 disabled:text-slate-300 dark:disabled:text-slate-600 disabled:cursor-not-allowed group transition-all hover:text-primary"
                >
                  Next
                  <span className="material-symbols-outlined text-base ml-1 group-hover:translate-x-1 transition-transform">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Components Layer */}
      {loading && (
        <div className="fixed inset-0 bg-white/60 dark:bg-slate-950/60 z-[100] flex items-center justify-center backdrop-blur-[2px]">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-5">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-slate-900 dark:text-white font-bold text-sm tracking-tight">Refreshing Dashboard...</p>
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

      <ConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation(prev => ({ ...prev, isOpen: false }))}
        onConfirm={async () => {
          if (!deleteConfirmation.id) return;
          setDeleteConfirmation(prev => ({ ...prev, isLoading: true }));
          try {
            await dispatch(deleteProfile(deleteConfirmation.id)).unwrap();
            toast.success(`Lead ${deleteConfirmation.name} deleted successfully`);
            setDeleteConfirmation({ isOpen: false, id: null, name: null, isLoading: false });
          } catch (err: any) {
            toast.error(err || "Failed to delete lead");
            setDeleteConfirmation(prev => ({ ...prev, isLoading: false }));
          }
        }}
        title="Delete Lead"
        description={`Are you sure you want to delete ${deleteConfirmation.name}? This action cannot be undone.`}
        confirmLabel="Delete Lead"
        isLoading={deleteConfirmation.isLoading}
      />
    </div>
  );
}

/* Internal Components */

function StatsDonut({ stats }: { stats: any }) {
  const total = stats.totalLeads || 1;
  const critical = stats.categories[0].count;
  const below = stats.categories[1].count;
  const average = stats.categories[2].count;
  const optimal = stats.categories[3].count;

  // Percentages
  const pCritical = (critical / total) * 100;
  const pBelow = (below / total) * 100;
  const pAverage = (average / total) * 100;
  const pOptimal = (optimal / total) * 100;

  return (
    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
      <circle className="text-slate-200 dark:text-slate-700" cx="18" cy="18" fill="transparent" r="15.915" stroke="currentColor" strokeWidth="4"></circle>
      
      {/* Critical - Red */}
      <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#ef4444" 
        strokeDasharray={`${pCritical} 100`} 
        strokeDashoffset="0" 
        strokeWidth="4.5" 
        className="donut-segment transition-all duration-1000 ease-out"
      ></circle>
      
      {/* Below Avg - Orange */}
      <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#f97316" 
        strokeDasharray={`${pBelow} 100`} 
        strokeDashoffset={`-${pCritical}`} 
        strokeWidth="4.5"
        className="donut-segment transition-all duration-1000 ease-out"
      ></circle>
      
      {/* Average - Yellow */}
      <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#eab308" 
        strokeDasharray={`${pAverage} 100`} 
        strokeDashoffset={`-${pCritical + pBelow}`} 
        strokeWidth="4.5"
        className="donut-segment transition-all duration-1000 ease-out"
      ></circle>
      
      {/* Optimal - Green */}
      <circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#22c55e" 
        strokeDasharray={`${pOptimal} 100`} 
        strokeDashoffset={`-${pCritical + pBelow + pAverage}`} 
        strokeWidth="4.5"
        className="donut-segment transition-all duration-1000 ease-out"
      ></circle>
    </svg>
  );
}

function StatusPill({ status }: { status: string }) {
  const statusConfig: Record<string, { bg: string; text: string; dot: string; label: string; border: string }> = {
    "Complete": { bg: "bg-green-50 dark:bg-green-900/20", text: "text-green-600 dark:text-green-400", dot: "bg-green-500", label: "Complete", border: "border-green-100 dark:border-green-900/30" },
    "Pending": { bg: "bg-orange-50 dark:bg-orange-900/20", text: "text-orange-600 dark:text-orange-400", dot: "bg-orange-500", label: "Pending", border: "border-orange-100 dark:border-orange-900/30" },
    "Failed": { bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-600 dark:text-red-400", dot: "bg-red-500", label: "Failed", border: "border-red-100 dark:border-red-900/30" },
  };

  const config = statusConfig[status] || statusConfig["Pending"];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${config.bg} ${config.text} border ${config.border}`}>
      <span className={`w-1 h-1 rounded-full ${config.dot}`}></span>
      {config.label}
    </span>
  );
}

function getScoreColor(score: number): string {
  if (score <= 25) return "text-red-500";
  if (score <= 50) return "text-orange-500";
  if (score <= 75) return "text-yellow-500";
  return "text-green-500";
}

function ActionButtons({ row }: { row: TableRow }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const socialLinks = [
    { icon: Linkedin, color: "text-[#0A66C2]", label: "LinkedIn", url: row.linkedinUrl },
    { icon: Instagram, color: "text-pink-600", label: "Instagram", url: row.instagramUrl },
    { icon: Twitter, color: "text-black dark:text-white", label: "X", url: row.twitterUrl },
    { icon: Globe, color: "text-purple-600", label: "Website", url: row.websiteUrl },
  ];

  return (
    <div className="relative group/social">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
        title="Social Actions"
      >
        <span className="material-symbols-outlined text-lg">add</span>
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute bottom-full right-0 mb-2 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl flex gap-1 z-50 animate-in fade-in slide-in-from-bottom-1 duration-200">
            {socialLinks.map((social) => {
              const hasUrl = social.url && social.url !== "#" && social.url.trim() !== "";
              
              if (!hasUrl) {
                return (
                  <div
                    key={social.label}
                    className="p-1.5 opacity-30 grayscale cursor-not-allowed rounded-lg"
                    title={`${social.label} (Not Available)`}
                  >
                    <social.icon className="w-4 h-4" />
                  </div>
                );
              }

              return (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all hover:scale-110 ${social.color}`}
                  title={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("ID Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-0.5 rounded-md transition-all ${copied ? 'text-green-500 bg-green-50 dark:bg-green-500/10' : 'text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800'}`}
      title="Copy ID"
    >
      <span className="material-symbols-outlined text-[13px]">
        {copied ? 'check_circle' : 'content_copy'}
      </span>
    </button>
  );
}

function getRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return "N/A";
  }
}