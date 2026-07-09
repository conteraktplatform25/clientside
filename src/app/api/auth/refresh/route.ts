import { NextRequest, NextResponse } from 'next/server';
import { proxyRequest } from '@/lib/api/backend/backend-proxy';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('contakt_refresh_token');

  if (!refreshToken) {
    return NextResponse.json(
      {
        success: false,
        message: 'No refresh token',
      },
      {
        status: 401,
      },
    );
  }
  
  return proxyRequest(request, {
    endpoint: '/auth/refresh',
    method: 'POST',
  });
}
