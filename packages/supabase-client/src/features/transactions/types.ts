import type {
  Transaction,
  TransactionInsert,
  TransactionUpdate,
  Category,
  Card,
} from '../../shared/types';

/**
 * Transaction with related category and card information
 * Uses Omit to remove foreign key fields that will be replaced with full objects
 */
export type TransactionWithRelations = Omit<Transaction, 'category_id'> & {
  category: Category | null;
  card: Card | null;
};

// Re-export base types for convenience
export type { Transaction, TransactionInsert, TransactionUpdate };
