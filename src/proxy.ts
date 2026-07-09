import { NextRequest, NextResponse } from 'next/server';

const AUTH_ROUTES = ['/login', 'signup-otp-verification', '/register'];
const PROTECTED_ROUTES = [
  '/business-profile',
  '/connect-business-details',
  '/connect-number',
  '/meta-connect',
  '/business',
  '/admin',
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /**
   * Skip API routes and static assets
   */
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  // const accessToken = request.cookies.get('contakt_access_token')?.value;
  const accessToken = request.cookies.get('contakt_access_token')?.value;
  // const refreshToken = request.cookies.get('contakt_refresh_token')?.value;
  console.log('Profile Info AccessToken:', accessToken);

  const isAuthenticated = Boolean(accessToken);
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/business/:path*',
    '/admin/:path*',
    '/login',
    '/register',
    '/((?!api|_next|favicon.ico|images|icons|fonts|.*\\..*).*)',
  ],
};
