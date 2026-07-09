import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { refreshSession } from '../refresh-session';
import { ApiErrorResponse } from '@/types/api-response.type';

interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}
type BackendAxiosError = AxiosError<ApiErrorResponse>;
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;
const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/forgot-password'];

export const apiClientV = axios.create({
  baseURL: '/api',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClientV.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    const backendError = error as BackendAxiosError;
    const originalRequest = backendError.config as RetryAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(backendError.response?.data);
    }

    if (!originalRequest.withCredentials) {
      console.log('API Client V With Credentials triggered here', error);
      return Promise.reject(backendError.response?.data);
    }

    if (originalRequest.url && AUTH_ENDPOINTS.some((url) => originalRequest!.url!.includes(url))) {
      console.log('API Client V Auth Endpoint triggered here', error.response?.data);
      return Promise.reject(backendError.response?.data);
    }
    /**
     * Ignore non-401 responses.
     */
    if (error.response?.status !== 401) {
      return Promise.reject(backendError.response?.data);
    }

    /**
     * Never retry twice.
     */
    if (originalRequest._retry) {
      //window.location.replace("/login");

      return Promise.reject(backendError.response?.data);
    }

    /**
     * Don't refresh the refresh endpoint.
     */
    if (originalRequest.url?.includes('/auth/refresh')) {
      // if (typeof window !== 'undefined') {
      //   window.location.replace("/login");
      // }

      return Promise.reject(backendError.response?.data);
    }
    originalRequest._retry = true;

    try {
      if (!isRefreshing) {
        isRefreshing = true;

        refreshPromise = refreshSession().finally(() => {
          isRefreshing = false;
          refreshPromise = null;
        });
      }

      await refreshPromise;

      return apiClientV(originalRequest);
    } catch (error) {
      //window.location.replace('/login');

      return Promise.reject(backendError.response?.data);
    }
  },
);

// interface BackendErrorResponse {
//   code: number;
//   status: string;
//   message: string;
// }

export const getApiException = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const backend = error.response?.data as ApiErrorResponse | undefined;

    if (!backend) {
      return error.message;
    }

    if (Array.isArray(backend.message)) {
      return backend.message.join('\n');
    }

    return backend.message.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong';
};
