import { NextResponse, NextRequest } from 'next/server';

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

  const accessToken = request.cookies.get('contakt_access_token')?.value;
  console.log('Profile Info AccessToken:', accessToken);
  const isAuthenticated = !!accessToken;

  /* ========================================================================================
     AUTHENTICATION LOGIC
  =========================================================================================== */
  const isAuthRoute = pathname.startsWith('/login');
  const isPlatformRoute = pathname.startsWith('/business');

  if (!isAuthenticated && isPlatformRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL(`/business`, request.url));
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
