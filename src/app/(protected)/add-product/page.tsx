"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";
import {
  createProduct,
  updateProduct,
  uploadProductFiles,
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
  Info,
  Trash2,
  Download,
  Bold,
  Italic,
  List as ListIcon,
  Link as LinkIcon,
} from "lucide-react";
import { AuthenticatedImage } from "../../components/AuthenticatedImage";
import { ConfirmationDialog } from "../../components/ConfirmationDialog";
import { FileUploadLoader } from "../../components/FileUploadLoader";
import { generateCharter } from "../../redux/slices/ProductSlice";

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
  const dummyHistoryPushed = React.useRef(false);

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

  const [draftCharter, setDraftCharter] = useState("");
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);

  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isDraggingDocs, setIsDraggingDocs] = useState(false);

  const [hasGeneratedCharter, setHasGeneratedCharter] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadTotalSize, setUploadTotalSize] = useState(1);
  const [loaderTitle, setLoaderTitle] = useState("Processing Product...");
  const [loaderIsSuccess, setLoaderIsSuccess] = useState(false);

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
      if (e.dataTransfer.files) {
        const newFiles = Array.from(e.dataTransfer.files);
        const nonPdfFiles = newFiles.filter(
          (f) => f.type !== "application/pdf",
        );
        if (nonPdfFiles.length > 0) {
          toast.error("Only PDF documents are allowed");
          const pdfFiles = newFiles.filter((f) => f.type === "application/pdf");
          setProductDocs((prev) => [...prev, ...pdfFiles]);
        } else {
          setProductDocs((prev) => [...prev, ...newFiles]);
        }
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
    loading: productsLoading,
  } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    if (productId && user?.userId) {
      const product = products.find((p) => p.id === productId);
      if (product) {
        const formData = {
          name: product.name,
          description: product.description,
        };
        setProductForm(formData);
        setInitialForm(formData);
        setExistingDocs(product.filePaths || []);
        setExistingImagePath(product.imagePath);
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

        if (productDocs.length > 0) {
          await dispatch(
            uploadProductFiles({
              productId: newProduct.id,
              userId,
              files: productDocs,
            }),
          ).unwrap();
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

  const handleGenerateDraftCharter = async () => {
    // 1. Call save product logic first (skip navigation, keep loader open)
    const currentProductId = await handleHandleAction(true, undefined, true);

    if (!currentProductId) {
      return;
    }

    // If we just created a new product, update the URL so a refresh doesn't lose the state
    if (!productId) {
      window.history.replaceState(null, "", `?id=${currentProductId}`);
    }

    // Update loader state for generation phase
    setLoaderTitle("Generating project charter...");
    setLoaderIsSuccess(false);
    setIsGeneratingDraft(true);
    toast.loading("Generating draft charter...", { id: "charter-gen" });

    try {
      const result = await dispatch(generateCharter(currentProductId)).unwrap();
      setDraftCharter(result);
      setHasGeneratedCharter(true);
      toast.success("Draft charter generated!", { id: "charter-gen" });

      // Signal success to loader and close after a delay
      setLoaderIsSuccess(true);
      setTimeout(() => {
        setIsUploading(false);
        setIsSubmitting(false);
        setLoaderIsSuccess(false);
      }, 1500);
    } catch (error: any) {
      toast.error(error || "Failed to generate draft charter", {
        id: "charter-gen",
      });
      // Close loader on error
      setIsUploading(false);
      setIsSubmitting(false);
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  const handleCopyDraftToFinal = async () => {
    if (!draftCharter) {
      toast.error("No draft charter to copy.");
      return;
    }

    // Bind draft to final description locally and clear draft preview
    setProductForm((prev) => ({ ...prev, description: draftCharter }));
    setDraftCharter("");
    toast.success("Draft copied to final description!");
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
        onComplete={() => {
          // Loader handles its own success state and timeout
        }}
      />

      {/* Main Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            aria-label="Go back"
            className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-6 w-6 text-slate-500" />
          </button>
          <div className="h-6 w-px bg-slate-200"></div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {productId ? "Edit Product" : "New Product Showcase"}
            </h1>
            <p className="text-sm text-slate-500">
              Drafting your strategic offering
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download Template
          </button>
          <button
            onClick={() => handleHandleAction(false)}
            disabled={createLoading || updateLoading || uploadLoading}
            className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm cursor-pointer flex items-center gap-2 disabled:opacity-70"
          >
            {(createLoading || updateLoading || uploadLoading) && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {productId ? "Update Product" : "Save Product"}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Section 1: Product Details */}
          <section data-purpose="product-details-container">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold text-sm">
                1
              </span>
              <h2 className="text-xl font-bold text-slate-800">
                Product Details
              </h2>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.05)] space-y-8">
              {/* Product Name Input */}
              <div className="space-y-2">
                <label
                  className="block text-xs font-bold text-slate-500 uppercase tracking-wider"
                  htmlFor="product-name"
                >
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  className={`w-full px-4 py-3 rounded-lg border ${formErrors.name ? "border-red-500" : "border-slate-200"} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300 text-sm`}
                  id="product-name"
                  placeholder="e.g. Strategic Growth Suite"
                  type="text"
                  value={productForm.name}
                  onChange={(e) => {
                    setProductForm({ ...productForm, name: e.target.value });
                    if (formErrors.name)
                      setFormErrors({ ...formErrors, name: undefined });
                  }}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {formErrors.name}
                  </p>
                )}
              </div>

              {/* Description Editor */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    FINAL PRODUCT CHARTER
                  </label>
                  <div className="flex gap-3 items-center">
                    <button
                      onClick={handleGenerateDraftCharter}
                      disabled={isGeneratingDraft || productDocs.length === 0}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-tight cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGeneratingDraft
                        ? "Generating..."
                        : "Generate Draft Product Charter"}
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      onClick={handleCopyDraftToFinal}
                      disabled={!draftCharter || productDocs.length === 0}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-tight cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Copy Draft Product Charter to Final
                    </button>
                  </div>
                </div>

                {draftCharter && (
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-100 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-blue-500" />
                      <span className="text-[10px] font-bold text-blue-600 uppercase">
                        Draft Generated
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-3 italic">
                      {draftCharter}
                    </p>
                  </div>
                )}

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  {/* Rich Text Toolbar */}
                  <div className="flex items-center gap-4 px-4 py-2 border-b border-slate-200 bg-slate-50">
                    <button
                      type="button"
                      onClick={() => {
                        const textarea = document.getElementById(
                          "description-input",
                        ) as HTMLTextAreaElement;
                        if (!textarea) return;

                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const text = productForm.description;
                        const before = text.substring(0, start);
                        const selection = text.substring(start, end);
                        const after = text.substring(end);

                        const newText = `${before}**${selection}**${after}`;
                        setProductForm({
                          ...productForm,
                          description: newText,
                        });

                        setTimeout(() => {
                          textarea.focus();
                          textarea.setSelectionRange(start + 2, end + 2);
                        }, 0);
                      }}
                      className="p-1.5 hover:bg-slate-200 rounded cursor-pointer transition-colors"
                      title="Bold"
                    >
                      <Bold className="w-4 h-4 text-slate-600" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const textarea = document.getElementById(
                          "description-input",
                        ) as HTMLTextAreaElement;
                        if (!textarea) return;

                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const text = productForm.description;
                        const before = text.substring(0, start);
                        const selection = text.substring(start, end);
                        const after = text.substring(end);

                        const newText = `${before}*${selection}*${after}`;
                        setProductForm({
                          ...productForm,
                          description: newText,
                        });

                        setTimeout(() => {
                          textarea.focus();
                          textarea.setSelectionRange(start + 1, end + 1);
                        }, 0);
                      }}
                      className="p-1.5 hover:bg-slate-200 rounded cursor-pointer transition-colors"
                      title="Italic"
                    >
                      <Italic className="w-4 h-4 text-slate-600" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const textarea = document.getElementById(
                          "description-input",
                        ) as HTMLTextAreaElement;
                        if (!textarea) return;

                        const start = textarea.selectionStart;
                        const text = productForm.description;
                        const before = text.substring(0, start);
                        const after = text.substring(start);

                        const newText = `${before}\n- ${after}`;
                        setProductForm({
                          ...productForm,
                          description: newText,
                        });

                        setTimeout(() => {
                          textarea.focus();
                          textarea.setSelectionRange(start + 3, start + 3);
                        }, 0);
                      }}
                      className="p-1.5 hover:bg-slate-200 rounded cursor-pointer transition-colors"
                      title="List"
                    >
                      <ListIcon className="w-4 h-4 text-slate-600" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const textarea = document.getElementById(
                          "description-input",
                        ) as HTMLTextAreaElement;
                        if (!textarea) return;

                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const text = productForm.description;
                        const before = text.substring(0, start);
                        const selection = text.substring(start, end);
                        const after = text.substring(end);

                        const newText = `${before}[${selection || "link text"}](url)${after}`;
                        setProductForm({
                          ...productForm,
                          description: newText,
                        });

                        setTimeout(() => {
                          textarea.focus();
                          const linkStart =
                            start + (selection ? selection.length : 9) + 3;
                          textarea.setSelectionRange(linkStart, linkStart + 3);
                        }, 0);
                      }}
                      className="p-1.5 hover:bg-slate-200 rounded cursor-pointer transition-colors"
                      title="Link"
                    >
                      <LinkIcon className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                  {/* Text Area */}
                  <textarea
                    id="description-input"
                    className="w-full p-4 border-none focus:ring-0 text-slate-600 placeholder:text-slate-300 resize-none outline-none text-sm"
                    placeholder="Briefly describe what this product does..."
                    rows={12}
                    value={productForm.description}
                    onChange={(e) => {
                      setProductForm({
                        ...productForm,
                        description: e.target.value,
                      });
                      if (formErrors.description)
                        setFormErrors({
                          ...formErrors,
                          description: undefined,
                        });
                    }}
                  ></textarea>
                </div>
                {formErrors.description && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {formErrors.description}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Section 2: Assets & Media */}
          <section data-purpose="assets-media-container">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold text-sm">
                2
              </span>
              <h2 className="text-xl font-bold text-slate-800">
                Assets & Media
              </h2>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.05)] space-y-8">
              {/* Product Image Upload */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Product Image
                </label>
                <div
                  onDragOver={(e) => handleDragOver(e, "image")}
                  onDragLeave={() => handleDragLeave("image")}
                  onDrop={(e) => handleDrop(e, "image")}
                  className={`relative border-2 border-dashed ${formErrors.image ? "border-red-300 bg-red-50/50" : isDraggingImage ? "border-blue-500 bg-blue-50/50" : "border-slate-200 bg-slate-50/50 hover:bg-slate-50"} rounded-xl py-12 flex flex-col items-center justify-center transition-colors cursor-pointer group min-h-[200px]`}
                >
                  {previewImage ? (
                    <div className="relative w-full h-full p-2 flex flex-col items-center justify-center">
                      <div className="relative group/image">
                        {productImage ? (
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="h-32 w-auto object-contain rounded-lg shadow-sm"
                          />
                        ) : (
                          <AuthenticatedImage
                            src={previewImage}
                            alt="Preview"
                            className="h-32 w-auto object-contain rounded-lg shadow-sm"
                          />
                        )}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setProductImage(null);
                            setExistingImagePath(null);
                          }}
                          className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md text-slate-400 hover:text-red-500 z-10 hover:scale-110 transition-all opacity-0 group-hover/image:opacity-100 cursor-pointer"
                          title="Remove Image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="mt-3 text-[10px] text-slate-500 font-medium truncate max-w-[80%]">
                        {productImage
                          ? productImage.name
                          : existingImagePath?.split("/").pop()}
                      </p>
                    </div>
                  ) : (
                    <>
                      <Cloud className="h-12 w-12 text-slate-300 mb-3 group-hover:scale-110 transition-transform" />
                      <p className="text-slate-600 font-medium">
                        Click or drag image here
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        PNG, JPG or WEBP (Max 2MB)
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setProductImage(file);
                        if (formErrors.image)
                          setFormErrors({ ...formErrors, image: undefined });
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                {formErrors.image && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {formErrors.image}
                  </p>
                )}
              </div>

              {/* Project Document Upload */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    PRODUCT DOCUMENTS
                  </label>
                </div>
                <div
                  onDragOver={(e) => handleDragOver(e, "docs")}
                  onDragLeave={() => handleDragLeave("docs")}
                  onDrop={(e) => handleDrop(e, "docs")}
                  className={`relative border-2 border-dashed ${isDraggingDocs ? "border-blue-500 bg-blue-50/50" : "border-slate-200 bg-slate-50/50 hover:bg-slate-50"} rounded-xl py-12 flex flex-col items-center justify-center transition-colors cursor-pointer group min-h-[160px]`}
                >
                  <Upload className="h-12 w-12 text-slate-300 mb-3 group-hover:scale-110 transition-transform" />
                  <p className="text-slate-600 font-medium">
                    Click or drag documents here
                  </p>
                  <p className="text-xs text-slate-400 mt-1">PDF (Max 10MB)</p>
                  <input
                    type="file"
                    multiple
                    accept="application/pdf"
                    onChange={(e) => {
                      if (e.target.files) {
                        const newFiles = Array.from(e.target.files);
                        const nonPdfFiles = newFiles.filter(
                          (f) => f.type !== "application/pdf",
                        );
                        if (nonPdfFiles.length > 0) {
                          toast.error("Only PDF documents are allowed");
                          const pdfFiles = newFiles.filter(
                            (f) => f.type === "application/pdf",
                          );
                          setProductDocs((prev) => [...prev, ...pdfFiles]);
                        } else {
                          setProductDocs((prev) => [...prev, ...newFiles]);
                        }
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>

                {/* Document List */}
                <div className="space-y-2 mt-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                  {/* Existing Documents */}
                  {existingDocs.map((path, index) => (
                    <div
                      key={`existing-${index}`}
                      className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl group/doc"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <FileText className="w-5 h-5 text-slate-400" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]">
                            {path.split("/").pop()}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">
                            Existing Document
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover/doc:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            const url = `${getBaseUrl()}${endpoints.getProductFile(productId || "", path)}`;
                            window.open(url, "_blank");
                          }}
                          className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-blue-500 transition-colors cursor-pointer"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setExistingDocs((prev) =>
                              prev.filter((_, i) => i !== index),
                            );
                            toast.success("Document removed from list");
                          }}
                          className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* New Documents */}
                  {productDocs.map((file, index) => (
                    <div
                      key={`new-${index}`}
                      className="flex justify-between items-center p-3 bg-blue-50/50 border border-blue-100 rounded-xl group/doc"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <FileText className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]">
                            {file.name}
                          </span>
                          <span className="text-[10px] text-blue-500 font-bold uppercase">
                            New Upload
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setProductDocs((prev) =>
                            prev.filter((_, i) => i !== index),
                          )
                        }
                        className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-red-500 opacity-0 group-hover/doc:opacity-100 transition-all cursor-pointer"
                        title="Remove"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

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
                      toast.error(error || "Failed to upload documents");
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
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={() => {
          setIsConfirmDialogOpen(false);
          router.push("/products");
        }}
        title="Unsaved Changes"
        description="You have unsaved changes. Are you sure you want to leave? Your progress will be lost."
        confirmLabel="Leave Page"
        cancelLabel="Stay"
        variant="info"
      />
    </div>
  );
}

export default function AddProductPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <AddProductContent />
    </Suspense>
  );
}
