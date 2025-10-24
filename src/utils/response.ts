import { NextResponse } from 'next/server';

export function success<T>(profile: T, message = 'Success', status = 200) {
  return NextResponse.json({ ok: true, message, profile }, { status });
}

export function failure(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}
