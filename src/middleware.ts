import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const PUBLIC_PATHS = [
  '/swagger',
  '/login',
  '/register',
  '/verification',
  '/forgot-password',
  '/otp-verification',
  '/reset-password',
  '/connect-number',
  '/whatsapp-connect',
  '/unauthorized',
  '/error',
];

const roleBasedRoutes: Record<string, string[]> = {
  '/admin': ['Admin'],
  '/': ['Business'],
  '/agent': ['Agent'],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip NextAuth routes and public routes
  if (
    pathname.startsWith('/api/auth') ||
    PUBLIC_PATHS.some((path) => pathname.startsWith(path)) ||
    pathname.startsWith('/_next') ||
    pathname.match(/\.(png|jpg|jpeg|svg|css|js|ico)$/)
  ) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.data?.user) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const userRole = token.data.user.role;
  for (const [route, allowedRoles] of Object.entries(roleBasedRoutes)) {
    if (pathname.startsWith(route) && !allowedRoles.includes(userRole)) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api/auth|api/docs|login|register|verification|forgot-password|otp-verification|reset-password|_next|.*\\.(?:png|jpg|jpeg|svg|css|js|ico)$).*)',
  ],
};
