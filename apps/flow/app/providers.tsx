'use client';

import { ReactQueryProvider } from '@repo/supabase-client/provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return <ReactQueryProvider>{children}</ReactQueryProvider>;
}
