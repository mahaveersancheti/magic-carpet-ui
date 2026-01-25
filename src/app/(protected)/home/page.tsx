"use client";
import { UploadModal } from "@/app/components/UploadModal";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Linkedin, Instagram, Twitter, Globe, Plus, Loader2, HelpCircle, Copy, Check } from "lucide-react";
import { AddRequestModal } from "@/app/components/AddRequestFormModal";
import { UserGuide, GuideStep } from "@/app/components/UserGuide";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";
import { fetchNotifications, fetchProfiles } from "../../redux/slices/ProfileSlice";
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
}

interface Notification {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  createdAt: string;
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
  const { profiles,notificationsData, loading, error } = useSelector((state: RootState) => state.profiles);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAddRequestModalOpen, setIsAddRequestModalOpen] = useState(false);
  const [openSocialRowId, setOpenSocialRowId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

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

  const GUIDE_STEPS: GuideStep[] = [
    {
      targetId: 'dashboard-header',
      title: 'Welcome to your Dashboard',
      description: 'This is your mission control center. Here you can track all your lead generation requests and view their status at a glance.',
      placement: 'bottom'
    },
    {
      targetId: 'search-filter-bar',
      title: 'Find What You Need',
      description: 'Use the robust search and filter tools to quickly locate specific profiles or check the status of pending requests.',
      placement: 'bottom'
    },
    {
      targetId: 'new-request-btn',
      title: 'Launch a New Request',
      description: 'Ready to find new leads? Click here to start a new search request. You can specify industry, role, and other criteria.',
      placement: 'bottom'
    },
    {
      targetId: 'requests-table',
      title: 'Monitor Progress',
      description: 'View real-time updates on your requests. Click on any name to dive deep into the generated profile report.',
      placement: 'left'
    }
  ];


  useEffect(() => {
    dispatch(fetchProfiles());
    dispatch(fetchNotifications());
    
    // Fetch notifications count
    // const fetchNotifications = async () => {
    //   try {
    //     const response = await api.get<Notification[]>(endpoints.notifications);
    //     if (Array.isArray(response)) {
    //       setNotifications(response);
    //     }
    //   } catch (error) {
    //     console.error("Failed to fetch notifications:", error);
    //   }
    // };
    
    // fetchNotifications();
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


  // Filtered & Sorted Data
  const filteredAndSortedRows = useMemo(() => {
    const mappedRows: TableRow[] = profiles.map(p => ({
      id: p.id,
      name: p.name,
      company: p.currentCompanyName || "N/A",
      email: p.email,
      phone: p.phone || "N/A",
      status: (p.status === "NEW" ? "Pending" : p.status) || "Pending",
      date: p.createdAt ? p.createdAt.substring(0, 10) : "N/A",
      warmCallScore: parseInt((p as any).warmCallScore || "0", 10),
    }));

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
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortOrder === "asc" ? (aVal < bVal ? -1 : 1) : (aVal > bVal ? -1 : 1);
    });
  }, [profiles, searchTerm, statusFilter, sortKey, sortOrder]);

  // Calculate statistics for dashboard cards
  const stats = useMemo(() => {
    const total = filteredAndSortedRows.length;
    const red = filteredAndSortedRows.filter(r => r.warmCallScore >= 0 && r.warmCallScore <= 25).length;
    const orange = filteredAndSortedRows.filter(r => r.warmCallScore > 25 && r.warmCallScore <= 50).length;
    const yellow = filteredAndSortedRows.filter(r => r.warmCallScore > 50 && r.warmCallScore <= 75).length;
    const green = filteredAndSortedRows.filter(r => r.warmCallScore > 75 && r.warmCallScore <= 100).length;

    return [
      { label: "Critical", range: "0-25", count: red, color: "red", bg: "bg-red-50", text: "text-red-700", border: "border-red-200", icon: "🔴" },
      { label: "Below Avg", range: "26-50", count: orange, color: "orange", bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", icon: "🟠" },
      { label: "Average", range: "51-75", count: yellow, color: "yellow", bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", icon: "🟡" },
      { label: "Optimal", range: "76-100", count: green, color: "green", bg: "bg-green-50", text: "text-green-700", border: "border-green-200", icon: "🟢" },
    ];
  }, [filteredAndSortedRows]);


  // Sort Icon Component
  const SortIcon = ({ column }: { column: keyof TableRow }) => {
    if (sortKey !== column) return <ArrowUpDown className="w-4 h-4 opacity-40" />;
    return sortOrder === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };


  function ActionButtons({ row }: { row: TableRow }) {
    const isSocialOpen = openSocialRowId === row.id;

    const originalActions = [
      { icon: "visibility", label: "View Details" },
    ];

    const socialLinks = [
      { icon: Linkedin, color: "text-[#0A66C2]", label: "LinkedIn", url: `https://linkedin.com/in/${row?.name?.toLowerCase().replace(" ", "-")}` },
      { icon: Instagram, color: "text-pink-600", label: "Instagram", url: `https://instagram.com/${row?.name?.toLowerCase().replace(" ", ".")}` },
      { icon: Twitter, color: "text-black", label: "X (Twitter)", url: `https://x.com/${row?.name?.toLowerCase().replace(" ", "")}` },
      { icon: Globe, color: "text-purple-600", label: "Website", url: `https://facebook.com/${row?.name?.toLowerCase().replace(" ", ".")}` },
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
      <div className="flex items-center gap-2 relative">
        {/* Original 3 buttons */}
        {originalActions.map((action) => (
          <button
            key={action.icon}
            onClick={() => viewDetails(action.icon, row.id)}
            title={action.label}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-blue-600 transition bg-white active:scale-95 shadow-sm"
          >
            <span className="material-symbols-outlined text-xl">
              {action.icon}
            </span>
          </button>
        ))}

        {/* Social FAB Button */}
        <div className="relative">
          {/* Social Icons - Open to the LEFT */}
          <div
            className={`absolute right-full top-1/2 -translate-y-1/2 mr-3 flex items-center gap-1 transition-all duration-200 origin-right ${isSocialOpen
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
              }`}
          >
            {socialLinks.map((social, i) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 bg-white group transition-colors"
                style={{
                  transitionDelay: `${i * 50}ms`
                }}
              >
                <social.icon className={`w-4 h-4 ${social.color}`} strokeWidth={2} />
              </a>
            ))}
          </div>

          {/* Main + Button */}
          <button
            onClick={toggleSocial}
            className={`w-10 h-10 flex items-center justify-center rounded-xl border transition active:scale-95 shadow-sm ${isSocialOpen ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-blue-600'}`}
            title="Social Profiles"
          >
            <Plus
              className={`w-4 h-4 transition-transform duration-300 ${isSocialOpen ? "rotate-45" : ""}`}
              strokeWidth={2}
            />
          </button>
        </div>
      </div>
    );
  }

  function TooltipText({ text, className = "" }: { text: string; className?: string }) {
    if (!text || text === "N/A") return <span className="text-gray-400">N/A</span>;
    
    return (
      <div className="group relative inline-block max-w-full">
        <div className={`truncate ${className}`}>
          {text}
        </div>
        <div className="absolute bottom-full left-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-[11px] font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-[100] shadow-xl pointer-events-none border border-gray-800">
          {text}
          <div className="absolute top-full left-4 -translate-y-[1px] border-4 border-transparent border-t-gray-900" />
        </div>
      </div>
    );
  }

  function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <button
        onClick={handleCopy}
        className="ml-2 p-1 hover:bg-blue-50 rounded-md transition-all text-gray-400 hover:text-blue-600 active:scale-90"
        title="Copy to clipboard"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-green-500 animate-in fade-in zoom-in duration-200" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
    );
  }

  return (
    <div className="flex w-full min-h-screen bg-transparent">
      <main className="flex-1 p-6 md:p-8 w-full pt-20 lg:pt-8 bg-transparent">
        <div className="flex flex-col gap-8 max-w-7xl mx-auto">

          {/* Header */}
          <header id="dashboard-header" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Home
              </h1>
              <p className="text-sm text-gray-500 mt-1">Manage your Prospects and potential Leads.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">

              {/* Search + Status Filter */}
              <div id="search-filter-bar" className="flex flex-col sm:flex-row gap-3">
                <label className="flex items-center gap-3 flex-1 h-10 px-4 rounded-lg border border-gray-300 bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                  <span className="material-symbols-outlined text-gray-400 text-lg">search</span>
                  <input
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400"
                  />
                </label>
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="h-10 px-4 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                  <option value="PROFILE_EXTRACTED">Profile Extracted</option>
                </select>
              </div>

              <button
                id="new-request-btn"
                onClick={() => setIsAddRequestModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95 text-xs"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                {/* <span>New Request</span> */}
              </button>

              <div className="flex items-center gap-3 pl-2 border-l border-gray-300">
                <button
                  onClick={() => setShowGuide(true)}
                  className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition"
                  title="Start Tour"
                >
                  <HelpCircle className="w-5 h-5" />
                </button>
                <HeaderIcon icon="notifications" notifications={notifications} />
              </div>
            </div>
          </header>

          {/* Dashboard Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`${stat.bg} ${stat.border} border rounded-xl p-3 transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 cursor-pointer`}
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xl">{stat.icon}</span>
                  <span className={`text-[10px] font-bold ${stat.text} bg-white px-1.5 py-0.5 rounded-full`}>
                    {stat.range}
                  </span>
                </div>
                <div className={`text-xl md:text-2xl font-black ${stat.text} mb-0.5`}>
                  {stat.count}
                </div>
                <div className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <style jsx>{`
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>

          {/* Table Section */}
          <section id="requests-table" className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Leads / Prospects
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {/* # */}
                    </th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <button onClick={() => handleSort("name")} className="flex items-center gap-1 hover:text-gray-700">
                        Name <SortIcon column="name" />
                      </button>
                    </th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      <button onClick={() => handleSort("company")} className="flex items-center gap-1 hover:text-gray-700">
                        Company <SortIcon column="company" />
                      </button>
                    </th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      <button onClick={() => handleSort("email")} className="flex items-center gap-1 hover:text-gray-700">
                        Contact <SortIcon column="email" />
                      </button>
                    </th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      <button onClick={() => handleSort("status")} className="flex items-center gap-1 hover:text-gray-700">
                        Status <SortIcon column="status" />
                      </button>
                    </th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                      <button onClick={() => handleSort("date")} className="flex items-center gap-1 hover:text-gray-700">
                        Date <SortIcon column="date" />
                      </button>
                    </th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      <button onClick={() => handleSort("warmCallScore")} className="flex items-center gap-1 hover:text-gray-700">
                        Score <SortIcon column="warmCallScore" />
                      </button>
                    </th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {filteredAndSortedRows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <span className="material-symbols-outlined text-4xl mb-2 opacity-20">inbox</span>
                          <p>No requests found matching your filters.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredAndSortedRows.map((row, index) => (
                      <tr
                        key={row.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-4 text-sm text-gray-500">{index + 1}</td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">
                          <button
                            onClick={() => viewDetails("visibility", row.id)}
                            className="hover:text-blue-600 transition-colors text-left block w-full"
                          >
                            <TooltipText text={row.name} className="max-w-[120px] md:max-w-[180px]" />
                          </button>
                          {/* Mobile: Show company below name */}
                          <div className="sm:hidden text-xs text-gray-500 mt-1">
                            {row.company}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 hidden sm:table-cell">
                          <TooltipText text={row.company} className="max-w-[120px] lg:max-w-[150px]" />
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 hidden lg:table-cell">
                          <div className="flex flex-col">
                            <div className="flex items-center group/email">
                              <a href={`mailto:${row.email}`} className="text-gray-900 hover:text-blue-600 transition truncate max-w-[140px] xl:max-w-[180px]" title={row.email}>
                                {row.email}
                              </a>
                              <CopyButton text={row.email} />
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-gray-500 text-xs truncate max-w-[120px]">
                                {row.phone}
                              </span>
                              {row.phone !== "N/A" && <CopyButton text={row.phone} />}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <StatusPill status={row.status} />
                          {/* Mobile: Show score below status */}
                          <div className="md:hidden mt-2">
                            <WarmCallScoreBadge score={row.warmCallScore} />
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 hidden md:table-cell">{row.date}</td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          <WarmCallScoreBadge score={row.warmCallScore} />
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex justify-end">
                            <ActionButtons row={row} />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {/* Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-gray-900 font-medium">Loading Profiles...</p>
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
        onSuccess={() => dispatch(fetchProfiles())}
      />

      <UserGuide
        steps={GUIDE_STEPS}
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        onComplete={handleGuideComplete}
      />
    </div>
  );
}

/* Small Components (updated) */
function HeaderIcon({ icon, notifications }: { icon: string; notifications: Notification[] }) {
  const count = notifications.length;
  return (
    <div className="relative group/notify">
      <button className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition relative">
        <span className="material-symbols-outlined text-xl">{icon}</span>
        {count > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover/notify:opacity-100 group-hover/notify:visible transition-all duration-300 z-50 w-80">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Notifications</span>
            {count > 0 && <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{count} New</span>}
          </div>
          
          <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div key={notif.id} className="p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 group/item">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 group-hover/item:bg-blue-100 transition-colors">
                      <span className="material-symbols-outlined text-lg text-blue-600">
                        {notif.type === 'alert' ? 'warning' : 'info'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className="text-xs font-black text-gray-900 truncate uppercase tracking-tight">{notif.title}</p>
                        <span className="text-[9px] font-bold text-gray-400 shrink-0">
                          {new Date(notif.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-relaxed font-medium line-clamp-2">
                        {notif.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                <span className="material-symbols-outlined text-3xl opacity-20 mb-2">notifications_off</span>
                <p className="text-[10px] font-bold uppercase tracking-widest">No notifications yet</p>
              </div>
            )}
          </div>
          
          <button className="px-4 py-3 text-[10px] font-black text-blue-600 uppercase tracking-widest bg-gray-50/50 hover:bg-blue-50 transition-colors text-center border-t border-gray-50">
            View All Notifications
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    Complete: "bg-green-100 text-green-700 border-green-200",
    Pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    Failed: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${map[status] || "bg-gray-100 text-gray-700 border-gray-200"}`}>
      {status}
    </span>
  );
}

function WarmCallScoreBadge({ score }: { score: number }) {
  const getScoreColor = (score: number): { bg: string; text: string; border: string; dot: string } => {
    if (score >= 0 && score <= 25) {
      return {
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
        dot: "bg-red-500"
      };
    } else if (score > 25 && score <= 50) {
      return {
        bg: "bg-orange-50",
        text: "text-orange-700",
        border: "border-orange-200",
        dot: "bg-orange-500"
      };
    } else if (score > 50 && score <= 75) {
      return {
        bg: "bg-yellow-50",
        text: "text-yellow-700",
        border: "border-yellow-200",
        dot: "bg-yellow-500"
      };
    } else {
      return {
        bg: "bg-green-50",
        text: "text-green-700",
        border: "border-green-200",
        dot: "bg-green-500"
      };
    }
  };

  const colors = getScoreColor(score);

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${colors.bg} ${colors.text} ${colors.border}`}>
      <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
      <span>{score}</span>
    </div>
  );
}