'use client';

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { queryKeys } from '@/shared/utils/query-keys';
import { getUser } from './server';
import type { AuthUser } from './types';

/**
 * React Query hook for fetching the current user
 *
 * @param initialData - Optional initial data from Server Component
 * @returns Query result with user data
 *
 * @example
 * ```typescript
 * 'use client'
 * import { useAuthQuery } from '@repo/supabase-client/auth'
 *
 * export function UserProfile({ initialUser }) {
 *   const { data: user, isLoading, error } = useAuthQuery(initialUser)
 *
 *   if (isLoading) return <div>Loading...</div>
 *   if (error) return <div>Error: {error.message}</div>
 *   if (!user) return <div>Not authenticated</div>
 *
 *   return <div>Hello, {user.email}</div>
 * }
 * ```
 *
 * @example
 * ```typescript
 * // With Server Component initialData
 * // app/profile/page.tsx (Server Component)
 * import { getUser } from '@repo/supabase-client/auth/server'
 * import { UserProfile } from './UserProfile'
 *
 * export default async function ProfilePage() {
 *   const initialUser = await getUser()
 *   return <UserProfile initialUser={initialUser} />
 * }
 *
 * // app/profile/UserProfile.tsx (Client Component)
 * 'use client'
 * import { useAuthQuery } from '@repo/supabase-client/auth'
 *
 * export function UserProfile({ initialUser }) {
 *   const { data: user } = useAuthQuery(initialUser)
 *   return <div>Hello, {user?.email}</div>
 * }
 * ```
 */
export function useAuthQuery(
  initialData?: AuthUser | null
): UseQueryResult<AuthUser | null, Error> {
  return useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: async () => {
      return await getUser();
    },
    initialData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
