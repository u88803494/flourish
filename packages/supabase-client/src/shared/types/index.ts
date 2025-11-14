export type { Database, Json } from './database';

// Convenience type exports for commonly used tables
export type User = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];

export type Card = Database['public']['Tables']['cards']['Row'];
export type CardInsert = Database['public']['Tables']['cards']['Insert'];
export type CardUpdate = Database['public']['Tables']['cards']['Update'];

export type Category = Database['public']['Tables']['categories']['Row'];
export type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
export type CategoryUpdate = Database['public']['Tables']['categories']['Update'];

export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
export type TransactionUpdate = Database['public']['Tables']['transactions']['Update'];

export type Statement = Database['public']['Tables']['statements']['Row'];
export type StatementInsert = Database['public']['Tables']['statements']['Insert'];
export type StatementUpdate = Database['public']['Tables']['statements']['Update'];

export type RecurringExpense = Database['public']['Tables']['recurring_expenses']['Row'];
export type RecurringExpenseInsert = Database['public']['Tables']['recurring_expenses']['Insert'];
export type RecurringExpenseUpdate = Database['public']['Tables']['recurring_expenses']['Update'];

export type SavingRule = Database['public']['Tables']['saving_rules']['Row'];
export type SavingRuleInsert = Database['public']['Tables']['saving_rules']['Insert'];
export type SavingRuleUpdate = Database['public']['Tables']['saving_rules']['Update'];
