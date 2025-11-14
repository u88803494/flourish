import 'server-only';

import {
  createServerClient as createSupabaseServerClient,
  type CookieOptions,
} from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '../../shared/types/database';

/**
 * Create a Supabase client for Server Components and Server Actions
 *
 * This client uses Next.js cookies() to manage authentication state.
 * It can only be used in Server Components and Server Actions.
 *
 * @returns Supabase client instance configured for server-side usage
 *
 * @example
 * ```typescript
 * // In a Server Component
 * import { createServerClient } from '@repo/supabase-client/server'
 *
 * export default async function Page() {
 *   const supabase = await createServerClient()
 *   const { data } = await supabase.from('transactions').select('*')
 *   return <div>{data?.length} transactions</div>
 * }
 * ```
 *
 * @example
 * ```typescript
 * // In a Server Action
 * 'use server'
 * import { createServerClient } from '@repo/supabase-client/server'
 *
 * export async function getTransactions(userId: string) {
 *   const supabase = await createServerClient()
 *   return await supabase.from('transactions').select('*').eq('user_id', userId)
 * }
 * ```
 */
export async function createServerClient() {
  const cookieStore = await cookies();

  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options as CookieOptions);
            });
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
