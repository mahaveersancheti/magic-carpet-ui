'use client';
import { configureStore } from "@reduxjs/toolkit";
import LoginSlice from "../slices/LoginSlice";
import ProfileSlice from "../slices/ProfileSlice";

export const store = configureStore({
  reducer: {
    auth: LoginSlice,
    profiles: ProfileSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
