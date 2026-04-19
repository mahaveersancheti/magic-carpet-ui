import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../redux/store';
import {
  createProduct,
  updateProduct,
  uploadProductFiles,
  deleteProductFile,
  generateCharter,
  generateCharterFromUrl,
  fetchProducts,
} from '../../features/products/productSlice';
import toast from 'react-hot-toast';
import {
  ArrowLeft, X, FileText, Cloud, Trash2,
  Globe, Plus, Save, Briefcase, Sparkles, CheckCircle,
} from 'lucide-react';

/* ─── tiny helpers ─── */
const formatBytes = (b: number) => {
  if (b === 0) return '0 B';
  const i = Math.floor(Math.log(b) / Math.log(1024));
  return `${(b / Math.pow(1024, i)).toFixed(1)} ${'BKMG'[i]}B`;
};

/* ─── Field Label ─── */
const Label: React.FC<{ text: string; required?: boolean }> = ({ text, required }) => (
  <p
    className="text-[10.5px] font-[700] uppercase tracking-[0.13em] mb-[7px]"
    style={{ fontFamily: "'Sora', sans-serif", color: 'var(--muted)' }}
  >
    {text}{required && <span style={{ color: 'var(--crimson)' }}> *</span>}
  </p>
);

/* ─── Field Error ─── */
const Err: React.FC<{ msg?: string }> = ({ msg }) =>
  msg ? (
    <p className="text-[10.5px] mt-1.5" style={{ color: 'var(--crimson)', fontFamily: "'DM Sans', sans-serif" }}>
      {msg}
    </p>
  ) : null;

/* ─── Inset Input wrapper ─── */
const InsetWrap: React.FC<{ children: React.ReactNode; hasError?: boolean; className?: string }> = ({
  children, hasError, className = '',
}) => (
  <div
    className={`flex items-center gap-3 rounded-[13px] px-4 ${className}`}
    style={{
      background: 'var(--bg)',
      boxShadow: hasError
        ? 'inset 4px 4px 10px var(--sd), inset -3px -3px 8px var(--sl), 0 0 0 1.5px var(--crimson)'
        : 'inset 4px 4px 10px var(--sd), inset -3px -3px 8px var(--sl)',
    }}
  >
    {children}
  </div>
);

/* ─── Loader overlay ─── */
const Loader: React.FC<{ visible: boolean; title: string; success: boolean; onClose: () => void }> = ({
  visible, title, success, onClose,
}) => {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ background: 'rgba(28,32,51,0.55)', backdropFilter: 'blur(6px)' }}>
      <div
        className="flex flex-col items-center gap-5 rounded-[22px] px-14 py-10"
        style={{ background: 'var(--card)', boxShadow: '12px 12px 32px var(--sd), -6px -6px 20px var(--sl)', minWidth: 280 }}
      >
        {success
          ? <CheckCircle size={44} style={{ color: 'var(--green)' }} />
          : <div className="w-11 h-11 rounded-full animate-spin" style={{ border: '3px solid rgba(200,16,46,0.15)', borderTopColor: 'var(--crimson)' }} />
        }
        <p className="text-[14px] font-[700]" style={{ fontFamily: "'Sora', sans-serif", color: 'var(--navy)' }}>
          {success ? 'Done!' : title}
        </p>
        {success && (
          <button
            onClick={onClose}
            className="px-7 py-2.5 rounded-[12px] text-white text-[12px] font-[600] border-none cursor-pointer"
            style={{ fontFamily: "'Sora', sans-serif", background: 'var(--crimson)', boxShadow: '5px 5px 16px rgba(200,16,46,0.36)' }}
          >Continue</button>
        )}
      </div>
    </div>
  );
};

/* ─── Confirm dialog ─── */
const Confirm: React.FC<{ open: boolean; title: string; desc: string; ok?: string; cancel?: string; onOk: () => void; onClose: () => void }> = ({
  open, title, desc, ok = 'Confirm', cancel = 'Cancel', onOk, onClose,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6" style={{ background: 'rgba(28,32,51,0.45)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-md rounded-[22px] p-7 flex flex-col gap-5" style={{ background: 'var(--card)', boxShadow: '10px 10px 28px var(--sd), -6px -6px 18px var(--sl)' }}>
        <div>
          <p className="text-[16px] font-[800] mb-1" style={{ fontFamily: "'Sora', sans-serif", color: 'var(--navy)' }}>{title}</p>
          <p className="text-[13px]" style={{ fontFamily: "'DM Sans', sans-serif", color: 'var(--mid)' }}>{desc}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-[12px] text-[13px] font-[600] border-none cursor-pointer"
            style={{ fontFamily: "'Sora', sans-serif", background: 'var(--bg)', color: 'var(--mid)', boxShadow: '4px 4px 10px var(--sd), -3px -3px 8px var(--sl)' }}>
            {cancel}
          </button>
          <button onClick={onOk} className="flex-1 py-3 rounded-[12px] text-[13px] font-[600] text-white border-none cursor-pointer"
            style={{ fontFamily: "'Sora', sans-serif", background: 'var(--crimson)', boxShadow: '5px 5px 16px rgba(200,16,46,0.36)' }}>
            {ok}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════════════════ */
const AddProductPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('id');

  const authUser = useSelector((s: RootState) => s.auth.user);
  const userId   = (authUser as any)?.userId ?? (authUser as any)?.id ?? (authUser as any)?.user?.id ?? '';

  const { products, createLoading, updateLoading, loading: productsLoading } =
    useSelector((s: RootState) => s.products);

  /* form state */
  const [form, setForm]             = useState({ name: '', description: '' });
  const [initForm, setInitForm]     = useState({ name: '', description: '' });
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productDocs,  setProductDocs]  = useState<File[]>([]);
  const [existingDocs, setExistingDocs] = useState<string[]>([]);
  const [existingImg,  setExistingImg]  = useState<string | null>(null);
  const [websiteURL,   setWebsiteURL]   = useState('');
  const [errors, setErrors]             = useState<{ name?: string; description?: string }>({});

  /* drag states */
  const [dragImg,  setDragImg]  = useState(false);
  const [dragDocs, setDragDocs] = useState(false);

  /* loader / submitting */
  const [uploading,   setUploading]   = useState(false);
  const [loaderTitle, setLoaderTitle] = useState('Saving...');
  const [loaderOk,    setLoaderOk]    = useState(false);
  const [submitting,  setSubmitting]  = useState(false);
  const [generating,  setGenerating]  = useState(false);

  /* dialogs */
  const [confirmLeave, setConfirmLeave]   = useState(false);
  const [docToDelete,  setDocToDelete]    = useState<string | null>(null);

  const initialized  = useRef(false);
  const historyPushed = useRef(false);

  /* load for edit */
  useEffect(() => {
    if (!productId || !userId) return;
    const p = products.find(x => x.id === productId);
    if (p) {
      if (!initialized.current) {
        const fd = { name: p.name, description: p.description };
        setForm(fd); setInitForm(fd);
        setExistingDocs(p.filePaths || []);
        setExistingImg(p.imagePath);
        initialized.current = true;
      }
    } else if (!productsLoading) {
      dispatch(fetchProducts(userId));
    }
  }, [productId, products, userId, productsLoading, dispatch]);

  const isDirty = useMemo(() =>
    form.name !== initForm.name ||
    form.description !== initForm.description ||
    productImage !== null || productDocs.length > 0,
    [form, initForm, productImage, productDocs]
  );

  /* beforeunload */
  useEffect(() => {
    const onBU  = (e: BeforeUnloadEvent) => { if (isDirty && !submitting) { e.preventDefault(); e.returnValue = ''; } };
    const onPop = () => { if (isDirty && !submitting) { window.history.pushState(null, '', window.location.href); setConfirmLeave(true); } };
    if (isDirty && !submitting && !historyPushed.current) { window.history.pushState(null, '', window.location.href); historyPushed.current = true; }
    window.addEventListener('beforeunload', onBU);
    window.addEventListener('popstate', onPop);
    return () => { window.removeEventListener('beforeunload', onBU); window.removeEventListener('popstate', onPop); };
  }, [isDirty, submitting]);

  /* validate */
  const validate = useCallback((): boolean => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = 'Product name is required';
    else if (form.name.trim().length < 3) e.name = 'Name must be at least 3 characters';
    else if (/[/\\]/.test(form.name)) e.name = 'Name cannot contain slashes';
    const hasDesc = form.description.trim().length >= 10;
    const hasDocs = productDocs.length > 0 || existingDocs.length > 0;
    if (!hasDesc && !hasDocs) e.description = 'Description (min 10 chars) or a document is required';
    setErrors(e);
    return !Object.keys(e).length;
  }, [form, productDocs, existingDocs]);

  /* save */
  const handleSave = useCallback(async (skipNav = false, keepLoader = false): Promise<string | null> => {
    if (!validate() || !userId) return null;
    setSubmitting(true); setUploading(true); setLoaderOk(false); setLoaderTitle('Saving product...');
    try {
      let cid = productId;
      if (productId) {
        await dispatch(updateProduct({ productId, userId, payload: { name: form.name, description: form.description, image: productImage ?? undefined } })).unwrap();
      } else {
        const np = await dispatch(createProduct({ userId, payload: { name: form.name, description: form.description || ' ', image: productImage ?? undefined } })).unwrap();
        cid = np.id; initialized.current = true;
      }
      if (productDocs.length > 0 && cid) {
        await dispatch(uploadProductFiles({ productId: cid, userId, files: productDocs })).unwrap();
        setExistingDocs(prev => [...prev, ...productDocs.map(f => f.name)]);
        setProductDocs([]);
      }
      toast.success(productId ? 'Product updated!' : 'Product created!');
      setLoaderOk(true);
      if (!skipNav)       setTimeout(() => { setUploading(false); navigate('/products'); }, 1500);
      else if (!keepLoader) setTimeout(() => setUploading(false), 1200);
      return cid;
    } catch (err: any) {
      toast.error(err || 'Failed to save'); setSubmitting(false); setUploading(false); setLoaderOk(false); return null;
    }
  }, [dispatch, navigate, form, productId, productImage, productDocs, userId, validate]);

  /* generate charter */
  const handleGenerate = useCallback(async () => {
    if (!websiteURL.trim() && productDocs.length === 0 && existingDocs.length === 0) {
      toast.error('Add a website URL or upload a document first'); return;
    }
    if (websiteURL.trim()) {
      try { new URL(websiteURL.startsWith('http') ? websiteURL : `https://${websiteURL}`); }
      catch { toast.error('Enter a valid URL'); return; }
    }
    const cid = await handleSave(true, true);
    if (!cid) return;
    if (!productId) window.history.replaceState(null, '', `?id=${cid}`);
    setGenerating(true); setLoaderOk(false);
    try {
      if (websiteURL.trim()) { setLoaderTitle('Scanning website...'); await dispatch(generateCharterFromUrl({ productId: cid, websiteURL })).unwrap(); }
      if (productDocs.length > 0) {
        setLoaderTitle('Uploading documents...');
        await dispatch(uploadProductFiles({ productId: cid, userId, files: productDocs })).unwrap();
        setProductDocs([]); dispatch(fetchProducts(userId));
      }
      setLoaderTitle('Generating charter...');
      const result = await dispatch(generateCharter(cid)).unwrap();
      setForm(prev => ({ ...prev, description: typeof result === 'string' ? result : JSON.stringify(result) }));
      toast.success('Charter generated!'); setLoaderOk(true);
      setTimeout(() => { setUploading(false); setSubmitting(false); setLoaderOk(false); }, 1500);
    } catch (err: any) {
      toast.error(err || 'Generation failed'); setUploading(false); setSubmitting(false);
    } finally { setGenerating(false); }
  }, [dispatch, handleSave, websiteURL, productDocs, existingDocs, productId, userId]);

  /* delete doc */
  const handleDeleteDoc = useCallback((path: string) => {
    if (!productId) { setExistingDocs(prev => prev.filter(p => p !== path)); return; }
    setDocToDelete(path);
  }, [productId]);

  const confirmDelete = useCallback(async () => {
    if (!docToDelete || !productId || !userId) { setDocToDelete(null); return; }
    try {
      await dispatch(deleteProductFile({ productId, fileId: docToDelete, userId })).unwrap();
      setExistingDocs(prev => prev.filter(p => p !== docToDelete));
      toast.success('Document removed');
    } catch (err: any) { toast.error(err || 'Delete failed'); }
    finally { setDocToDelete(null); }
  }, [dispatch, docToDelete, productId, userId]);

  /* drag */
  const onDragOver  = useCallback((e: React.DragEvent, t: 'img'|'doc') => { e.preventDefault(); t === 'img' ? setDragImg(true) : setDragDocs(true); }, []);
  const onDragLeave = useCallback((t: 'img'|'doc') => t === 'img' ? setDragImg(false) : setDragDocs(false), []);
  const onDrop      = useCallback((e: React.DragEvent, t: 'img'|'doc') => {
    e.preventDefault();
    if (t === 'img') {
      setDragImg(false);
      const f = e.dataTransfer.files?.[0];
      if (f?.type.startsWith('image/')) setProductImage(f); else toast.error('Please drop an image file');
    } else {
      setDragDocs(false);
      const ok = ['application/pdf','application/vnd.ms-powerpoint','application/vnd.openxmlformats-officedocument.presentationml.presentation'];
      const valid = Array.from(e.dataTransfer.files).filter(f => { if (!ok.includes(f.type)) { toast.error(`${f.name}: PDF/PPT only`); return false; } return true; });
      setProductDocs(prev => [...prev, ...valid]);
    }
  }, []);

  const previewUrl = useMemo(() => {
    if (productImage) return URL.createObjectURL(productImage);
    if (existingImg)  return existingImg;
    return null;
  }, [productImage, existingImg]);

  const isBusy      = createLoading || updateLoading || submitting;
  const canGenerate = !generating && (websiteURL.trim() !== '' || productDocs.length > 0 || existingDocs.length > 0);
  const allDocs     = [...existingDocs.map(p => ({ name: p.split('/').pop() ?? p, key: p, isNew: false })),
                        ...productDocs.map((f, i) => ({ name: f.name, key: `new-${i}`, isNew: true, size: f.size, idx: i }))];

  /* ─── shared input style ─── */
  const inputCls = "flex-1 bg-transparent border-none outline-none py-[11px] text-[13px]";
  const inputStyle = { fontFamily: "'DM Sans', sans-serif", color: 'var(--text)' } as React.CSSProperties;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: "'DM Sans', sans-serif", color: 'var(--text)' }}>

      {/* overlays */}
      <Loader visible={uploading} title={loaderTitle} success={loaderOk}
        onClose={() => { setUploading(false); setSubmitting(false); setLoaderOk(false); }} />
      <Confirm open={confirmLeave} title="Unsaved Changes"
        desc="You have unsaved changes. Leave anyway?" ok="Leave" cancel="Stay"
        onOk={() => { setConfirmLeave(false); navigate('/products'); }} onClose={() => setConfirmLeave(false)} />
      <Confirm open={docToDelete !== null} title="Remove Document"
        desc={`Remove "${docToDelete?.split('/').pop()}"? This cannot be undone.`} ok="Remove" cancel="Cancel"
        onOk={confirmDelete} onClose={() => setDocToDelete(null)} />

      {/* ═══ STICKY HEADER ═══ */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between gap-4 px-6 py-3.5"
        style={{ background: 'var(--card)', boxShadow: '0 3px 16px var(--sd)', borderBottom: '1px solid rgba(200,16,46,0.1)' }}
      >
        {/* Back + breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => isDirty ? setConfirmLeave(true) : navigate('/products')}
            className="w-9 h-9 rounded-[11px] flex items-center justify-center border-none cursor-pointer transition-colors"
            style={{ background: 'var(--bg)', color: 'var(--mid)', boxShadow: '3px 3px 8px var(--sd), -2px -2px 6px var(--sl)' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--crimson)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--mid)'}
          >
            <ArrowLeft size={17} />
          </button>
          <div>
            <p className="text-[11px] font-[600] uppercase tracking-[0.1em]" style={{ fontFamily: "'Sora', sans-serif", color: 'var(--crimson)' }}>
              Products
            </p>
            <h1 className="text-[17px] font-[800] leading-none mt-0.5" style={{ fontFamily: "'Sora', sans-serif", color: 'var(--navy)' }}>
              {productId ? 'Edit Product' : 'New Product'}
            </h1>
          </div>
        </div>

        {/* Save */}
        <button
          onClick={() => handleSave(false)}
          disabled={isBusy}
          className="flex items-center gap-2 px-5 py-2.5 rounded-[12px] text-white text-[12.5px] font-[700] border-none cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: "'Sora', sans-serif", background: 'linear-gradient(135deg, var(--crimson), var(--orange))', boxShadow: '5px 5px 16px rgba(200,16,46,0.36)' }}
        >
          {isBusy
            ? <div className="w-4 h-4 rounded-full animate-spin" style={{ border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
            : <Save size={14} />}
          {productId ? 'Save Changes' : 'Save Product'}
        </button>
      </header>

      {/* ═══ FORM BODY ═══ */}
      <main className="max-w-2xl mx-auto px-5 py-8 pb-20">
        <div
          className="rounded-[20px] p-6 md:p-8 flex flex-col gap-6"
          style={{ background: 'var(--card)', boxShadow: '8px 8px 20px var(--sd), -6px -6px 16px var(--sl)' }}
        >

          {/* ── Product Name ── */}
          <div>
            <Label text="Product Name" required />
            <InsetWrap hasError={!!errors.name}>
              <Briefcase size={14} style={{ color: 'var(--muted)', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Enter product name"
                value={form.name}
                onChange={e => { setForm({ ...form, name: e.target.value.replace(/[/\\]/g, '') }); if (errors.name) setErrors({ ...errors, name: undefined }); }}
                className={inputCls}
                style={inputStyle}
              />
            </InsetWrap>
            <Err msg={errors.name} />
          </div>

          {/* ── Website URL ── */}
          <div>
            <Label text="Website URL" />
            <InsetWrap>
              <Globe size={14} style={{ color: 'var(--muted)', flexShrink: 0 }} />
              <input
                type="url"
                placeholder="https://yourproduct.com"
                value={websiteURL}
                onChange={e => setWebsiteURL(e.target.value)}
                className={inputCls}
                style={inputStyle}
              />
              {websiteURL && (
                <button onClick={() => setWebsiteURL('')} className="border-none bg-transparent cursor-pointer p-0 flex" style={{ color: 'var(--muted)' }}>
                  <X size={13} />
                </button>
              )}
            </InsetWrap>
          </div>

          {/* ── Product Image ── */}
          <div>
            <Label text="Product Image" />
            <div
              onDragOver={e => onDragOver(e, 'img')}
              onDragLeave={() => onDragLeave('img')}
              onDrop={e => onDrop(e, 'img')}
              className="relative rounded-[14px] flex items-center justify-center transition-all cursor-pointer overflow-hidden"
              style={{
                minHeight: 110,
                background: dragImg ? 'rgba(200,16,46,0.04)' : 'var(--bg)',
                boxShadow: dragImg
                  ? 'inset 4px 4px 10px var(--sd), inset -3px -3px 8px var(--sl), 0 0 0 1.5px var(--crimson)'
                  : 'inset 4px 4px 10px var(--sd), inset -3px -3px 8px var(--sl)',
                border: `1.5px dashed ${dragImg ? 'var(--crimson)' : 'rgba(163,177,194,0.45)'}`,
              }}
            >
              {previewUrl ? (
                <div className="flex items-center gap-4 p-4 w-full">
                  <img src={previewUrl} alt="Preview" className="h-16 w-auto object-contain rounded-[10px]" style={{ boxShadow: '3px 3px 8px var(--sd)' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-[600] truncate" style={{ color: 'var(--navy)', fontFamily: "'Sora', sans-serif" }}>
                      {productImage?.name ?? 'Existing image'}
                    </p>
                    {productImage && <p className="text-[10.5px]" style={{ color: 'var(--muted)' }}>{formatBytes(productImage.size)}</p>}
                  </div>
                  <button
                    onClick={e => { e.preventDefault(); e.stopPropagation(); setProductImage(null); setExistingImg(null); }}
                    className="w-7 h-7 rounded-full flex items-center justify-center border-none cursor-pointer flex-shrink-0"
                    style={{ background: 'var(--card)', color: 'var(--crimson)', boxShadow: '2px 2px 6px var(--sd)' }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center pointer-events-none py-6 gap-2">
                  <div className="w-9 h-9 rounded-[11px] flex items-center justify-center" style={{ background: 'var(--card)', boxShadow: '3px 3px 8px var(--sd), -2px -2px 6px var(--sl)', color: 'var(--crimson)' }}>
                    <Cloud size={16} />
                  </div>
                  <p className="text-[12px]" style={{ color: 'var(--mid)', fontFamily: "'DM Sans', sans-serif" }}>Click or drag to upload</p>
                  <p className="text-[9.5px] font-[700] uppercase tracking-widest" style={{ color: 'var(--muted)', fontFamily: "'Sora', sans-serif" }}>JPG · PNG · WEBP</p>
                </div>
              )}
              <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={e => { const f = e.target.files?.[0]; if (f) setProductImage(f); }} />
            </div>
          </div>

          {/* ── Documents ── */}
          <div>
            <Label text="Documents" />

            {/* drop zone */}
            <div
              onDragOver={e => onDragOver(e, 'doc')}
              onDragLeave={() => onDragLeave('doc')}
              onDrop={e => onDrop(e, 'doc')}
              className="relative rounded-[14px] flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden"
              style={{
                minHeight: 90,
                background: dragDocs ? 'rgba(200,16,46,0.04)' : 'var(--bg)',
                boxShadow: dragDocs
                  ? 'inset 4px 4px 10px var(--sd), inset -3px -3px 8px var(--sl), 0 0 0 1.5px var(--crimson)'
                  : 'inset 4px 4px 10px var(--sd), inset -3px -3px 8px var(--sl)',
                border: `1.5px dashed ${dragDocs ? 'var(--crimson)' : 'rgba(163,177,194,0.45)'}`,
              }}
            >
              <div className="flex flex-col items-center pointer-events-none py-5 gap-1.5">
                <div className="w-9 h-9 rounded-[11px] flex items-center justify-center" style={{ background: 'var(--card)', boxShadow: '3px 3px 8px var(--sd), -2px -2px 6px var(--sl)', color: 'var(--crimson)' }}>
                  <Plus size={16} />
                </div>
                <p className="text-[12px]" style={{ color: 'var(--mid)', fontFamily: "'DM Sans', sans-serif" }}>Click or drag to upload</p>
                <p className="text-[9.5px] font-[700] uppercase tracking-widest" style={{ color: 'var(--muted)', fontFamily: "'Sora', sans-serif" }}>PDF · PPT · PPTX</p>
              </div>
              <input type="file" multiple accept=".pdf,.ppt,.pptx" className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={e => {
                  if (!e.target.files) return;
                  const ok = ['application/pdf','application/vnd.ms-powerpoint','application/vnd.openxmlformats-officedocument.presentationml.presentation'];
                  const valid = Array.from(e.target.files).filter(f => { if (!ok.includes(f.type)) { toast.error(`${f.name}: PDF/PPT only`); return false; } return true; });
                  setProductDocs(prev => [...prev, ...valid]);
                }} />
            </div>

            {/* document chips */}
            {allDocs.length > 0 && (
              <div className="flex flex-col gap-2 mt-3">
                {allDocs.map(doc => (
                  <div
                    key={doc.key}
                    className="flex items-center gap-3 px-4 py-3 rounded-[12px]"
                    style={{
                      background: 'var(--bg)',
                      boxShadow: 'inset 3px 3px 7px var(--sd), inset -2px -2px 5px var(--sl)',
                      borderLeft: doc.isNew ? '3px solid var(--crimson)' : '3px solid var(--muted)',
                    }}
                  >
                    <FileText size={14} style={{ color: doc.isNew ? 'var(--crimson)' : 'var(--mid)', flexShrink: 0 }} />
                    <span className="flex-1 text-[12px] truncate" style={{ fontFamily: "'DM Sans', sans-serif", color: 'var(--navy)' }}>
                      {doc.name}
                    </span>
                    {doc.isNew && 'size' in doc && (
                      <span className="text-[10px] font-[600]" style={{ color: 'var(--muted)', fontFamily: "'Sora', sans-serif" }}>
                        {formatBytes((doc as any).size)}
                      </span>
                    )}
                    {!doc.isNew && (
                      <span className="text-[10px] font-[600] uppercase tracking-wider" style={{ color: 'var(--muted)', fontFamily: "'Sora', sans-serif" }}>Saved</span>
                    )}
                    <button
                      onClick={() => doc.isNew
                        ? setProductDocs(prev => prev.filter((_, i) => i !== (doc as any).idx))
                        : handleDeleteDoc(doc.key)}
                      className="w-6 h-6 rounded-full flex items-center justify-center border-none cursor-pointer ml-1"
                      style={{ background: 'transparent', color: 'var(--muted)' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--crimson)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--muted)'}
                    >
                      {doc.isNew ? <X size={12} /> : <Trash2 size={12} />}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── thin red-orange divider ── */}
          <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(200,16,46,0.18), transparent)' }} />

          {/* ── Product Charter textarea ── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label text="Product Charter" />
              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={!canGenerate || submitting}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-[10px] text-white text-[11px] font-[700] border-none cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  fontFamily: "'Sora', sans-serif",
                  background: canGenerate && !submitting ? 'var(--navy)' : 'var(--mid)',
                  boxShadow: canGenerate ? '4px 4px 12px rgba(28,32,51,0.3)' : 'none',
                  letterSpacing: '0.04em',
                }}
              >
                {generating
                  ? <div className="w-3 h-3 rounded-full animate-spin" style={{ border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
                  : <Sparkles size={12} />}
                {generating ? 'Generating...' : 'Generate with AI'}
              </button>
            </div>

            <div
              className="rounded-[14px] overflow-hidden"
              style={{
                background: 'var(--bg)',
                boxShadow: errors.description
                  ? 'inset 4px 4px 10px var(--sd), inset -3px -3px 8px var(--sl), 0 0 0 1.5px var(--crimson)'
                  : 'inset 4px 4px 10px var(--sd), inset -3px -3px 8px var(--sl)',
              }}
            >
              <textarea
                placeholder="Write your product description or click 'Generate with AI'..."
                value={form.description}
                onChange={e => { setForm({ ...form, description: e.target.value }); if (errors.description) setErrors({ ...errors, description: undefined }); }}
                rows={10}
                className="w-full p-5 bg-transparent border-none outline-none resize-none text-[13px] leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif", color: 'var(--text)' }}
              />
            </div>
            <Err msg={errors.description} />
          </div>

          {/* ── Bottom action row ── */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => isDirty ? setConfirmLeave(true) : navigate('/products')}
              className="px-5 py-2.5 rounded-[12px] text-[12.5px] font-[600] border-none cursor-pointer transition-all"
              style={{ fontFamily: "'Sora', sans-serif", background: 'var(--bg)', color: 'var(--mid)', boxShadow: '4px 4px 10px var(--sd), -3px -3px 8px var(--sl)' }}
            >
              Cancel
            </button>

            <button
              onClick={() => handleSave(false)}
              disabled={isBusy}
              className="flex items-center gap-2 px-7 py-2.5 rounded-[12px] text-white text-[12.5px] font-[700] border-none cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "'Sora', sans-serif", background: 'linear-gradient(135deg, var(--crimson), var(--orange))', boxShadow: '5px 5px 16px rgba(200,16,46,0.36)' }}
            >
              {isBusy
                ? <div className="w-4 h-4 rounded-full animate-spin" style={{ border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
                : <Save size={14} />}
              {productId ? 'Save Changes' : 'Save Product'}
            </button>
          </div>

        </div>
      </main>

      <style>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(200,16,46,0.22); border-radius: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
};

export default AddProductPage;
