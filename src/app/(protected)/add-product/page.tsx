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
        // Enforce single file
        if (e.dataTransfer.files.length > 1) {
          toast.error("Please upload only one document");
        }

        const file = e.dataTransfer.files[0];
        if (file.type !== "application/pdf") {
          toast.error("Only PDF documents are allowed");
        } else {
          // Replace existing docs with the new single file
          setProductDocs([file]);
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
    deleteFileLoading,
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
    setLoaderTitle("Generating Product Charter...");
    setLoaderIsSuccess(false);
    setIsGeneratingDraft(true);
    toast.loading("Generating charter...", { id: "charter-gen" });

    try {
      const result = await dispatch(generateCharter(currentProductId)).unwrap();
      // Bind directly to productForm description
      setProductForm((prev) => ({ ...prev, description: result }));
      toast.success("Charter generated!", { id: "charter-gen" });

      // Signal success to loader and close after a delay
      setLoaderIsSuccess(true);
      setTimeout(() => {
        setIsUploading(false);
        setIsSubmitting(false);
        setLoaderIsSuccess(false);
      }, 1500);
    } catch (error: any) {
      toast.error(error || "Failed to generate charter", {
        id: "charter-gen",
      });
      // Close loader on error
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
        onComplete={() => {
          // Loader handles its own success state and timeout
        }}
      />

      {/* BEGIN: MainHeader */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            aria-label="Go back"
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {productId ? "Edit Product" : "New Product Showcase"}
            </h1>
            <p className="text-sm text-gray-500">
              Drafting your strategic offering
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download Charter Template
          </button>
          <button
            onClick={() => handleHandleAction(false)}
            disabled={createLoading || updateLoading || uploadLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm cursor-pointer disabled:opacity-70 flex items-center gap-2"
          >
            {(createLoading || updateLoading || uploadLoading) && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {productId ? "Update Product" : "Save Product"}
          </button>
        </div>
      </header>
      {/* END: MainHeader */}

      {/* BEGIN: ProgressIndicator */}
      <nav aria-label="Progress" className="max-w-4xl mx-auto mt-8 mb-12 px-1">
        <ol className="flex items-center justify-between w-full">
          <li className="flex flex-col items-center flex-1">
            <div className="flex items-center w-full">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm ${productForm.name ? "bg-blue-600 text-white" : "bg-blue-600 text-white"}`}
              >
                1
              </div>
              <div
                className={`h-0.5 flex-grow margin-0 mx-4 ${productForm.name ? "bg-blue-600" : "bg-gray-200"}`}
              ></div>
            </div>
            <span className="mt-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Product Name
            </span>
          </li>
          <li className="flex flex-col items-center flex-1">
            <div className="flex items-center w-full">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm ${productImage || existingImagePath ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}
              >
                2
              </div>
              <div
                className={`h-0.5 flex-grow margin-0 mx-4 ${productImage || existingImagePath ? "bg-blue-600" : "bg-gray-200"}`}
              ></div>
            </div>
            <span
              className={`mt-2 text-xs font-semibold uppercase tracking-wider ${productImage || existingImagePath ? "text-blue-600" : "text-gray-400"}`}
            >
              Product Image
            </span>
          </li>
          <li className="flex flex-col items-center flex-1">
            <div className="flex items-center w-full">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm ${productDocs.length > 0 || existingDocs.length > 0 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}
              >
                3
              </div>
              <div
                className={`h-0.5 flex-grow margin-0 mx-4 ${productDocs.length > 0 || existingDocs.length > 0 ? "bg-blue-600" : "bg-gray-200"}`}
              ></div>
            </div>
            <span
              className={`mt-2 text-xs font-semibold uppercase tracking-wider ${productDocs.length > 0 || existingDocs.length > 0 ? "text-blue-600" : "text-gray-400"}`}
            >
              Documents
            </span>
          </li>
          <li className="flex flex-col items-center">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm border-2 border-transparent ${productForm.description ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}
            >
              4
            </div>
            <span
              className={`mt-2 text-xs font-semibold uppercase tracking-wider ${productForm.description ? "text-blue-600" : "text-gray-400"}`}
            >
              Charter
            </span>
          </li>
        </ol>
      </nav>
      {/* END: ProgressIndicator */}

      {/* BEGIN: WorkflowContent */}
      <main className="max-w-4xl mx-auto px-1 pb-20">
        {/* STAGE 1 & 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* BEGIN: Stage1_ProjectName */}
          <section
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all duration-300"
            data-purpose="stage-1-container"
          >
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
              Stage 1: Product Name
            </h2>
            <div className="space-y-4">
              <label
                className="block text-xs font-bold text-gray-500 uppercase"
                htmlFor="product-name"
              >
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                className={`w-full bg-blue-50 border-none rounded-lg p-4 text-gray-700 focus:ring-2 focus:ring-blue-500 transition outline-none ${formErrors.name ? "ring-2 ring-red-500" : ""}`}
                id="product-name"
                placeholder="Enter product name"
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
          </section>
          {/* END: Stage1_ProjectName */}

          {/* BEGIN: Stage2_ProductImage */}
          <section
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all duration-300"
            data-purpose="stage-2-container"
          >
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
              Stage 2: Product Image
            </h2>
            <div
              onDragOver={(e) => handleDragOver(e, "image")}
              onDragLeave={() => handleDragLeave("image")}
              onDrop={(e) => handleDrop(e, "image")}
              className={`border-2 border-dashed ${formErrors.image ? "border-red-300 bg-red-50/50" : isDraggingImage ? "border-blue-500 bg-blue-50/50" : "border-gray-200 hover:bg-gray-50"} rounded-xl p-8 flex flex-col items-center justify-center transition cursor-pointer group min-h-[200px] relative`}
            >
              {previewImage ? (
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <div className="relative group/image">
                    {productImage ? (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="h-24 w-auto object-contain rounded-lg shadow-sm"
                      />
                    ) : (
                      <AuthenticatedImage
                        src={previewImage}
                        alt="Preview"
                        className="h-24 w-auto object-contain rounded-lg shadow-sm"
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
                  <p className="mt-3 text-[10px] text-gray-500 font-medium truncate max-w-[80%]">
                    {productImage
                      ? productImage.name
                      : existingImagePath?.split("/").pop()}
                  </p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
                    <Cloud className="h-8 w-8 text-blue-400" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700">
                    Click or drag image here
                  </p>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-tight">
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
          </section>
          {/* END: Stage2_ProductImage */}
        </div>

        {/* BEGIN: Stage3_UploadDocuments */}
        <section
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8 transition-all duration-300"
          data-purpose="stage-3-container"
        >
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
            Stage 3: Upload Document
          </h2>
          <div
            onDragOver={(e) => handleDragOver(e, "docs")}
            onDragLeave={() => handleDragLeave("docs")}
            onDrop={(e) => handleDrop(e, "docs")}
            className={`border-2 border-dashed ${isDraggingDocs ? "border-blue-500 bg-blue-50/50" : "border-gray-200 hover:bg-gray-50"} rounded-xl p-10 flex flex-col items-center justify-center transition cursor-pointer mb-4 relative`}
          >
            <Upload className="h-10 w-10 text-gray-300 mb-2" />
            <p className="text-sm font-semibold text-gray-700">
              Click or drag a document here
            </p>
            <p className="text-xs text-gray-400 mt-1">Only PDF File Accepted</p>
            <input
              type="file"
              accept="application/pdf"
              onClick={(e) => {
                // Reset so selecting the same file again fires onChange
                (e.target as HTMLInputElement).value = "";
              }}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  const file = e.target.files[0];
                  if (file.type !== "application/pdf") {
                    toast.error("Only PDF documents are allowed");
                  } else {
                    // Replace existing docs with the new single file
                    setProductDocs([file]);
                  }
                }
              }}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          {/* File List */}
          <div className="space-y-2">
            {/* Existing Documents */}
            {existingDocs.map((path, index) => (
              <div
                key={`existing-${index}`}
                className="flex items-center gap-4 p-4 border border-blue-100 bg-blue-50/30 rounded-lg group/doc"
              >
                <div className="w-10 h-12 bg-white rounded-md border border-gray-200 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                    {path.split("/").pop()}
                  </p>
                  <span className="text-[10px] font-bold text-blue-600 uppercase">
                    Existing Document
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteExistingDoc(path)}
                  disabled={deleteFileLoading}
                  className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover/doc:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete Document"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}

            {/* New Documents */}
            {productDocs.map((file, index) => (
              <div
                key={`new-${index}`}
                className="flex items-center gap-4 p-4 border border-blue-100 bg-blue-50/30 rounded-lg group/doc"
              >
                <div className="w-10 h-12 bg-white rounded-md border border-gray-200 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                    {file.name}
                  </p>
                  <span className="text-[10px] font-bold text-blue-600 uppercase">
                    New Upload
                  </span>
                </div>
                <button
                  onClick={() => {
                    const newDocs = [...productDocs];
                    newDocs.splice(index, 1);
                    setProductDocs(newDocs);
                  }}
                  className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover/doc:opacity-100 transition-opacity"
                  title="Remove Document"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </section>
        {/* END: Stage3_UploadDocuments */}

        {/* BEGIN: Stage4_GenerateCharter */}
        <section
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all duration-300"
          data-purpose="stage-4-container"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
                Stage 4: Generate Charter
              </h2>
              <label className="block text-xs font-bold text-gray-500 uppercase">
                Product Charter <span className="text-red-500">*</span>
              </label>
            </div>
            <button
              onClick={handleGenerateDraftCharter}
              disabled={isGeneratingDraft || productDocs.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="h-4 w-4" />
              {isGeneratingDraft ? "Generating..." : "Generate Product Charter"}
            </button>
          </div>

          {/* Rich Text Editor Simulated Container */}
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-inner">
            {/* Editor Toolbar */}
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex gap-4">
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
                className="p-1 hover:bg-gray-200 rounded text-gray-600 font-bold w-8"
              >
                B
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
                className="p-1 hover:bg-gray-200 rounded text-gray-600 italic font-serif w-8 text-lg"
              >
                I
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
                  setProductForm({ ...productForm, description: newText });

                  setTimeout(() => {
                    textarea.focus();
                    textarea.setSelectionRange(start + 3, start + 3);
                  }, 0);
                }}
                className="p-1 hover:bg-gray-200 rounded text-gray-600 flex items-center justify-center"
              >
                <ListIcon className="h-4 w-4" />
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
                className="p-1 hover:bg-gray-200 rounded text-gray-600"
              >
                <LinkIcon className="h-4 w-4" />
              </button>
            </div>
            {/* Editor Text Area */}
            <textarea
              id="description-input"
              className="w-full p-6 bg-white min-h-[350px] text-sm text-gray-700 leading-relaxed whitespace-pre-wrap outline-none resize-none border-none focus:ring-0"
              placeholder="Charter details will appear here..."
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
            <p className="text-red-500 text-[10px] mt-1 px-1">
              {formErrors.description}
            </p>
          )}
        </section>
        {/* END: Stage4_GenerateCharter */}
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
