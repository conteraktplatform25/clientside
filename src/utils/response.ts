import { NextResponse } from 'next/server';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
type RequestBody = JsonValue | FormData;

type FetchRequestOptions<TBody = undefined> = {
  method?: HttpMethod;
  body?: TBody;
  headers?: HeadersInit;
};

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

export async function fetchMetaAPI<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.error?.message || 'Meta API request failed');
  }

  return json as T;
}

export async function fetchMultipartJSON<TResponse, TBody extends RequestBody | undefined = undefined>(
  url: string,
  options?: FetchRequestOptions<TBody>
): Promise<TResponse> {
  const { method = 'GET', body, headers } = options || {};
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  const res = await fetch(url, {
    method,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    headers: {
      ...(isFormData ? {} : body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
  });

  const json = await res.json();

  if (!res.ok || json.ok === false) {
    throw new Error(json.message || 'API request failed');
  }

  // match your backend response wrapper
  return json.profile ?? json.data ?? json;
}
