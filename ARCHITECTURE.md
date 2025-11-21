# ARCHITECTURE.md

**Purpose**: System architecture documentation for Flourish platform

**Last Updated**: 2025-11-21
**Status**: Active
**Architecture Version**: 2.0 (Supabase-first)

---

## 🏗️ Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Applications                      │
├────────────────────────────┬────────────────────────────────┤
│      Flow (Next.js)        │      Apex (Next.js)            │
│   Financial Tracking       │   Performance Statistics       │
│   Port: 3100               │   Port: 3200                   │
└────────────────────────────┴────────────────────────────────┘
                              │
                              │ HTTPS
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Platform                         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Auth       │  │   Database   │  │   Storage    │      │
│  │   JWT/OAuth  │  │   PostgreSQL │  │   Files      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   REST API   │  │   Realtime   │  │   Functions  │      │
│  │   Auto-gen   │  │   WebSocket  │  │   Edge       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ RLS Policies
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      PostgreSQL                              │
│                                                               │
│  Tables: users, cards, categories, statements,               │
│          transactions, recurring_expenses, saving_rules      │
└─────────────────────────────────────────────────────────────┘
```

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Vercel (CDN)                          │
├────────────────────────────┬────────────────────────────────┤
│  flow.vercel.app           │  apex.vercel.app               │
│  (Production)              │  (Production)                   │
└────────────────────────────┴────────────────────────────────┘
                              │
                              │ API Calls
                              ↓
┌─────────────────────────────────────────────────────────────┐
│               Supabase Cloud (Global)                        │
│                                                               │
│  Project: fstcioczrehqtcbdzuij                               │
│  Region: Southeast Asia (Singapore)                          │
│  Tier: Free (50K MAU, 500MB DB, 1GB Storage)                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Architecture Decision Records (ADRs)

### ADR 001: Architecture Simplification (2025-11-07)

**Status**: Accepted & Implemented
**Context**: Evaluating backend deployment options (NestJS + Render vs Supabase)

**Decision**: Adopt Supabase-first architecture, remove NestJS backend

**Rationale**:

- **Cost**: $0/month (Supabase Free) vs $7+/month (NestJS + Render)
- **Maintenance**: 70% reduction in infrastructure overhead
- **Development Speed**: 60% faster (auto-generated APIs vs manual endpoints)
- **Feature Fit**: CRUD + statistics align perfectly with Supabase capabilities

**Consequences**:

- ✅ No backend server to maintain
- ✅ Simplified deployment (Vercel only)
- ✅ Built-in Auth, Realtime, Storage
- ⚠️ Complex business logic requires Edge Functions
- ⚠️ Vendor lock-in to Supabase (mitigated: PostgreSQL is standard)

**Implementation**: Sprint 0.9 (4 sub-sprints)
**Documentation**: `docs/decisions/001-architecture-simplification.md`

---

## 📦 Component Architecture

### Frontend Applications

#### Flow App (Financial Tracking)

**Technology Stack**:

- Framework: Next.js 15 (App Router)
- Language: TypeScript 5 (strict mode)
- Styling: Tailwind CSS
- State: React Context + Hooks
- Data Fetching: Supabase Client (@repo/supabase-client)

**Key Features**:

- Transaction management (CRUD)
- Category organization
- Statement import
- Recurring expense tracking
- Saving rules automation

**Directory Structure**:

```
apps/flow/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/              # Utilities and helpers
│   └── hooks/            # Custom React hooks
├── public/               # Static assets
└── package.json
```

#### Apex App (Performance Statistics)

**Technology Stack**:

- Framework: Next.js 15 (App Router)
- Language: TypeScript 5 (strict mode)
- Styling: Tailwind CSS
- Charts: TBD (Phase 1)
- Data Fetching: Supabase Client (@repo/supabase-client)

**Key Features** (Planned):

- Financial KPI dashboard
- Trend analysis
- Goal tracking
- Performance reports

**Directory Structure**:

```
apps/apex/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/              # Utilities and helpers
│   └── hooks/            # Custom React hooks
├── public/               # Static assets
└── package.json
```

### Shared Packages

#### @repo/supabase-client

**Purpose**: Centralized Supabase client configuration and utilities

**Exports**:

- `supabase` - Configured Supabase client instance
- `useAuth()` - Authentication hook
- `useUser()` - Current user data hook
- `useTransactions()` - Transaction data hook
- Types (auto-generated from database schema)

**Usage Example**:

```typescript
import { supabase, useAuth } from '@repo/supabase-client';

function LoginPage() {
  const { signIn, signOut, user } = useAuth();

  // ...
}
```

#### @repo/database

**Purpose**: Database schema reference (Prisma)

**Status**: Reference only (not used for migrations)

**Contents**:

- `prisma/schema.prisma` - Database schema definition
- Documentation for table relationships
- Type reference for discussions

**Note**: Actual migrations use Supabase SQL files

#### @repo/ui

**Purpose**: Shared React components

**Components**:

- Button, Input, Select (form elements)
- Card, Modal, Dropdown (containers)
- Table, List (data display)

**Styling**: Tailwind CSS with consistent design tokens

#### @repo/chart-engine

**Status**: Planned for Phase 1

**Purpose**: Chart rendering logic shared between Flow and Apex

---

## 🗄️ Database Architecture

### Schema Design

**Core Tables**:

```sql
-- User authentication (managed by Supabase Auth)
users
├── id (UUID, PK)
├── email
├── created_at
└── updated_at

-- Payment cards
cards
├── id (UUID, PK)
├── user_id (UUID, FK → users.id)
├── name
├── last_four
├── card_type
└── is_active

-- Transaction categories
categories
├── id (UUID, PK)
├── user_id (UUID, FK → users.id)
├── name
├── type (income/expense)
├── color
└── icon

-- Credit card statements
statements
├── id (UUID, PK)
├── card_id (UUID, FK → cards.id)
├── month
├── year
├── due_date
├── total_amount
└── is_paid

-- Financial transactions
transactions
├── id (UUID, PK)
├── user_id (UUID, FK → users.id)
├── category_id (UUID, FK → categories.id)
├── statement_id (UUID, FK → statements.id, nullable)
├── amount
├── description
├── transaction_date
└── type (income/expense)

-- Recurring expenses
recurring_expenses
├── id (UUID, PK)
├── user_id (UUID, FK → users.id)
├── category_id (UUID, FK → categories.id)
├── amount
├── frequency (daily/weekly/monthly/yearly)
├── start_date
├── end_date (nullable)
└── is_active

-- Automated saving rules
saving_rules
├── id (UUID, PK)
├── user_id (UUID, FK → users.id)
├── name
├── rule_type (percentage/fixed/conditional)
├── amount
├── condition (JSON, nullable)
└── is_active
```

### Row Level Security (RLS)

**Policy Pattern**:

```sql
-- Users can only access their own data
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own transactions" ON transactions
  USING (auth.uid() = user_id);
```

**Applied to all user-scoped tables**:

- transactions
- categories
- cards
- statements
- recurring_expenses
- saving_rules

**Benefits**:

- Automatic multi-tenancy
- No need for WHERE user_id = ? in queries
- Security enforced at database level

### Indexes

**Foreign Keys** (automatic):

```sql
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
CREATE INDEX idx_transactions_statement_id ON transactions(statement_id);
```

**Query Optimization**:

```sql
CREATE INDEX idx_transactions_date ON transactions(transaction_date DESC);
CREATE INDEX idx_transactions_type ON transactions(type);
```

---

## 🔐 Security Architecture

### Authentication Flow

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ 1. signIn(email, password)
       ↓
┌─────────────────┐
│ Supabase Auth   │
├─────────────────┤
│ - Verify creds  │
│ - Generate JWT  │
│ - Set session   │
└────────┬────────┘
         │ 2. JWT Token
         ↓
┌──────────────────┐
│ Client Storage   │
│ (localStorage)   │
└────────┬─────────┘
         │ 3. Include in requests
         ↓
┌────────────────────┐
│ Supabase REST API  │
├────────────────────┤
│ - Validate JWT     │
│ - Extract user_id  │
│ - Apply RLS        │
└────────────────────┘
```

### Data Access Control

**Layers**:

1. **Authentication** (Supabase Auth): Who are you?
2. **Authorization** (RLS Policies): What can you access?
3. **Validation** (Application): Is this data valid?

**Security Principles**:

- Zero trust: Verify every request
- Least privilege: Users can only access their data
- Defense in depth: Multiple security layers
- Encryption: HTTPS for transit, encrypted at rest

### Environment Variables

**Public** (exposed to browser):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

**Private** (server-side only):

```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # Never expose to frontend!
```

**Usage**:

- Anon key: Safe for frontend, limited by RLS
- Service role key: Bypasses RLS, migrations only

---

## 🚀 Deployment Architecture

### Frontend Deployment (Vercel)

**Trigger**: Push to `main` branch
**Process**:

1. Git push → Vercel detects change
2. Vercel builds Next.js apps
3. Deploy to global CDN
4. Update DNS

**Environment Variables** (Vercel Dashboard):

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Domains**:

- Flow: `https://flourish-flow.vercel.app`
- Apex: `https://flourish-apex.vercel.app`

### Database Deployment (Supabase)

**Migration Workflow**:

```bash
# Local development
npx supabase migration new feature_name
# Edit SQL file in supabase/migrations/

# Test locally
npx supabase db reset

# Deploy to production
npx supabase db push
```

**Rollback Strategy**:

- Create reverse migration
- Supabase doesn't support auto-rollback
- Keep backups (automatic daily backups)

---

## 📊 Performance Architecture

### Caching Strategy

**CDN Caching** (Vercel):

- Static assets: Cached indefinitely
- SSR pages: Cache with revalidation
- API routes: No cache (user-specific)

**Client Caching**:

- Supabase Client: In-memory cache
- React Query (future): Server state management

### Database Optimization

**Indexes**:

- All foreign keys indexed
- Date columns for sorting
- Frequently filtered columns

**Query Optimization**:

- RLS policies use indexed columns
- Limit result sets
- Paginate large datasets

### Bundle Size

**Target**: < 200KB initial JS bundle

**Optimization**:

- Tree-shaking (automatic)
- Code splitting (route-based)
- Dynamic imports for heavy components
- Lazy loading for charts (future)

---

## 🔄 Data Flow Architecture

### Transaction Creation Flow

```
┌──────────────┐
│ User Input   │
│ (Flow App)   │
└──────┬───────┘
       │
       │ 1. Submit form
       ↓
┌──────────────────┐
│ Client Validation│
│ (React Hook Form)│
└──────┬───────────┘
       │
       │ 2. Call Supabase
       ↓
┌───────────────────────┐
│ Supabase REST API     │
│ POST /transactions    │
└──────┬────────────────┘
       │
       │ 3. Validate JWT & RLS
       ↓
┌────────────────────────┐
│ PostgreSQL             │
│ INSERT INTO transactions│
└──────┬─────────────────┘
       │
       │ 4. Return new record
       ↓
┌────────────────────┐
│ Update UI          │
│ (Optimistic)       │
└────────────────────┘
```

### Real-time Updates (Future)

```
┌─────────────┐        ┌─────────────┐
│  Browser A  │        │  Browser B  │
└──────┬──────┘        └──────┬──────┘
       │                      │
       │ 1. Create transaction│
       ↓                      │
┌──────────────┐              │
│  Supabase    │              │
│  Database    │              │
└──────┬───────┘              │
       │                      │
       │ 2. Broadcast change  │
       ├──────────────────────┤
       │                      │
       │                      ↓
       │              ┌───────────────┐
       │              │ Realtime Sub  │
       │              │ (WebSocket)   │
       │              └───────┬───────┘
       │                      │
       │                      │ 3. Update UI
       │                      ↓
       │              ┌──────────────┐
       │              │ Browser B    │
       │              │ (Auto-sync)  │
       │              └──────────────┘
```

---

## 🧩 Integration Points

### External Services

**Supabase** (Primary):

- Database (PostgreSQL)
- Authentication (JWT)
- Storage (File uploads)
- Realtime (WebSocket)
- Edge Functions (Future)

**Vercel** (Deployment):

- CDN hosting
- Serverless functions (if needed)
- Analytics
- Environment management

**Future Integrations** (Phase 2+):

- Payment gateways (Stripe)
- Email service (SendGrid/Postmark)
- Analytics (PostHog/Mixpanel)
- Error tracking (Sentry)

---

## 🔮 Future Architecture Considerations

### Scalability

**Current Limits** (Supabase Free Tier):

- 50,000 MAU (Monthly Active Users)
- 500 MB database storage
- 1 GB file storage
- 2 GB bandwidth

**Scaling Path**:

1. **Phase 1** (0-50K users): Free tier
2. **Phase 2** (50K-500K users): Supabase Pro ($25/month)
3. **Phase 3** (500K+ users): Team/Enterprise plan

**Horizontal Scaling**:

- Supabase handles database scaling
- Vercel handles frontend CDN scaling
- Edge Functions for compute scaling

### Migration Path

**If Supabase becomes limiting**:

1. Export PostgreSQL database (standard format)
2. Migrate to managed PostgreSQL (AWS RDS, etc.)
3. Re-implement Auth with NextAuth.js or similar
4. Add NestJS for complex business logic (code archived)

**Cost**: ~1 week of work (architecture preserved)

---

## 📚 Related Documentation

**Architecture Decisions**:

- `docs/decisions/001-architecture-simplification.md`

**Implementation Guides**:

- `docs/guides/database-migrations.md`
- `docs/guides/development.md`

**Deployment**:

- `docs/deployment/README.md`
- `docs/deployment/git-workflow.md`

---

**Maintained By**: Flourish Team
**Architecture Version**: 2.0 (Supabase-first)
**Last Major Update**: Sprint 0.9 (2025-11-21)
**Next Review**: Sprint 1 (Authentication implementation)
