import type {
  Transaction,
  TransactionInsert,
  TransactionUpdate,
  Category,
  Card,
} from '../../shared/types';

/**
 * Transaction with related category and card information
 */
export interface TransactionWithRelations extends Transaction {
  category: Category | null;
  card: Card | null;
}

// Re-export base types for convenience
export type { Transaction, TransactionInsert, TransactionUpdate };
