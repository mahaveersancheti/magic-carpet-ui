"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";
import { createProduct, updateProduct, uploadProductFiles, CreateProductPayload, UpdateProductPayload, fetchProductsByUserId } from "../../redux/slices/ProductSlice";
import { getBaseUrl, api } from "../../services/apiService";
import { endpoints } from "../../lib/endpoints";
import toast from 'react-hot-toast';
import { useUser } from '../../hooks/useUser';
import { useSearchParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import {
  Upload,
  X,
  Eye,
  ArrowLeft,
  FileText,
  Cloud,
  Info,
  Edit2,
  Trash2,
  ImageIcon,
} from "lucide-react";
import { AuthenticatedImage } from "../../components/AuthenticatedImage";
import { ConfirmationDialog } from "../../components/ConfirmationDialog";

function AddProductContent() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get('id');

  const [productForm, setProductForm] = useState<CreateProductPayload & { tagline?: string }>({
    name: '',
    description: '',
  });
  const [initialForm, setInitialForm] = useState<CreateProductPayload & { tagline?: string }>({
    name: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const dummyHistoryPushed = React.useRef(false);

  const [productImage, setProductImage] = useState<File | null>(null);
  const [productDocs, setProductDocs] = useState<File[]>([]);
  const [existingDocs, setExistingDocs] = useState<string[]>([]);
  const [existingImagePath, setExistingImagePath] = useState<string | null>(null);

  const [formErrors, setFormErrors] = useState<{ name?: string; description?: string; image?: string }>({});

  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isDraggingDocs, setIsDraggingDocs] = useState(false);

  const handleDragOver = (e: React.DragEvent, type: 'image' | 'docs') => {
    e.preventDefault();
    if (type === 'image') setIsDraggingImage(true);
    else setIsDraggingDocs(true);
  };

  const handleDragLeave = (type: 'image' | 'docs') => {
    if (type === 'image') setIsDraggingImage(false);
    else setIsDraggingDocs(false);
  };

  const handleDrop = (e: React.DragEvent, type: 'image' | 'docs') => {
    e.preventDefault();
    if (type === 'image') {
      setIsDraggingImage(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith('image/')) {
        setProductImage(file);
        if (formErrors.image) setFormErrors({ ...formErrors, image: undefined });
      } else {
        toast.error('Please drop an image file');
      }
    } else {
      setIsDraggingDocs(false);
      if (e.dataTransfer.files) {
        setProductDocs(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
      }
    }
  };

  const [showUploadPrompt, setShowUploadPrompt] = useState(false);
  const [uploadPromptProductId, setUploadPromptProductId] = useState<string | null>(null);
  const [uploadPromptDocs, setUploadPromptDocs] = useState<File[]>([]);

  const { products, createLoading, updateLoading, uploadLoading, loading: productsLoading } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    if (productId && user?.userId) {
      const product = products.find(p => p.id === productId);
      if (product) {
        const formData = {
          name: product.name,
          description: product.description
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
        e.returnValue = '';
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (isDirty && !isSubmitting) {
        // Prevent immediate navigation by pushing the current URL back onto the stack
        window.history.pushState(null, '', window.location.href);
        setIsConfirmDialogOpen(true);
      }
    };

    // Push an initial dummy state when form becomes dirty to enable interception
    if (isDirty && !isSubmitting && !dummyHistoryPushed.current) {
      window.history.pushState(null, '', window.location.href);
      dummyHistoryPushed.current = true;
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isDirty, isSubmitting]);

  const handleBack = () => {
    if (isDirty) {
      setIsConfirmDialogOpen(true);
    } else {
      router.push('/products');
    }
  };

  const validateForm = (): boolean => {
    const errors: { name?: string; description?: string; image?: string } = {};

    if (!productForm.name.trim()) {
      errors.name = 'Product name is required';
    } else if (productForm.name.trim().length < 3) {
      errors.name = 'Product name must be at least 3 characters';
    }

    if (!productForm.description.trim()) {
      errors.description = 'Description is required';
    } else if (productForm.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }

    if (!productId && !productImage) {
      errors.image = 'Product image is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleHandleAction = async () => {
    if (!validateForm()) {
        return;
    }

    const userId = user?.userId;
    if (!userId) return;

    setIsSubmitting(true);
    try {
        if (productId) {
            // Update mode
            const payload: UpdateProductPayload = {
                ...productForm,
                image: productImage || undefined
            };

            await dispatch(updateProduct({
                productId,
                userId,
                payload
            })).unwrap();

            if (productDocs.length > 0) {
                await dispatch(uploadProductFiles({
                    productId,
                    userId,
                    files: productDocs
                })).unwrap();
            }

            toast.success('Product updated successfully!');
            router.push('/products');
        } else {
            // Create mode
            const payload: CreateProductPayload = {
                ...productForm,
                image: productImage || undefined
            };

            const newProduct = await dispatch(createProduct({ userId, payload })).unwrap();

            if (productDocs.length > 0) {
                await dispatch(uploadProductFiles({
                    productId: newProduct.id,
                    userId,
                    files: productDocs
                })).unwrap();
            }

            toast.success('Product added successfully!');
            
            const newProductId = newProduct.id;
            if (productDocs.length === 0) {
                setUploadPromptProductId(newProductId);
                setShowUploadPrompt(true);
            } else {
                 router.push('/products');
            }
        }
    } catch (error: any) {
        toast.error(error || 'Failed to save product');
        setIsSubmitting(false);
    }
  };

  const getPreviewImageUrl = () => {
      if (productImage) {
          return URL.createObjectURL(productImage);
      }
      if (existingImagePath) {
           return `${getBaseUrl()}${endpoints.getProductImage(productId || '')}`;
      }
      return null;
  };

  const previewImage = getPreviewImageUrl();

  return (
    <div className="min-h-screen bg-background-light text-slate-900 transition-colors duration-300">
        
        {/* Header - Matching add-lead style roughly but keeping the new HTML structure */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleBack}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <div className="h-6 w-px bg-slate-200"></div>
                    <div>
                        <h1 className="text-lg font-semibold">{productId ? 'Edit Product' : 'New Product Showcase'}</h1>
                        <p className="text-xs text-slate-500">Drafting your strategic offering</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {/* <button 
                        onClick={() => router.push('/products')}
                        className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-gray-300"
                    >
                        Discard Draft
                    </button> */}
                    <button 
                        onClick={handleHandleAction}
                        disabled={createLoading || updateLoading || uploadLoading}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm shadow-blue-500/20 transition-all flex items-center gap-2"
                    >
                        {(createLoading || updateLoading || uploadLoading) && (
                             <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                        {productId ? 'Update Product' : 'Publish Product'}
                    </button>
                </div>
            </div>
        </header>

        <main className="max-w-[1280px] mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                    {/* Section 1: Product Details */}
                    <section>
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-[#111318]">
                            <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">1</span>
                            Product Details
                        </h2>
                        <div className="space-y-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="space-y-1.5">
                                <label className="text-[10px] lg:text-[11px] font-bold text-[#606e8a] uppercase tracking-wider">
                                    Product Name <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text"
                                    value={productForm.name}
                                    onChange={(e) => {
                                        setProductForm({ ...productForm, name: e.target.value });
                                        if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                                    }}
                                    className={`w-full px-3 py-2 rounded-lg border ${formErrors.name ? 'border-red-500' : 'border-gray-200'} bg-slate-50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm lg:text-[13px]`}
                                    placeholder="e.g. Strategic Growth Suite"
                                />
                                {formErrors.name && <p className="text-red-500 text-[10px] mt-1">{formErrors.name}</p>}
                            </div>
                            
                            {/* <div className="space-y-1.5">
                                <label className="text-[10px] lg:text-[11px] font-bold text-[#606e8a] uppercase tracking-wider">
                                    Tagline <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text"
                                    value={tagline}
                                    onChange={(e) => setTagline(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-slate-50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm lg:text-[13px]"
                                    placeholder="A short, catchy one-liner"
                                />
                            </div> */}

                            <div className="space-y-1.5">
                                <label className="text-[10px] lg:text-[11px] font-bold text-[#606e8a] uppercase tracking-wider">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <div className="border border-gray-200 rounded-xl overflow-hidden bg-slate-50">
                                    {/* Simple Toolbar */}
                                    <div className="flex items-center gap-1 p-1.5 border-b border-gray-200 bg-white">
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                const textarea = document.getElementById('description-input') as HTMLTextAreaElement;
                                                if (!textarea) return;
                                                
                                                const start = textarea.selectionStart;
                                                const end = textarea.selectionEnd;
                                                const text = productForm.description;
                                                const before = text.substring(0, start);
                                                const selection = text.substring(start, end);
                                                const after = text.substring(end);
                                                
                                                const newText = `${before}**${selection}**${after}`;
                                                setProductForm({ ...productForm, description: newText });
                                                
                                                // Wait for state update then restore focus logic could be added here
                                                setTimeout(() => {
                                                    textarea.focus();
                                                    textarea.setSelectionRange(start + 2, end + 2);
                                                }, 0);
                                            }}
                                            className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-700 transition-colors"
                                            title="Bold"
                                        >
                                            <span className="material-symbols-outlined text-sm font-bold">format_bold</span>
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                const textarea = document.getElementById('description-input') as HTMLTextAreaElement;
                                                if (!textarea) return;
                                                
                                                const start = textarea.selectionStart;
                                                const end = textarea.selectionEnd;
                                                const text = productForm.description;
                                                const before = text.substring(0, start);
                                                const selection = text.substring(start, end);
                                                const after = text.substring(end);
                                                
                                                const newText = `${before}*${selection}*${after}`;
                                                setProductForm({ ...productForm, description: newText });
                                                
                                                setTimeout(() => {
                                                    textarea.focus();
                                                    textarea.setSelectionRange(start + 1, end + 1);
                                                }, 0);
                                            }}
                                            className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-700 transition-colors"
                                            title="Italic"
                                        >
                                            <span className="material-symbols-outlined text-sm font-bold">format_italic</span>
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                const textarea = document.getElementById('description-input') as HTMLTextAreaElement;
                                                if (!textarea) return;
                                                
                                                const start = textarea.selectionStart;
                                                const text = productForm.description;
                                                const before = text.substring(0, start);
                                                const after = text.substring(start);
                                                
                                                // Simple list insertion at cursor
                                                const newText = `${before}\n- ${after}`;
                                                setProductForm({ ...productForm, description: newText });
                                                
                                                setTimeout(() => {
                                                    textarea.focus();
                                                    textarea.setSelectionRange(start + 3, start + 3);
                                                }, 0);
                                            }}
                                            className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-700 transition-colors"
                                            title="Bullet List"
                                        >
                                            <span className="material-symbols-outlined text-sm font-bold">format_list_bulleted</span>
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                const textarea = document.getElementById('description-input') as HTMLTextAreaElement;
                                                if (!textarea) return;
                                                
                                                const start = textarea.selectionStart;
                                                const end = textarea.selectionEnd;
                                                const text = productForm.description;
                                                const before = text.substring(0, start);
                                                const selection = text.substring(start, end);
                                                const after = text.substring(end);
                                                
                                                const newText = `${before}[${selection || 'link text'}](url)${after}`;
                                                setProductForm({ ...productForm, description: newText });

                                                setTimeout(() => {
                                                    textarea.focus();
                                                    // highlight 'url' part
                                                    const linkStart = start + (selection ? selection.length : 9) + 3; 
                                                    textarea.setSelectionRange(linkStart, linkStart + 3);
                                                }, 0);
                                            }}
                                            className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-700 transition-colors"
                                            title="Insert Link"
                                        >
                                            <span className="material-symbols-outlined text-sm font-bold">link</span>
                                        </button>
                                    </div>
                                    <textarea 
                                        id="description-input"
                                        value={productForm.description}
                                        onChange={(e) => {
                                            setProductForm({ ...productForm, description: e.target.value });
                                            if (formErrors.description) setFormErrors({ ...formErrors, description: undefined });
                                        }}
                                        className={`w-full px-4 py-3 bg-transparent border-none focus:ring-0 resize-none outline-none text-sm lg:text-[13px]`} 
                                        placeholder="Briefly describe what this product does..." 
                                        rows={12}
                                    />
                                </div>
                                {formErrors.description && <p className="text-red-500 text-[10px] mt-1">{formErrors.description}</p>}
                            </div>
                        </div>
                    </section>
                </div>

                <div className="space-y-8">
                    {/* Section 2: Assets & Media */}
                    <section>
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-[#111318]">
                            <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">2</span>
                            Assets & Media
                        </h2>
                        <div className="space-y-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="space-y-1.5">
                                <label className="text-[10px] lg:text-[11px] font-bold text-[#606e8a] uppercase tracking-wider">
                                    Product Image <span className="text-red-500">*</span>
                                </label>
                                <div 
                                    onDragOver={(e) => handleDragOver(e, 'image')}
                                    onDragLeave={() => handleDragLeave('image')}
                                    onDrop={(e) => handleDrop(e, 'image')}
                                    className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed ${formErrors.image ? 'border-red-300 bg-red-50/50' : isDraggingImage ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-blue-500/50 hover:bg-blue-50/30'} rounded-2xl transition-all cursor-pointer group`}
                                >
                                    <div className="flex flex-col items-center pointer-events-none w-full h-full justify-center">
                                        {previewImage ? (
                                            <div className="relative w-full h-full p-2 flex flex-col items-center justify-center pointer-events-auto">
                                                {productImage ? (
                                                    <img src={previewImage} alt="Preview" className="h-32 w-auto object-contain rounded-lg shadow-sm" />
                                                ) : (
                                                    <AuthenticatedImage 
                                                        src={previewImage} 
                                                        alt="Preview" 
                                                        className="h-32 w-auto object-contain rounded-lg shadow-sm" 
                                                    />
                                                )}
                                                <div className="absolute inset-x-0 bottom-2 text-center">
                                                    <span className="inline-block px-2 py-1 bg-black/50 text-white text-[10px] rounded-md backdrop-blur-sm truncate max-w-[90%]">
                                                        {productImage ? productImage.name : (existingImagePath ? existingImagePath.split('/').pop() : 'Image')}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <Cloud className="w-8 h-8 text-slate-400 mb-2 group-hover:scale-110 transition-transform" />
                                                <p className="text-sm font-medium text-slate-600">Click or drag image here</p>
                                                <p className="text-[10px] text-slate-400 mt-1">PNG, JPG or WEBP (Max 2MB)</p>
                                            </>
                                        )}
                                    </div>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              setProductImage(file);
                                              if (formErrors.image) setFormErrors({ ...formErrors, image: undefined });
                                            }
                                        }}
                                        className="absolute inset-0 opacity-0 cursor-pointer" 
                                    />
                                    {(productImage || (existingImagePath && productId)) && (
                                        <button 
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setProductImage(null);
                                                setExistingImagePath(null);
                                            }}
                                            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:text-red-500 z-10 hover:bg-slate-100 transition-colors"
                                            title="Remove Image"
                                            type="button"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                {formErrors.image && <p className="text-red-500 text-[10px] mt-1">{formErrors.image}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] lg:text-[11px] font-bold text-[#606e8a] uppercase tracking-wider">
                                    Resource Documents
                                </label>
                                <div 
                                    onDragOver={(e) => handleDragOver(e, 'docs')}
                                    onDragLeave={() => handleDragLeave('docs')}
                                    onDrop={(e) => handleDrop(e, 'docs')}
                                    className={`relative flex flex-col items-center justify-center w-full min-h-[10rem] border-2 border-dashed ${isDraggingDocs ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-blue-500/50 hover:bg-blue-50/30'} rounded-2xl transition-all cursor-pointer`}
                                >
                                    <div className="flex flex-col items-center pointer-events-none py-4">
                                        <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                        <p className="text-sm font-medium text-slate-600">Click or drag documents here</p>
                                        <p className="text-[10px] text-slate-400 mt-1">PDF, DOCX (Max 10MB)</p>
                                    </div>
                                    <input 
                                        type="file" 
                                        multiple
                                        onChange={(e) => {
                                            if (e.target.files) {
                                                setProductDocs(prev => [...prev, ...Array.from(e.target.files || [])]);
                                            }
                                        }}
                                        className="absolute inset-0 opacity-0 cursor-pointer" 
                                    />
                                </div>
                                
                                {/* Document List */}
                                <div className="space-y-2 mt-4 max-h-[200px] overflow-y-auto custom-scrollbar">
                                    {/* New Documents */}
                                    {productDocs.map((file, index) => (
                                        <div key={`new-${index}`} className="flex justify-between items-center p-2 bg-blue-50/50 border border-blue-100 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="p-1.5 bg-white rounded-md">
                                                    <FileText className="w-4 h-4 text-blue-500" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-medium text-slate-700 truncate max-w-[200px]">{file.name}</span>
                                                    <span className="text-[9px] text-blue-500 font-bold uppercase">New Upload</span>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => setProductDocs(prev => prev.filter((_, i) => i !== index))}
                                                className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    
                                    {/* Existing Documents */}
                                    {existingDocs.map((path, index) => (
                                        <div key={`existing-${index}`} className="flex justify-between items-center p-2 bg-slate-50 border border-slate-100 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="p-1.5 bg-white rounded-md">
                                                     <FileText className="w-4 h-4 text-slate-500" />
                                                </div>
                                                 <div className="flex flex-col">
                                                    <span className="text-xs font-medium text-slate-700 truncate max-w-[200px]">{path.split('/').pop()}</span>
                                                    <span className="text-[9px] text-slate-400 font-bold uppercase">Existing</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>

        {/* Floating Action Button for Mobile */}
        <div className="fixed bottom-6 right-6 lg:hidden">
            <button 
                onClick={handleHandleAction}
                className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-500/40 flex items-center justify-center hover:bg-blue-700 transition-colors"
            >
                {/* <Check className="w-6 h-6" /> */}
                <span className="material-icons-outlined">check</span>
            </button>
        </div>

         {/* Product Document Upload Prompt Modal */}
         {showUploadPrompt && (
          <div className="fixed inset-0 bg-gray-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden flex flex-col">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Product Created!</h3>
              <p className="text-gray-500 text-sm mb-6 text-center">
                Your product has been added successfully. Would you like to upload any supporting documents now?
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
                    className="flex items-center gap-3 w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-100 transition-all border-dashed"
                  >
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-500 text-sm font-medium">
                      {uploadPromptDocs.length > 0
                        ? `${uploadPromptDocs.length} files selected`
                        : "Click to select documents"}
                    </span>
                  </label>
                </div>

                {uploadPromptDocs.length > 0 && (
                  <div className="max-h-32 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {uploadPromptDocs.map((file, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-blue-50/30 rounded-lg border border-blue-100 text-xs">
                        <span className="truncate text-gray-600">{file.name}</span>
                        <button
                          onClick={() => setUploadPromptDocs(prev => prev.filter((_, i) => i !== index))}
                          className="text-gray-400 hover:text-red-500"
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
                        router.push('/products');
                    }}
                    className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all"
                    disabled={uploadLoading}
                  >
                    Skip for now
                  </button>
                  <button
                    onClick={async () => {
                         if (!uploadPromptProductId || uploadPromptDocs.length === 0) return;
                         const userId = user?.userId;
                         if (!userId) return;
                     
                         try {
                           await dispatch(uploadProductFiles({
                             productId: uploadPromptProductId,
                             userId,
                             files: uploadPromptDocs
                           })).unwrap();
                     
                           toast.success('Documents uploaded successfully!');
                           setShowUploadPrompt(false);
                           router.push('/products');
                         } catch (error: any) {
                           toast.error(error || 'Failed to upload documents');
                         }
                    }}
                    disabled={uploadLoading || uploadPromptDocs.length === 0}
                    className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            router.push('/products');
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
        <Suspense fallback={<div>Loading...</div>}>
            <AddProductContent />
        </Suspense>
    );
}
