/**
 * Centralized query key factory for React Query
 *
 * This factory provides type-safe, consistent query keys across the application.
 * Query keys are used by React Query to identify and cache queries.
 *
 * Benefits:
 * - Prevents typos and inconsistencies
 * - Enables easy invalidation of related queries
 * - Provides autocomplete for query keys
 * - Makes refactoring easier
 *
 * @example
 * ```typescript
 * // Use in a query
 * useQuery({
 *   queryKey: queryKeys.transactions.list(userId),
 *   queryFn: () => getTransactions(userId)
 * })
 *
 * // Invalidate all transaction queries
 * queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all })
 *
 * // Invalidate specific user's transactions
 * queryClient.invalidateQueries({ queryKey: queryKeys.transactions.lists() })
 * ```
 */
export const queryKeys = {
  // Auth queries
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
  },

  // Transaction queries
  transactions: {
    all: ['transactions'] as const,
    lists: () => [...queryKeys.transactions.all, 'list'] as const,
    list: (userId: string) => [...queryKeys.transactions.lists(), userId] as const,
    details: () => [...queryKeys.transactions.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.transactions.details(), id] as const,
  },

  // Card queries
  cards: {
    all: ['cards'] as const,
    lists: () => [...queryKeys.cards.all, 'list'] as const,
    list: (userId: string) => [...queryKeys.cards.lists(), userId] as const,
    details: () => [...queryKeys.cards.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.cards.details(), id] as const,
  },

  // Category queries
  categories: {
    all: ['categories'] as const,
    lists: () => [...queryKeys.categories.all, 'list'] as const,
    list: (userId: string) => [...queryKeys.categories.lists(), userId] as const,
    details: () => [...queryKeys.categories.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.categories.details(), id] as const,
  },

  // Statement queries
  statements: {
    all: ['statements'] as const,
    lists: () => [...queryKeys.statements.all, 'list'] as const,
    list: (userId: string) => [...queryKeys.statements.lists(), userId] as const,
    details: () => [...queryKeys.statements.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.statements.details(), id] as const,
  },

  // Recurring expense queries
  recurringExpenses: {
    all: ['recurring-expenses'] as const,
    lists: () => [...queryKeys.recurringExpenses.all, 'list'] as const,
    list: (userId: string) => [...queryKeys.recurringExpenses.lists(), userId] as const,
    details: () => [...queryKeys.recurringExpenses.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.recurringExpenses.details(), id] as const,
  },

  // Saving rule queries
  savingRules: {
    all: ['saving-rules'] as const,
    lists: () => [...queryKeys.savingRules.all, 'list'] as const,
    list: (userId: string) => [...queryKeys.savingRules.lists(), userId] as const,
    details: () => [...queryKeys.savingRules.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.savingRules.details(), id] as const,
  },
} as const;
