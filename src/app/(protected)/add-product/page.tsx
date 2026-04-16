"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";
import {
  createProduct,
  updateProduct,
  uploadProductFiles,
  deleteProductFile,
  CreateProductPayload,
  UpdateProductPayload,
  fetchProductsByUserId,
} from "../../redux/slices/ProductSlice";
import { getBaseUrl, api } from "../../services/apiService";
import { endpoints } from "../../lib/endpoints";
import toast from "react-hot-toast";
import { useUser } from "../../hooks/useUser";
import { useSearchParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import {
  Upload,
  X,
  Eye,
  ArrowLeft,
  FileText,
  Cloud,
  Trash2,
  Download,
  Bold,
  Italic,
  List as ListIcon,
  Link as LinkIcon,
  Globe,
  Plus,
  CheckCircle,
  Save,
  Briefcase,
} from "lucide-react";
import { AuthenticatedImage } from "../../components/AuthenticatedImage";
import { ConfirmationDialog } from "../../components/ConfirmationDialog";
import { FileUploadLoader } from "../../components/FileUploadLoader";
import { 
  generateCharter, 
  generateCharterFromUrl 
} from "../../redux/slices/ProductSlice";

function AddProductContent() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get("id");

  const [productForm, setProductForm] = useState<
    CreateProductPayload & { tagline?: string }
  >({
    name: "",
    description: "",
  });
  const [initialForm, setInitialForm] = useState<
    CreateProductPayload & { tagline?: string }
  >({
    name: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<string | null>(null);
  const dummyHistoryPushed = React.useRef(false);
  const isFormInitialized = React.useRef(false);

  const [productImage, setProductImage] = useState<File | null>(null);
  const [productDocs, setProductDocs] = useState<File[]>([]);
  const [existingDocs, setExistingDocs] = useState<string[]>([]);
  const [existingImagePath, setExistingImagePath] = useState<string | null>(
    null,
  );

  const [formErrors, setFormErrors] = useState<{
    name?: string;
    description?: string;
    image?: string;
  }>({});

  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);

  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isDraggingDocs, setIsDraggingDocs] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadTotalSize, setUploadTotalSize] = useState(1);
  const [loaderTitle, setLoaderTitle] = useState("Processing Product...");
  const [loaderIsSuccess, setLoaderIsSuccess] = useState(false);
  const [websiteURL, setWebsiteURL] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [isUrlSuccess, setIsUrlSuccess] = useState(false);

  const handleDragOver = (e: React.DragEvent, type: "image" | "docs") => {
    e.preventDefault();
    if (type === "image") setIsDraggingImage(true);
    else setIsDraggingDocs(true);
  };

  const handleDragLeave = (type: "image" | "docs") => {
    if (type === "image") setIsDraggingImage(false);
    else setIsDraggingDocs(false);
  };

  const handleDrop = (e: React.DragEvent, type: "image" | "docs") => {
    e.preventDefault();
    if (type === "image") {
      setIsDraggingImage(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        setProductImage(file);
        if (formErrors.image)
          setFormErrors({ ...formErrors, image: undefined });
      } else {
        toast.error("Please drop an image file");
      }
    } else {
      setIsDraggingDocs(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const newFiles = Array.from(e.dataTransfer.files).filter((file) => {
          const allowedTypes = [
            "application/pdf",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          ];
          if (!allowedTypes.includes(file.type)) {
            toast.error(`${file.name} is not a valid format (PDF/PPT only)`);
            return false;
          }
          return true;
        });
        setProductDocs((prev) => [...prev, ...newFiles]);
        if (formErrors.description)
          setFormErrors({ ...formErrors, description: undefined });
      }
    }
  };

  const [showUploadPrompt, setShowUploadPrompt] = useState(false);
  const [uploadPromptProductId, setUploadPromptProductId] = useState<
    string | null
  >(null);
  const [uploadPromptDocs, setUploadPromptDocs] = useState<File[]>([]);

  const {
    products,
    createLoading,
    updateLoading,
    uploadLoading,
    deleteFileLoading,
    generateCharterLoading,
    generateCharterFromUrlLoading,
    loading: productsLoading,
  } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    if (productId && user?.userId) {
      const product = products.find((p) => p.id === productId);
      if (product) {
        // Only initialize the form once from server data.
        // Subsequent Redux updates (e.g. from updateProduct) should NOT
        // overwrite local state like existingDocs which the user may have changed.
        if (!isFormInitialized.current) {
          const formData = {
            name: product.name,
            description: product.description,
          };
          setProductForm(formData);
          setInitialForm(formData);
          setExistingDocs(product.filePaths || []);
          setExistingImagePath(product.imagePath);
          isFormInitialized.current = true;
        }
      } else if (!productsLoading) {
        dispatch(fetchProductsByUserId(user.userId));
      }
    }
  }, [productId, products, user?.userId, productsLoading, dispatch]);

  const isDirty =
    productForm.name !== initialForm.name ||
    productForm.description !== initialForm.description ||
    productImage !== null ||
    productDocs.length > 0;

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !isSubmitting) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (isDirty && !isSubmitting) {
        // Prevent immediate navigation by pushing the current URL back onto the stack
        window.history.pushState(null, "", window.location.href);
        setIsConfirmDialogOpen(true);
      }
    };

    // Push an initial dummy state when form becomes dirty to enable interception
    if (isDirty && !isSubmitting && !dummyHistoryPushed.current) {
      window.history.pushState(null, "", window.location.href);
      dummyHistoryPushed.current = true;
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isDirty, isSubmitting]);

  const handleBack = () => {
    if (isDirty) {
      setIsConfirmDialogOpen(true);
    } else {
      router.push("/products");
    }
  };

  const validateForm = (): boolean => {
    const errors: { name?: string; description?: string; image?: string } = {};

    if (!productForm.name.trim()) {
      errors.name = "Product name is required";
    } else if (productForm.name.trim().length < 3) {
      errors.name = "Product name must be at least 3 characters";
    } else if (/[/\\]/.test(productForm.name)) {
      errors.name = "Product name cannot contain slashes (/ or \\)";
    }

    const hasDescription = productForm.description.trim().length >= 10;
    const hasDocs = productDocs.length > 0 || existingDocs.length > 0;

    if (!hasDescription && !hasDocs) {
      errors.description =
        "Either a description (min 10 chars) or a product document is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleHandleAction = async (
    skipNavigation = false,
    descriptionOverride?: string,
    keepLoaderOpen = false,
  ) => {
    if (!validateForm()) {
      return null;
    }

    const userId = user?.userId;
    if (!userId) return null;

    setIsSubmitting(true);
    setIsUploading(true);
    setLoaderIsSuccess(false);
    setLoaderTitle("Saving Product...");

    // Calculate total size in MB
    let totalSize = 0;
    if (productImage) totalSize += productImage.size;
    productDocs.forEach((doc) => (totalSize += doc.size));
    const totalSizeMB = Math.max(0.2, totalSize / (1024 * 1024)); // Min 0.2MB for animation visibility

    setUploadTotalSize(totalSizeMB);
    setUploadFileName(productForm.name);

    try {
      let currentProductId = productId;
      if (productId) {
        // Update mode
        const payload: UpdateProductPayload = {
          name: productForm.name,
          description:
            descriptionOverride !== undefined
              ? descriptionOverride
              : productForm.description,
          image: productImage || undefined,
        };

        await dispatch(
          updateProduct({
            productId,
            userId,
            payload,
          }),
        ).unwrap();

        if (productDocs.length > 0) {
          await dispatch(
            uploadProductFiles({
              productId,
              userId,
              files: productDocs,
            }),
          ).unwrap();
          // Move uploaded docs to existingDocs so the list remains visible
          setExistingDocs((prev) => [
            ...prev,
            ...productDocs.map((f) => f.name),
          ]);
          setProductDocs([]);
        }

        toast.success("Product updated successfully!");
      } else {
        // Create mode
        const payload: CreateProductPayload = {
          name: productForm.name,
          description:
            (descriptionOverride !== undefined
              ? descriptionOverride
              : productForm.description) || " ",
          image: productImage || undefined,
        };

        const newProduct = await dispatch(
          createProduct({ userId, payload }),
        ).unwrap();
        currentProductId = newProduct.id;
        // Mark form as initialized so the useEffect doesn't reset
        // existingDocs when the URL updates with the new productId
        isFormInitialized.current = true;

        if (productDocs.length > 0) {
          await dispatch(
            uploadProductFiles({
              productId: newProduct.id,
              userId,
              files: productDocs,
            }),
          ).unwrap();
          // Move uploaded docs to existingDocs so the list remains visible
          setExistingDocs((prev) => [
            ...prev,
            ...productDocs.map((f) => f.name),
          ]);
          setProductDocs([]);
        }

        toast.success("Product added successfully!");
      }

      setLoaderIsSuccess(true);

      // Handle post-save behavior
      if (!skipNavigation) {
        setTimeout(() => {
          setIsUploading(false);
          if (!productId) {
            const newProductId = currentProductId!;
            if (productDocs.length === 0) {
              setUploadPromptProductId(newProductId);
              setShowUploadPrompt(true);
            } else {
              router.push("/products");
            }
          } else {
            router.push("/products");
          }
        }, 2000);
      } else if (!keepLoaderOpen) {
        // If skipping navigation and not keeping loader open, just close the loader after a bit
        setTimeout(() => {
          setIsUploading(false);
        }, 1500);
      }

      return currentProductId;
    } catch (error: any) {
      toast.error(error || "Failed to save product");
      setIsSubmitting(false);
      setIsUploading(false);
      setLoaderIsSuccess(false);
      return null;
    }
  };

  const getPreviewImageUrl = () => {
    if (productImage) {
      return URL.createObjectURL(productImage);
    }
    if (existingImagePath) {
      return `${getBaseUrl()}${endpoints.getProductImage(productId || "")}`;
    }
    return null;
  };

  const previewImage = getPreviewImageUrl();

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

  const handleDeleteExistingDoc = (filePath: string) => {
    const currentProductId = productId;
    if (!currentProductId) {
      // If product not yet saved, just remove from local state without confirmation
      setExistingDocs((prev) => prev.filter((p) => p !== filePath));
      return;
    }
    // Open confirmation dialog
    setDocToDelete(filePath);
  };

  const confirmDeleteDoc = async () => {
    if (!docToDelete) return;
    const currentProductId = productId;
    const userId = user?.userId;
    setDocToDelete(null);
    if (!currentProductId || !userId) return;
    try {
      await dispatch(
        deleteProductFile({
          productId: currentProductId,
          fileId: docToDelete,
          userId,
        }),
      ).unwrap();
      setExistingDocs((prev) => prev.filter((p) => p !== docToDelete));
      toast.success("Document deleted successfully");
    } catch (error: any) {
      toast.error(error || "Failed to delete document");
    }
  };

  const handleGenerateFromUrl = async (id: string, url: string) => {
    setLoaderTitle("Extracting site data...");
    setLoaderIsSuccess(false);
    try {
      await dispatch(generateCharterFromUrl({ productId: id, websiteURL: url })).unwrap();
      setIsUrlSuccess(true);
      return true;
    } catch (error: any) {
      toast.error(error || "Failed to scan website");
      return false;
    }
  };

  const handleGenerateDraftCharter = async () => {
    // Validation: URL OR Document must be present
    if (!websiteURL.trim() && productDocs.length === 0 && existingDocs.length === 0) {
      toast.error("Please provide either a Website URL or a document to generate a charter.");
      return;
    }

    // URL format validation if present
    if (websiteURL.trim()) {
      try {
        new URL(websiteURL.startsWith("http") ? websiteURL : `https://${websiteURL}`);
      } catch (e) {
        toast.error("Please provide a valid URL");
        return;
      }
    }

    // 1. Call save product logic first (skip navigation, keep loader open)
    const currentProductId = await handleHandleAction(true, undefined, true);

    if (!currentProductId) {
      return;
    }

    // If we just created a new product, update the URL
    if (!productId) {
      window.history.replaceState(null, "", `?id=${currentProductId}`);
    }

    setIsGeneratingDraft(true);
    setLoaderIsSuccess(false);

    try {
      // 2. Sequential Execution
      
      // Step A: URL Scan
      if (websiteURL.trim()) {
        toast.loading("Scanning website...", { id: "seq-gen" });
        await handleGenerateFromUrl(currentProductId, websiteURL);
      }

      // Step B: Multi-file Upload
      if (productDocs.length > 0) {
        const userId = user?.userId;
        if (userId) {
          setLoaderTitle("Uploading documents...");
          toast.loading("Uploading documents...", { id: "seq-gen" });
          await dispatch(
            uploadProductFiles({
              productId: currentProductId,
              userId,
              files: productDocs,
            }),
          ).unwrap();
          // Reset local docs as they are now server-side
          setProductDocs([]);
          // Optionally fetch updated product or manually update existingDocs
          dispatch(fetchProductsByUserId(userId));
        }
      }

      // Step C: Final Charter Generation
      setLoaderTitle("Generating Final Charter...");
      toast.loading("Generating your charter...", { id: "seq-gen" });
      const result = await dispatch(generateCharter(currentProductId)).unwrap();
      
      setProductForm((prev) => ({ ...prev, description: result }));
      toast.success("Charter generated successfully!", { id: "seq-gen" });

      // Signal success to loader
      setLoaderIsSuccess(true);
      setTimeout(() => {
        setIsUploading(false);
        setIsSubmitting(false);
        setLoaderIsSuccess(false);
      }, 1500);
    } catch (error: any) {
      toast.error(error || "Process failed at some step", { id: "seq-gen" });
      setIsUploading(false);
      setIsSubmitting(false);
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <FileUploadLoader
        isVisible={isUploading}
        title={loaderTitle}
        fileName={uploadFileName}
        totalSizeMB={uploadTotalSize}
        isSuccessManuallyControlled={true}
        isSuccess={loaderIsSuccess}
        onClose={() => {
          setIsUploading(false);
          setIsSubmitting(false);
          setLoaderIsSuccess(false);
        }}
        onComplete={() => {}}
      />

      {/* Header - Sticky Matching Profile Style */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 pt-20 lg:pt-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-all cursor-pointer"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-lg lg:text-xl font-bold tracking-tight text-[#111318]">
              {productId ? "Edit Product" : "Add Product"}
            </h1>
            <p className="text-[#606e8a] text-xs lg:text-sm">
              Define your strategic offering and details.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadTemplate}
            className="hidden md:flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Template
          </button>
          <button
            onClick={() => handleHandleAction(false)}
            disabled={createLoading || updateLoading || uploadLoading}
            className="bg-[#0d59f2] text-white px-4 lg:px-6 py-2 rounded-xl text-xs font-bold shadow-lg shadow-[#0d59f2]/20 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {createLoading || updateLoading || uploadLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {productId ? "Save Changes" : "Save Product"}
          </button>
        </div>
      </header>

      {/* Main Content Area - Profile Edit Inspired */}
      <main className="max-w-[1920px] mx-auto px-6 mt-8 w-full pb-20">
        <div className="bg-white p-6 lg:p-8 rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 w-full mb-10">
          <div className="space-y-12">
            
            {/* SECTION 1: Strategic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4">
                <h2 className="text-lg font-black text-slate-900 mb-2">Strategic Information</h2>
                <p className="text-sm text-slate-500 font-medium">Basic details that identify your product in the portfolio.</p>
              </div>
              <div className="lg:col-span-8 space-y-8">
                {/* Product Name */}
                <label className="flex flex-col gap-2">
                  <span className="text-[10px] lg:text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Product Name <span className="text-red-500">*</span>
                  </span>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border ${formErrors.name ? "border-red-500 bg-red-50/30" : "border-slate-200 bg-slate-50/30"} focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all outline-none text-sm font-bold text-slate-700`}
                      placeholder="Enter product name"
                      value={productForm.name}
                      onChange={(e) => {
                        const sanitizedValue = e.target.value.replace(/[/\\]/g, "");
                        setProductForm({ ...productForm, name: sanitizedValue });
                        if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                      }}
                    />
                  </div>
                  {formErrors.name && <span className="text-red-500 text-[10px] font-bold">{formErrors.name}</span>}
                </label>

                {/* Product Image */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] lg:text-[11px] font-black text-slate-400 uppercase tracking-widest">Product Reference Image</span>
                  <div
                    onDragOver={(e) => handleDragOver(e, "image")}
                    onDragLeave={() => handleDragLeave("image")}
                    onDrop={(e) => handleDrop(e, "image")}
                    className={`relative border-2 border-dashed ${formErrors.image ? "border-red-300 bg-red-50/50" : isDraggingImage ? "border-blue-500 bg-blue-50/50" : "border-slate-200 bg-slate-50/30 hover:border-slate-300"} rounded-2xl p-6 lg:p-10 flex flex-col items-center justify-center transition-all cursor-pointer group min-h-[160px] overflow-hidden`}
                  >
                    {previewImage ? (
                      <div className="flex flex-col items-center justify-center w-full">
                        <div className="relative group/img-preview">
                          {productImage ? (
                            <img src={previewImage} alt="Preview" className="h-20 w-auto object-contain rounded-lg shadow-md" />
                          ) : (
                            <AuthenticatedImage src={previewImage} alt="Preview" className="h-20 w-auto object-contain rounded-lg shadow-md" />
                          )}
                          <button
                            onClick={(e) => {
                              e.preventDefault(); e.stopPropagation();
                              setProductImage(null); setExistingImagePath(null);
                            }}
                            className="absolute -top-2 -right-2 p-1.5 bg-white rounded-full shadow-lg text-slate-400 hover:text-red-500 z-10 opacity-0 group-hover/img-preview:opacity-100 transition-all hover:scale-110"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center pointer-events-none">
                        <div className="p-3 bg-white rounded-xl shadow-sm mb-3 group-hover:scale-110 transition-transform duration-300">
                          <Cloud className="w-5 h-5 text-blue-500" />
                        </div>
                        <p className="text-xs font-bold text-slate-600">Drop image here or click</p>
                        <p className="text-[9px] text-slate-400 uppercase tracking-tighter mt-1 font-black">JPG, PNG, WEBP (Max 2MB)</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setProductImage(file);
                          if (formErrors.image) setFormErrors({ ...formErrors, image: undefined });
                        }
                      }}
                    />
                  </div>
                  {formErrors.image && <span className="text-red-500 text-[10px] font-bold font-mono">{formErrors.image}</span>}
                </div>
              </div>
            </div>

            {/* SECTION 2: Digital Footprint */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-12 border-t border-slate-100">
              <div className="lg:col-span-4">
                <h2 className="text-lg font-black text-slate-900 mb-2">Digital Footprint</h2>
                <p className="text-sm text-slate-500 font-medium">A link to your product's live website for AI-assisted context.</p>
              </div>
              <div className="lg:col-span-8">
                <label className="flex flex-col gap-2">
                  <span className="text-[10px] lg:text-[11px] font-black text-slate-400 uppercase tracking-widest">Product Website URL</span>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                      <Globe className="w-4 h-4" />
                    </div>
                    <input
                      type="url"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border ${urlError ? "border-red-500 bg-red-50/30" : "border-slate-200 bg-slate-50/30 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-50"} transition-all outline-none text-sm font-bold text-slate-700`}
                      placeholder="https://example.com"
                      value={websiteURL}
                      onChange={(e) => {
                        setWebsiteURL(e.target.value);
                        if (urlError) setUrlError(null);
                      }}
                    />
                  </div>
                  {urlError && <span className="text-red-500 text-[10px] font-bold">{urlError}</span>}
                </label>
              </div>
            </div>

            {/* SECTION 3: Knowledge Base */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-12 border-t border-slate-100">
              <div className="lg:col-span-4">
                <h2 className="text-lg font-black text-slate-900 mb-2">Knowledge Base</h2>
                <p className="text-sm text-slate-500 font-medium">Upload technical documents, manuals, or presentations.</p>
              </div>
              <div className="lg:col-span-8 space-y-6">
                <div
                  onDragOver={(e) => handleDragOver(e, "docs")}
                  onDragLeave={() => handleDragLeave("docs")}
                  onDrop={(e) => handleDrop(e, "docs")}
                  className={`relative border-2 border-dashed ${isDraggingDocs ? "border-blue-500 bg-blue-50/70 shadow-inner" : "border-slate-200 bg-slate-50/30 hover:border-slate-300"} rounded-2xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer group min-h-[140px]`}
                >
                  <div className="p-3 bg-white rounded-xl shadow-sm mb-3 group-hover:scale-110 transition-all">
                    <Plus className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-xs font-bold text-slate-600">Click or drag documents to upload</p>
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest mt-1 font-black">supports multi-file uploads (PDF, PPT, PPTX)</p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.ppt,.pptx"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        const newFiles = Array.from(e.target.files).filter((file) => {
                          const allowedTypes = ["application/pdf", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"];
                          if (!allowedTypes.includes(file.type)) { toast.error(`${file.name} is not a valid format`); return false; }
                          return true;
                        });
                        setProductDocs((prev) => [...prev, ...newFiles]);
                      }
                    }}
                  />
                </div>

                {/* File List Grid */}
                {(existingDocs.length > 0 || productDocs.length > 0) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar pt-2">
                    {/* Existing */}
                    {existingDocs.map((path, index) => (
                      <div key={`ex-${index}`} className="flex items-center gap-3 p-3 border border-slate-100 bg-slate-50/50 rounded-xl group/doc animate-in fade-in duration-300">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-[10px] font-black text-slate-700 truncate">{path.split("/").pop()}</p>
                          <span className="text-[9px] font-bold text-slate-400 uppercase">Existing File</span>
                        </div>
                        <button
                          onClick={() => handleDeleteExistingDoc(path)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover/doc:opacity-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    {/* New */}
                    {productDocs.map((file, index) => (
                      <div key={`new-${index}`} className="flex items-center gap-3 p-3 border border-blue-50 bg-blue-50/50 rounded-xl group/doc animate-in slide-in-from-right-2 duration-300">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-[10px] font-black text-slate-700 truncate">{file.name}</p>
                          <span className="text-[9px] font-bold text-blue-600 uppercase tracking-tight">New Upload</span>
                        </div>
                        <button
                          onClick={() => setProductDocs((prev) => prev.filter((_, i) => i !== index))}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover/doc:opacity-100"
                        >
                           <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 4: Product Charter */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-12 border-t border-slate-100">
              <div className="lg:col-span-4">
                <h2 className="text-lg font-black text-slate-900 mb-2">Product Charter</h2>
                <p className="text-sm text-slate-500 font-medium">The core strategic document for your product. You can generate this using AI from your knowledge base or write it manually.</p>
                
                <button
                  onClick={handleGenerateDraftCharter}
                  disabled={isGeneratingDraft || (!websiteURL.trim() && productDocs.length === 0 && existingDocs.length === 0)}
                  className="mt-6 w-full md:w-auto bg-slate-900 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed group"
                >
                  {isGeneratingDraft ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <div className="p-1 bg-white/10 rounded group-hover:bg-blue-600 transition-colors">
                      <Plus className="w-3 h-3 text-white" />
                    </div>
                  )}
                  {isGeneratingDraft ? "Generating charter..." : "Generate Product charter"}
                </button>
              </div>
              <div className="lg:col-span-8">
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col bg-slate-50">
                  <div className="bg-white px-4 py-2 border-b border-slate-200 flex gap-2 overflow-x-auto no-scrollbar">
                    <button type="button" onClick={() => {}} className="p-2 hover:bg-slate-50 rounded-lg text-slate-600 transition-all"><Bold className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => {}} className="p-2 hover:bg-slate-50 rounded-lg text-slate-600 transition-all"><Italic className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => {}} className="p-2 hover:bg-slate-50 rounded-lg text-slate-600 transition-all"><ListIcon className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => {}} className="p-2 hover:bg-slate-50 rounded-lg text-slate-600 transition-all"><LinkIcon className="w-3.5 h-3.5" /></button>
                  </div>
                  <textarea
                    id="description-input"
                    className="w-full p-6 bg-white min-h-[400px] text-sm font-medium text-slate-700 leading-relaxed outline-none resize-none border-none focus:ring-4 focus:ring-blue-50/50 transition-all"
                    placeholder="Describe your product strategy here..."
                    value={productForm.description}
                    onChange={(e) => {
                      setProductForm({ ...productForm, description: e.target.value });
                      if (formErrors.description) setFormErrors({ ...formErrors, description: undefined });
                    }}
                  ></textarea>
                </div>
                {formErrors.description && <p className="text-red-500 text-[10px] font-bold mt-2 px-1 font-mono">{formErrors.description}</p>}
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* END: WorkflowContent */}

      {/* Product Document Upload Prompt Modal */}
      {showUploadPrompt && (
        <div className="fixed inset-0 bg-slate-900/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden flex flex-col scale-in-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">
              Product Created!
            </h3>
            <p className="text-slate-500 text-sm mb-6 text-center">
              Your product has been added successfully. Would you like to upload
              any supporting documents now?
            </p>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      setUploadPromptDocs(Array.from(e.target.files));
                    }
                  }}
                  className="hidden"
                  id="prompt-docs-upload"
                />
                <label
                  htmlFor="prompt-docs-upload"
                  className="flex items-center gap-3 w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100 transition-all border-dashed"
                >
                  <Upload className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-500 text-sm font-medium">
                    {uploadPromptDocs.length > 0
                      ? `${uploadPromptDocs.length} files selected`
                      : "Click to select documents"}
                  </span>
                </label>
              </div>

              {uploadPromptDocs.length > 0 && (
                <div className="max-h-32 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {uploadPromptDocs.map((file, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 bg-blue-50/30 rounded-lg border border-blue-100 text-xs"
                    >
                      <span className="truncate text-slate-600">
                        {file.name}
                      </span>
                      <button
                        onClick={() =>
                          setUploadPromptDocs((prev) =>
                            prev.filter((_, i) => i !== index),
                          )
                        }
                        className="cursor-pointer text-slate-400 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowUploadPrompt(false);
                    router.push("/products");
                  }}
                  className="cursor-pointer flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                  disabled={uploadLoading}
                >
                  Skip for now
                </button>
                <button
                  onClick={async () => {
                    if (!uploadPromptProductId || uploadPromptDocs.length === 0)
                      return;
                    const userId = user?.userId;
                    if (!userId) return;

                    try {
                      await dispatch(
                        uploadProductFiles({
                          productId: uploadPromptProductId,
                          userId,
                          files: uploadPromptDocs,
                        }),
                      ).unwrap();

                      toast.success("Documents uploaded successfully!");
                      setShowUploadPrompt(false);
                      router.push("/products");
                    } catch (error: any) {
                      toast.error(error || "Failed to upload document");
                    }
                  }}
                  disabled={uploadLoading || uploadPromptDocs.length === 0}
                  className="cursor-pointer flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Upload Docs
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmationDialog
        isOpen={docToDelete !== null}
        onClose={() => setDocToDelete(null)}
        onConfirm={confirmDeleteDoc}
        title="Delete Document"
        description={`Are you sure you want to delete "${docToDelete?.split("/").pop()}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />

      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={() => {
          setIsConfirmDialogOpen(false);
          router.push("/products");
        }}
        title="Unsaved Changes"
        description="You have unsaved changes. Are you sure you want to leave? Your changes will be lost."
        confirmLabel="Leave Page"
        cancelLabel="Stay on Page"
      />
    </div>
  );
}

export default function AddProductPage() {
  return (
    <Suspense>
      <AddProductContent />
    </Suspense>
  );
}
