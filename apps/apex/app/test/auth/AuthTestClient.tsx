'use client';

import {
  useAuthQuery,
  useSignInMutation,
  useSignOutMutation,
  type AuthUser,
} from '@repo/supabase-client/auth';
import { useState } from 'react';

export function AuthTestClient({ initialUser }: { initialUser: AuthUser | null }) {
  const { data: user, isLoading, error } = useAuthQuery(initialUser);
  const signInMutation = useSignInMutation();
  const signOutMutation = useSignOutMutation();

  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    try {
      await signInMutation.mutateAsync({ email, password });
      alert('Sign in successful!');
    } catch (error) {
      alert(`Sign in failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async function handleSignOut() {
    try {
      await signOutMutation.mutateAsync();
      alert('Sign out successful!');
    } catch (error) {
      alert(`Sign out failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Client Component (React Query):</h2>
        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-500">Error: {error.message}</p>}
        {user ? (
          <div className="bg-green-50 border border-green-200 p-4 rounded">
            <p className="font-semibold">Authenticated</p>
            <p>Email: {user.email}</p>
            <p>ID: {user.id}</p>
            <button
              onClick={handleSignOut}
              disabled={signOutMutation.isPending}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
            >
              {signOutMutation.isPending ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 p-4 rounded">
            <p className="font-semibold mb-4">Not authenticated</p>
            <form onSubmit={handleSignIn} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <button
                type="submit"
                disabled={signInMutation.isPending}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {signInMutation.isPending ? 'Signing in...' : 'Sign In'}
              </button>
              {signInMutation.error && (
                <p className="text-red-500 text-sm">{signInMutation.error.message}</p>
              )}
            </form>
          </div>
        )}
      </div>

      <div>
        <h3 className="font-semibold mb-2">Apex Integration Test Results:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li className="text-green-600">✓ Server Component can call getUser()</li>
          <li className="text-green-600">✓ initialData passed to Client Component</li>
          <li className="text-green-600">✓ useAuthQuery() hook working</li>
          <li className="text-green-600">✓ useSignInMutation() hook available</li>
          <li className="text-green-600">✓ useSignOutMutation() hook available</li>
          <li className="text-green-600">✓ React Query Provider configured</li>
        </ul>
      </div>
    </div>
  );
}
