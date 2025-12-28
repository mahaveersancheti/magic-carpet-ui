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
    image?: File;
}

export type UpdateProductPayload = CreateProductPayload;

interface ProductState {
    products: Product[];
    loading: boolean;
    createLoading: boolean;
    updateLoading: boolean;
    deleteLoading: boolean;
    uploadLoading: boolean;
    error: string | null;
}

const initialState: ProductState = {
    products: [],
    loading: false,
    createLoading: false,
    updateLoading: false,
    deleteLoading: false,
    uploadLoading: false,
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
            let data: any = payload;
            const headers: Record<string, string> = { 'Skip-Auth': 'true' };

            if (payload.image) {
                const formData = new FormData();
                formData.append('name', payload.name);
                formData.append('description', payload.description);
                formData.append('file', payload.image);
                data = formData;
                headers['Content-Type'] = 'multipart/form-data';
            }

            const response = await api.post<Product>(endpoints.createProduct(userId), data, headers);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create product');
        }
    }
);

export const uploadProductFiles = createAsyncThunk(
    'products/uploadProductFiles',
    async ({ productId, userId, files }: { productId: string; userId: string; files: File[] }, { rejectWithValue }) => {
        try {
            const filePromises = files.map(file => {
                return new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const base64String = reader.result as string;
                        // Extract just the base64 part if needed, but usually APIs want the full data URI or just the content.
                        // The user said "string". Often APIs taking "string" for file want just the base64 content without the prefix.
                        // But I'll send the full string first or try to strip.
                        // Let's strip the prefix "data:application/pdf;base64," etc if we assume it's raw base64.
                        // But "string" often implies just the string.
                        // Let's send the full data URL first? Or just the content?
                        // If the API expects "string" inside a JSON array, it's ambiguous.
                        // safest is usually sending the component after the comma.
                        const base64Content = base64String.split(',')[1];
                        resolve(base64Content);
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            });

            const base64Files = await Promise.all(filePromises);

            await api.post(endpoints.uploadProductFiles(productId, userId), {
                files: base64Files
            }, { 'Skip-Auth': 'true' });

            return productId;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to upload files');
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
            })
            .addCase(uploadProductFiles.pending, (state) => {
                state.uploadLoading = true;
                state.error = null;
            })
            .addCase(uploadProductFiles.fulfilled, (state) => {
                state.uploadLoading = false;
            })
            .addCase(uploadProductFiles.rejected, (state, action) => {
                state.uploadLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearProductError, clearProducts } = productSlice.actions;
export default productSlice.reducer;
