-- ============================================================================
-- Migration 01: Initial Schema
-- Drop old Prisma-generated schema and create new Supabase schema
-- ============================================================================

-- Drop existing tables (from Prisma) in reverse dependency order
DROP TABLE IF EXISTS saving_rules CASCADE;
DROP TABLE IF EXISTS recurring_expenses CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS statements CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS cards CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop existing ENUM types if they exist
DROP TYPE IF EXISTS "StatementStatus" CASCADE;
DROP TYPE IF EXISTS "TransactionType" CASCADE;
DROP TYPE IF EXISTS "RecurringFrequency" CASCADE;

-- ============================================================================
-- Create ENUM types with correct naming (snake_case)
-- ============================================================================

CREATE TYPE statement_status AS ENUM ('PENDING', 'EXTRACTED', 'IMPORTED', 'ARCHIVED');
CREATE TYPE transaction_type AS ENUM ('EXPENSE', 'INCOME', 'REFUND');
CREATE TYPE recurring_frequency AS ENUM ('WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'BIANNUAL', 'ANNUAL');

-- ============================================================================
-- Create Tables
-- ============================================================================

-- Users table (linked to Supabase auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE users IS 'User profiles linked to Supabase Auth';
COMMENT ON COLUMN users.id IS 'References auth.users.id - automatically managed by Supabase Auth';

-- Cards table
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  bank TEXT NOT NULL,
  last4 TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, last4)
);

COMMENT ON TABLE cards IS 'Credit/debit cards for statement tracking';
COMMENT ON COLUMN cards.last4 IS 'Last 4 digits of card number';
COMMENT ON COLUMN cards.is_active IS 'Soft delete flag - inactive cards are hidden but data is preserved';

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#808080',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

COMMENT ON TABLE categories IS 'Transaction categories for expense tracking';
COMMENT ON COLUMN categories.color IS 'Hex color code for UI display';

-- Statements table
CREATE TABLE statements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES cards(id) ON DELETE RESTRICT,
  pdf_url TEXT,
  upload_date TIMESTAMPTZ DEFAULT NOW(),
  statement_date TIMESTAMPTZ NOT NULL,
  status statement_status DEFAULT 'PENDING',
  extracted_count INTEGER DEFAULT 0,
  imported_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE statements IS 'Credit card statements uploaded by users';
COMMENT ON COLUMN statements.pdf_url IS 'URL to stored PDF file (Supabase Storage)';
COMMENT ON COLUMN statements.status IS 'Processing status: PENDING -> EXTRACTED -> IMPORTED -> ARCHIVED';
COMMENT ON COLUMN statements.extracted_count IS 'Number of transactions extracted from PDF';
COMMENT ON COLUMN statements.imported_count IS 'Number of transactions imported to transactions table';

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  statement_id UUID REFERENCES statements(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  merchant_name TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(12, 2) NOT NULL,
  type transaction_type NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  confidence FLOAT,
  raw_text TEXT,
  is_manual_entry BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE transactions IS 'Individual transactions from statements or manual entry';
COMMENT ON COLUMN transactions.statement_id IS 'NULL for manually entered transactions';
COMMENT ON COLUMN transactions.confidence IS 'OCR confidence score (0-1) for extracted transactions';
COMMENT ON COLUMN transactions.raw_text IS 'Original OCR text from PDF';
COMMENT ON COLUMN transactions.is_manual_entry IS 'TRUE if manually entered, FALSE if extracted from statement';

-- Recurring Expenses table
CREATE TABLE recurring_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(12, 2) NOT NULL,
  frequency recurring_frequency NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE recurring_expenses IS 'Recurring expenses for budget planning';
COMMENT ON COLUMN recurring_expenses.end_date IS 'NULL for indefinite recurring expenses';

-- Saving Rules table
CREATE TABLE saving_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  frequency TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE saving_rules IS 'Automatic saving rules for financial goals';
