import { getUser } from '@repo/supabase-client/auth/server';
import { AuthTestClient } from './AuthTestClient';

export default async function AuthTestPage() {
  const initialUser = await getUser();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Integration Test</h1>
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Server Component Data:</h2>
        <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(initialUser, null, 2)}</pre>
      </div>
      <AuthTestClient initialUser={initialUser} />
    </div>
  );
}
