"use client";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
// import { toastManager } from '../utils/toast-manager';

export const BASE_DOMAIN_magnun =
  "https://magic-carpet.data-magnum.com/v1/api/";
export const BASE_URL_Digital = "https://magiccarpet.digital/v1/api/";

export const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    const URL = window.location.origin;
    if (URL.includes("localhost")) {
      return BASE_DOMAIN_magnun;
    } else if (URL.includes("magiccarpet.digital")) {
      return BASE_URL_Digital;
    } else {
      return BASE_DOMAIN_magnun;
    }
  }
  return BASE_DOMAIN_magnun;
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";
  // Check if we should skip auth
  // if (config.headers && config.headers['Skip-Auth']) {
  //   delete config.headers['Skip-Auth']; // Remove the custom header before sending
  //   return config;
  // }
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any)["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

import toast from "react-hot-toast";

// ... existing code ...

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;

    let message = "Request failed";

    if (data) {
      if (typeof data === "string") {
        message = data;
      } else if (data.message) {
        message = data.message;
      } else if (data.errors && Array.isArray(data.errors)) {
        message = data.errors.join("\n");
      } else if (data.error) {
        message = data.error;
      } else if (data.detail) {
        message = data.detail;
      }
    } else if (error.message) {
      message = error.message;
    }

    const displayMessage = typeof message === 'string' ? message : JSON.stringify(message);

    if (status === 400) {
      toast.error(displayMessage);
    } else if (status === 401 || status === 403) {
      // Clear auth state and navigate to login
      if (typeof window !== "undefined") {
        const current = window.location.pathname || "";
        if (
          !current.includes("/landing") &&
          !current.includes("/signin") &&
          !current.includes("/signup")
        ) {
          localStorage.removeItem("token");
          const errorMsg =
            status === 403
              ? "Access Denied: You do not have permission to perform this action."
              : "Session Expired: Please login again to continue.";
          toast.error(errorMsg);

          // Small delay to allow the user to see the toast message
          setTimeout(() => {
            window.location.href = "/signin";
          }, 2000);
        }
      }
    } else {
      toast.error(displayMessage);
    }

    return Promise.reject(new Error(displayMessage));
  },
);

const request = async <T>(
  endpoint: string,
  config: AxiosRequestConfig = {},
): Promise<T> => {
  const response = await axiosInstance.request<T>({ url: endpoint, ...config });
  return response.data as T;
};

export const api = {
  get: <T>(endpoint: string, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: "GET", headers }),
  post: <T>(endpoint: string, body?: any, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: "POST", data: body, headers }),
  put: <T>(endpoint: string, body?: any, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: "PUT", data: body, headers }),
  patch: <T>(endpoint: string, body?: any, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: "PATCH", data: body, headers }),
  delete: <T>(endpoint: string, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: "DELETE", headers }),
  download: async (endpoint: string) => {
    const response = await axiosInstance.get(endpoint, {
      responseType: "blob",
    });
    const contentType = response.headers["content-type"];
    if (
      contentType &&
      (contentType.includes("text/html") ||
        contentType.includes("application/json"))
    ) {
      const text = await response.data.text();
      try {
        const json = JSON.parse(text);
        throw new Error(json.message || "Download failed");
      } catch (e) {
        throw new Error(
          "Download failed: Authentication required or file not found",
        );
      }
    }
    return response.data;
  },
  getWithResponse: async (
    endpoint: string,
    headers?: Record<string, string>,
  ) => {
    const response = await axiosInstance.get(endpoint, {
      responseType: "blob",
      headers: headers || {},
    });
    const contentType = response.headers["content-type"] || "";
    return {
      data: response.data,
      contentType: contentType,
      headers: response.headers,
    };
  },
};

export type ApiClient = typeof api;
