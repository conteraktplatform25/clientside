import { apiServer } from '@/lib/api-server';
import axios from 'axios';
import { ApiResponse } from '@/types/api-response.type';

export async function GET<TResponse>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<TResponse>> {
  try {
    console.log('Initializing GET service');
    const response = await apiServer.get<ApiResponse<TResponse>>(url, {
      params,
    });
    console.log('Response Logger:', response.data);
    return response.data;
  } catch (error) {
    console.log('Response Logger:', error);
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    }

    throw error;
  }
}

export async function POST<TResponse, TBody>(url: string, body: TBody): Promise<ApiResponse<TResponse>> {
  try {
    console.log('Initializing POST service');
    const response = await apiServer.post<ApiResponse<TResponse>>(url, body);
    console.log('Response Logger:', response.data);
    return response.data;
  } catch (error) {
    console.log('Response Logger:', error);
    if (axios.isAxiosError(error)) {
      throw {
        message: error.response?.data?.message ?? error.message,
        statusCode: error.status ?? 500,
      };
    }

    throw error;
  }
}
