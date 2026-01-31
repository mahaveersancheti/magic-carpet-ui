"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";
import { fetchProductsByUserId, createProduct, updateProduct, deleteProduct, uploadProductFiles, CreateProductPayload, UpdateProductPayload, Product } from "../../redux/slices/ProductSlice";
import { getBaseUrl, api } from "../../services/apiService";
import { endpoints } from "../../lib/endpoints";
import toast from 'react-hot-toast';
import { useUser } from '../../hooks/useUser';
import {
  Download,
  Plus,
  X,
  Edit2,
  Trash2,
  LayoutGrid,
  List,
  Upload,
  FileText,
  Eye,
} from "lucide-react";
import { AuthenticatedImage } from "../../components/AuthenticatedImage";

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useUser();

  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<CreateProductPayload>({
    name: '',
    description: ''
  });
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productDocs, setProductDocs] = useState<File[]>([]);

  const [formErrors, setFormErrors] = useState<{ name?: string; description?: string; image?: string }>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // State for missing documents prompt after adding product
  const [showUploadPrompt, setShowUploadPrompt] = useState(false);
  const [uploadPromptProductId, setUploadPromptProductId] = useState<string | null>(null);
  const [uploadPromptDocs, setUploadPromptDocs] = useState<File[]>([]);

  const getProductImageUrl = (productId: string) => {
    return `${getBaseUrl()}${endpoints.getProductImage(productId)}`;
  };

  const handleViewDoc = async (path: string, productId: string) => {
    const fileName = path.split(/[\/\\]/).pop();
    if (!fileName) return;

    try {
      const fullUrl = `${getBaseUrl()}${endpoints.getProductFile(productId, fileName)}`;
      const response = await fetch(fullUrl, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 404) {
        toast.error('Document not found');
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch document');

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      window.open(objectUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error viewing document:', error);
      toast.error('Failed to open document');
    }
  };

  // Get products from Redux store
  const { products, loading: productsLoading, createLoading, updateLoading, deleteLoading, uploadLoading, error: productsError } = useSelector(
    (state: RootState) => state.products
  );
  
  // Fetch products when component mounts
  useEffect(() => {
    if (user?.userId) {
      dispatch(fetchProductsByUserId(user.userId));
    }
  }, [dispatch, user?.userId]);

  // Validate form
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

    if (!editingProduct && !productImage) {
      errors.image = 'Product image is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDownloadTemplate = async () => {
    try {
      const blob = await api.download(endpoints.downloadProductTemplate);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'product_template.txt');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Template downloaded successfully');
    } catch (error: any) {
      toast.error('Failed to download template');
      console.error(error);
    }
  };

  // Handle form submit
  const handleAddProduct = async () => {
    if (!validateForm()) {
      return;
    }

    const userId = user?.userId;
    if (!userId) return;

    try {
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
      setShowAddProductModal(false);
      
      const newProductId = newProduct.id;
      
      // If no documents were uploaded, show the prompt
      if (productDocs.length === 0) {
        setUploadPromptProductId(newProductId);
        setShowUploadPrompt(true);
      }

      setProductForm({ name: '', description: '' });
      setProductImage(null);
      setProductDocs([]);
      setFormErrors({});
      // Refresh products list
      dispatch(fetchProductsByUserId(userId));
    } catch (error: any) {
      toast.error(error || 'Failed to add product');
    }
  };

  // Handle edit click
  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description
    });
    setProductImage(null);
    setProductDocs([]);
    setFormErrors({});
    setShowAddProductModal(true);
  };

  // Handle update product
  const handleUpdateProduct = async () => {
    if (!validateForm() || !editingProduct) {
      return;
    }

    const userId = user?.userId;
    if (!userId) return;

    try {
      const payload: UpdateProductPayload = {
        ...productForm,
        image: productImage || undefined
      };

      await dispatch(updateProduct({
        productId: editingProduct.id,
        userId,
        payload
      })).unwrap();

      if (productDocs.length > 0) {
        await dispatch(uploadProductFiles({
          productId: editingProduct.id,
          userId,
          files: productDocs
        })).unwrap();
      }

      toast.success('Product updated successfully!');
      setShowAddProductModal(false);
      setEditingProduct(null);
      setProductForm({ name: '', description: '' });
      setProductImage(null);
      setProductDocs([]);
      setFormErrors({});
      // Refresh products list
      dispatch(fetchProductsByUserId(userId));
    } catch (error: any) {
      toast.error(error || 'Failed to update product');
    }
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
      await dispatch(deleteProduct({ productId: deletingProductId, userId })).unwrap();
      toast.success('Product deleted successfully!');
      setDeletingProductId(null);
    } catch (error: any) {
      toast.error(error || 'Failed to delete product');
    }
  };
  // Handle prompt skip
  const handlePromptSkip = () => {
    setShowUploadPrompt(false);
    setUploadPromptProductId(null);
    setUploadPromptDocs([]);
  };

  // Handle prompt upload
  const handlePromptUpload = async () => {
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
      handlePromptSkip();
      // Refresh products list to show new document count
      dispatch(fetchProductsByUserId(userId));
    } catch (error: any) {
      toast.error(error || 'Failed to upload documents');
    }
  };

  return (
    <div className="min-h-screen bg-transparent py-6 px-4 sm:px-6 lg:px-8 pt-20 lg:pt-10">
      <div className="mx-auto max-w-7xl">
        <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100 transition-all duration-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Product Showcase</h3>
              <p className="text-xs text-gray-500 mt-1">Manage and display your strategic offerings</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleDownloadTemplate}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-blue-600 font-bold rounded-xl transition-all shadow-sm active:scale-95 text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                {/* Download */}
              </button>
              <button
                onClick={() => setShowAddProductModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95 text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Product
              </button>
            </div>
          </div>

          {productsLoading ? (
            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-4"}>
              {[1, 2].map((i) => (
                <div key={i} className={`border border-gray-100 rounded-2xl bg-white overflow-hidden animate-pulse ${viewMode === 'list' ? 'flex items-center p-4' : ''}`}>
                  <div className={viewMode === 'grid' ? "w-full h-48 bg-gray-50" : "w-32 h-32 rounded-xl bg-gray-50 shrink-0"} />
                  <div className={`${viewMode === 'grid' ? 'p-6' : 'ml-4 flex-1'} space-y-3`}>
                    <div className="h-6 bg-gray-50 rounded-lg w-3/4" />
                    <div className="h-4 bg-gray-50 rounded-lg w-full" />
                    <div className="h-4 bg-gray-50 rounded-lg w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : productsError ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-red-500 font-bold mb-2">Request Failed</p>
              <p className="text-sm text-gray-600">{productsError}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-300" />
              </div>
              <h4 className="text-gray-900 font-bold mb-1">No products yet</h4>
              <p className="text-sm text-gray-500 mb-6">Start highlighting your core solutions here</p>
              <button
                onClick={() => setShowAddProductModal(true)}
                className="text-blue-600 font-bold text-sm hover:underline"
              >
                Create your first product
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-4"}>
              {products.map((product) => {

                if (viewMode === 'list') {
                  return (
                    <div
                      key={product.id}
                      className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-blue-200 hover:shadow-lg transition-all duration-300 flex items-center p-4"
                    >
                      <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                        <AuthenticatedImage
                          src={getProductImageUrl(product.id)}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="ml-5 flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                            {product.name}
                          </h4>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleEditClick(product); }}
                              className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteClick(product.id); }}
                              className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mt-1">
                          {product.description}
                        </p>
                        {product.filePaths && product.filePaths.length > 0 ? (
                          <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg w-fit">
                            <FileText className="w-3 h-3" />
                            {product.filePaths.length} Document{product.filePaths.length > 1 ? 's' : ''}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg w-fit border border-amber-100">
                            <FileText className="w-3 h-3 text-amber-400" />
                            No documents uploaded
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={product.id}
                    className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-blue-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col"
                  >
                    <div className="relative h-48 overflow-hidden bg-gray-50">
                      <AuthenticatedImage
                        src={getProductImageUrl(product.id)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      {/* Actions Overlay */}
                      <div className="absolute top-3 right-3 flex gap-2 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEditClick(product); }}
                          className="p-2.5 rounded-xl bg-white/95 text-gray-600 hover:text-blue-600 hover:bg-white shadow-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteClick(product.id); }}
                          className="p-2.5 rounded-xl bg-white/95 text-gray-600 hover:text-red-500 hover:bg-white shadow-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col">
                      <h4 className="font-bold text-base text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed flex-1">
                        {product.description}
                      </p>
                      {product.filePaths && product.filePaths.length > 0 ? (
                        <div className="flex items-center gap-1.5 mt-3 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg w-fit">
                          <FileText className="w-3 h-3" />
                          {product.filePaths.length} Document{product.filePaths.length > 1 ? 's' : ''}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 mt-3 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg w-fit border border-amber-100">
                          <FileText className="w-3 h-3 text-amber-400" />
                          No documents uploaded
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Upload Modal */}
        {/* Add Product Modal */}
        {showAddProductModal && (
          <div
            className="fixed inset-0 bg-gray-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm transition-opacity"
            onClick={() => {
              setShowAddProductModal(false);
              setEditingProduct(null);
              setProductForm({ name: '', description: '' });
              setProductImage(null);
              setProductDocs([]);
              setFormErrors({});
            }}
          >
            <div
              className="bg-white rounded-3xl w-full max-w-lg border border-gray-100 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center shrink-0 bg-white z-10">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Provide the details for your strategic offering</p>
                </div>

                <button
                  onClick={() => {
                    setShowAddProductModal(false);
                    setEditingProduct(null);
                    setProductForm({ name: '', description: '' });
                    setProductImage(null);
                    setProductDocs([]);
                    setFormErrors({});
                  }}
                  className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                <div className="space-y-6">
                  {/* Product Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      autoFocus
                      value={productForm.name}
                      onChange={(e) => {
                        setProductForm({ ...productForm, name: e.target.value });
                        if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                      }}
                      className={`w-full px-5 py-3.5 bg-gray-50 border ${formErrors.name ? 'border-red-500' : 'border-gray-200'} rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white transition-all text-gray-900 placeholder:text-gray-400`}
                      placeholder="e.g. Strategic Growth Suite"
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-xs font-bold mt-1 px-1">{formErrors.name}</p>
                    )}
                  </div>

                  {/* Product Description */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) => {
                        setProductForm({ ...productForm, description: e.target.value });
                        if (formErrors.description) setFormErrors({ ...formErrors, description: undefined });
                      }}
                      className={`w-full px-5 py-3.5 bg-gray-50 border ${formErrors.description ? 'border-red-500' : 'border-gray-200'} rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:bg-white transition-all text-gray-900 placeholder:text-gray-400 resize-none`}
                      placeholder="Briefly describe what this product does..."
                      rows={5}
                    />
                    {formErrors.description && (
                      <p className="text-red-500 text-xs font-bold mt-1 px-1">{formErrors.description}</p>
                    )}
                  </div>

                  {/* Product Image */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      Product Image <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
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
                        className="hidden"
                        id="product-image-upload"
                      />
                      <label
                        htmlFor="product-image-upload"
                        className={`flex items-center gap-3 w-full px-5 py-3.5 bg-gray-50 border ${formErrors.image ? 'border-red-500' : 'border-gray-200'} rounded-2xl cursor-pointer hover:bg-gray-100 transition-all border-dashed`}
                      >
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-500 text-sm font-medium">
                          {productImage ? productImage.name : (editingProduct?.imagePath ? editingProduct.imagePath.split('/').pop() : "Click to upload image")}
                        </span>
                      </label>
                      {productImage && (
                        <button
                          onClick={() => setProductImage(null)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-200 rounded-full text-gray-400 hover:text-red-500 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    {formErrors.image && (
                      <p className="text-red-500 text-xs font-bold mt-1 px-1">{formErrors.image}</p>
                    )}
                  </div>

                  {/* Product Documents */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      Product Documents
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        multiple
                        onChange={(e) => {
                          if (e.target.files) {
                            setProductDocs(Array.from(e.target.files));
                          }
                        }}
                        className="hidden"
                        id="product-docs-upload"
                      />
                      <label
                        htmlFor="product-docs-upload"
                        className="flex items-center gap-3 w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-100 transition-all border-dashed"
                      >
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-500 text-sm font-medium">
                          {productDocs.length > 0
                            ? `${productDocs.length} new files selected`
                            : (editingProduct?.filePaths && editingProduct.filePaths.length > 0
                              ? `${editingProduct.filePaths.length} existing documents found`
                              : "Click to upload documents")}
                        </span>
                      </label>
                    </div>
                    {(productDocs.length > 0 || (editingProduct?.filePaths && editingProduct.filePaths.length > 0)) && (
                      <div className="space-y-2 mt-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar border-t border-gray-100 pt-4">
                        {/* New Documents */}
                        {productDocs.map((file, index) => (
                          <div key={`new-${index}`} className="flex justify-between items-center p-2 bg-blue-50/30 rounded-lg border border-blue-100 text-sm">
                            <div className="flex items-center gap-2 truncate">
                              <span className="text-[10px] font-bold text-blue-600 uppercase">NEW</span>
                              <span className="truncate text-gray-600">{file.name}</span>
                            </div>
                            <button
                              onClick={() => setProductDocs(prev => prev.filter((_, i) => i !== index))}
                              className="text-gray-400 hover:text-red-500 shrink-0 ml-2"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        {/* Existing Documents */}
                        {editingProduct?.filePaths?.map((path, index) => (
                          <div key={`existing-${index}`} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                            <div className="flex items-center gap-2 truncate">
                              <span className="truncate text-gray-400">{path.split('/').pop()}</span>
                              <span className="text-[8px] font-bold text-gray-300 uppercase shrink-0">Existing</span>
                            </div>
                            <button
                              onClick={() => handleViewDoc(path, editingProduct.id)}
                              className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-blue-600 transition-all"
                              title="View Document"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {/* Modal Footer */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowAddProductModal(false);
                      setEditingProduct(null);
                      setProductForm({ name: '', description: '' });
                      setProductImage(null);
                      setProductDocs([]);
                      setFormErrors({});
                    }}
                    className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={createLoading || updateLoading || uploadLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                    disabled={createLoading || updateLoading || uploadLoading}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {(createLoading || updateLoading || uploadLoading) && (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    {editingProduct ? 'Save Changes' : 'Create Product'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {deletingProductId && (
          <div className="fixed inset-0 bg-gray-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl scale-100 animate-in fade-in zoom-in duration-200">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Product?</h3>
              <p className="text-gray-500 text-sm mb-6">
                Are you sure you want to delete this product? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeletingProductId(null)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleteLoading}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                    onClick={handlePromptSkip}
                    className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all"
                    disabled={uploadLoading}
                  >
                    Skip for now
                  </button>
                  <button
                    onClick={handlePromptUpload}
                    disabled={uploadLoading || uploadPromptDocs.length === 0}
                    className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {uploadLoading && (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
