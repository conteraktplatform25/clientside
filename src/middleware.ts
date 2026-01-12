import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { UserObject } from 'next-auth';

const PUBLIC_PATHS = [
  '/swagger',
  '/login',
  '/register',
  'signup-otp-verification',
  '/verification',
  '/profile',
  '/forgot-password',
  '/otp-verification',
  '/reset-password',
  '/connect-number',
  '/whatsapp-connect',
  '/unauthorized',
  '/error',
];

// const roleBasedRoutes: Record<string, string[]> = {
//   '/admin': ['Admin', 'Super_Admin'],
//   '/': ['Business'],
//   '/agent': ['Agent'],
// };
const roleBasedRoutes: Array<{
  prefix: string;
  allowedRoles: string[];
}> = [
  { prefix: '/admin', allowedRoles: ['Admin', 'Super_Admin'] },
  { prefix: '/agent', allowedRoles: ['Agent'] },
];

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

  const user = token.data.user as UserObject;
  const isAdmin = user.role === 'Admin' || user.role === 'Super_Admin';
  const full_name = `${user.first_name} ${user.last_name}`;

  // Only BUSINESS users go to profile completion
  if (!isAdmin && !user.is_activated && !pathname.startsWith('/profile')) {
    return NextResponse.redirect(new URL(`/profile?verified=true&email=${user.email}&name=${full_name}`, req.url));
  }

  //const userRole = user.role;
  for (const { prefix, allowedRoles } of roleBasedRoutes) {
    if (pathname.startsWith(prefix) && !allowedRoles.includes(user.role)) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|login|register|signup-otp-verification|verification|forgot-password|otp-verification|profile|reset-password|_next|.*\\.(?:png|jpg|jpeg|svg|css|js|ico)$).*)',
  ],
};
