import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Download, Trash2, Edit } from 'lucide-react';
import NeomorphicTable from '../../components/NeomorphicTable';
import NeomorphicButton from '../../components/NeomorphicButton';
import NeomorphicInput from '../../components/NeomorphicInput';
import { fetchProducts, deleteProduct } from '../../features/products/productSlice';
import type { Product } from '../../features/products/productSlice';
import type { AppDispatch, RootState } from '../../redux/store';
import toast from 'react-hot-toast';

const ProductList: React.FC = () => {
  const dispatch  = useDispatch<AppDispatch>();
  const navigate  = useNavigate();
  const { products, loading } = useSelector((state: RootState) => state.products);
  const { user }              = useSelector((state: RootState) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');

  /* resolve userId across possible auth shapes */
  const userId = useMemo(
    () => user?.userId ?? user?.id ?? (user as any)?.user?.id ?? '',
    [user]
  );

  useEffect(() => {
    if (userId) dispatch(fetchProducts(userId));
  }, [dispatch, userId]);

  const handleDelete = useCallback(
    async (productId: string) => {
      if (!window.confirm('Are you sure you want to delete this product?')) return;
      const result = await dispatch(deleteProduct({ productId, userId }));
      if (deleteProduct.fulfilled.match(result)) {
        toast.success('Product deleted successfully');
      }
    },
    [dispatch, userId]
  );

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [products, searchTerm]
  );

  /* ── Table column definitions ── */
  const columns = useMemo(
    () => [
      {
        header: 'Product Name',
        accessor: (p: Product) => (
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-[10px] flex items-center justify-center font-sora font-bold text-[13px] text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #C8102E, #E8821A)', boxShadow: '3px 3px 8px rgba(200,16,46,0.3)' }}
            >
              {p.name.charAt(0).toUpperCase()}
            </div>
            <span className="font-sora font-bold text-[#1C2033]">{p.name}</span>
          </div>
        ),
      },
      {
        header: 'Description',
        accessor: 'description' as keyof Product,
        className: 'max-w-xs truncate',
      },
      {
        header: 'Status',
        accessor: (p: Product) => (
          <span
            className="px-3 py-1 rounded-full text-[10px] font-sora font-black uppercase tracking-widest"
            style={
              p.status === 'ACTIVE'
                ? { color: '#0D9E6E', background: 'rgba(13,158,110,0.1)' }
                : { color: '#E8821A', background: 'rgba(232,130,26,0.1)' }
            }
          >
            {p.status || 'DRAFT'}
          </span>
        ),
      },
      {
        header: 'Files',
        accessor: (p: Product) => (
          <span className="font-dm text-[#7A8799]">{p.filePaths?.length || 0} Assets</span>
        ),
      },
    ],
    []
  );

  /* ── Row actions ── */
  const actions = useCallback(
    (p: Product) => (
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(`/edit-product?id=${p.id}`)}
          className="p-2 neo-outset rounded-lg text-[#777] hover:text-[#E8821A] neo-transition border-none outline-none cursor-pointer"
          title="Edit product"
        >
          <Edit size={14} />
        </button>
        <button
          onClick={() => handleDelete(p.id)}
          className="p-2 neo-outset rounded-lg text-[#777] hover:text-[#C8102E] neo-transition border-none outline-none cursor-pointer"
          title="Delete product"
        >
          <Trash2 size={14} />
        </button>
      </div>
    ),
    [navigate, handleDelete]
  );

  /* ════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════ */
  return (
    <div className="flex flex-col gap-8 pb-8">

      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="eyebrow">Magic Carpet · Catalog</div>
          <h2 className="font-sora text-3xl font-black text-[#1C2033]">
            Products<span style={{ color: '#C8102E' }}>.</span>
          </h2>
          <p className="font-dm text-sm text-[#7A8799]">Manage your strategic offerings</p>
        </div>

        {/* ADD PRODUCT — now navigates to dedicated page */}
        <NeomorphicButton
          variant="brand"
          className="h-fit font-sora"
          onClick={() => navigate('/add-product')}
        >
          <Plus size={18} />
          ADD PRODUCT
        </NeomorphicButton>
      </div>

      {/* Toolbar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-8">
          <NeomorphicInput
            placeholder="Search products by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={18} />}
          />
        </div>
        <div className="lg:col-span-4 flex gap-4">
          <NeomorphicButton variant="secondary" fullWidth className="!py-3">
            <Filter size={18} />
            FILTER
          </NeomorphicButton>
          <NeomorphicButton variant="secondary" fullWidth className="!py-3">
            <Download size={18} />
            EXPORT
          </NeomorphicButton>
        </div>
      </div>

      {/* Products table */}
      <NeomorphicTable
        data={filteredProducts}
        columns={columns}
        loading={loading}
        actions={actions}
      />
    </div>
  );
};

export default ProductList;
