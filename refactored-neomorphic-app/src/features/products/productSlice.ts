import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/apiService';

export interface Product {
  id: string;
  name: string;
  description: string;
  userId: string;
  status: string | null;
  imagePath: string | null;
  filePaths: string[];
}

interface ProductState {
  products: Product[];
  loading: boolean;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
  uploadLoading: boolean;
  generateLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  uploadLoading: false,
  generateLoading: false,
  error: null,
};

/* ── Fetch all products by user ── */
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<Product[]>(`product/user/${userId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

/* ── Create product ── */
export const createProduct = createAsyncThunk(
  'products/create',
  async ({ userId, payload }: { userId: string; payload: any }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('name', payload.name);
      formData.append('description', payload.description);
      if (payload.image) formData.append('image', payload.image);

      const response = await api.post('product', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    }
  }
);

/* ── Update product ── */
export const updateProduct = createAsyncThunk(
  'products/update',
  async (
    { productId, userId, payload }: { productId: string; userId: string; payload: any },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('name', payload.name);
      formData.append('description', payload.description);
      if (payload.image) formData.append('image', payload.image);

      const response = await api.put(`product/${productId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

/* ── Delete product ── */
export const deleteProduct = createAsyncThunk(
  'products/delete',
  async ({ productId, userId }: { productId: string; userId: string }, { rejectWithValue }) => {
    try {
      await api.delete(`product/${productId}?userId=${userId}`);
      return productId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

/* ── Upload product files (PDF / PPT) ── */
export const uploadProductFiles = createAsyncThunk(
  'products/uploadFiles',
  async (
    { productId, userId, files }: { productId: string; userId: string; files: File[] },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append('userId', userId);
      files.forEach((file) => formData.append('files', file));

      const response = await api.post(`product/${productId}/files`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload files');
    }
  }
);

/* ── Delete a single product file ── */
export const deleteProductFile = createAsyncThunk(
  'products/deleteFile',
  async (
    { productId, fileId, userId }: { productId: string; fileId: string; userId: string },
    { rejectWithValue }
  ) => {
    try {
      await api.delete(`product/${productId}/file?fileId=${encodeURIComponent(fileId)}&userId=${userId}`);
      return { productId, fileId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete file');
    }
  }
);

/* ── Generate charter from URL ── */
export const generateCharterFromUrl = createAsyncThunk(
  'products/generateFromUrl',
  async (
    { productId, websiteURL }: { productId: string; websiteURL: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(`product/${productId}/url`, { url: websiteURL });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to scan website');
    }
  }
);

/* ── Generate charter (AI) ── */
export const generateCharter = createAsyncThunk(
  'products/generateCharter',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await api.post<string>(`product/${productId}/charter`, {});
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate charter');
    }
  }
);

/* ══════════════════════════════════════════════════════════════
   SLICE
══════════════════════════════════════════════════════════════ */
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* fetch */
      .addCase(fetchProducts.pending, (state) => { state.loading = true; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      /* create */
      .addCase(createProduct.pending, (state) => { state.createLoading = true; })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.createLoading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload as string;
      })

      /* update */
      .addCase(updateProduct.pending, (state) => { state.updateLoading = true; })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.updateLoading = false;
        const idx = state.products.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.products[idx] = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload as string;
      })

      /* delete */
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
      })

      /* upload files */
      .addCase(uploadProductFiles.pending, (state) => { state.uploadLoading = true; })
      .addCase(uploadProductFiles.fulfilled, (state) => { state.uploadLoading = false; })
      .addCase(uploadProductFiles.rejected, (state, action) => {
        state.uploadLoading = false;
        state.error = action.payload as string;
      })

      /* delete file */
      .addCase(deleteProductFile.pending, (state) => { state.deleteLoading = true; })
      .addCase(deleteProductFile.fulfilled, (state, action) => {
        state.deleteLoading = false;
        const product = state.products.find((p) => p.id === action.payload.productId);
        if (product) {
          product.filePaths = product.filePaths.filter((f) => f !== action.payload.fileId);
        }
      })
      .addCase(deleteProductFile.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload as string;
      })

      /* generate charter */
      .addCase(generateCharter.pending, (state) => { state.generateLoading = true; })
      .addCase(generateCharter.fulfilled, (state) => { state.generateLoading = false; })
      .addCase(generateCharter.rejected, (state, action) => {
        state.generateLoading = false;
        state.error = action.payload as string;
      })

      /* generate from URL */
      .addCase(generateCharterFromUrl.pending, (state) => { state.generateLoading = true; })
      .addCase(generateCharterFromUrl.fulfilled, (state) => { state.generateLoading = false; })
      .addCase(generateCharterFromUrl.rejected, (state, action) => {
        state.generateLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProductError } = productSlice.actions;
export default productSlice.reducer;
