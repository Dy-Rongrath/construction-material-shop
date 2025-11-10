import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/session';
import {
  handleCORS,
  rateLimit,
  generalLimiter,
  authLimiter,
  apiLimiter,
  applySecurityHeaders,
  sanitizeInput,
  detectSQLInjection,
  detectXSS,
} from '@/lib/security';

// Protected routes that require authentication
const protectedRoutes = ['/account', '/checkout', '/order-confirmation'];

// Auth routes that should redirect to home if already authenticated
const authRoutes = ['/auth/login', '/auth/register'];

// API routes that need rate limiting
// const apiRoutes = ['/api'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle CORS
  const corsResponse = handleCORS(request);
  if (corsResponse) {
    applySecurityHeaders(corsResponse);
    return corsResponse;
  }

  // Apply rate limiting based on route type
  if (pathname.startsWith('/api/auth')) {
    const rateLimitResult = await rateLimit(request, authLimiter);
    if (!rateLimitResult.success) {
      applySecurityHeaders(rateLimitResult.response!);
      return rateLimitResult.response;
    }
  } else if (pathname.startsWith('/api')) {
    const rateLimitResult = await rateLimit(request, apiLimiter);
    if (!rateLimitResult.success) {
      applySecurityHeaders(rateLimitResult.response!);
      return rateLimitResult.response;
    }
  } else {
    const rateLimitResult = await rateLimit(request, generalLimiter);
    if (!rateLimitResult.success) {
      applySecurityHeaders(rateLimitResult.response!);
      return rateLimitResult.response;
    }
  }

  // Input validation and sanitization for API routes
  if (pathname.startsWith('/api')) {
    // Check query parameters for malicious input
    for (const [, value] of request.nextUrl.searchParams) {
      const sanitized = sanitizeInput(value);
      if (detectSQLInjection(sanitized) || detectXSS(sanitized)) {
        const response = NextResponse.json(
          { error: 'Bad Request', message: 'Invalid input detected' },
          { status: 400 }
        );
        applySecurityHeaders(response);
        return response;
      }
    }
  }

  // Get session from secure HttpOnly cookie
  const session = await getSession(request);
  const isAuthenticated = !!session;

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && authRoutes.some(route => pathname.startsWith(route))) {
    const response = NextResponse.redirect(new URL('/', request.url));
    applySecurityHeaders(response);
    return response;
  }

  // Redirect unauthenticated users to login for protected routes
  if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(loginUrl);
    applySecurityHeaders(response);
    return response;
  }

  // Admin guard: redirect non‑admins to home for /admin routes
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(loginUrl);
      applySecurityHeaders(response);
      return response;
    }
    // Lightweight email check from cookie session
    const email = session?.user?.email?.toLowerCase?.();
    const list = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean);
    if (!email || !list.includes(email)) {
      const response = NextResponse.redirect(new URL('/', request.url));
      applySecurityHeaders(response);
      return response;
    }
  }

  // For all other requests, ensure security headers are applied
  const response = NextResponse.next();
  applySecurityHeaders(response);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};
