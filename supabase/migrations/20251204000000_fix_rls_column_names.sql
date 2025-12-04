-- ============================================================================
-- FIX: RLS Policy Column Names
-- Sprint 12.4 Hotfix
-- ============================================================================
-- Issue: RLS policies used "userId" (camelCase) but actual columns are user_id (snake_case)
-- Impact: All policies were non-functional, users couldn't access any data
-- Fix: Drop and recreate all policies with correct column names
-- ============================================================================

-- ============================================================================
-- 1. DROP ALL EXISTING POLICIES (with incorrect column names)
-- ============================================================================

-- Cards table
DROP POLICY IF EXISTS "cards_select_own" ON cards;
DROP POLICY IF EXISTS "cards_insert_own" ON cards;
DROP POLICY IF EXISTS "cards_update_own" ON cards;
DROP POLICY IF EXISTS "cards_delete_own" ON cards;

-- Categories table
DROP POLICY IF EXISTS "categories_select_own" ON categories;
DROP POLICY IF EXISTS "categories_insert_own" ON categories;
DROP POLICY IF EXISTS "categories_update_own" ON categories;
DROP POLICY IF EXISTS "categories_delete_own" ON categories;

-- Statements table
DROP POLICY IF EXISTS "statements_select_own" ON statements;
DROP POLICY IF EXISTS "statements_insert_own" ON statements;
DROP POLICY IF EXISTS "statements_update_own" ON statements;
DROP POLICY IF EXISTS "statements_delete_own" ON statements;

-- Transactions table
DROP POLICY IF EXISTS "transactions_select_own" ON transactions;
DROP POLICY IF EXISTS "transactions_insert_own" ON transactions;
DROP POLICY IF EXISTS "transactions_update_own" ON transactions;
DROP POLICY IF EXISTS "transactions_delete_own" ON transactions;

-- Recurring expenses table
DROP POLICY IF EXISTS "recurring_expenses_select_own" ON recurring_expenses;
DROP POLICY IF EXISTS "recurring_expenses_insert_own" ON recurring_expenses;
DROP POLICY IF EXISTS "recurring_expenses_update_own" ON recurring_expenses;
DROP POLICY IF EXISTS "recurring_expenses_delete_own" ON recurring_expenses;

-- Saving rules table
DROP POLICY IF EXISTS "saving_rules_select_own" ON saving_rules;
DROP POLICY IF EXISTS "saving_rules_insert_own" ON saving_rules;
DROP POLICY IF EXISTS "saving_rules_update_own" ON saving_rules;
DROP POLICY IF EXISTS "saving_rules_delete_own" ON saving_rules;

-- ============================================================================
-- 2. RECREATE POLICIES WITH CORRECT COLUMN NAMES (user_id)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- CARDS TABLE
-- ----------------------------------------------------------------------------
CREATE POLICY "cards_select_own"
  ON cards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "cards_insert_own"
  ON cards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cards_update_own"
  ON cards FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cards_delete_own"
  ON cards FOR DELETE
  USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- CATEGORIES TABLE
-- ----------------------------------------------------------------------------
CREATE POLICY "categories_select_own"
  ON categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "categories_insert_own"
  ON categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "categories_update_own"
  ON categories FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "categories_delete_own"
  ON categories FOR DELETE
  USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- STATEMENTS TABLE
-- ----------------------------------------------------------------------------
CREATE POLICY "statements_select_own"
  ON statements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "statements_insert_own"
  ON statements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "statements_update_own"
  ON statements FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "statements_delete_own"
  ON statements FOR DELETE
  USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- TRANSACTIONS TABLE
-- ----------------------------------------------------------------------------
CREATE POLICY "transactions_select_own"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "transactions_insert_own"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "transactions_update_own"
  ON transactions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "transactions_delete_own"
  ON transactions FOR DELETE
  USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- RECURRING_EXPENSES TABLE
-- ----------------------------------------------------------------------------
CREATE POLICY "recurring_expenses_select_own"
  ON recurring_expenses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "recurring_expenses_insert_own"
  ON recurring_expenses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "recurring_expenses_update_own"
  ON recurring_expenses FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "recurring_expenses_delete_own"
  ON recurring_expenses FOR DELETE
  USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- SAVING_RULES TABLE
-- ----------------------------------------------------------------------------
CREATE POLICY "saving_rules_select_own"
  ON saving_rules FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "saving_rules_insert_own"
  ON saving_rules FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "saving_rules_update_own"
  ON saving_rules FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "saving_rules_delete_own"
  ON saving_rules FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 3. ADD INDEXES FOR RLS QUERY PERFORMANCE
-- ============================================================================
-- Note: Using IF NOT EXISTS to avoid errors if indexes already exist

CREATE INDEX IF NOT EXISTS idx_cards_user_id ON cards(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_statements_user_id ON statements(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_recurring_expenses_user_id ON recurring_expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_saving_rules_user_id ON saving_rules(user_id);

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- Run this query to verify policies are correct:
--
-- SELECT tablename, policyname, qual
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- AND qual LIKE '%user_id%'
-- ORDER BY tablename;
--
-- Expected: All policies should reference user_id (not "userId")
-- ============================================================================
