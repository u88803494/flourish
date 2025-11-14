'use client';

import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { queryKeys } from '../../shared/utils/query-keys';
import { signIn, signUp, signOut } from './server';
import type { AuthUser, SignInCredentials, SignUpCredentials } from './types';

/**
 * React Query mutation hook for signing in
 *
 * @returns Mutation result
 *
 * @example
 * ```typescript
 * 'use client'
 * import { useSignInMutation } from '@repo/supabase-client/auth'
 *
 * export function SignInForm() {
 *   const signInMutation = useSignInMutation()
 *
 *   async function handleSubmit(e) {
 *     e.preventDefault()
 *     const formData = new FormData(e.target)
 *
 *     try {
 *       await signInMutation.mutateAsync({
 *         email: formData.get('email'),
 *         password: formData.get('password'),
 *       })
 *       // Redirect to dashboard
 *     } catch (error) {
 *       console.error('Sign in failed:', error)
 *     }
 *   }
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input name="email" type="email" />
 *       <input name="password" type="password" />
 *       <button disabled={signInMutation.isPending}>
 *         {signInMutation.isPending ? 'Signing in...' : 'Sign In'}
 *       </button>
 *       {signInMutation.error && <div>{signInMutation.error.message}</div>}
 *     </form>
 *   )
 * }
 * ```
 */
export function useSignInMutation(): UseMutationResult<AuthUser, Error, SignInCredentials> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signIn,
    onSuccess: (user) => {
      // Update the auth user query with the new user data
      queryClient.setQueryData(queryKeys.auth.user(), user);
      // Invalidate to refetch in case server state changed
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
  });
}

/**
 * React Query mutation hook for signing up
 *
 * @returns Mutation result
 *
 * @example
 * ```typescript
 * 'use client'
 * import { useSignUpMutation } from '@repo/supabase-client/auth'
 *
 * export function SignUpForm() {
 *   const signUpMutation = useSignUpMutation()
 *
 *   async function handleSubmit(e) {
 *     e.preventDefault()
 *     const formData = new FormData(e.target)
 *
 *     try {
 *       await signUpMutation.mutateAsync({
 *         email: formData.get('email'),
 *         password: formData.get('password'),
 *       })
 *       // Show success message or redirect
 *     } catch (error) {
 *       console.error('Sign up failed:', error)
 *     }
 *   }
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input name="email" type="email" />
 *       <input name="password" type="password" />
 *       <button disabled={signUpMutation.isPending}>Sign Up</button>
 *     </form>
 *   )
 * }
 * ```
 */
export function useSignUpMutation(): UseMutationResult<AuthUser, Error, SignUpCredentials> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signUp,
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.auth.user(), user);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
  });
}

/**
 * React Query mutation hook for signing out
 *
 * @returns Mutation result
 *
 * @example
 * ```typescript
 * 'use client'
 * import { useSignOutMutation } from '@repo/supabase-client/auth'
 *
 * export function SignOutButton() {
 *   const signOutMutation = useSignOutMutation()
 *
 *   async function handleSignOut() {
 *     try {
 *       await signOutMutation.mutateAsync()
 *       // Redirect to login page
 *     } catch (error) {
 *       console.error('Sign out failed:', error)
 *     }
 *   }
 *
 *   return (
 *     <button
 *       onClick={handleSignOut}
 *       disabled={signOutMutation.isPending}
 *     >
 *       {signOutMutation.isPending ? 'Signing out...' : 'Sign Out'}
 *     </button>
 *   )
 * }
 * ```
 */
export function useSignOutMutation(): UseMutationResult<void, Error, void> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      // Clear the auth user query
      queryClient.setQueryData(queryKeys.auth.user(), null);
      // Clear all cached queries
      queryClient.clear();
    },
  });
}
