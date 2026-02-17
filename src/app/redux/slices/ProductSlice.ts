import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/apiService";
import { endpoints } from "../../lib/endpoints";

export interface Product {
  id: string;
  name: string;
  description: string;
  userId: string;
  status: string | null;
  imagePath: string | null;
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
  generateCharterLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  uploadLoading: false,
  generateCharterLoading: false,
  error: null,
};

export const fetchProductsByUserId = createAsyncThunk(
  "products/fetchProductsByUserId",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<Product[]>(
        endpoints.getProductsByUserId(userId),
        { "Skip-Auth": "true" },
      );
      // Filter out products with empty IDs
      const validProducts = response.filter(
        (product) => product.id && product.id.trim() !== "",
      );
      return validProducts;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch products");
    }
  },
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (
    { userId, payload }: { userId: string; payload: CreateProductPayload },
    { rejectWithValue },
  ) => {
    try {
      // Use base product endpoint without query parameters
      const endpoint = "product";

      // Create FormData with image and metadata
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("name", payload.name);
      formData.append("description", payload.description);
      if (payload.image) {
        formData.append("image", payload.image);
      }

      const response = await api.post<Product>(endpoint, formData, {
        "Skip-Auth": "true",
        "Content-Type": "multipart/form-data",
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create product");
    }
  },
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (
    {
      productId,
      userId,
      payload,
    }: { productId: string; userId: string; payload: UpdateProductPayload },
    { rejectWithValue },
  ) => {
    try {
      // Build the final endpoint URL without query parameters
      const endpoint = endpoints.updateProduct;

      // Create FormData with image and metadata
      const formData = new FormData();
      formData.append("productId", productId);
      formData.append("userId", userId);
      formData.append("name", payload.name);
      formData.append("description", payload.description);
      if (payload.image) {
        formData.append("image", payload.image);
      }

      const response = await api.put<Product>(endpoint, formData, {
        "Skip-Auth": "true",
        "Content-Type": "multipart/form-data",
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update product");
    }
  },
);

export const uploadProductFiles = createAsyncThunk(
  "products/uploadProductFiles",
  async (
    {
      productId,
      userId,
      files,
    }: { productId: string; userId: string; files: File[] },
    { rejectWithValue },
  ) => {
    try {
      // Upload each file separately with FormData
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("productId", productId);
        formData.append("userId", userId);
        formData.append("file", file);

        return await api.post(endpoints.uploadProductFiles, formData, {
          "Skip-Auth": "true",
          "Content-Type": "multipart/form-data",
        });
      });

      await Promise.all(uploadPromises);
      return productId;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to upload files");
    }
  },
);

export const generateCharter = createAsyncThunk(
  "products/generateCharter",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await api.post<string>(
        endpoints.generateCharter(productId),
        {},
        {
          accept: "text/plain;charset=UTF-8",
          "Content-Type": "application/json",
        },
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to generate charter");
    }
  },
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (
    { productId, userId }: { productId: string; userId: string },
    { rejectWithValue },
  ) => {
    try {
      await api.delete(endpoints.deleteProduct(productId, userId), {
        "Skip-Auth": "true",
      });
      return productId;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete product");
    }
  },
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
    clearProducts: (state) => {
      state.products = [];
    },
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
        const index = state.products.findIndex(
          (p) => p.id === action.payload.id,
        );
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
        state.products = state.products.filter((p) => p.id !== action.payload);
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
      })
      .addCase(generateCharter.pending, (state) => {
        state.generateCharterLoading = true;
        state.error = null;
      })
      .addCase(generateCharter.fulfilled, (state) => {
        state.generateCharterLoading = false;
      })
      .addCase(generateCharter.rejected, (state, action) => {
        state.generateCharterLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProductError, clearProducts } = productSlice.actions;
export default productSlice.reducer;
