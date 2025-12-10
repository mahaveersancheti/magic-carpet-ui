'use client';
import { configureStore } from "@reduxjs/toolkit";
import LoginSlice from "../slices/LoginSlice";
import ProfileSlice from "../slices/ProfileSlice";
import ProductSlice from "../slices/ProductSlice";

export const store = configureStore({
  reducer: {
    auth: LoginSlice,
    profiles: ProfileSlice,
    products: ProductSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
