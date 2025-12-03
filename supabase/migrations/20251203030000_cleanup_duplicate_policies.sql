-- ============================================================================
-- Cleanup Duplicate RLS Policies
-- Sprint 12.4: Remove old duplicate policies
-- ============================================================================
-- This migration removes old RLS policies that were created before the
-- standardized naming convention. Keeps only the *_own policies.
-- ============================================================================

-- ============================================================================
-- Drop old Cards policies
-- ============================================================================
DROP POLICY IF EXISTS "Users can view own cards" ON cards;
DROP POLICY IF EXISTS "Users can insert own cards" ON cards;
DROP POLICY IF EXISTS "Users can update own cards" ON cards;
DROP POLICY IF EXISTS "Users can delete own cards" ON cards;

-- ============================================================================
-- Drop old Categories policies
-- ============================================================================
DROP POLICY IF EXISTS "Users can manage own categories" ON categories;

-- ============================================================================
-- Drop old Statements policies
-- ============================================================================
DROP POLICY IF EXISTS "Users can manage own statements" ON statements;

-- ============================================================================
-- Drop old Transactions policies
-- ============================================================================
DROP POLICY IF EXISTS "Users can manage own transactions" ON transactions;

-- ============================================================================
-- Drop old Recurring Expenses policies
-- ============================================================================
DROP POLICY IF EXISTS "Users can manage own recurring expenses" ON recurring_expenses;

-- ============================================================================
-- Drop old Saving Rules policies
-- ============================================================================
DROP POLICY IF EXISTS "Users can manage own saving rules" ON saving_rules;

-- ============================================================================
-- Drop old Users policies
-- ============================================================================
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- After cleanup, we should have exactly:
-- - _prisma_migrations: 1 policy
-- - users: 2 policies (users_select_own, users_update_own)
-- - cards: 4 policies (*_select_own, *_insert_own, *_update_own, *_delete_own)
-- - categories: 4 policies
-- - statements: 4 policies
-- - transactions: 4 policies
-- - recurring_expenses: 4 policies
-- - saving_rules: 4 policies
-- Total: 29 policies
-- ============================================================================
