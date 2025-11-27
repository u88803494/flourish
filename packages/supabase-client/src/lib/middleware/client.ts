import {
  createServerClient as createSupabaseServerClient,
  type CookieOptions,
} from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '../../shared/types/database';

// Use a generic type to avoid version conflicts in monorepo
type MiddlewareRequest = {
  cookies: {
    getAll(): Array<{ name: string; value: string }>;
    set(name: string, value: string): void;
  };
  headers: Headers;
  url: string;
};

/**
 * Create a Supabase client for Next.js Middleware
 *
 * This client is specifically designed for use in middleware where
 * cookies need to be read from the request and set on the response.
 *
 * @param request - The incoming Next.js request
 * @returns Object containing the Supabase client, response, and user getter
 *
 * @example
 * ```typescript
 * // In middleware.ts
 * import { createMiddlewareClient } from '@repo/supabase-client/middleware'
 *
 * export async function middleware(request: NextRequest) {
 *   const { supabase, response, getUser } = createMiddlewareClient(request)
 *   const user = await getUser()
 *
 *   if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
 *     return NextResponse.redirect(new URL('/login', request.url))
 *   }
 *
 *   return response
 * }
 * ```
 */
export function createMiddlewareClient(request: MiddlewareRequest) {
  // Create a response that we can modify
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Update request cookies
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          // Create a new response with updated cookies
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });

          // Set cookies on the response
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options as CookieOptions);
          });
        },
      },
    }
  );

  /**
   * Get the currently authenticated user
   * This also refreshes the session if needed
   */
  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  }

  return {
    supabase,
    get response() {
      return response;
    },
    getUser,
  };
}
