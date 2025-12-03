-- ============================================================================
-- Fix Function Search Path Security Issue
-- Sprint 12.4: Security Enhancement
-- ============================================================================
-- This migration adds SET search_path to all functions to prevent
-- search path injection attacks (Supabase Security Advisor warning).
--
-- Reference: https://www.postgresql.org/docs/current/sql-createfunction.html
-- ============================================================================

-- ============================================================================
-- 1. Auth Integration Functions
-- ============================================================================

-- Fix handle_new_user() - SECURITY DEFINER function (highest priority)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION handle_new_user() IS 'Automatically creates a user profile in public.users when a new auth.users record is created';

-- Fix update_updated_at_column()
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION update_updated_at_column() IS 'Automatically updates the updated_at column to current timestamp';

-- ============================================================================
-- 2. Helper Functions (Analytics)
-- ============================================================================

-- Fix get_monthly_spending()
CREATE OR REPLACE FUNCTION get_monthly_spending(
  p_user_id UUID,
  p_year INTEGER,
  p_month INTEGER
)
RETURNS DECIMAL
LANGUAGE SQL
STABLE
SET search_path = ''
AS $$
  SELECT COALESCE(SUM(amount), 0)
  FROM public.transactions
  WHERE user_id = p_user_id
    AND type = 'EXPENSE'
    AND EXTRACT(YEAR FROM date) = p_year
    AND EXTRACT(MONTH FROM date) = p_month;
$$;

COMMENT ON FUNCTION get_monthly_spending(UUID, INTEGER, INTEGER) IS 'Calculate total spending for a specific user in a specific month';

-- Fix get_category_total()
CREATE OR REPLACE FUNCTION get_category_total(
  p_user_id UUID,
  p_category_id UUID
)
RETURNS DECIMAL
LANGUAGE SQL
STABLE
SET search_path = ''
AS $$
  SELECT COALESCE(SUM(amount), 0)
  FROM public.transactions
  WHERE user_id = p_user_id
    AND category_id = p_category_id
    AND type = 'EXPENSE';
$$;

COMMENT ON FUNCTION get_category_total(UUID, UUID) IS 'Calculate total spending for a specific category';

-- Fix get_category_spending_by_range()
CREATE OR REPLACE FUNCTION get_category_spending_by_range(
  p_user_id UUID,
  p_category_id UUID,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ
)
RETURNS DECIMAL
LANGUAGE SQL
STABLE
SET search_path = ''
AS $$
  SELECT COALESCE(SUM(amount), 0)
  FROM public.transactions
  WHERE user_id = p_user_id
    AND category_id = p_category_id
    AND type = 'EXPENSE'
    AND date >= p_start_date
    AND date <= p_end_date;
$$;

COMMENT ON FUNCTION get_category_spending_by_range(UUID, UUID, TIMESTAMPTZ, TIMESTAMPTZ) IS 'Calculate category spending within a date range';

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- Run this query to verify functions have search_path set:
--
-- SELECT
--   p.proname AS function_name,
--   pg_get_function_identity_arguments(p.oid) AS arguments,
--   p.prosecdef AS is_security_definer,
--   p.proconfig AS config_settings
-- FROM pg_proc p
-- JOIN pg_namespace n ON p.pronamespace = n.oid
-- WHERE n.nspname = 'public'
--   AND p.proname IN (
--     'handle_new_user',
--     'update_updated_at_column',
--     'get_monthly_spending',
--     'get_category_total',
--     'get_category_spending_by_range'
--   );
--
-- Expected: All functions should have search_path in config_settings
-- ============================================================================
