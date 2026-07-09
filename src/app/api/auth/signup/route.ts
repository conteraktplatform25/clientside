import { NextRequest } from 'next/server';
import { proxyRequest } from '@/lib/api/backend/backend-proxy';

export async function POST(request: NextRequest) {
  return proxyRequest(request, {
    endpoint: '/auth/register',
    method: 'POST',
  });
}
