'use client';

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { queryKeys } from '../../shared/utils/query-keys';
import { getTransactions, getTransaction } from './server';
import type { TransactionWithRelations } from './types';

/**
 * React Query hook for fetching all transactions for a user
 *
 * @param userId - User ID to filter transactions
 * @param initialData - Optional initial data from Server Component
 * @returns Query result with transactions array
 *
 * @example
 * ```typescript
 * 'use client'
 * import { useTransactionsQuery } from '@repo/supabase-client/transactions'
 *
 * export function TransactionsList({ userId, initialTransactions }) {
 *   const { data: transactions, isLoading, error } = useTransactionsQuery(
 *     userId,
 *     initialTransactions
 *   )
 *
 *   if (isLoading) return <div>Loading...</div>
 *   if (error) return <div>Error: {error.message}</div>
 *
 *   return (
 *     <ul>
 *       {transactions.map(tx => (
 *         <li key={tx.id}>{tx.merchant_name} - ${tx.amount}</li>
 *       ))}
 *     </ul>
 *   )
 * }
 * ```
 *
 * @example
 * ```typescript
 * // With Server Component initialData pattern
 * // app/transactions/page.tsx (Server Component)
 * import { getTransactions } from '@repo/supabase-client/transactions/server'
 * import { TransactionsList } from './TransactionsList'
 *
 * export default async function TransactionsPage() {
 *   const initialTransactions = await getTransactions(userId)
 *   return <TransactionsList userId={userId} initialTransactions={initialTransactions} />
 * }
 *
 * // app/transactions/TransactionsList.tsx (Client Component)
 * 'use client'
 * import { useTransactionsQuery } from '@repo/supabase-client/transactions'
 *
 * export function TransactionsList({ userId, initialTransactions }) {
 *   const { data: transactions } = useTransactionsQuery(userId, initialTransactions)
 *   // Data is immediately available from Server Component, no loading state
 *   return <div>{transactions.length} transactions</div>
 * }
 * ```
 */
export function useTransactionsQuery(
  userId: string,
  initialData?: TransactionWithRelations[]
): UseQueryResult<TransactionWithRelations[], Error> {
  return useQuery({
    queryKey: queryKeys.transactions.list(userId),
    queryFn: async () => {
      return await getTransactions(userId);
    },
    initialData,
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!userId,
  });
}

/**
 * React Query hook for fetching a single transaction
 *
 * @param id - Transaction ID
 * @param userId - User ID for authorization
 * @param initialData - Optional initial data from Server Component
 * @returns Query result with single transaction
 *
 * @example
 * ```typescript
 * 'use client'
 * import { useTransactionQuery } from '@repo/supabase-client/transactions'
 *
 * export function TransactionDetail({ id, userId, initialTransaction }) {
 *   const { data: transaction, isLoading, error } = useTransactionQuery(
 *     id,
 *     userId,
 *     initialTransaction
 *   )
 *
 *   if (isLoading) return <div>Loading...</div>
 *   if (error) return <div>Error: {error.message}</div>
 *   if (!transaction) return <div>Not found</div>
 *
 *   return (
 *     <div>
 *       <h1>{transaction.merchant_name}</h1>
 *       <p>Amount: ${transaction.amount}</p>
 *       <p>Category: {transaction.category?.name}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useTransactionQuery(
  id: string,
  userId: string,
  initialData?: TransactionWithRelations
): UseQueryResult<TransactionWithRelations, Error> {
  return useQuery({
    queryKey: queryKeys.transactions.detail(id),
    queryFn: async () => {
      return await getTransaction(id, userId);
    },
    initialData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id && !!userId,
  });
}
