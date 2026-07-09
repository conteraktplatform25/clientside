// src/lib/api/backend/cookies.ts
import { cookies } from 'next/headers';

export async function getCookieHeader(): Promise<string | null> {
  const cookieStore = await cookies();

  const allCookies = cookieStore.getAll();

  if (allCookies.length === 0) {
    return null;
  }

  return allCookies.map((cookie) => `${cookie.name}=${cookie.value}`).join('; ');
}
