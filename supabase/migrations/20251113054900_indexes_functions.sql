-- ============================================================================
-- Migration 04: Indexes & Helper Functions
-- Performance optimization and utility functions
-- ============================================================================

-- ============================================================================
-- Performance Indexes
-- ============================================================================

-- Statements table indexes
CREATE INDEX idx_statements_user_card ON statements(user_id, card_id);
CREATE INDEX idx_statements_date ON statements(statement_date);
CREATE INDEX idx_statements_status ON statements(status);

-- Transactions table indexes
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date);
CREATE INDEX idx_transactions_statement ON transactions(statement_id);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_transactions_type ON transactions(type);

-- Recurring expenses indexes
CREATE INDEX idx_recurring_expenses_user ON recurring_expenses(user_id);
CREATE INDEX idx_recurring_expenses_dates ON recurring_expenses(start_date, end_date);

-- Saving rules indexes
CREATE INDEX idx_saving_rules_user ON saving_rules(user_id);

-- Categories indexes
CREATE INDEX idx_categories_user ON categories(user_id);

-- Cards indexes
CREATE INDEX idx_cards_user ON cards(user_id);

-- ============================================================================
-- Helper Functions
-- ============================================================================

-- Function: Get monthly spending total
CREATE OR REPLACE FUNCTION get_monthly_spending(
  p_user_id UUID,
  p_year INTEGER,
  p_month INTEGER
)
RETURNS DECIMAL AS $$
  SELECT COALESCE(SUM(amount), 0)
  FROM transactions
  WHERE user_id = p_user_id
    AND type = 'EXPENSE'
    AND EXTRACT(YEAR FROM date) = p_year
    AND EXTRACT(MONTH FROM date) = p_month;
$$ LANGUAGE SQL STABLE;

COMMENT ON FUNCTION get_monthly_spending(UUID, INTEGER, INTEGER) IS 'Calculate total spending for a specific user in a specific month';

-- Function: Get category total
CREATE OR REPLACE FUNCTION get_category_total(
  p_user_id UUID,
  p_category_id UUID
)
RETURNS DECIMAL AS $$
  SELECT COALESCE(SUM(amount), 0)
  FROM transactions
  WHERE user_id = p_user_id
    AND category_id = p_category_id
    AND type = 'EXPENSE';
$$ LANGUAGE SQL STABLE;

COMMENT ON FUNCTION get_category_total(UUID, UUID) IS 'Calculate total spending for a specific category';

-- Function: Get category spending by date range
CREATE OR REPLACE FUNCTION get_category_spending_by_range(
  p_user_id UUID,
  p_category_id UUID,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ
)
RETURNS DECIMAL AS $$
  SELECT COALESCE(SUM(amount), 0)
  FROM transactions
  WHERE user_id = p_user_id
    AND category_id = p_category_id
    AND type = 'EXPENSE'
    AND date >= p_start_date
    AND date <= p_end_date;
$$ LANGUAGE SQL STABLE;

COMMENT ON FUNCTION get_category_spending_by_range(UUID, UUID, TIMESTAMPTZ, TIMESTAMPTZ) IS 'Calculate category spending within a date range';
