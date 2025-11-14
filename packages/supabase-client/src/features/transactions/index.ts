// Server exports (for Server Components and Server Actions)
export {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from './server';

// Client exports (for Client Components)
export { useTransactionsQuery, useTransactionQuery } from './queries';
export {
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} from './mutations';

// Type exports
export type {
  Transaction,
  TransactionInsert,
  TransactionUpdate,
  TransactionWithRelations,
} from './types';
