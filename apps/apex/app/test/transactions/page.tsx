import { getTransactions } from '@repo/supabase-client/transactions/server';
import { TransactionsTestClient } from './TransactionsTestClient';

// Mock user ID for testing (in production, get from auth session)
const TEST_USER_ID = '00000000-0000-0000-0000-000000000000';

export default async function TransactionsTestPage() {
  let initialTransactions;
  let error = null;

  try {
    initialTransactions = await getTransactions(TEST_USER_ID);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Unknown error';
    initialTransactions = [];
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Apex - Transactions Integration Test</h1>

      {error && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-yellow-800">Server fetch error: {error}</p>
          <p className="text-sm text-yellow-600 mt-2">
            This is expected if you haven't set up Supabase environment variables yet.
          </p>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Server Component Data:</h2>
        <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-64">
          {JSON.stringify(initialTransactions, null, 2)}
        </pre>
      </div>

      <TransactionsTestClient userId={TEST_USER_ID} initialTransactions={initialTransactions} />
    </div>
  );
}
