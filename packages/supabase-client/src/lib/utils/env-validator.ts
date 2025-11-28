/**
 * Environment Variable Validator
 *
 * Provides type-safe validation for Supabase environment variables using Zod.
 * Throws descriptive errors at runtime if required variables are missing or invalid.
 */

import { z } from 'zod';

/**
 * Zod schema for Supabase environment variables
 *
 * Validates:
 * - NEXT_PUBLIC_SUPABASE_URL: Must be a valid URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY: Must be a non-empty string
 */
const supabaseEnvSchema = z.object({
  url: z
    .string({
      message:
        '[Supabase Config] NEXT_PUBLIC_SUPABASE_URL is not defined. Please set this environment variable in your .env.local file.',
    })
    .url({
      message: '[Supabase Config] NEXT_PUBLIC_SUPABASE_URL must be a valid URL.',
    }),
  anonKey: z
    .string({
      message:
        '[Supabase Config] NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined. Please set this environment variable in your .env.local file.',
    })
    .min(1, {
      message: '[Supabase Config] NEXT_PUBLIC_SUPABASE_ANON_KEY cannot be empty.',
    }),
});

/**
 * Inferred TypeScript type from Zod schema
 */
export type SupabaseEnv = z.infer<typeof supabaseEnvSchema>;

/**
 * Validates and returns Supabase environment variables.
 *
 * @throws ZodError with descriptive messages if validation fails
 * @returns Object containing validated url and anonKey
 */
export function getSupabaseEnv(): SupabaseEnv {
  return supabaseEnvSchema.parse({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
}
