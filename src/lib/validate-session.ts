import 'server-only';

import { cache } from 'react';
import { cookies } from 'next/headers';
import { AxiosError } from 'axios';
import { apiServer } from './api-server';
import { TValidateSessionResponse } from '@/types/auth/auth-user.type';
import { nestServer } from './api/nest-server';

/**
 * Builds the authentication cookie header.
 * Returns null if neither auth cookie exists.
 */
async function getAuthCookieHeader(): Promise<string | null> {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get('contakt_access_token');
  const refreshToken = cookieStore.get('contakt_refresh_token');

  // No authentication cookies at all
  if (!accessToken && !refreshToken) {
    return null;
  }

  return [accessToken, refreshToken]
    .filter(Boolean)
    .map((cookie) => `${cookie!.name}=${cookie!.value}`)
    .join('; ');
}

/**
 * Calls the validate-session endpoint.
 */
// async function validate(cookieHeader: string) {
//   const response = await apiServer.get<TValidateSessionResponse>('/auth/validate-session', {
//     headers: {
//       Cookie: cookieHeader,
//     },
//   });

//   return response.data;
// }

/**
 * Attempts to refresh the user's session.
 */
// async function refreshSession(cookieHeader: string): Promise<boolean> {
//   try {
//     await apiServer.post(
//       '/auth/refresh',
//       {},
//       {
//         headers: {
//           Cookie: cookieHeader,
//         },
//       },
//     );

//     return true;
//   } catch {
//     return false;
//   }
// }

/** ************************************************
 * Validate Session
 *
 * - Server only
 * - Cached per request
 * - Reads cookies directly
 * *********************************************** */
export const validateSession = cache(async (): Promise<TValidateSessionResponse | null> => {
  const cookieHeader = await getAuthCookieHeader();
  // No auth cookies -> don't call the backend.
  if (!cookieHeader) {
    return null;
  }
  try {
    const { data } = await nestServer.get<TValidateSessionResponse>('/auth/validate-session', {
      headers: {
        Cookie: cookieHeader,
      },
    });
    return data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status !== 401) {
      console.error('Error validating session:', axiosError.response?.data ?? axiosError.message);
      return null;
    }

    console.error('Session validation failed:', axiosError.response?.data ?? axiosError.message);

    return null;
  }
});

// async function refreshAndRetry() {
//   try {
//     const cookieStore = await cookies();

//     const cookieHeader = cookieStore
//       .getAll()
//       .map((c) => `${c.name}=${c.value}`)
//       .join('; ');

//     const refreshResponse = await apiServer.post(
//       '/auth/refresh',
//       {},
//       {
//         headers: {
//           Cookie: cookieHeader,
//         },
//       },
//     );
//     console.log('Getting Refreshed AccessToken', refreshResponse.data);
//     const accessToken = refreshResponse.data.accessToken;
//     return accessToken;
//   } catch {
//     return null;
//   }
// }
