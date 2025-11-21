# Database Migrations Guide

**Purpose**: Guide for creating and managing Supabase database migrations

**Last Updated**: 2025-11-21

---

## Workflow Overview

```
1. Design Phase → 2. Create Migration → 3. Write SQL → 4. Test Locally → 5. Deploy
```

---

## 1. Design Phase

### Reference Schema

The Prisma schema is kept as a design reference:

**Location**: `packages/database/prisma/schema.prisma`

**Purpose**:

- Documentation of database structure
- Type definitions for discussion
- Reference for relationships

**Note**: We do NOT use Prisma migrations. All migrations are in SQL format for Supabase.

### Design Checklist

- [ ] Sketch new tables/columns
- [ ] Consider relationships (foreign keys)
- [ ] Plan indexes for performance
- [ ] Think about Row Level Security (RLS)
- [ ] Document breaking changes

---

## 2. Create Migration

### Command

```bash
npx supabase migration new feature_name
```

**Example**:

```bash
npx supabase migration new add_tags_table
```

**Output**:

```
Created migration: supabase/migrations/20241121123000_add_tags_table.sql
```

### Naming Conventions

Good names:

- `add_tags_table` - Clear what is being added
- `update_transactions_add_notes` - Specific modification
- `fix_categories_unique_constraint` - Bug fix purpose

Bad names:

- `migration_1` - No context
- `update` - Too vague
- `fix` - Doesn't specify what

---

## 3. Write SQL

### Migration File Structure

```sql
-- Migration: [Brief description]
-- Created: [Date]
-- Purpose: [Explain why this change is needed]

-- Drop (if modifying existing objects)
DROP TABLE IF EXISTS old_table CASCADE;

-- Create tables
CREATE TABLE new_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_new_table_user_id ON new_table(user_id);

-- Row Level Security
ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own records" ON new_table
  USING (auth.uid() = user_id);

-- Functions/Triggers (if needed)
CREATE TRIGGER update_new_table_updated_at
  BEFORE UPDATE ON new_table
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Common Patterns

#### Adding a New Table

```sql
CREATE TABLE table_name (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  -- other columns
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index on foreign key
CREATE INDEX idx_table_name_user_id ON table_name(user_id);

-- Enable RLS
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Users can manage own records" ON table_name
  USING (auth.uid() = user_id);
```

#### Adding a Column

```sql
ALTER TABLE table_name
  ADD COLUMN new_column TEXT;

-- If needed: backfill data
UPDATE table_name
  SET new_column = 'default_value'
  WHERE new_column IS NULL;

-- If needed: add constraint
ALTER TABLE table_name
  ALTER COLUMN new_column SET NOT NULL;
```

#### Creating an Index

```sql
CREATE INDEX idx_table_column ON table_name(column_name);

-- For multiple columns
CREATE INDEX idx_table_col1_col2 ON table_name(col1, col2);

-- For partial index
CREATE INDEX idx_table_active ON table_name(user_id) WHERE is_active = true;
```

---

## 4. Test Locally

### Reset Database with All Migrations

```bash
npx supabase db reset
```

**What it does**:

- Drops all tables
- Re-runs ALL migrations in order
- Verifies migration integrity

### Verify Schema

```bash
# Open Supabase Studio locally
npx supabase start

# Visit: http://localhost:54323
# Check: Table Editor, SQL Editor
```

### Test Queries

```sql
-- Test insert
INSERT INTO new_table (user_id, name)
VALUES ('...', 'test');

-- Test RLS (should fail if not owner)
SET ROLE authenticated;
SELECT * FROM new_table;
```

---

## 5. Deploy to Remote

### Push to Production

```bash
npx supabase link --project-ref fstcioczrehqtcbdzuij
npx supabase db push
```

**Confirmation Required**:

```
Remote database is not empty. Would you like to continue? [y/N]
y
```

### Verify Deployment

```bash
# Check diff (should be empty)
npx supabase db diff
```

---

## Row Level Security (RLS) Policies

### Why RLS?

- **Security**: Ensures users can only access their own data
- **Automatic**: No need to add `WHERE user_id = ?` in every query
- **Supabase Auth Integration**: Uses `auth.uid()` function

### RLS Template

```sql
-- Enable RLS on table
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view own records
CREATE POLICY "Users can view own records" ON table_name
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert own records
CREATE POLICY "Users can insert own records" ON table_name
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update own records
CREATE POLICY "Users can update own records" ON table_name
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete own records
CREATE POLICY "Users can delete own records" ON table_name
  FOR DELETE
  USING (auth.uid() = user_id);

-- Or combine all operations
CREATE POLICY "Users can manage own records" ON table_name
  USING (auth.uid() = user_id);
```

### Testing RLS Policies

```sql
-- Test as anonymous user (should fail)
SELECT * FROM table_name;

-- Test as authenticated user (should only see own data)
SET ROLE authenticated;
SET request.jwt.claim.sub = '<user-uuid>';
SELECT * FROM table_name;
```

---

## Rollback & Recovery

### Local Rollback

```bash
# Reset to clean state
npx supabase db reset
```

### Remote Rollback

**Supabase does not support automatic rollback.**

**Options**:

1. **Write Reverse Migration** (Recommended)

   ```bash
   npx supabase migration new rollback_feature_name
   ```

   ```sql
   -- Reverse the changes
   DROP TABLE new_table CASCADE;
   ```

2. **Manual Fix in Dashboard**
   - Supabase Dashboard → SQL Editor
   - Run manual SQL to fix

3. **Restore from Backup**
   - Supabase Dashboard → Database → Backups
   - Restore to point before migration

---

## Best Practices

### Migration Writing

✅ **DO**:

- Write idempotent migrations (`CREATE TABLE IF NOT EXISTS`)
- Add comments explaining why
- Test locally first
- Use transactions for complex changes
- Create indexes for foreign keys

❌ **DON'T**:

- Delete data without backup
- Change column types without migration path
- Skip RLS policies on new tables
- Hardcode UUIDs or user IDs

### Performance

- **Indexes**: Add on columns used in WHERE, JOIN, ORDER BY
- **Partial Indexes**: For commonly filtered subsets
- **Avoid**: Over-indexing (slows down writes)

### Security

- **Always enable RLS** on tables with user data
- **Test policies** with different user contexts
- **Review permissions** before deploying

---

## Common Issues & Solutions

### Issue: Migration fails with "relation already exists"

**Solution**: Use `IF NOT EXISTS`

```sql
CREATE TABLE IF NOT EXISTS table_name (...);
```

### Issue: RLS blocks all access

**Solution**: Check policy USING clause

```sql
-- Make sure auth.uid() returns user's UUID
SELECT auth.uid();
```

### Issue: Migration runs locally but fails remotely

**Solution**: Check database state

```bash
npx supabase db diff
# Shows differences between local and remote
```

---

## Related Documentation

- [Sprint 9 - Supabase Migration Plan](../sprints/sprint-0-foundation/09-supabase-migration-plan.md)
- [Supabase Setup Guide](./mcp-setup.md)
- [Supabase Migrations Docs](https://supabase.com/docs/guides/cli/local-development#database-migrations)

---

**Maintained By**: Flourish Team
**Last Updated**: 2025-11-21
**Status**: Active
