// src/types/api-response.type.ts

export interface ApiErrorMessage {
  message: string;
  error: string;
  statusCode: number;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  path: string;
  message: ApiErrorMessage;
  timestamp: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  timestamp: string;
}

export type ApiResult<T = unknown> = ApiResponse<T> | ApiErrorResponse;
