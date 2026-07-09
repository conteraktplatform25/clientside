import { NextResponse, NextRequest } from 'next/server';

interface ProxyRequestOptions {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD';
}

const FORWARDED_HEADERS = ['accept-language', 'user-agent', 'x-forwarded-for', 'x-forwarded-proto'] as const;

export async function proxyRequest(request: NextRequest, { endpoint, method = 'GET' }: ProxyRequestOptions) {
  try {
    const backendUrl = new URL(endpoint, process.env.NEXT_PUBLIC_API_URL);
    backendUrl.search = request.nextUrl.search;

    const headers = new Headers({
      Accept: 'application/json',
    });
    const contentType = request.headers.get('content-type');
    if (contentType) {
      headers.set('Content-Type', contentType);
    }

    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) {
      headers.set('Cookie', cookieHeader);
    }

    for (const header of FORWARDED_HEADERS) {
      const value = request.headers.get(header);

      if (value) {
        headers.set(header, value);
      }
    }

    /**
     * Read request body only when necessary.
     */
    let body: BodyInit | undefined;
    if (method !== 'GET' && method !== 'HEAD') {
      body = await request.text();
    }
    const backendResponse = await fetch(backendUrl, {
      method,
      headers,
      body,
      redirect: 'manual',
      cache: 'no-store',
    });
    // console.log('******************** Next Body route trigerred *********************', backendResponse);

    const responseContentType = backendResponse.headers.get('content-type');

    let payload: unknown = null;

    if (responseContentType?.includes('application/json')) {
      payload = await backendResponse.json();
    } else {
      payload = await backendResponse.text();
    }

    const response = NextResponse.json(payload, {
      status: backendResponse.status,
    });

    /**
     * Forward every Set-Cookie header exactly as received.
     */
    const setCookies = backendResponse.headers.getSetCookie();
    for (const cookie of setCookies) {
      response.headers.append('Set-Cookie', cookie);
    }

    return response;
  } catch (error) {
    console.error('Backend proxy error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Unable to reach backend service.',
      },
      {
        status: 503,
      },
    );
  }
}
