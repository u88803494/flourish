-- ============================================================================
-- RLS (Row Level Security) Policies for Flourish
-- Sprint 12.4: Authentication & Authorization
-- ============================================================================
--
-- ⚠️  KNOWN ISSUE (FIXED)
-- ============================================================================
-- This migration contains a column naming error: uses "userId" (camelCase)
-- but actual database columns are user_id (snake_case).
--
-- FIX: See migration 20251204000000_fix_rls_column_names.sql
--      which drops and recreates all policies with correct column names.
--
-- DO NOT modify this file - migrations should remain immutable history.
-- ============================================================================
--
-- This migration enables RLS on all user-facing tables and creates policies
-- to ensure users can only access their own data.
--
-- Security Model:
-- - All tables use auth.uid() to verify ownership
-- - SELECT: Users can only view their own records
-- - INSERT: Users can only create records with their own user_id
-- - UPDATE: Users can only modify their own records
-- - DELETE: Users can only delete their own records
-- ============================================================================

-- ============================================================================
-- 1. USERS TABLE
-- ============================================================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can view their own profile
CREATE POLICY "users_select_own"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

-- UPDATE: Users can update their own profile
CREATE POLICY "users_update_own"
  ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Note: INSERT and DELETE are handled by Supabase Auth, not user-facing

-- ============================================================================
-- 2. CARDS TABLE
-- ============================================================================

-- Enable RLS
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can view their own cards
CREATE POLICY "cards_select_own"
  ON cards
  FOR SELECT
  USING (auth.uid()::text = "userId");

-- INSERT: Users can create cards for themselves
CREATE POLICY "cards_insert_own"
  ON cards
  FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

-- UPDATE: Users can update their own cards
CREATE POLICY "cards_update_own"
  ON cards
  FOR UPDATE
  USING (auth.uid()::text = "userId")
  WITH CHECK (auth.uid()::text = "userId");

-- DELETE: Users can delete their own cards
CREATE POLICY "cards_delete_own"
  ON cards
  FOR DELETE
  USING (auth.uid()::text = "userId");

-- ============================================================================
-- 3. CATEGORIES TABLE
-- ============================================================================

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can view their own categories
CREATE POLICY "categories_select_own"
  ON categories
  FOR SELECT
  USING (auth.uid()::text = "userId");

-- INSERT: Users can create categories for themselves
CREATE POLICY "categories_insert_own"
  ON categories
  FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

-- UPDATE: Users can update their own categories
CREATE POLICY "categories_update_own"
  ON categories
  FOR UPDATE
  USING (auth.uid()::text = "userId")
  WITH CHECK (auth.uid()::text = "userId");

-- DELETE: Users can delete their own categories
CREATE POLICY "categories_delete_own"
  ON categories
  FOR DELETE
  USING (auth.uid()::text = "userId");

-- ============================================================================
-- 4. STATEMENTS TABLE
-- ============================================================================

-- Enable RLS
ALTER TABLE statements ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can view their own statements
CREATE POLICY "statements_select_own"
  ON statements
  FOR SELECT
  USING (auth.uid()::text = "userId");

-- INSERT: Users can create statements for themselves
CREATE POLICY "statements_insert_own"
  ON statements
  FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

-- UPDATE: Users can update their own statements
CREATE POLICY "statements_update_own"
  ON statements
  FOR UPDATE
  USING (auth.uid()::text = "userId")
  WITH CHECK (auth.uid()::text = "userId");

-- DELETE: Users can delete their own statements
CREATE POLICY "statements_delete_own"
  ON statements
  FOR DELETE
  USING (auth.uid()::text = "userId");

-- ============================================================================
-- 5. TRANSACTIONS TABLE
-- ============================================================================

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can view their own transactions
CREATE POLICY "transactions_select_own"
  ON transactions
  FOR SELECT
  USING (auth.uid()::text = "userId");

-- INSERT: Users can create transactions for themselves
CREATE POLICY "transactions_insert_own"
  ON transactions
  FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

-- UPDATE: Users can update their own transactions
CREATE POLICY "transactions_update_own"
  ON transactions
  FOR UPDATE
  USING (auth.uid()::text = "userId")
  WITH CHECK (auth.uid()::text = "userId");

-- DELETE: Users can delete their own transactions
CREATE POLICY "transactions_delete_own"
  ON transactions
  FOR DELETE
  USING (auth.uid()::text = "userId");

-- ============================================================================
-- 6. RECURRING_EXPENSES TABLE
-- ============================================================================

-- Enable RLS
ALTER TABLE recurring_expenses ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can view their own recurring expenses
CREATE POLICY "recurring_expenses_select_own"
  ON recurring_expenses
  FOR SELECT
  USING (auth.uid()::text = "userId");

-- INSERT: Users can create recurring expenses for themselves
CREATE POLICY "recurring_expenses_insert_own"
  ON recurring_expenses
  FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

-- UPDATE: Users can update their own recurring expenses
CREATE POLICY "recurring_expenses_update_own"
  ON recurring_expenses
  FOR UPDATE
  USING (auth.uid()::text = "userId")
  WITH CHECK (auth.uid()::text = "userId");

-- DELETE: Users can delete their own recurring expenses
CREATE POLICY "recurring_expenses_delete_own"
  ON recurring_expenses
  FOR DELETE
  USING (auth.uid()::text = "userId");

-- ============================================================================
-- 7. SAVING_RULES TABLE
-- ============================================================================

-- Enable RLS
ALTER TABLE saving_rules ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can view their own saving rules
CREATE POLICY "saving_rules_select_own"
  ON saving_rules
  FOR SELECT
  USING (auth.uid()::text = "userId");

-- INSERT: Users can create saving rules for themselves
CREATE POLICY "saving_rules_insert_own"
  ON saving_rules
  FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

-- UPDATE: Users can update their own saving rules
CREATE POLICY "saving_rules_update_own"
  ON saving_rules
  FOR UPDATE
  USING (auth.uid()::text = "userId")
  WITH CHECK (auth.uid()::text = "userId");

-- DELETE: Users can delete their own saving rules
CREATE POLICY "saving_rules_delete_own"
  ON saving_rules
  FOR DELETE
  USING (auth.uid()::text = "userId");

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these queries to verify RLS is enabled and policies are active:
--
-- 1. Check RLS status:
-- SELECT schemaname, tablename, rowsecurity
-- FROM pg_tables
-- WHERE schemaname = 'public';
--
-- 2. List all policies:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- ORDER BY tablename, policyname;
--
-- ============================================================================
