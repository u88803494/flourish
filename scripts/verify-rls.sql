-- ============================================================================
-- RLS Verification Script
-- Run this in Supabase SQL Editor to verify RLS is enabled
-- ============================================================================

-- 1. Check RLS is enabled on all tables
SELECT
  schemaname,
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'users', 'cards', 'categories', 'statements',
    'transactions', 'recurring_expenses', 'saving_rules'
  )
ORDER BY tablename;

-- Expected result: All tables should have rls_enabled = true

-- ============================================================================

-- 2. List all RLS policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd AS operation
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Expected result: Should see 28 policies total
-- - users: 2 policies (SELECT, UPDATE)
-- - cards: 4 policies (SELECT, INSERT, UPDATE, DELETE)
-- - categories: 4 policies (SELECT, INSERT, UPDATE, DELETE)
-- - statements: 4 policies (SELECT, INSERT, UPDATE, DELETE)
-- - transactions: 4 policies (SELECT, INSERT, UPDATE, DELETE)
-- - recurring_expenses: 4 policies (SELECT, INSERT, UPDATE, DELETE)
-- - saving_rules: 4 policies (SELECT, INSERT, UPDATE, DELETE)

-- ============================================================================

-- 3. Count policies per table
SELECT
  tablename,
  COUNT(*) AS policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- Expected result:
-- users: 2
-- cards: 4
-- categories: 4
-- statements: 4
-- transactions: 4
-- recurring_expenses: 4
-- saving_rules: 4
