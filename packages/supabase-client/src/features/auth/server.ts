'use server';

import { createServerClient } from '@/lib/server';
import { revalidatePath } from 'next/cache';
import type { AuthUser, SignInCredentials, SignUpCredentials } from './types';

/**
 * Get the currently authenticated user
 *
 * @returns User object if authenticated, null otherwise
 *
 * @example
 * ```typescript
 * // In a Server Component
 * import { getUser } from '@repo/supabase-client/auth/server'
 *
 * export default async function ProfilePage() {
 *   const user = await getUser()
 *   if (!user) return <div>Not authenticated</div>
 *   return <div>Hello, {user.email}</div>
 * }
 * ```
 */
export async function getUser(): Promise<AuthUser | null> {
  const supabase = await createServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email || '',
    createdAt: user.created_at,
  };
}

/**
 * Sign in a user with email and password
 *
 * @param credentials - Email and password credentials
 * @returns User object if successful
 * @throws Error if sign in fails
 *
 * @example
 * ```typescript
 * 'use server'
 * import { signIn } from '@repo/supabase-client/auth/server'
 *
 * export async function handleSignIn(email: string, password: string) {
 *   try {
 *     const user = await signIn({ email, password })
 *     return { success: true, user }
 *   } catch (error) {
 *     return { success: false, error: error.message }
 *   }
 * }
 * ```
 */
export async function signIn(credentials: SignInCredentials): Promise<AuthUser> {
  const supabase = await createServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.signInWithPassword(credentials);

  if (error || !user) {
    throw new Error(error?.message || 'Sign in failed');
  }

  revalidatePath('/', 'layout');

  return {
    id: user.id,
    email: user.email || '',
    createdAt: user.created_at,
  };
}

/**
 * Sign up a new user with email and password
 *
 * @param credentials - Email and password credentials
 * @returns User object if successful
 * @throws Error if sign up fails
 *
 * @example
 * ```typescript
 * 'use server'
 * import { signUp } from '@repo/supabase-client/auth/server'
 *
 * export async function handleSignUp(email: string, password: string) {
 *   try {
 *     const user = await signUp({ email, password })
 *     return { success: true, user }
 *   } catch (error) {
 *     return { success: false, error: error.message }
 *   }
 * }
 * ```
 */
export async function signUp(credentials: SignUpCredentials): Promise<AuthUser> {
  const supabase = await createServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp(credentials);

  if (error || !user) {
    throw new Error(error?.message || 'Sign up failed');
  }

  revalidatePath('/', 'layout');

  return {
    id: user.id,
    email: user.email || '',
    createdAt: user.created_at,
  };
}

/**
 * Sign out the currently authenticated user
 *
 * @throws Error if sign out fails
 *
 * @example
 * ```typescript
 * 'use server'
 * import { signOut } from '@repo/supabase-client/auth/server'
 *
 * export async function handleSignOut() {
 *   try {
 *     await signOut()
 *     return { success: true }
 *   } catch (error) {
 *     return { success: false, error: error.message }
 *   }
 * }
 * ```
 */
export async function signOut(): Promise<void> {
  const supabase = await createServerClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/', 'layout');
}
