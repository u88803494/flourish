import { createMiddlewareClient } from '@repo/supabase-client/middleware';
import { sanitizeRedirectPath } from '@repo/supabase-client/lib/utils/url-validator';
import { type NextRequest, NextResponse } from 'next/server';

/**
 * Authentication Middleware
 *
 * Handles session refresh and route protection for the application.
 *
 * Security Features:
 * - Open Redirect prevention via URL validation
 * - Fail-secure error handling (redirects to maintenance on auth service failure)
 *
 * Performance Optimizations:
 * - Early return for static assets (no Supabase API call)
 * - Early return for public routes (no Supabase API call)
 * - Only calls Supabase API when authentication check is needed
 */

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/transactions',
  '/profile',
  '/settings',
  '/cards',
  '/categories',
  '/statements',
];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/login'];

// Public routes that don't need any authentication check
const publicRoutes = ['/', '/about', '/pricing', '/maintenance'];

// Static asset patterns - skip middleware entirely
const STATIC_PATTERNS = [
  /^\/_next/,
  /^\/api/,
  /^\/favicon/,
  /\.(ico|png|jpg|jpeg|svg|css|js|woff|woff2)$/,
];

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Performance: Skip static assets entirely
  if (STATIC_PATTERNS.some((pattern) => pattern.test(pathname))) {
    return NextResponse.next();
  }

  // Performance: Public routes don't need auth check
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Determine route type
  const needsAuth = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  // Performance: Routes that don't need auth check can pass through
  if (!needsAuth && !isAuthRoute) {
    return NextResponse.next();
  }

  // Routes that need auth check - call Supabase API
  try {
    const { getUser, response } = createMiddlewareClient(request);
    const user = await getUser();

    // Protected route + not logged in = redirect to login
    if (needsAuth && !user) {
      // Validate callback URL to prevent Open Redirect
      const safeCallbackUrl = sanitizeRedirectPath(pathname);
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', safeCallbackUrl);
      return NextResponse.redirect(loginUrl);
    }

    // Auth route + logged in = redirect to dashboard
    if (isAuthRoute && user) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return response;
  } catch (error) {
    // Log error for debugging
    console.error('[Middleware Error]', {
      error: error instanceof Error ? error.message : 'Unknown error',
      pathname,
      timestamp: new Date().toISOString(),
    });

    // Fail-secure: Protected routes redirect to maintenance page
    // Public routes continue (graceful degradation)
    if (needsAuth) {
      return NextResponse.redirect(new URL('/maintenance', request.url));
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
