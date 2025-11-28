import { getUser } from '@repo/supabase-client/auth/server';
import { redirect } from 'next/navigation';
import { ProfileClient } from './profile-client';

export default async function ProfilePage() {
  const user = await getUser();

  if (!user) {
    redirect('/login?callbackUrl=/profile');
  }

  return <ProfileClient initialUser={user} />;
}
