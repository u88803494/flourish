import { getUser } from '@repo/supabase-client/auth/server';
import { redirect } from 'next/navigation';
import { DashboardClient } from './dashboard-client';

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login?callbackUrl=/dashboard');
  }

  return <DashboardClient initialUser={user} />;
}
