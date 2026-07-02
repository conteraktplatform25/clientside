import axios, { AxiosError } from 'axios';

export const apiServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

apiServer.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

interface BackendErrorResponse {
  code: number;
  status: string;
  message: string;
}

export const getApiException = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const response = error.response?.data as BackendErrorResponse;

    return response?.message || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong';
};
