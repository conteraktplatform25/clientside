import { ApiErrorResponse } from '@/types/api-response.type';

// Centralized error handling helper
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}

// export function getServerErrorMessage(error: unknown): ApiErrorResponse {
//   if (error instanceof Error) {
//     return error.message;
//   }
//   if (typeof error === 'string') {
//     return error;
//   }
//   return 'An unexpected error occurred';
// }
