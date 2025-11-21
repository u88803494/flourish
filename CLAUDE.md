# CLAUDE.md

本檔案提供 Claude Code (claude.ai/code) 在此儲存庫中工作時的指引。

**文檔框架**: 本檔案遵循 [Diataxis framework](https://diataxis.fr/) 結構：

- **Tutorials**（學習導向）：新手的逐步指南
- **How-to Guides**（目標導向）：特定任務的解決方案
- **Reference**（資訊導向）：技術規格
- **Explanation**（理解導向）：概念澄清

**相關文檔**:

- `AGENTS.md` - AI agent 協作工作流程與最佳實踐
- `ARCHITECTURE.md` - 系統架構與設計模式
- `docs/references/glossary.md` - 專案術語參考

## 🌱 Project Overview

**Flourish** is an integrated personal growth platform for financial tracking and performance statistics. Based on the philosophy: "When money flows and statistics rise, everything will **flourish**."

### Current Architecture (Sprint 0.8 Decision)

The project has adopted a **Supabase-first architecture** (ADR 001):

```
Frontend (Flow/Apex) → Supabase (Database + Auth + REST API)
         ↓
     Vercel
```

**Key Benefits:**

- Cost: $0/month (vs $7+/month for NestJS + Render)
- Maintenance: ~70% reduction
- Development speed: ~60% faster
- Perfect for current needs (CRUD + statistics)

**Status:** Sprint 0.9 complete (Supabase migration finished)

---

## 🛠️ Essential Development Commands

### Prerequisites

- Node.js 20+
- pnpm 9+
- Turborepo monorepo setup (all apps in one workspace)

### Quick Start

```bash
# Install dependencies
pnpm install

# Start all apps in development mode
pnpm dev
# Starts: flow (3100), apex (3200)

# Start specific app
pnpm dev --filter=flow      # Financial tracking (Next.js)
pnpm dev --filter=apex      # Statistics tool (Next.js)

# Build all applications
pnpm build

# Lint all applications
pnpm lint

# Type check
pnpm check-types
```

### Database (Prisma - Reference Only)

**Important:** In Sprint 0.9, migrations will move to Supabase SQL format. Prisma schema is kept as a reference for design purposes.

```bash
cd packages/database

# View Prisma schema
cat prisma/schema.prisma

# Generate Prisma client (already done)
pnpm prisma generate

# Run migrations locally (development only)
pnpm migrate

# Push schema to database
pnpm db:push
```

### Supabase CLI (Sprint 0.9+)

```bash
# Login to Supabase
npx supabase login

# Initialize local development
npx supabase init

# Link to remote project
npx supabase link --project-ref fstcioczrehqtcbdzuij

# Manage migrations
npx supabase migration new [name]     # Create new migration
npx supabase db push                  # Push to remote
npx supabase db reset                 # Reset local database
```

---

## 📁 Project Structure

### Applications (apps/)

**flow** - Financial tracking application

- Framework: Next.js 15 (App Router)
- Port: 3100 (development)
- Status: Core functionality ready
- URL: https://flourish-flow.vercel.app

**apex** - Statistics and performance tracking

- Framework: Next.js 15 (App Router)
- Port: 3200 (development)
- Status: Foundation complete, features coming in Phase 1
- URL: https://flourish-apex.vercel.app

**api** - ⚠️ **ARCHIVED** (2025-11-21)

- Framework: NestJS 11
- Status: No longer maintained
- Reason: Migrated to Supabase architecture (ADR 001)
- Archive: `docs/archive/nestjs-api/`
- All functionality replaced by Supabase

### Shared Packages (packages/)

**database**

- Prisma schema + client
- Status: Keeping as design reference during migration
- Location: `packages/database/prisma/schema.prisma`
- Tables: users, cards, categories, statements, transactions, recurring_expenses, saving_rules

**supabase-client**

- Supabase JavaScript client wrapper
- TypeScript types (auto-generated from schema)
- React hooks for common operations
- Status: ✅ Complete (Sprint 0.9.3)

**ui**

- Shared React components
- Tailwind CSS based

**chart-engine**

- Chart rendering logic
- Status: Planned for Phase 1

**typescript-config, eslint-config**

- Shared configuration files

---

## 🏗️ Architecture Decisions

### ADR 001: Architecture Simplification (2025-11-07)

**Decision:** Migrate from NestJS + Render to pure Supabase architecture

**Why:**

- Supabase handles: Database + Auth + REST API + Realtime subscriptions
- No separate backend needed for current feature set
- 100% cost reduction ($0 vs $7+/month)
- 70% less maintenance overhead
- 60% faster development

**Implementation:** Sprint 0.9 (4 sub-sprints)

**Important Files:**

- Decision record: `docs/decisions/001-architecture-simplification.md`
- Evaluation: `docs/sprints/sprint-0-foundation/0.8-deployment-evaluation.md`
- Plan: `docs/sprints/sprint-0-foundation/0.9-supabase-migration-plan.md`

---

## 🚀 Development Workflow

### Branches

- `main` - Production (deployed to Vercel)
- `staging` - Testing environment (will be deprecated after Sprint 0.9)
- `feat/*` - Feature branches
- `fix/*` - Bug fix branches

### Commits

Follow **Conventional Commits** format:

```
feat(scope): description        # New feature
fix(scope): description         # Bug fix
docs(scope): description        # Documentation
chore(scope): description       # Maintenance
refactor(scope): description    # Code refactoring
```

Example:

```bash
git commit -m "feat(flow): add transaction filtering

- Add date range selector
- Add category filter
- Implement local state management"
```

### Creating a Feature

```bash
# 1. Create feature branch
git checkout -b feat/new-feature

# 2. Development cycle
pnpm dev                    # Start development
# ... code, test, commit ...

# 3. Push and create PR
git push origin feat/new-feature

# 4. After review and approval
# Merge to main → Auto-deploys to production
```

---

## 📊 Tech Stack

### Frontend

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **UI Components:** React 19
- **State Management:** React Context (planning Redux for Phase 1)

### Backend (Current: NestJS, Moving to Supabase)

- **Framework:** NestJS 11 (archiving in Sprint 0.9)
- **ORM:** Prisma (keeping schema as reference)
- **Testing:** Jest (unit), Supertest (E2E)

### Database

- **Provider:** Supabase (PostgreSQL)
- **Migrations:** SQL files (Supabase CLI)
- **Auth:** Supabase Auth
- **API:** Auto-generated REST API with RLS

### Deployment

- **Frontend:** Vercel (auto-deploy from main)
- **Database:** Supabase (managed PostgreSQL)
- **Backend:** Being removed (Sprint 0.9)

---

## 📚 Key Documentation

### Architecture & Decisions

- `docs/decisions/001-architecture-simplification.md` - Current architecture decision
- `docs/deployment/README.md` - Deployment overview (Supabase + Vercel)

### Sprint Planning

- `docs/sprints/sprint-0-foundation/overview.md` - Phase 0 progress tracking
- `docs/sprints/sprint-0-foundation/0.9-supabase-migration-plan.md` - Sprint 0.9 detailed plan

### Development Guides

- `docs/guides/development.md` - Local development setup
- `docs/guides/mcp-setup.md` - MCP configuration guide (when available)
- `docs/guides/database-migrations.md` - Migration workflow (Sprint 0.9)

### Git Workflow

- `docs/deployment/git-workflow.md` - Branching and deployment strategy

---

## 🎯 Current Phase: Phase 0 Foundation

**Status:** 🔄 In Progress (93% complete - 13/14 sprints done)

Completed sprints:

- Sprint 0.1: Monorepo structure ✅
- Sprint 0.2-0.5: Development tooling ✅
- Sprint 0.6: NestJS ✅
- Sprint 0.7: Apex app ✅
- Sprint 0.8: Architecture decision ✅
- Sprint 0.9: Supabase migration ✅ (All 4 sub-sprints complete)
- Sprint 0.10: Documentation & Agent Setup 🔄 (In progress)

**Next Sprint**: Sprint 0.11 - Sprint Numbering Refactoring

---

## 🔐 Security & Environment Variables

### Local Development (.env.local)

```bash
# Supabase Configuration (Sprint 0.9+)
SUPABASE_PROJECT_REF=fstcioczrehqtcbdzuij
SUPABASE_ACCESS_TOKEN=<your-access-token>  # For Supabase CLI
NEXT_PUBLIC_SUPABASE_URL=https://fstcioczrehqtcbdzuij.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>   # For frontend

# MCP Configuration (Optional, Sprint 0.9+)
# MCP config uses environment variables defined above
```

**Important:**

- `.env.local` is in `.gitignore` (never commit secrets)
- Use environment variables in configuration files
- Service role key is only for migrations, never expose to frontend

---

## 🧠 Working with the Codebase

### Key Files to Understand

1. **Turborepo Configuration**
   - `turbo.json` - Monorepo pipeline definition
   - Root `package.json` - Workspace configuration

2. **Prisma Schema** (Reference)
   - `packages/database/prisma/schema.prisma`
   - Contains 7 main tables (users, cards, categories, statements, etc.)
   - Being migrated to Supabase SQL format in Sprint 0.9

3. **Frontend Configuration**
   - `apps/flow/next.config.js` - Next.js config for Flow
   - `apps/apex/next.config.js` - Next.js config for Apex
   - Both use Tailwind CSS

4. **Type Safety**
   - TypeScript strict mode enabled everywhere
   - Shared types in packages
   - Prisma generates types for database models

### Important: Reading Code

**Before making changes:**

1. Check if file has existing patterns (follow them)
2. Look at recent commits in file history
3. Check ADR for architectural decisions
4. Run `pnpm lint` before committing

**Common Issues:**

- Type errors? Run `pnpm check-types`
- Lint errors? Run `pnpm lint --fix`
- Build fails? Check `pnpm build` output

---

## 🚨 Known Limitations & Future Work

### Currently Being Removed

- **NestJS API** (`apps/api/`) - Being archived in Sprint 0.9
  - All backend logic will use Supabase directly
  - Archived code saved for reference: `docs/archive/nestjs-api/`

### Not Yet Implemented

- **Authentication** - Coming in Sprint 1 (Supabase Auth)
- **Charts** - Chart engine planned for Phase 1
- **Realtime** - Supabase Realtime subscriptions (future)

### Architecture Assumptions

- Small team (solo developer)
- Current load: small user base (~50K MAU free tier)
- Future growth: RLS policies will scale, may need Edge Functions for complex logic
- Can upgrade to NestJS later if needed (code archived)

---

## 💡 Development Tips

### Performance

- Monorepo: Use `--filter` flag to focus on specific apps
- Build: Turborepo caches builds, deleting `.turbo/` clears cache
- Dev: Each app runs independently, no cross-app dependencies at runtime

### Testing

- Jest for unit tests
- Run: `pnpm test` (if configured)
- E2E tests with Supertest (API only, during Sprint 0.9 archival)

### Debugging

- Use browser DevTools for frontend
- Supabase Dashboard for database inspection
- Check application logs in Vercel Dashboard

---

## 📞 Getting Help

### Documentation

1. Check `docs/` directory for complete documentation
2. Read relevant ADR for architectural decisions
3. Check Sprint records for context

### Common Questions

- "How do I add a new API endpoint?" → See docs on Supabase REST API
- "How do I deploy?" → See `docs/deployment/` folder
- "How do I create migrations?" → See `docs/guides/database-migrations.md` (Sprint 0.9+)

---

**Last Updated:** 2025-11-21
**Current Phase:** Phase 0 Foundation (93% complete - Sprint 0.10 in progress)
**Next:** Sprint 0.11 - Sprint Numbering Refactoring
