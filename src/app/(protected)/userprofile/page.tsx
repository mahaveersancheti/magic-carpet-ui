"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";
import { fetchProductsByUserId, createProduct, updateProduct, deleteProduct, CreateProductPayload, Product } from "../../redux/slices/ProductSlice";
import { getBaseUrl } from "../../services/apiService";
import toast from 'react-hot-toast';
import { useUser } from '../../hooks/useUser';
import {
  Mail,
  Phone,
  Link2,
  Share2,
  MoreHorizontal,
  CloudUpload,
  Download,
  Plus,
  X,
  Edit2,
  Globe,
  Calendar,
  Facebook,
  Linkedin,
  Twitter,
  Instagram,
  Trash2,
  LayoutGrid,
  List,
} from "lucide-react";

export default function UserProfile() {
  const dispatch = useDispatch<AppDispatch>();

  const { user } = useUser();
  const [userData, setUserData] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCsF819KQIZRWOc4COafT_vJqvIQ5rcdJ_nMnsTyj1BqbAkXU20i4PmkOx2i2pwT3b7ogKzv4W4tCuYok6rOSrDyxRPEpMHWT9aVJUY1FdWhg25NK0wqqpO7hpbAgh6czPzpu50wq_JWIfQvpDrYDoYYbCKJdM0Cq6WBMkWKcoc4qg0cSvgEGD2ZDLR8cjqxgZkcc6Qn3xnja0PJGj7gPMFVUWH1RLu0S6g5CN5NU02RnANCarAaASXlUd6B19ybkl0Ppmg1WnKCsxw",
  });

  useEffect(() => {
    if (user) {
      setUserData(prev => ({
        ...prev,
        name: user.name || prev.name,
        title: user.designation && user.companyName
          ? `${user.designation} @ ${user.companyName}`
          : user.designation || prev.title,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  const [showUploadOverlay, setShowUploadOverlay] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<CreateProductPayload>({
    name: '',
    description: ''
  });
  const [formErrors, setFormErrors] = useState<{ name?: string; description?: string }>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Get products from Redux store
  const { products, loading: productsLoading, createLoading, updateLoading, deleteLoading, error: productsError } = useSelector(
    (state: RootState) => state.products
  );
  const { selectedProfile } = useSelector((state: RootState) => state.profiles);

  // Fetch products when component mounts or when selectedProfile changes
  useEffect(() => {
    const targetUserId = selectedProfile?.id || user?.userId;
    if (targetUserId) {
      dispatch(fetchProductsByUserId(targetUserId));
    }
  }, [dispatch, selectedProfile?.id, user?.userId]);

  // Validate form
  const validateForm = (): boolean => {
    const errors: { name?: string; description?: string } = {};

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

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submit
  const handleAddProduct = async () => {
    if (!validateForm()) {
      return;
    }

    const userId = selectedProfile?.id || user?.userId;
    if (!userId) return;

    try {
      await dispatch(createProduct({ userId, payload: productForm })).unwrap();
      toast.success('Product added successfully!');
      setShowAddProductModal(false);
      setProductForm({ name: '', description: '' });
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
    setFormErrors({});
    setShowAddProductModal(true);
  };

  // Handle update product
  const handleUpdateProduct = async () => {
    if (!validateForm() || !editingProduct) {
      return;
    }

    const userId = selectedProfile?.id || user?.userId;
    if (!userId) return;

    try {
      await dispatch(updateProduct({
        productId: editingProduct.id,
        userId,
        payload: productForm
      })).unwrap();
      toast.success('Product updated successfully!');
      setShowAddProductModal(false);
      setEditingProduct(null);
      setProductForm({ name: '', description: '' });
      setFormErrors({});
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

    const userId = selectedProfile?.id || user?.userId;
    if (!userId) return;

    try {
      await dispatch(deleteProduct({ productId: deletingProductId, userId })).unwrap();
      toast.success('Product deleted successfully!');
      setDeletingProductId(null);
    } catch (error: any) {
      toast.error(error || 'Failed to delete product');
    }
  };



  const files = [
    { name: "Document1.pdf", size: "2.1 MB", type: "pdf" },
    { name: "Document2.docx", size: "856 KB", type: "doc" },
  ];

  const quickLinks = [
    { label: "My Portfolio", href: "#portfolio", icon: Globe },
    { label: "Book a Meeting", href: "#meeting", icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-transparent py-6 px-4 sm:px-6 lg:px-8 pt-20 lg:pt-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-4 space-y-4">
            {/* Profile Card */}
            <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100 transition-all duration-200 relative overflow-hidden">
              {/* Subtle background element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50" />

              <div className="relative z-10 flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden ring-4 ring-blue-50 shadow-md">
                    <img
                      src={userData.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <h2 className="font-bold text-2xl text-gray-900 mb-1">
                  {userData.name}
                </h2>
                <p className="text-blue-600 font-bold text-sm mb-6 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  {userData.title}
                </p>

                <div className="flex gap-3">
                  {[
                    { Icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com" },
                    { Icon: Twitter, label: "Twitter", href: "https://twitter.com" },
                  ].map(({ Icon, label, href }, i) => (
                    <a
                      key={i}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm"
                      aria-label={label}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  ))}
                  <button
                    className="p-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-600 hover:text-gray-900 hover:bg-white hover:border-gray-200 transition-all shadow-sm"
                    aria-label="Share"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100">
              <h3 className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-4">
                Overview
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-1">Products</p>
                  <p className="text-xl font-black text-gray-900">{products.length}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-1">Status</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <p className="text-xs font-bold text-gray-900 tracking-tight">Active</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info Card */}
            <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100">
              <h3 className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-4">
                Contact Information
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-colors group">
                  <div className="p-2 rounded-lg bg-white shadow-sm border border-gray-100 text-blue-600 group-hover:scale-110 transition-transform">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-tight">Email</p>
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {userData.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-colors group">
                  <div className="p-2 rounded-lg bg-white shadow-sm border border-gray-100 text-blue-600 group-hover:scale-110 transition-transform">
                    <Phone className="w- 4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-tight">Phone</p>
                    <p className="text-sm font-bold text-gray-900">
                      {userData.phone || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-8 space-y-4">
            {/* Product Showcase Card */}
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
                    const imageUrl = product.filePaths && product.filePaths.length > 0
                      ? `${getBaseUrl().replace('/api/', '')}${product.filePaths[0]}`
                      : '/Image-not-found.png';

                    if (viewMode === 'list') {
                      return (
                        <div
                          key={product.id}
                          className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-blue-200 hover:shadow-lg transition-all duration-300 flex items-center p-4"
                        >
                          <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                            <img
                              src={imageUrl}
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
                          <img
                            src={imageUrl}
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
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
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
              setFormErrors({});
            }}
          >
            <div
              className="bg-white rounded-3xl w-full max-w-lg border border-gray-100 shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
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
                      setFormErrors({});
                    }}
                    className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

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
                </div>

                <div className="flex gap-4 mt-10">
                  <button
                    onClick={() => {
                      setShowAddProductModal(false);
                      setEditingProduct(null);
                      setProductForm({ name: '', description: '' });
                      setFormErrors({});
                    }}
                    className="flex-1 h-12 px-6 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98] disabled:opacity-50"
                    disabled={createLoading || updateLoading}
                  >
                    Cancel
                  </button>

                  <button
                    onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                    disabled={createLoading || updateLoading}
                    className="flex-[2] h-12 px-6 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {(createLoading || updateLoading) ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{editingProduct ? 'Updating...' : 'Adding...'}</span>
                      </>
                    ) : (
                      <span>{editingProduct ? 'Update Product' : 'Add Product'}</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {deletingProductId && (
          <div
            className="fixed inset-0 bg-gray-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm transition-opacity"
            onClick={() => setDeletingProductId(null)}
          >
            <div
              className="bg-white rounded-3xl w-full max-w-md border border-gray-100 shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Delete Product
                </h3>
                <p className="text-gray-600 leading-relaxed mb-8">
                  Are you sure you want to delete <span className="font-bold text-gray-900">"{products.find(p => p.id === deletingProductId)?.name}"</span>? This action cannot be undone and will remove all associated data.
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={() => setDeletingProductId(null)}
                    className="flex-1 h-12 px-6 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98] disabled:opacity-50"
                    disabled={deleteLoading}
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleDeleteConfirm}
                    disabled={deleteLoading}
                    className="flex-1 h-12 px-6 bg-red-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-500/20 hover:bg-red-600 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {deleteLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <span>Delete</span>
                    )}
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