'use client';

import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { queryKeys } from '@/shared/utils/query-keys';
import { createTransaction, updateTransaction, deleteTransaction } from './server';
import type { Transaction, TransactionInsert, TransactionUpdate } from './types';

/**
 * React Query mutation hook for creating a transaction
 *
 * @param userId - User ID for cache invalidation
 * @returns Mutation result
 *
 * @example
 * ```typescript
 * 'use client'
 * import { useCreateTransactionMutation } from '@repo/supabase-client/transactions'
 *
 * export function CreateTransactionForm({ userId }) {
 *   const createMutation = useCreateTransactionMutation(userId)
 *
 *   async function handleSubmit(e) {
 *     e.preventDefault()
 *     const formData = new FormData(e.target)
 *
 *     try {
 *       await createMutation.mutateAsync({
 *         user_id: userId,
 *         merchant_name: formData.get('merchant'),
 *         amount: parseFloat(formData.get('amount')),
 *         date: formData.get('date'),
 *         type: 'EXPENSE',
 *       })
 *       // Show success message or redirect
 *     } catch (error) {
 *       console.error('Failed to create transaction:', error)
 *     }
 *   }
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input name="merchant" placeholder="Merchant" />
 *       <input name="amount" type="number" step="0.01" />
 *       <input name="date" type="date" />
 *       <button disabled={createMutation.isPending}>Create</button>
 *       {createMutation.error && <div>{createMutation.error.message}</div>}
 *     </form>
 *   )
 * }
 * ```
 */
export function useCreateTransactionMutation(
  userId: string
): UseMutationResult<Transaction, Error, TransactionInsert> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      // Invalidate the transactions list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.list(userId) });
    },
  });
}

/**
 * React Query mutation hook for updating a transaction
 *
 * @param userId - User ID for cache invalidation
 * @returns Mutation result
 *
 * @example
 * ```typescript
 * 'use client'
 * import { useUpdateTransactionMutation } from '@repo/supabase-client/transactions'
 *
 * export function EditTransactionForm({ transaction, userId }) {
 *   const updateMutation = useUpdateTransactionMutation(userId)
 *
 *   async function handleSubmit(e) {
 *     e.preventDefault()
 *     const formData = new FormData(e.target)
 *
 *     try {
 *       await updateMutation.mutateAsync({
 *         id: transaction.id,
 *         updates: {
 *           merchant_name: formData.get('merchant'),
 *           amount: parseFloat(formData.get('amount')),
 *         },
 *       })
 *     } catch (error) {
 *       console.error('Failed to update transaction:', error)
 *     }
 *   }
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input name="merchant" defaultValue={transaction.merchant_name} />
 *       <input name="amount" type="number" step="0.01" defaultValue={transaction.amount} />
 *       <button disabled={updateMutation.isPending}>Update</button>
 *     </form>
 *   )
 * }
 * ```
 */
export function useUpdateTransactionMutation(
  userId: string
): UseMutationResult<Transaction, Error, { id: string; updates: TransactionUpdate }> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }) => {
      return await updateTransaction(id, userId, updates);
    },
    onSuccess: (data, variables) => {
      // Update the specific transaction in the cache
      queryClient.setQueryData(queryKeys.transactions.detail(variables.id), data);
      // Invalidate the transactions list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.list(userId) });
    },
  });
}

/**
 * React Query mutation hook for deleting a transaction
 *
 * @param userId - User ID for cache invalidation
 * @returns Mutation result
 *
 * @example
 * ```typescript
 * 'use client'
 * import { useDeleteTransactionMutation } from '@repo/supabase-client/transactions'
 *
 * export function DeleteTransactionButton({ transactionId, userId }) {
 *   const deleteMutation = useDeleteTransactionMutation(userId)
 *
 *   async function handleDelete() {
 *     if (!confirm('Are you sure?')) return
 *
 *     try {
 *       await deleteMutation.mutateAsync(transactionId)
 *       // Redirect to transactions list
 *     } catch (error) {
 *       console.error('Failed to delete transaction:', error)
 *     }
 *   }
 *
 *   return (
 *     <button
 *       onClick={handleDelete}
 *       disabled={deleteMutation.isPending}
 *     >
 *       {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
 *     </button>
 *   )
 * }
 * ```
 */
export function useDeleteTransactionMutation(
  userId: string
): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteTransaction(id, userId);
    },
    onSuccess: (_, transactionId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.transactions.detail(transactionId) });
      // Invalidate the transactions list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.list(userId) });
    },
  });
}
