'use client';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
// import { toastManager } from '../utils/toast-manager';


export const getBaseUrl = () => {
  return "http://magic-carpet.data-magnum.com:8080/api/";
  // if (typeof window !== 'undefined') {
  //   const URL = window.location.origin;
  //   return URL.includes('localhost')
  //     ? 'https://mitcapex.mahindra.com/api'
  //     : URL + '/api';
  // }
  //  return 'https://mitcapex-uat.m-devsecops.com/api'; 
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : "";
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any)['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

import toast from 'react-hot-toast';

// ... existing code ...

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 400) {
      const message = error?.response?.data?.message || error.message || 'Bad Request';
      toast.error(message);
    }

    if (status === 401) {
      // Clear auth state and navigate to login
      // try { removeItem('token'); } catch {}
      if (typeof window !== 'undefined') {
        const current = window.location.pathname || '';
        if (!current.includes('/landing')) {
          // window.location.href = '/landing'; // Commented out to prevent loop during testing if needed
        }
      }
    }
    const message = error?.response?.data?.message || error.message || 'Request failed';
    if (status !== 400) { // Avoid double toast for 400
      toast.error(message);
    }
    return Promise.reject(new Error(message));
  }
);

const request = async <T>(endpoint: string, config: AxiosRequestConfig = {}): Promise<T> => {
  const response = await axiosInstance.request<T>({ url: endpoint, ...config });
  return response.data as T;
}

export const api = {
  get: <T>(endpoint: string, headers?: Record<string, string>) => request<T>(endpoint, { method: 'GET', headers }),
  post: <T>(endpoint: string, body?: any, headers?: Record<string, string>) => request<T>(endpoint, { method: 'POST', data: body, headers }),
  put: <T>(endpoint: string, body?: any, headers?: Record<string, string>) => request<T>(endpoint, { method: 'PUT', data: body, headers }),
  delete: <T>(endpoint: string, headers?: Record<string, string>) => request<T>(endpoint, { method: 'DELETE', headers }),
};

export type ApiClient = typeof api;


