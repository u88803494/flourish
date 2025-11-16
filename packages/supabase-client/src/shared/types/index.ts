import type { Database as DB } from './database';

export type { Database, Json } from './database';

// Convenience type exports for commonly used tables
export type User = DB['public']['Tables']['users']['Row'];
export type UserInsert = DB['public']['Tables']['users']['Insert'];
export type UserUpdate = DB['public']['Tables']['users']['Update'];

export type Card = DB['public']['Tables']['cards']['Row'];
export type CardInsert = DB['public']['Tables']['cards']['Insert'];
export type CardUpdate = DB['public']['Tables']['cards']['Update'];

export type Category = DB['public']['Tables']['categories']['Row'];
export type CategoryInsert = DB['public']['Tables']['categories']['Insert'];
export type CategoryUpdate = DB['public']['Tables']['categories']['Update'];

export type Transaction = DB['public']['Tables']['transactions']['Row'];
export type TransactionInsert = DB['public']['Tables']['transactions']['Insert'];
export type TransactionUpdate = DB['public']['Tables']['transactions']['Update'];

export type Statement = DB['public']['Tables']['statements']['Row'];
export type StatementInsert = DB['public']['Tables']['statements']['Insert'];
export type StatementUpdate = DB['public']['Tables']['statements']['Update'];

export type RecurringExpense = DB['public']['Tables']['recurring_expenses']['Row'];
export type RecurringExpenseInsert = DB['public']['Tables']['recurring_expenses']['Insert'];
export type RecurringExpenseUpdate = DB['public']['Tables']['recurring_expenses']['Update'];

export type SavingRule = DB['public']['Tables']['saving_rules']['Row'];
export type SavingRuleInsert = DB['public']['Tables']['saving_rules']['Insert'];
export type SavingRuleUpdate = DB['public']['Tables']['saving_rules']['Update'];
