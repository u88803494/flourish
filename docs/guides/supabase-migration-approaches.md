# Supabase Migration Approaches

**Last Updated**: 2025-11-13
**Status**: Active Decision
**Related**: [ADR 002 - Imperative Migrations](../decisions/002-imperative-migrations.md)

---

## 📖 Overview

Database migrations are version-controlled changes to your database schema. Supabase supports two approaches for managing migrations:

1. **Imperative Migrations** (SQL files) - What we use ✅
2. **Declarative Schema** (State-based) - Alternative approach

This document explains both approaches, their trade-offs, and why Flourish uses Imperative Migrations.

---

## 🔧 Imperative Migrations (Current Approach)

### What is it?

Imperative migrations define **step-by-step changes** to your database schema. Each migration is a SQL file that describes how to transform the database from one state to another.

**Analogy**: Like a recipe that tells you each cooking step in order.

### How it works

```bash
# 1. Create a new migration
npx supabase migration new add_user_preferences

# 2. Edit the generated SQL file
# supabase/migrations/20251113120000_add_user_preferences.sql
```

```sql
-- supabase/migrations/20251113120000_add_user_preferences.sql

-- Add new column
ALTER TABLE users ADD COLUMN preferences JSONB DEFAULT '{}';

-- Add index for performance
CREATE INDEX idx_users_preferences ON users USING GIN (preferences);

-- Add comment
COMMENT ON COLUMN users.preferences IS 'User preference settings stored as JSON';
```

```bash
# 3. Push to Supabase
npx supabase db push
```

### Real Example from Flourish

From `supabase/migrations/20251113050233_initial_schema.sql`:

```sql
-- Create ENUM types
CREATE TYPE statement_status AS ENUM ('PENDING', 'EXTRACTED', 'IMPORTED', 'ARCHIVED');
CREATE TYPE transaction_type AS ENUM ('EXPENSE', 'INCOME', 'REFUND');

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE users IS 'User profiles linked to Supabase Auth';
```

### Pros ✅

| Advantage              | Why it matters                                                            |
| ---------------------- | ------------------------------------------------------------------------- |
| **Full Control**       | You write exactly what changes should happen                              |
| **Explicit History**   | Each migration file shows exactly what changed and when                   |
| **Easy Review**        | Clear SQL that can be reviewed in PRs                                     |
| **Predictable**        | No surprises - you know exactly what will run                             |
| **Learn SQL**          | Improves your SQL skills through hands-on practice                        |
| **Complex Operations** | Can handle intricate migrations (data transformations, conditional logic) |

### Cons ❌

| Disadvantage               | Impact                                  |
| -------------------------- | --------------------------------------- |
| **Manual Work**            | You must write all SQL by hand          |
| **Requires SQL Knowledge** | Need to know PostgreSQL syntax          |
| **No Auto-Diffing**        | Can't automatically detect schema drift |
| **More Verbose**           | More code to write and maintain         |

### When to use

- ✅ You want full control over database changes
- ✅ You're learning SQL and PostgreSQL
- ✅ Your team is comfortable with SQL
- ✅ You need complex migrations (data transformations, conditional logic)
- ✅ You value explicit migration history

---

## 🎯 Declarative Schema (Alternative Approach)

### What is it?

Declarative schema defines the **desired final state** of your database. The tool automatically generates the migrations needed to reach that state.

**Analogy**: Like telling someone "I want a chocolate cake" and they figure out the recipe.

### How it works

```bash
# 1. Define your schema in a single file
# supabase/schema.sql
```

```sql
-- supabase/schema.sql (Complete database state)

CREATE TYPE statement_status AS ENUM ('PENDING', 'EXTRACTED', 'IMPORTED', 'ARCHIVED');

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  preferences JSONB DEFAULT '{}',  -- Added this line
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_preferences ON users USING GIN (preferences);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
```

```bash
# 2. Generate migration automatically
npx supabase db diff --schema public

# Output: Generated 20251113120000_add_preferences.sql
# ALTER TABLE users ADD COLUMN preferences JSONB DEFAULT '{}';
# CREATE INDEX idx_users_preferences ON users USING GIN (preferences);

# 3. Push to Supabase
npx supabase db push
```

### Example Workflow

**Before** (current schema):

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT
);
```

**After** (you edit schema.sql to add preferences):

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  preferences JSONB DEFAULT '{}'  -- Added
);
```

**CLI auto-generates**:

```sql
-- Generated migration
ALTER TABLE users ADD COLUMN preferences JSONB DEFAULT '{}';
```

### Pros ✅

| Advantage                  | Why it matters                            |
| -------------------------- | ----------------------------------------- |
| **70% Faster**             | CLI generates SQL for you                 |
| **Auto-Diffing**           | Automatically detects schema differences  |
| **Less SQL Writing**       | Just define the final state               |
| **Safer Changes**          | Tool generates correct migration syntax   |
| **Schema Drift Detection** | Can compare remote vs local automatically |

### Cons ❌

| Disadvantage           | Impact                                      |
| ---------------------- | ------------------------------------------- |
| **Less Control**       | Tool decides how to migrate                 |
| **Hidden Changes**     | Generated migrations might surprise you     |
| **Learning Curve**     | New Supabase feature, fewer resources       |
| **Complex Operations** | May not handle complex data transformations |
| **Supabase-Specific**  | Locked into Supabase tooling                |

### When to use

- ✅ Large team wanting simplified workflow
- ✅ Frequent schema changes
- ✅ Less SQL expertise on team
- ✅ Want automated drift detection
- ✅ Simple CRUD schema (no complex transformations)

---

## 📊 Side-by-Side Comparison

### Adding a New Column

**Imperative (Our Approach)**:

```sql
-- 20251113120000_add_user_preferences.sql
ALTER TABLE users ADD COLUMN preferences JSONB DEFAULT '{}';
CREATE INDEX idx_users_preferences ON users USING GIN (preferences);
COMMENT ON COLUMN users.preferences IS 'User preference settings';
```

**Declarative (Alternative)**:

```sql
-- schema.sql (just edit the table definition)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  preferences JSONB DEFAULT '{}'  -- Just add this line
);

CREATE INDEX idx_users_preferences ON users USING GIN (preferences);
```

```bash
# Then run: npx supabase db diff
# Auto-generates the ALTER TABLE migration
```

### Comparison Table

| Feature             | Imperative            | Declarative              |
| ------------------- | --------------------- | ------------------------ |
| **Learning Curve**  | 🟡 Medium (need SQL)  | 🟢 Easy (less SQL)       |
| **Control**         | 🟢 Full control       | 🟡 Tool-dependent        |
| **Speed**           | 🟡 Manual SQL writing | 🟢 70% faster            |
| **History**         | 🟢 Explicit files     | 🟡 Generated files       |
| **Review**          | 🟢 Clear SQL diffs    | 🟡 Review generated code |
| **Complex Ops**     | 🟢 Full SQL power     | 🔴 Limited               |
| **SQL Learning**    | 🟢 High value         | 🔴 Abstracted away       |
| **Drift Detection** | 🔴 Manual             | 🟢 Automatic             |
| **Tooling**         | 🟢 Standard SQL       | 🟡 Supabase CLI only     |

---

## 🏗️ Flourish's Decision: Imperative Migrations

### Why we chose Imperative

1. **Learning Value** 🎓
   - Henry wants to become a full-stack engineer
   - Learning SQL is essential for backend development
   - Imperative migrations are SQL practice

2. **Project Scale** 📏
   - Solo developer project
   - Small schema (7 tables)
   - Infrequent schema changes
   - Declarative's 70% speed advantage doesn't matter much

3. **Control & Predictability** 🎯
   - Full control over migration order
   - No surprises from auto-generated SQL
   - Can add complex logic if needed (data transformations, conditional migrations)

4. **Already Complete** ✅
   - 4 migrations already written and working
   - Schema is deployed and tested
   - No benefit to switching now

### When to reconsider

Consider switching to Declarative Schema if:

- ⚠️ **Team grows** → Multiple developers benefit from simplified workflow
- ⚠️ **Schema changes become frequent** → 70% speed savings become significant
- ⚠️ **Maintaining schema drift becomes a pain** → Auto-diffing becomes valuable
- ⚠️ **Henry is comfortable with SQL** → Learning value achieved, can optimize for speed

### Migration Path (if needed in future)

If we decide to switch to Declarative later:

```bash
# 1. Generate schema.sql from current migrations
npx supabase db dump --schema public > supabase/schema.sql

# 2. Future changes just edit schema.sql
# 3. Use db diff to generate migrations
npx supabase db diff
```

Our existing migrations remain valid and don't need to be rewritten.

---

## 📚 Workflow Guide

### Current Workflow (Imperative)

```bash
# 1. Create new migration
npx supabase migration new feature_name

# 2. Edit the generated SQL file
# supabase/migrations/YYYYMMDDHHMMSS_feature_name.sql

# 3. Write your SQL
ALTER TABLE users ADD COLUMN new_field TEXT;

# 4. Test locally (optional)
npx supabase db reset  # Resets local DB and runs all migrations

# 5. Push to remote
npx supabase db push

# 6. Commit to Git
git add supabase/migrations/
git commit -m "feat(db): add new_field to users"
```

### Alternative Workflow (Declarative)

```bash
# 1. Edit schema.sql
# supabase/schema.sql - modify the desired state

# 2. Generate migration diff
npx supabase db diff --schema public

# 3. Review generated migration
cat supabase/migrations/YYYYMMDDHHMMSS_generated.sql

# 4. Push to remote
npx supabase db push

# 5. Commit to Git
git add supabase/schema.sql supabase/migrations/
git commit -m "feat(db): add new_field to users"
```

---

## 🔗 Related Documentation

- [ADR 002 - Imperative Migrations Decision](../decisions/002-imperative-migrations.md)
- [Sprint 0.9.2 - Database Migrations](../sprints/sprint-0-foundation/0.9-supabase-migration-plan.md)
- [Database Setup Guide](./database-setup.md)
- [Supabase CLI Reference](https://supabase.com/docs/guides/cli)

---

## 🤔 FAQ

**Q: Can I use both approaches in the same project?**
A: Technically yes, but not recommended. Pick one approach for consistency.

**Q: Is Declarative Schema stable?**
A: Yes, it's a production feature as of 2024-2025. But it's newer than Imperative migrations.

**Q: Will my Imperative migrations become obsolete?**
A: No. Imperative migrations are the foundation of both approaches. Declarative just auto-generates them.

**Q: Can I switch from Imperative to Declarative later?**
A: Yes! Generate schema.sql from your existing migrations and continue from there.

**Q: Which approach does Supabase recommend?**
A: Supabase supports both equally. Declarative is newer and marketed as "simpler", but Imperative remains fully supported.

---

**Decision Made By**: Henry Lee
**Decision Date**: 2025-11-13
**Review Date**: After Sprint 1 (when schema changes become more frequent)
