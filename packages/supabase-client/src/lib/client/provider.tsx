'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

/**
 * React Query Provider for Flourish applications
 *
 * This component wraps the entire application to provide React Query
 * functionality including caching, background refetching, and optimistic updates.
 *
 * @param children - React children to be wrapped by the provider
 *
 * @example
 * ```typescript
 * // app/layout.tsx
 * import { ReactQueryProvider } from '@repo/supabase-client/provider'
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <ReactQueryProvider>
 *           {children}
 *         </ReactQueryProvider>
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 */
export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  // Create a client instance per request to prevent cross-request pollution
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data is considered fresh for 5 minutes
            staleTime: 5 * 60 * 1000,
            // Don't refetch on window focus by default
            refetchOnWindowFocus: false,
            // Retry failed requests once
            retry: 1,
          },
          mutations: {
            // Retry failed mutations once
            retry: 1,
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
