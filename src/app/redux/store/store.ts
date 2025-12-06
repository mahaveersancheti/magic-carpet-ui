'use client';
import { configureStore } from "@reduxjs/toolkit";
import LoginSlice from "../slices/LoginSlice";
export const store = configureStore({
  reducer: {
    auth: LoginSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
