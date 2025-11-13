-- ============================================================================
-- Migration 03: Row Level Security (RLS)
-- Enables RLS and creates user-isolation policies
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE saving_rules ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Users table policies
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- ============================================================================
-- Cards table policies
-- ============================================================================

-- Users can view their own cards
CREATE POLICY "Users can view own cards" ON cards
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own cards
CREATE POLICY "Users can insert own cards" ON cards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own cards
CREATE POLICY "Users can update own cards" ON cards
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own cards
CREATE POLICY "Users can delete own cards" ON cards
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- Categories table policies
-- ============================================================================

CREATE POLICY "Users can manage own categories" ON categories
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- Statements table policies
-- ============================================================================

CREATE POLICY "Users can manage own statements" ON statements
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- Transactions table policies
-- ============================================================================

CREATE POLICY "Users can manage own transactions" ON transactions
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- Recurring Expenses table policies
-- ============================================================================

CREATE POLICY "Users can manage own recurring expenses" ON recurring_expenses
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- Saving Rules table policies
-- ============================================================================

CREATE POLICY "Users can manage own saving rules" ON saving_rules
  FOR ALL USING (auth.uid() = user_id);
