'use client';

import { Suspense } from 'react';
import { LoginContent } from './login-content';

function LoginPageSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md h-96 bg-muted animate-pulse rounded-lg" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageSkeleton />}>
      <LoginContent />
    </Suspense>
  );
}
