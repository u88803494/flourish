-- ============================================================================
-- Enable RLS on Prisma Migrations Table
-- Sprint 12.4: Security Fix
-- ============================================================================
-- This migration enables RLS on the _prisma_migrations table to resolve
-- Supabase Security Advisor warning. This table is internal and should not
-- be accessible via the API.
-- ============================================================================

-- Enable RLS on _prisma_migrations table
ALTER TABLE _prisma_migrations ENABLE ROW LEVEL SECURITY;

-- Create a policy that denies all access
-- This table is for internal migration tracking only
CREATE POLICY "no_public_access"
  ON _prisma_migrations
  FOR ALL
  USING (false);

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- Run this query to verify RLS is enabled:
--
-- SELECT tablename, rowsecurity
-- FROM pg_tables
-- WHERE schemaname = 'public' AND tablename = '_prisma_migrations';
--
-- Expected result: rowsecurity = true
-- ============================================================================
