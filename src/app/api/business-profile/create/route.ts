import { NextRequest } from 'next/server';
import { proxyRequest } from '@/lib/api/backend/backend-proxy';

export async function POST(request: NextRequest) {
  console.log('Backend Api triggered');
  return proxyRequest(request, {
    endpoint: '/business/create-profile',
    method: 'POST',
  });
}
