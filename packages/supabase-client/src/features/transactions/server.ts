'use server';

import { createServerClient } from '../../lib/server/client';
import { revalidatePath } from 'next/cache';
import type { QueryData } from '@supabase/supabase-js';
import type {
  Transaction,
  TransactionInsert,
  TransactionUpdate,
  TransactionWithRelations,
} from './types';

/**
 * Helper to bypass Supabase type inference issues
 * See TYPESCRIPT_KNOWN_ISSUES.md for details
 */
function bypassSupabaseTypeCheck(query: any): any {
  return query;
}

/**
 * Get all transactions for a user with related data
 *
 * @param userId - User ID to filter transactions
 * @returns Array of transactions with category and card relations
 *
 * @example
 * ```typescript
 * // In a Server Component
 * import { getTransactions } from '@repo/supabase-client/transactions/server'
 *
 * export default async function TransactionsPage() {
 *   const transactions = await getTransactions(userId)
 *   return (
 *     <ul>
 *       {transactions.map(tx => (
 *         <li key={tx.id}>{tx.merchant_name} - ${tx.amount}</li>
 *       ))}
 *     </ul>
 *   )
 * }
 * ```
 */
export async function getTransactions(userId: string): Promise<TransactionWithRelations[]> {
  const supabase: any = await createServerClient();

  const result = await supabase
    .from('transactions')
    .select('*, category:categories(*), card:cards(*)')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  const { data, error } = result;

  if (error) {
    throw new Error(`Failed to fetch transactions: ${error.message}`);
  }

  // Transform the data to match our type (Supabase returns different shape)
  return (data || []).map((tx: any) => ({
    ...tx,
    category: Array.isArray(tx.category) ? tx.category[0] || null : tx.category,
    card: Array.isArray(tx.card) ? tx.card[0] || null : tx.card,
  })) as TransactionWithRelations[];
}

/**
 * Get a single transaction by ID with related data
 *
 * @param id - Transaction ID
 * @param userId - User ID for authorization
 * @returns Transaction with category and card relations
 * @throws Error if transaction not found or unauthorized
 *
 * @example
 * ```typescript
 * import { getTransaction } from '@repo/supabase-client/transactions/server'
 *
 * export default async function TransactionDetailPage({ params }) {
 *   const transaction = await getTransaction(params.id, userId)
 *   return <div>{transaction.merchant_name}</div>
 * }
 * ```
 */
export async function getTransaction(
  id: string,
  userId: string
): Promise<TransactionWithRelations> {
  const supabase: any = await createServerClient();

  const result = await supabase
    .from('transactions')
    .select('*, category:categories(*), card:cards(*)')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  const { data, error } = result;

  if (error) {
    throw new Error(`Failed to fetch transaction: ${error.message}`);
  }

  if (!data) {
    throw new Error('Transaction not found');
  }

  return {
    ...data,
    category: Array.isArray((data as any).category)
      ? (data as any).category[0] || null
      : (data as any).category,
    card: Array.isArray((data as any).card) ? (data as any).card[0] || null : (data as any).card,
  } as TransactionWithRelations;
}

/**
 * Create a new transaction
 *
 * @param transaction - Transaction data to insert
 * @returns Created transaction
 * @throws Error if creation fails
 *
 * @example
 * ```typescript
 * 'use server'
 * import { createTransaction } from '@repo/supabase-client/transactions/server'
 *
 * export async function addTransaction(formData: FormData) {
 *   const transaction = await createTransaction({
 *     user_id: userId,
 *     merchant_name: formData.get('merchant'),
 *     amount: parseFloat(formData.get('amount')),
 *     date: formData.get('date'),
 *     type: 'EXPENSE',
 *   })
 *   return { success: true, transaction }
 * }
 * ```
 */
export async function createTransaction(transaction: TransactionInsert): Promise<Transaction> {
  const supabase: any = await createServerClient();

  const { data, error } = await supabase.from('transactions').insert(transaction).select().single();

  if (error) {
    throw new Error(`Failed to create transaction: ${error.message}`);
  }

  if (!data) {
    throw new Error('Transaction creation returned no data');
  }

  revalidatePath('/transactions');

  return data;
}

/**
 * Update an existing transaction
 *
 * @param id - Transaction ID
 * @param userId - User ID for authorization
 * @param updates - Transaction fields to update
 * @returns Updated transaction
 * @throws Error if update fails or unauthorized
 *
 * @example
 * ```typescript
 * 'use server'
 * import { updateTransaction } from '@repo/supabase-client/transactions/server'
 *
 * export async function editTransaction(id: string, updates: TransactionUpdate) {
 *   const transaction = await updateTransaction(id, userId, updates)
 *   return { success: true, transaction }
 * }
 * ```
 */
export async function updateTransaction(
  id: string,
  userId: string,
  updates: TransactionUpdate
): Promise<Transaction> {
  const supabase: any = await createServerClient();

  const result = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  const { data, error } = result;

  if (error) {
    throw new Error(`Failed to update transaction: ${error.message}`);
  }

  if (!data) {
    throw new Error('Transaction not found or unauthorized');
  }

  revalidatePath('/transactions');
  revalidatePath(`/transactions/${id}`);

  return data;
}

/**
 * Delete a transaction
 *
 * @param id - Transaction ID
 * @param userId - User ID for authorization
 * @throws Error if deletion fails or unauthorized
 *
 * @example
 * ```typescript
 * 'use server'
 * import { deleteTransaction } from '@repo/supabase-client/transactions/server'
 *
 * export async function removeTransaction(id: string) {
 *   await deleteTransaction(id, userId)
 *   return { success: true }
 * }
 * ```
 */
export async function deleteTransaction(id: string, userId: string): Promise<void> {
  const supabase: any = await createServerClient();

  const result = await supabase.from('transactions').delete().eq('id', id).eq('user_id', userId);

  const { error } = result;

  if (error) {
    throw new Error(`Failed to delete transaction: ${error.message}`);
  }

  revalidatePath('/transactions');
}
