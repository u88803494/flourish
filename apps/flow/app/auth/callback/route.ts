import { createServerClient } from '@repo/supabase-client/server';
import { sanitizeRedirectPath } from '@repo/supabase-client/lib/utils/url-validator';
import { NextResponse } from 'next/server';

/**
 * OAuth Callback Route Handler
 *
 * This route handles the callback from OAuth providers (e.g., Google).
 * After successful authentication, Supabase redirects here with an auth code.
 * We exchange the code for a session and redirect the user to their destination.
 *
 * Security:
 * - Validates redirect path to prevent Open Redirect attacks
 * - Only allows redirects to whitelisted internal paths
 *
 * Flow:
 * 1. User clicks "Sign in with Google"
 * 2. User authenticates with Google
 * 3. Google redirects to Supabase callback URL
 * 4. Supabase redirects to this route with an auth code
 * 5. We exchange the code for a session
 * 6. User is redirected to the dashboard (or original destination)
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  // Validate and sanitize redirect path to prevent Open Redirect attacks
  const safeRedirectPath = sanitizeRedirectPath(next);

  if (code) {
    const supabase = await createServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      // Log error for debugging (do not expose details to user)
      console.error('[Auth Callback Error]', {
        error: error.message,
        code: error.code,
        timestamp: new Date().toISOString(),
      });
      return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
    }

    // Successful authentication - redirect to safe destination
    return NextResponse.redirect(`${origin}${safeRedirectPath}`);
  }

  // Missing auth code
  console.error('[Auth Callback Error]', {
    error: 'Missing authorization code',
    timestamp: new Date().toISOString(),
  });
  return NextResponse.redirect(`${origin}/login?error=missing_code`);
}
