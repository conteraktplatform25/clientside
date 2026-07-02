import 'server-only';

import { cache } from 'react';
import { cookies } from 'next/headers';
import { AxiosError } from 'axios';
import { apiServer } from './api-server';
import { TValidateSessionResponse } from '@/types/auth/auth-user.type';

/** ************************************************
 * Validate Session
 *
 * - Server only
 * - Cached per request
 * - Reads cookies directly
 * *********************************************** */
export const validateSession = cache(async (): Promise<TValidateSessionResponse | null> => {
  try {
    /**
     * Get auth cookie
     */
    const cookieStore = await cookies();

    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join('; ');

    const response = await apiServer.get('/auth/validate-session', {
      headers: {
        Cookie: cookieHeader,
      },
    });

    return response.data;

  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 401) {
      return await refreshAndRetry();
    }
    return null;
  }
});

async function refreshAndRetry() {
  try {
    const cookieStore = await cookies();

    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join('; ');

    const refreshResponse = await apiServer.post(
      '/auth/refresh',
      {},
      {
        headers: {
          Cookie: cookieHeader,
        },
      },
    );
    console.log('Getting Refreshed AccessToken', refreshResponse.data);
    const accessToken = refreshResponse.data.accessToken;
    return accessToken;
  } catch {
    return null;
  }
}
