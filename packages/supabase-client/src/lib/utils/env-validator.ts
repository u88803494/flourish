/**
 * Environment Variable Validator
 *
 * Provides type-safe validation for Supabase environment variables.
 * Throws descriptive errors at runtime if required variables are missing.
 */

interface SupabaseEnv {
  url: string;
  anonKey: string;
}

/**
 * Validates and returns Supabase environment variables.
 *
 * @throws Error if NEXT_PUBLIC_SUPABASE_URL is not defined
 * @throws Error if NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined
 * @returns Object containing validated url and anonKey
 */
export function getSupabaseEnv(): SupabaseEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error(
      '[Supabase Config] NEXT_PUBLIC_SUPABASE_URL is not defined. ' +
        'Please set this environment variable in your .env.local file.'
    );
  }

  if (!anonKey) {
    throw new Error(
      '[Supabase Config] NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined. ' +
        'Please set this environment variable in your .env.local file.'
    );
  }

  return { url, anonKey };
}
