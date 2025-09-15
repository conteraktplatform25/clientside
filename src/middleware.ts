import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/profile',
  '/verification',
  '/forgot-password',
  '/reset-password',
  '/connect-number',
  '/whatsapp-connect',
  '/not-found',
  '/unauthorized',
  '/error',
  '/api',
];

// RBAC mapping: which roles can access which routes
const roleBasedRoutes: Record<string, string[]> = {
  '/admin': ['Admin'],
  '/': ['Business'],
  '/agent': ['Agent'],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow static files & public routes
  if (
    PUBLIC_PATHS.some((path) => pathname.startsWith(path)) ||
    pathname.startsWith('/_next') ||
    pathname.match(/\.(png|jpg|jpeg|svg|css|js|ico)$/)
  ) {
    return NextResponse.next();
  }

  // Retrieve token (from next-auth cookie/session)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || !token.data?.user) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const userRole = token.data.user.role;

  // Role-based restrictions
  for (const [route, allowedRoles] of Object.entries(roleBasedRoutes)) {
    if (pathname.startsWith(route) && !allowedRoles.includes(userRole)) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  return NextResponse.next();
}

// Apply middleware to all routes except static assets
export const config = {
  matcher: ['/((?!_next|.*\\.(?:png|jpg|jpeg|svg|css|js|ico)).*)'],
};
