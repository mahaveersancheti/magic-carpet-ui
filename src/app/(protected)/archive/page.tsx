"use client";
import { UploadModal } from "@/app/components/UploadModal";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";
import { Loader2, Copy, UploadCloud } from "lucide-react";
// import { UserGuide, GuideStep } from "@/app/components/UserGuide";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";
import {
  fetchNotifications,
  fetchArchivedProfiles,
  archiveProfile,
  unarchiveProfile,
} from "../../redux/slices/ProfileSlice";
import { fetchProductsByUserId } from "../../redux/slices/ProductSlice";
import { useUser } from "../../hooks/useUser";
import toast from "react-hot-toast";
import { api } from "../../services/apiService";
import { endpoints } from "../../lib/endpoints";
import { ArchiveModal } from "@/app/components/ArchiveModal";
import { ArchiveRestore } from "lucide-react";

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
  productNames: string;
}

interface Notification {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  createdAt: string;
}

export default function ArchivePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useUser();
  const { archivedProfiles, notificationsData, archivedLoading, error } =
    useSelector((state: RootState) => state.profiles);
  const { products, loading: productsLoading } = useSelector(
    (state: RootState) => state.products,
  );

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [openSocialRowId, setOpenSocialRowId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Archive Modal State
  const [archiveModal, setArchiveModal] = useState<{
    isOpen: boolean;
    id: string | null;
    name: string | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    id: null,
    name: null,
    isLoading: false,
  });

  // User Guide State
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    setNotifications(notificationsData);
  }, [notificationsData]);

  useEffect(() => {
    // Check if user has seen the guide
    const hasSeenGuide = localStorage.getItem("hasSeenDashboardGuide_v1");
    if (!hasSeenGuide) {
      // Small delay to ensure UI is ready
      setTimeout(() => setShowGuide(true), 1000);
    }
  }, []);

  const handleGuideComplete = () => {
    localStorage.setItem("hasSeenDashboardGuide_v1", "true");
    setShowGuide(false);
  };

  useEffect(() => {
    dispatch(fetchArchivedProfiles());
    dispatch(fetchNotifications());
    if (user?.userId) {
      dispatch(fetchProductsByUserId(user.userId));
    }
  }, [dispatch, user?.userId]);

  useEffect(() => {
    if (error) {
      toast.error(
        typeof error === "string"
          ? error
          : (error as any)?.message || "An error occurred",
      );
    }
  }, [error]);

  // Sorting & Filtering State
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<keyof TableRow | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset page when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
    const mappedRows: TableRow[] = (archivedProfiles || []).map((p) => {
      let status = "Pending";
      const originalStatus = p.status?.toUpperCase();

      if (originalStatus === "COMPLETED" || originalStatus === "COMPLETE") {
        status = "Complete";
      } else if (originalStatus === "FAILED") {
        status = "Failed";
      } else if (originalStatus === "ARCHIVED") {
        status = "Archived";
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
        linkedinUrl:
          (p as any).linkedinUrl || (p as any).linkedinProfileLink || "",
        instagramUrl: (p as any).instagramUrl || "",
        twitterUrl: (p as any).twitterUrl || "",
        websiteUrl: (p as any).websiteUrl || "",
        productNames:
          (p as any).productFit
            ?.map((pf: any) => pf.productName)
            .filter(Boolean)
            .join(", ") || "N/A",
      };
    });

    let filtered = mappedRows;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (row) =>
          row?.name?.toLowerCase()?.includes(term) ||
          row?.company?.toLowerCase()?.includes(term) ||
          row?.status?.toLowerCase()?.includes(term),
      );
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

      return sortOrder === "asc"
        ? aVal < bVal
          ? -1
          : 1
        : aVal > bVal
          ? -1
          : 1;
    });
  }, [archivedProfiles, searchTerm, sortKey, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedRows.length / itemsPerPage);
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedRows.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedRows, currentPage]);

  const SortIcon = ({ column }: { column: keyof TableRow }) => {
    if (sortKey !== column)
      return (
        <span className="material-symbols-outlined text-sm opacity-30">
          unfold_more
        </span>
      );
    return (
      <span className="material-symbols-outlined text-sm">
        {sortOrder === "asc" ? "arrow_upward" : "arrow_downward"}
      </span>
    );
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-background-light transition-colors duration-200">
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-slate-200 bg-white sticky top-0 z-50 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {/* Mobile Menu Button Placeholder */}
            <div className="w-10 lg:hidden shrink-0"></div>
            {/* <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-lg">leaderboard</span>
            </div> */}
            {/* <h1 className="text-lg font-bold tracking-tight text-slate-900">LeadPulse</h1> */}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/tutorial")}
              className="cursor-pointer p-1.5 hover:bg-slate-100 rounded-full text-slate-500"
            >
              <span className="material-symbols-outlined text-xl">help</span>
            </button>
            <div className="relative group/notify">
              <button className="cursor-pointer p-1.5 hover:bg-slate-100 rounded-full text-slate-500 relative">
                <span className="material-symbols-outlined text-xl">
                  notifications
                </span>
                {notifications.length > 0 && (
                  <span className="cursor-pointer absolute top-0.5 right-0.5 bg-red-500 text-white text-[9px] font-bold px-1 rounded-full border border-white">
                    {notifications.length > 9 ? "9+" : notifications.length}
                  </span>
                )}
              </button>
              {/* Notification Dropdown */}
              <div className="absolute right-0 top-full pt-1 opacity-0 invisible group-hover/notify:opacity-100 group-hover/notify:visible transition-all duration-300 z-50 w-72">
                <div className="bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden flex flex-col">
                  <div className="px-3 py-2 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">
                      Notifications
                    </span>
                    {notifications.length > 0 && (
                      <span className="text-[9px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                        {notifications.length} New
                      </span>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.slice(0, 5).map((notif) => (
                        <div
                          key={notif.id}
                          className="p-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-xs text-primary">
                                {notif.type === "alert" ? "warning" : "info"}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <p className="text-[11px] font-bold text-slate-900 truncate">
                                  {notif.title}
                                </p>
                                <span className="text-[9px] text-slate-500 shrink-0">
                                  {getRelativeTime(notif.createdAt)}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 leading-tight font-medium line-clamp-2">
                                {notif.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 flex flex-col items-center justify-center text-slate-500">
                        <span className="material-symbols-outlined text-xl opacity-20 mb-1">
                          notifications_off
                        </span>
                        <p className="text-[9px] font-bold uppercase tracking-widest">
                          No notifications yet
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <div
              className="flex items-center gap-2 ml-1 cursor-pointer"
              onClick={() => router.push("/userprofile")}
            >
              <div className="w-7 h-7 rounded-full bg-slate-200 overflow-hidden ring-1 ring-slate-100">
                <img
                  alt="Admin Avatar"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTARnqqcH5HFBuJBIYfcK2R7b0uCXIkVN7CTaCzZ0C7ID_aqoR42PlArasOTtQC1OlfcuzyLG5bR6j6SMRZpltlJxmDHQ02kKB6GoYtKy1MoOWzLLth06dsIX-9v7QXHINF1axEp7ZbkXiOdIIBrTK-viXWs-6n8rwlQSIIYNB-yzA_YEx7qU-YjlM4OfeLAutX1cLMhGtZSZykH1ytteZPP9xgMU0JfOJmiVG3iT-wPCBB1YI8K7bKyIrSrYoXaE3NH4gohQy24RU"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col min-h-0 w-full p-4 gap-4 overflow-hidden">
          {/* Warnings Section */}
          <div className="flex flex-col gap-2 shrink-0">
            {/* Product Warning */}
            {!productsLoading && products.length === 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="bg-orange-100 p-1.5 rounded-lg shrink-0 text-orange-600">
                  <span className="material-symbols-outlined text-lg">
                    inventory_2
                  </span>
                </div>
                <div className="flex-1 pt-0.5">
                  <h3 className="text-sm font-bold text-slate-900 mb-0.5">
                    Products Missing
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    You haven't added any products yet. Adding products helps us
                    tailor the experience for you.
                    <button
                      onClick={() => router.push("/products")}
                      className="text-blue-600 font-bold hover:underline ml-1"
                    >
                      Add Products
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Table Container */}
          <div className="flex flex-col min-h-0 max-h-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Table Actions */}
            <div className="p-3 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 shrink-0">
              <div className="relative w-full md:w-80 group">
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-lg">
                  search
                </span>
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border-none rounded-lg focus:ring-1 focus:ring-primary text-xs placeholder-slate-500 transition-all"
                  placeholder="Search leads..."
                  type="text"
                />
              </div>
            </div>

            {/* Table Body with internal scrolling */}
            <div className="flex-1 overflow-auto bg-white min-h-0">
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead className="sticky top-0 z-30 bg-white shadow-sm border-b border-slate-100">
                    <tr className="bg-slate-50/95 backdrop-blur-sm text-[10px] uppercase tracking-wider font-bold text-slate-500 border-b border-slate-200">
                      <th className="px-4 py-2.5 w-32">Lead ID</th>
                      <th className="px-4 py-2.5 min-w-[180px]">
                        <button
                          onClick={() => handleSort("name")}
                          className="flex items-center gap-1 hover:text-primary transition-colors"
                        >
                          Name & Company <SortIcon column="name" />
                        </button>
                      </th>
                      <th className="px-4 py-2.5 w-24">
                        <button
                          onClick={() => handleSort("warmCallScore")}
                          className="flex items-center gap-1 hover:text-primary transition-colors"
                        >
                          Score <SortIcon column="warmCallScore" />
                        </button>
                      </th>
                      <th className="px-4 py-2.5 w-32">
                        <button
                          onClick={() => handleSort("status")}
                          className="flex items-center gap-1 hover:text-primary transition-colors"
                        >
                          Status <SortIcon column="status" />
                        </button>
                      </th>
                      <th className="px-4 py-2.5 min-w-[150px]">
                        <button
                          onClick={() => handleSort("productNames")}
                          className="flex items-center gap-1 hover:text-primary transition-colors"
                        >
                          Products <SortIcon column="productNames" />
                        </button>
                      </th>
                      <th className="px-4 py-2.5 w-32">
                        <button
                          onClick={() => handleSort("date")}
                          className="flex items-center gap-1 hover:text-primary transition-colors"
                        >
                          Updated <SortIcon column="date" />
                        </button>
                      </th>
                      <th className="px-4 py-2.5 text-center w-36">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedRows.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-20 text-center">
                          <div className="flex flex-col items-center justify-center text-slate-400">
                            <span className="material-symbols-outlined text-5xl opacity-20 mb-3">
                              inbox
                            </span>
                            <p className="text-xs font-medium">
                              No leads found matching your criteria
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedRows.map((row) => (
                        <tr
                          key={row.id}
                          className="hover:bg-slate-50/50 transition-colors group"
                        >
                          <td className="px-4 py-2 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] font-mono font-bold text-slate-500">
                                {row.id
                                  ? `${row.id.substring(0, 8).toUpperCase()}...`
                                  : "N/A"}
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
                                <p className="font-bold text-[12px] text-slate-900 truncate">
                                  {row.name}
                                </p>
                                <p className="text-[10px] text-slate-500 truncate">
                                  {row.company}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-2">
                            <span
                              className={`text-sm font-bold ${getScoreColor(row.warmCallScore)}`}
                            >
                              {row.warmCallScore}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <StatusPill status={row.status} />
                          </td>
                          <td className="px-4 py-2">
                            <p
                              className="text-[11px] font-medium text-slate-600 truncate max-w-[200px]"
                              title={row.productNames}
                            >
                              {row.productNames}
                            </p>
                          </td>
                          <td className="px-4 py-2">
                            <span className="text-[11px] font-medium text-slate-500">
                              {getRelativeTime(row.date)}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex items-center justify-center gap-0.5">
                              <button
                                onClick={() =>
                                  viewDetails("visibility", row.id)
                                }
                                className="cursor-pointer p-1 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all active:scale-95"
                                title="View Details"
                              >
                                <span className="material-symbols-outlined text-lg">
                                  visibility
                                </span>
                              </button>
                              <button
                                onClick={() =>
                                  setArchiveModal({
                                    isOpen: true,
                                    id: row.id,
                                    name: row.name,
                                    isLoading: false,
                                  })
                                }
                                className="cursor-pointer p-1 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all active:scale-95"
                                title="UnArchive Lead"
                              >
                                <ArchiveRestore className="w-4.5 h-4.5" />
                              </button>
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
            <div className="px-4 py-2 bg-slate-50/30 flex items-center justify-between shrink-0 border-t border-slate-100">
              <p className="text-[11px] font-semibold text-slate-500">
                Showing{" "}
                <span className="text-slate-900 font-bold">
                  {paginatedRows.length > 0
                    ? (currentPage - 1) * itemsPerPage + 1
                    : 0}
                  -
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredAndSortedRows.length,
                  )}
                </span>{" "}
                of{" "}
                <span className="text-slate-900 font-bold">
                  {filteredAndSortedRows.length}
                </span>{" "}
                results
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="cursor-pointer flex items-center px-3 py-1 text-[10px] font-bold text-slate-500 disabled:text-slate-300 disabled:cursor-not-allowed group transition-all hover:text-primary"
                >
                  <span className="material-symbols-outlined text-base mr-1 group-hover:-translate-x-1 transition-transform">
                    chevron_left
                  </span>
                  Prev
                </button>
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-6 h-6 rounded-lg text-[10px] font-bold transition-all hover:scale-105 active:scale-95 ${currentPage === i + 1 ? "bg-blue-700 text-white shadow-md shadow-primary/10" : "text-slate-500 hover:bg-slate-100"}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="cursor-pointer flex items-center px-3 py-1 text-[10px] font-bold text-slate-500 disabled:text-slate-300 disabled:cursor-not-allowed group transition-all hover:text-primary"
                >
                  Next
                  <span className="material-symbols-outlined text-base ml-1 group-hover:translate-x-1 transition-transform">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Components Layer */}
      {archivedLoading && (
        <div className="fixed inset-0 bg-white/60 z-[100] flex items-center justify-center backdrop-blur-[2px]">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-200 flex flex-col items-center gap-5">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-slate-900 font-bold text-sm tracking-tight">
              Refreshing Dashboard...
            </p>
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

      <ArchiveModal
        isOpen={archiveModal.isOpen}
        onClose={() => setArchiveModal((prev) => ({ ...prev, isOpen: false }))}
        title="UnArchive Lead"
        description={`Are you sure you want to unarchive ${archiveModal.name}? This will move it back to the active list.`}
        confirmLabel="UnArchive"
        isLoading={archiveModal.isLoading}
        onConfirm={async (note) => {
          if (!archiveModal.id) return;
          setArchiveModal((prev) => ({ ...prev, isLoading: true }));
          try {
            await dispatch(
              unarchiveProfile({
                id: archiveModal.id,
                reason: note || "UnArchived",
                targetStatus: "PROFILE_EXTRACTED", // or Pending based on user requirement
              }),
            ).unwrap();
            toast.success(`Lead ${archiveModal.name} unarchived successfully`);
            dispatch(fetchArchivedProfiles());
            setArchiveModal((prev) => ({ ...prev, isOpen: false }));
          } catch (err: any) {
            toast.error(
              typeof err === "string"
                ? err
                : err?.message || "Failed to update status",
            );
          } finally {
            setArchiveModal((prev) => ({ ...prev, isLoading: false }));
          }
        }}
      />
    </div>
  );
}

/* Internal Components */

function StatusPill({ status }: { status: string }) {
  const statusConfig: Record<
    string,
    { bg: string; text: string; dot: string; label: string; border: string }
  > = {
    Complete: {
      bg: "bg-green-50",
      text: "text-green-600",
      dot: "bg-green-500",
      label: "Complete",
      border: "border-green-100",
    },
    Pending: {
      bg: "bg-orange-50",
      text: "text-orange-600",
      dot: "bg-orange-500",
      label: "Pending",
      border: "border-orange-100",
    },
    Failed: {
      bg: "bg-red-50",
      text: "text-red-600",
      dot: "bg-red-500",
      label: "Failed",
      border: "border-red-100",
    },
    Archived: {
      bg: "bg-slate-50",
      text: "text-slate-600",
      dot: "bg-slate-500",
      label: "Archived",
      border: "border-slate-100",
    },
  };

  const config = statusConfig[status] || statusConfig["Pending"];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${config.bg} ${config.text} border ${config.border}`}
    >
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
      className={`p-0.5 rounded-md transition-all ${copied ? "text-green-500 bg-green-50" : "text-slate-400 hover:text-primary hover:bg-slate-100"}`}
      title="Copy ID"
    >
      <span className="material-symbols-outlined text-[13px]">
        {copied ? "check_circle" : "content_copy"}
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
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "N/A";
  }
}
