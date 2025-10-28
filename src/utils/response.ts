import { NextResponse } from 'next/server';

export function success<T>(profile: T, message = 'Success', status = 200) {
  return NextResponse.json({ ok: true, message, profile }, { status });
}

export function failure(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  const json = await res.json();

  if (!res.ok || json.ok === false) {
    throw new Error(json.message || 'API request failed');
  }

  // ✅ Always return the `profile` field (your backend wraps actual data inside it)
  return json.profile as T;
}
