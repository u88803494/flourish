# ADR 002: Use Imperative Migrations for Database Schema Changes

**Status**: Accepted
**Date**: 2025-11-13
**Deciders**: Henry Lee
**Related**: [ADR 001 - Architecture Simplification](./001-architecture-simplification.md), [Sprint 0.9.2](../sprints/sprint-0-foundation/0.9-supabase-migration-plan.md)

---

## Context

During Sprint 0.9.2 (Database Schema & Migrations), we needed to decide between two approaches for managing Supabase database migrations:

1. **Imperative Migrations** - Traditional SQL migration files
2. **Declarative Schema** - New Supabase feature (2024-2025) using state-based schema definitions

Both approaches are officially supported by Supabase and production-ready.

### Background

- Flourish is a personal project with a solo developer (Henry)
- Project uses Supabase as the database and backend (per ADR 001)
- Schema consists of 7 core tables (users, cards, categories, statements, transactions, recurring_expenses, saving_rules)
- Migration frequency expected to be low (monthly at most)
- Developer goal: become a full-stack engineer with strong SQL knowledge

### Research Findings

**Imperative Migrations**:

- ✅ Full control over migration logic
- ✅ Explicit history and clear diffs
- ✅ Standard SQL - universal knowledge
- ✅ Can handle complex data transformations
- ❌ Requires manual SQL writing
- ❌ No automatic drift detection

**Declarative Schema**:

- ✅ 70% faster development (auto-generates migrations)
- ✅ Automatic schema drift detection
- ✅ Simpler workflow for simple CRUD operations
- ❌ Less control over migration execution
- ❌ Newer feature with fewer learning resources
- ❌ Supabase-specific, not portable

---

## Decision

**We will use Imperative Migrations (SQL migration files) for Flourish.**

Migration workflow:

```bash
# Create migration
npx supabase migration new feature_name

# Edit SQL file
# supabase/migrations/YYYYMMDDHHMMSS_feature_name.sql

# Push to Supabase
npx supabase db push
```

---

## Rationale

### 1. Learning Value (Primary Factor) 🎓

**Henry's Goal**: Become a full-stack engineer

- Imperative migrations provide hands-on SQL practice
- Building strong SQL skills is essential for backend development
- Declarative Schema abstracts away SQL, reducing learning opportunities
- **Impact**: High - aligns with personal development goals

### 2. Project Scale (Supporting Factor) 📏

**Flourish Characteristics**:

- Solo developer (no team coordination complexity)
- Small schema (7 tables, ~30 columns total)
- Low migration frequency (estimated once per month or less)

**Analysis**:

- Declarative's 70% speed advantage is negligible for infrequent changes
- Estimated time savings: ~2 hours/year
- Not worth the trade-off of reduced control and learning

### 3. Already Complete (Pragmatic Factor) ✅

**Current State**:

- Sprint 0.9.2 completed with 4 Imperative migrations
- All migrations tested and deployed successfully
- Schema working correctly in production

**Analysis**:

- Switching to Declarative would require rework
- No technical debt from current approach
- Migrations can serve as learning examples

### 4. Control & Predictability (Technical Factor) 🎯

**Requirements**:

- Need explicit control for Row Level Security (RLS) policies
- Complex trigger functions for auth integration
- Helper functions for business logic
- Data type migrations (PascalCase ENUM → snake_case)

**Analysis**:

- Imperative provides full control over migration order
- Can review exact SQL in pull requests
- No surprises from auto-generated code
- Handles complex operations better

---

## Consequences

### Positive ✅

1. **Strong SQL foundation**: Developer gains valuable SQL expertise
2. **Full control**: Can implement complex migrations as needed
3. **Clear history**: Each migration file documents exactly what changed
4. **Easy review**: SQL diffs are straightforward in PRs
5. **Portable knowledge**: SQL skills transfer to any database/ORM

### Negative ❌

1. **Manual work**: Must write SQL by hand for each change
2. **No auto-diffing**: Can't automatically detect schema drift
3. **Slower (marginally)**: Takes longer to write migrations vs auto-generation

### Neutral 🟡

1. **Can switch later**: Not locked in - can migrate to Declarative Schema if needs change
2. **Both approaches supported**: Supabase maintains both long-term

---

## Alternatives Considered

### Alternative 1: Declarative Schema

**Pros**:

- Faster development (70% time savings)
- Automatic drift detection
- Simpler workflow

**Cons**:

- Less learning value (abstracts SQL away)
- Reduced control over migrations
- Fewer learning resources available

**Why rejected**: Learning value and control are higher priorities than speed for this project.

### Alternative 2: ORM-based Migrations (Prisma, Drizzle)

**Pros**:

- TypeScript-first approach
- Type-safe queries
- Integrated migrations

**Cons**:

- Poor Supabase integration (per ADR 001 research)
- Doesn't support Supabase features (RLS, auth.users, triggers)
- Additional abstraction layer

**Why rejected**: Already decided against ORMs in ADR 001 due to Supabase compatibility issues.

### Alternative 3: Hybrid Approach

**Idea**: Use Imperative for complex migrations, Declarative for simple ones

**Why rejected**: Mixing approaches creates inconsistency and confusion.

---

## Implementation

### Sprint 0.9.2 Deliverables

Completed 4 migrations using Imperative approach:

1. **`20251113050233_initial_schema.sql`**
   - Core tables and ENUM types
   - Foreign key relationships
   - Timestamps and defaults

2. **`20251113054218_auth_integration.sql`**
   - Auto-create user trigger
   - Updated_at triggers for all tables

3. **`20251113054418_rls_policies.sql`**
   - Row Level Security enabled
   - User data isolation policies

4. **`20251113054900_indexes_functions.sql`**
   - Performance indexes
   - Helper functions for business logic

### Guidelines for Future Migrations

```sql
-- Template for new migrations
-- supabase/migrations/YYYYMMDDHHMMSS_descriptive_name.sql

-- ============================================================================
-- Migration XX: Descriptive Title
-- Purpose and context
-- ============================================================================

-- Add your SQL here
-- Use comments to explain non-obvious logic

-- Add table comments for documentation
COMMENT ON TABLE table_name IS 'Description of purpose';
COMMENT ON COLUMN table_name.column_name IS 'Description of use';
```

---

## Review Triggers

Reconsider this decision if:

1. **Team Growth**: Multiple developers join → Declarative might simplify collaboration
2. **High Frequency**: Schema changes become weekly → 70% speed savings become significant
3. **SQL Mastery**: Henry achieves strong SQL skills → Learning value achieved
4. **Schema Complexity**: Schema grows to 50+ tables → Auto-diffing becomes valuable
5. **Drift Issues**: Manual drift management becomes painful → Auto-detection needed

**Next Review**: After Sprint 1 (Authentication) when schema evolution patterns become clearer

---

## Related Decisions

- **ADR 001 - Architecture Simplification**: Decided to use Supabase directly (no NestJS, no Prisma)
- This ADR complements ADR 001 by defining how we'll manage Supabase migrations

---

## References

- [Supabase Migration Approaches Guide](../guides/supabase-migration-approaches.md) - Detailed comparison
- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [Sprint 0.9.2 Implementation](../sprints/sprint-0-foundation/0.9-supabase-migration-plan.md)
- [PostgreSQL Migration Best Practices](https://www.postgresql.org/docs/current/ddl-alter.html)

---

## Notes

### Why This Matters

Database migrations are a foundational decision that affects:

- Development velocity
- Code review quality
- Team onboarding
- Technical debt accumulation
- Developer skill growth

Choosing Imperative Migrations prioritizes **learning and control** over **speed and convenience** - appropriate for a solo developer building full-stack skills.

### Future Migration Path

If we switch to Declarative Schema later:

```bash
# Generate schema.sql from current migrations
npx supabase db dump --schema public > supabase/schema.sql

# Future changes edit schema.sql and run
npx supabase db diff
```

Existing Imperative migrations remain valid and functional.
