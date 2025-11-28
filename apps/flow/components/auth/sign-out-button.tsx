'use client';

import { useRouter } from 'next/navigation';
import { useSignOutMutation } from '@repo/supabase-client/auth';
import { Button } from '@repo/ui/button';

interface SignOutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  className?: string;
}

export function SignOutButton({ variant = 'ghost', className }: SignOutButtonProps) {
  const router = useRouter();
  const signOutMutation = useSignOutMutation();

  async function handleSignOut() {
    try {
      await signOutMutation.mutateAsync();
      router.push('/');
    } catch (error) {
      console.error('[Sign Out Error]', error);
      // Fail-safe: redirect to home even on error
      router.push('/');
    }
  }

  return (
    <Button
      variant={variant}
      onClick={handleSignOut}
      disabled={signOutMutation.isPending}
      className={className}
    >
      {signOutMutation.isPending ? '登出中...' : '登出'}
    </Button>
  );
}
