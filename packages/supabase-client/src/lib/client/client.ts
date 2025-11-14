import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr';
import type { Database } from '@/shared/types/database';

/**
 * Create a Supabase client for Client Components
 *
 * This client uses browser cookies to manage authentication state.
 * It should be used in Client Components when you need to interact
 * with Supabase directly from the client.
 *
 * @returns Supabase client instance configured for browser usage
 *
 * @example
 * ```typescript
 * 'use client'
 * import { createBrowserClient } from '@repo/supabase-client/client'
 *
 * export function MyComponent() {
 *   const supabase = createBrowserClient()
 *
 *   async function handleSignIn() {
 *     await supabase.auth.signInWithPassword({ email, password })
 *   }
 *
 *   return <button onClick={handleSignIn}>Sign In</button>
 * }
 * ```
 */
export function createBrowserClient() {
  return createSupabaseBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
