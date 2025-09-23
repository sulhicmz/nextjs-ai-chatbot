import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { guestRegex, isDevelopmentEnvironment } from './lib/constants';
import { debugLog } from './lib/debug';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  debugLog('Middleware called for path:', pathname);

  /*
   * Playwright starts the dev server and requires a 200 status to
   * begin the tests, so this ensures that the tests can start
   */
  if (pathname.startsWith('/ping')) {
    return new Response('pong', { status: 200 });
  }

  if (pathname.startsWith('/api/auth')) {
    debugLog('Skipping auth for auth API routes');
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: !isDevelopmentEnvironment,
  });
  debugLog('Token from middleware:', token ? 'Exists' : 'Missing');

  if (!token) {
    debugLog('No token found, redirecting to guest auth');
    const redirectUrl = encodeURIComponent(request.url);

    return NextResponse.redirect(
      new URL(`/api/auth/guest?redirectUrl=${redirectUrl}`, request.url),
    );
  }

  const isGuest = guestRegex.test(token?.email ?? '');
  debugLog('Is guest user:', isGuest);

  if (token && !isGuest && ['/login', '/register'].includes(pathname)) {
    debugLog(
      'Authenticated user accessing login/register, redirecting to home',
    );
    return NextResponse.redirect(new URL('/', request.url));
  }

  debugLog('Allowing request to proceed');
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/chat/:id',
    '/api/:path*',
    '/login',
    '/register',

    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
