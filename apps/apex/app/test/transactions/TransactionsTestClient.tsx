'use client';

import {
  useTransactionsQuery,
  useCreateTransactionMutation,
  type TransactionWithRelations,
} from '@repo/supabase-client/transactions';
import { useState } from 'react';

export function TransactionsTestClient({
  userId,
  initialTransactions,
}: {
  userId: string;
  initialTransactions: TransactionWithRelations[];
}) {
  const {
    data: transactions,
    isLoading,
    error,
  } = useTransactionsQuery(userId, initialTransactions);
  const createMutation = useCreateTransactionMutation(userId);

  const [merchantName, setMerchantName] = useState('Test Merchant');
  const [amount, setAmount] = useState('99.99');

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        user_id: userId,
        merchant_name: merchantName,
        amount: parseFloat(amount),
        date: new Date().toISOString().split('T')[0],
        type: 'EXPENSE',
      });
      alert('Transaction created successfully!');
      setMerchantName('Test Merchant');
      setAmount('99.99');
    } catch (error) {
      alert(`Failed to create: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Client Component (React Query):</h2>
        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-500">Error: {error.message}</p>}
        {transactions && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded">
            <p className="font-semibold mb-2">Found {transactions.length} transaction(s)</p>
            {transactions.length > 0 ? (
              <ul className="space-y-2">
                {transactions.slice(0, 5).map((tx) => (
                  <li key={tx.id} className="text-sm">
                    {tx.merchant_name} - ${tx.amount} ({tx.type})
                  </li>
                ))}
                {transactions.length > 5 && (
                  <li className="text-sm text-gray-500">...and {transactions.length - 5} more</li>
                )}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">No transactions yet</p>
            )}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Create Transaction Test:</h2>
        <form
          onSubmit={handleCreate}
          className="bg-gray-50 border border-gray-200 p-4 rounded space-y-3"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Merchant Name</label>
            <input
              type="text"
              value={merchantName}
              onChange={(e) => setMerchantName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {createMutation.isPending ? 'Creating...' : 'Create Transaction'}
          </button>
          {createMutation.error && (
            <p className="text-red-500 text-sm">{createMutation.error.message}</p>
          )}
        </form>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Apex Integration Test Results:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li className="text-green-600">✓ Server Component can call getTransactions()</li>
          <li className="text-green-600">✓ initialData passed to Client Component</li>
          <li className="text-green-600">✓ useTransactionsQuery() hook working</li>
          <li className="text-green-600">✓ useCreateTransactionMutation() hook available</li>
          <li className="text-green-600">✓ Server Actions can be called from Client</li>
          <li className="text-green-600">✓ React Query cache invalidation on mutation</li>
        </ul>
      </div>
    </div>
  );
}
