import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/apiService';
import { endpoints } from '../../lib/endpoints';

export interface Product {
    id: string;
    name: string;
    description: string;
    userId: string;
    filePaths: string[];
}

export interface CreateProductPayload {
    name: string;
    description: string;
}

export type UpdateProductPayload = CreateProductPayload;

interface ProductState {
    products: Product[];
    loading: boolean;
    createLoading: boolean;
    updateLoading: boolean;
    deleteLoading: boolean;
    error: string | null;
}

const initialState: ProductState = {
    products: [],
    loading: false,
    createLoading: false,
    updateLoading: false,
    deleteLoading: false,
    error: null,
};

export const fetchProductsByUserId = createAsyncThunk(
    'products/fetchProductsByUserId',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await api.get<Product[]>(endpoints.getProductsByUserId(userId), { 'Skip-Auth': 'true' });
            // Filter out products with empty IDs
            const validProducts = response.filter(product => product.id && product.id.trim() !== '');
            return validProducts;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch products');
        }
    }
);

export const createProduct = createAsyncThunk(
    'products/createProduct',
    async ({ userId, payload }: { userId: string; payload: CreateProductPayload }, { rejectWithValue }) => {
        try {
            const response = await api.post<Product>(endpoints.createProduct(userId), payload, { 'Skip-Auth': 'true' });
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create product');
        }
    }
);

export const updateProduct = createAsyncThunk(
    'products/updateProduct',
    async ({ productId, userId, payload }: { productId: string; userId: string; payload: UpdateProductPayload }, { rejectWithValue }) => {
        try {
            const response = await api.put<Product>(endpoints.updateProduct(productId, userId), payload, { 'Skip-Auth': 'true' });
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update product');
        }
    }
);

export const deleteProduct = createAsyncThunk(
    'products/deleteProduct',
    async ({ productId, userId }: { productId: string; userId: string }, { rejectWithValue }) => {
        try {
            await api.delete(endpoints.deleteProduct(productId, userId), { 'Skip-Auth': 'true' });
            return productId;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to delete product');
        }
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        clearProductError: (state) => {
            state.error = null;
        },
        clearProducts: (state) => {
            state.products = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductsByUserId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductsByUserId.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProductsByUserId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(createProduct.pending, (state) => {
                state.createLoading = true;
                state.error = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.createLoading = false;
                state.products.push(action.payload);
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.createLoading = false;
                state.error = action.payload as string;
            })
            .addCase(updateProduct.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.updateLoading = false;
                const index = state.products.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteProduct.pending, (state) => {
                state.deleteLoading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.products = state.products.filter(p => p.id !== action.payload);
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.deleteLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearProductError, clearProducts } = productSlice.actions;
export default productSlice.reducer;
