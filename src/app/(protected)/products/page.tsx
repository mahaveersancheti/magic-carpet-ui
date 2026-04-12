"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";
import {
  fetchProductsByUserId,
  deleteProduct,
} from "../../redux/slices/ProductSlice";
import { getBaseUrl, api } from "../../services/apiService";
import { endpoints } from "../../lib/endpoints";
import toast from "react-hot-toast";
import { useUser } from "../../hooks/useUser";
import { useRouter } from "next/navigation";
import {
  Download,
  Plus,
  Edit2,
  Trash2,
  LayoutGrid,
  List,
  FileText,
} from "lucide-react";
import { AuthenticatedImage } from "../../components/AuthenticatedImage";

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useUser();
  const router = useRouter();

  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getProductImageUrl = (productId: string) => {
    return `${getBaseUrl()}${endpoints.getProductImage(productId)}`;
  };

  // Get products from Redux store
  const {
    products,
    loading: productsLoading,
    deleteLoading,
    error: productsError,
  } = useSelector((state: RootState) => state.products);

  // Fetch products when component mounts
  useEffect(() => {
    if (user?.userId) {
      dispatch(fetchProductsByUserId(user.userId));
    }
  }, [dispatch, user?.userId]);

  // Reset to page 1 on search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleDownloadTemplate = async () => {
    try {
      const blob = await api.download(endpoints.downloadProductTemplate);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "product_template.txt");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Template downloaded successfully");
    } catch (error: any) {
      toast.error("Failed to download template");
      console.error(error);
    }
  };

  const handleAddProductClick = () => {
    router.push("/add-product");
  };

  const handleEditClick = (productId: string) => {
    router.push(`/add-product?id=${productId}`);
  };

  // Handle delete click
  const handleDeleteClick = (productId: string) => {
    setDeletingProductId(productId);
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (!deletingProductId) return;

    const userId = user?.userId;
    if (!userId) return;

    try {
      await dispatch(
        deleteProduct({ productId: deletingProductId, userId }),
      ).unwrap();
      toast.success("Product deleted successfully!");
      setDeletingProductId(null);
    } catch (error: any) {
      toast.error(error || "Failed to delete product");
    }
  };

  const filteredProducts = React.useMemo(() => {
    if (!searchTerm.trim()) return products;
    const term = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.id.toLowerCase().includes(term) ||
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term),
    );
  }, [products, searchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  return (
    <div className="h-screen flex flex-col bg-background-light text-slate-900 transition-colors duration-200 overflow-hidden">
      <div className="flex-1 flex flex-col min-h-0 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pt-20 lg:pt-8">
        <div className="shrink-0 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 mt-14 lg:mt-0">
          <div className="space-y-1">
            <h1 className="text-lg lg:text-xl font-bold tracking-tight text-[#111318]">
              Product Showcase
            </h1>
            <p className="text-[#606e8a] text-xs lg:text-sm">
              Manage and display your strategic offerings
            </p>
          </div>
          <div className="flex flex-1 max-w-2xl items-center gap-4">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-slate-400 text-[20px]">
                  search
                </span>
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-all shadow-sm"
                placeholder="Search products, taglines or documents..."
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadTemplate}
                className="cursor-pointer px-3 py-1.5 rounded-lg border border-gray-300 font-bold text-xs hover:bg-gray-50 transition-all disabled:opacity-50 inline-flex items-center justify-center"
                title="Download Template"
              >
                <span className="material-symbols-outlined text-[20px]">
                  file_download
                </span>
              </button>
              <button
                onClick={handleAddProductClick}
                className="cursor-pointer bg-[#0d59f2] text-white px-3 lg:px-4 py-1.5 rounded-lg text-xs font-bold shadow-lg shadow-[#0d59f2]/20 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">
                  add
                </span>
                Add Product
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col min-h-0 max-h-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex-1 overflow-auto min-h-0 scrollbar-thin scrollbar-thumb-slate-200">
            <table className="min-w-full divide-y divide-slate-200 border-separate border-spacing-0">
              <thead className="sticky top-0 z-30 bg-slate-50 backdrop-blur-sm">
                <tr>
                  <th
                    className="px-6 py-4 text-left text-[10px] lg:text-[11px] font-bold text-[#606e8a] uppercase tracking-wider border-b border-slate-200 w-36"
                    scope="col"
                  >
                    Product ID
                  </th>
                  <th
                    className="px-6 py-4 text-left text-[10px] lg:text-[11px] font-bold text-[#606e8a] uppercase tracking-wider border-b border-slate-200"
                    scope="col"
                  >
                    Product
                  </th>
                  <th
                    className="px-6 py-4 text-left text-[10px] lg:text-[11px] font-bold text-[#606e8a] uppercase tracking-wider border-b border-slate-200"
                    scope="col"
                  >
                    Description
                  </th>
                  <th
                    className="px-6 py-4 text-center text-[10px] lg:text-[11px] font-bold text-[#606e8a] uppercase tracking-wider border-b border-slate-200"
                    scope="col"
                  >
                    Documents
                  </th>
                  <th
                    className="px-6 py-4 text-right text-[10px] lg:text-[11px] font-bold text-[#606e8a] uppercase tracking-wider border-b border-slate-200"
                    scope="col"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {productsLoading ? (
                  [1, 2, 3].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-slate-100 w-28 rounded"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-slate-100 rounded"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-slate-100 w-24 rounded"></div>
                            <div className="h-3 bg-slate-100 w-32 rounded"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-slate-100 w-full rounded"></div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="h-6 bg-slate-100 w-16 mx-auto rounded-full"></div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="h-8 bg-slate-100 w-16 ml-auto rounded"></div>
                      </td>
                    </tr>
                  ))
                ) : paginatedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <span className="material-symbols-outlined text-5xl opacity-20 mb-3">
                          inventory_2
                        </span>
                        <p className="text-xs font-medium">
                          {searchTerm
                            ? "No products matching your search"
                            : "No products found"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-mono font-bold text-slate-500">
                            {product.id
                              ? `${product.id.substring(0, 8).toUpperCase()}...`
                              : "N/A"}
                          </span>
                          <CopyButton text={product.id} />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded overflow-hidden">
                            {product.imagePath ? (
                              <AuthenticatedImage
                                src={getProductImageUrl(product.id)}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-[#0d59f2] to-[#4f8ef7] flex items-center justify-center">
                                <span className="text-white text-xs font-bold uppercase tracking-wide">
                                  {product.name.slice(0, 2)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-slate-900">
                              {product.name}
                            </div>
                            <div className="text-[11px] text-[#606e8a] truncate max-w-[150px]">
                              {product.description?.split(".")[0]}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600 truncate-2-lines max-w-md">
                          {product.description}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {product.filePaths && product.filePaths.length > 0 ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#0d59f2]/10 text-[#0d59f2] border border-[#0d59f2]/10">
                            {product.filePaths.length} Doc
                            {product.filePaths.length > 1 ? "s" : ""}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200/50">
                            No Docs
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => handleEditClick(product.id)}
                            className="cursor-pointer p-2 text-slate-400 hover:text-primary transition-colors"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              edit
                            </span>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(product.id)}
                            className="cursor-pointer p-2 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="shrink-0 px-6 py-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-[11px] lg:text-xs font-medium text-[#606e8a] order-2 sm:order-1">
              Showing{" "}
              <span className="font-bold text-[#111318]">
                {filteredProducts.length > 0
                  ? (currentPage - 1) * itemsPerPage + 1
                  : 0}
              </span>{" "}
              to{" "}
              <span className="font-bold text-[#111318]">
                {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
              </span>{" "}
              of{" "}
              <span className="font-bold text-[#111318]">
                {filteredProducts.length}
              </span>{" "}
              entries
            </div>
            <nav
              aria-label="Pagination"
              className="flex items-center space-x-1 order-1 sm:order-2"
            >
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="cursor-pointer inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-300 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px] mr-1">
                  chevron_left
                </span>
                Previous
              </button>
              <div className="hidden md:flex items-center space-x-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`cursor-pointer w-8 h-8 flex items-center justify-center text-xs font-bold rounded-lg transition-all ${
                      currentPage === i + 1
                        ? "bg-[#0d59f2] text-white shadow-lg shadow-[#0d59f2]/20"
                        : "border border-transparent text-[#606e8a] hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="cursor-pointer inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-300 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm ml-1"
              >
                Next
                <span className="material-symbols-outlined text-[18px] ml-1">
                  chevron_right
                </span>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deletingProductId && (
        <div className="fixed inset-0 bg-gray-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl scale-100 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">delete</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Delete Product?
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingProductId(null)}
                className="cursor-pointer flex-1 py-1.5 rounded-lg border border-gray-300 font-bold text-xs hover:bg-gray-50 transition-all disabled:opacity-50"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="cursor-pointer flex-1 bg-red-500 text-white px-3 lg:px-4 py-1.5 rounded-lg text-xs font-bold shadow-lg shadow-red-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap flex items-center justify-center gap-2"
              >
                {deleteLoading && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
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
      className={`p-0.5 rounded-md transition-all ${copied ? "text-green-500 bg-green-50" : "text-slate-400 hover:text-primary hover:bg-slate-100"}`}
      title="Copy ID"
    >
      <span className="material-symbols-outlined text-[13px]">
        {copied ? "check_circle" : "content_copy"}
      </span>
    </button>
  );
}
