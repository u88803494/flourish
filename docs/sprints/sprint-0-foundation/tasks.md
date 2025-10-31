# Sprint 0: Foundation - Tasks

Track the implementation progress of Sprint 0 sub-sprints.

---

## 📋 Sprint 0.1: Basic Monorepo Structure

**Status**: ✅ COMPLETED  
**Completed**: 2025-01-15

- [x] Create Turborepo with pnpm
  - Use `pnpm dlx create-turbo@latest flourish`
  - Select pnpm as package manager
- [x] Rename web app to flow
  - Rename directory `apps/web` → `apps/flow`
  - Update `package.json` name field
- [x] Create placeholder directories
  - Create `apps/apex/`
  - Create `apps/api/`
  - Create `packages/database/`
  - Create `packages/chart-engine/`
  - Add `.gitkeep` files
- [x] Organize documentation
  - Create `docs/` structure (guides, references, sprints)
  - Move and reorganize existing documentation files
  - Create `docs/README.md` for navigation
  - Create `project-overview.md`
- [x] Test flow app
  - Run `pnpm dev --filter=flow`
  - Verify app loads at http://localhost:3000
- [x] Git commits
  - Commit 1: Rename web to flow
  - Commit 2: Add placeholder directories
  - Commit 3: Add documentation
  - Commit 4: Update README
  - Commit 5: Update dependencies
  - Follow Conventional Commits format

---

## 🎨 Sprint 0.2: Prettier Setup

**Status**: ✅ COMPLETED
**Completed**: 2025-10-30

- [x] Install Prettier
  - `pnpm add -D -w prettier`
- [x] Create `.prettierrc` configuration
  - Define formatting rules
  - Set consistent style (semi, quotes, etc.)
- [x] Create `.prettierignore`
  - Ignore `node_modules`, `.next`, etc.
- [x] Add format scripts to root `package.json`
  - `format`: Format all files
  - `format:check`: Check formatting (for CI)
- [x] Format existing codebase
  - Run `pnpm format`
  - Review changes
- [x] Test formatting
  - Make a small change
  - Run format
  - Verify auto-formatting works
- [x] Git commit
  - `chore: add prettier for code formatting`

---

## 🪝 Sprint 0.3: Husky + lint-staged

**Status**: ✅ COMPLETED
**Completed**: 2025-10-30

- [x] Install packages
  - `pnpm add -D -w husky lint-staged`
- [x] Initialize Husky
  - Run `npx husky install`
  - Add `prepare` script to `package.json`
- [x] Create `.lintstagedrc` configuration
  - Configure for TypeScript files
  - Configure for JSON/MD files
- [x] Create pre-commit hook
  - `npx husky add .husky/pre-commit "npx lint-staged"`
- [x] Test pre-commit hook
  - Make a change
  - Stage files
  - Attempt commit
  - Verify auto-format and lint runs
- [x] Document the workflow
  - Update development guide if needed
- [x] Git commit
  - `chore: add husky and lint-staged for pre-commit checks`

---

## 📝 Sprint 0.4: commitlint Setup

**Status**: ✅ COMPLETED
**Completed**: 2025-10-30

- [x] Install commitlint
  - `pnpm add -D -w @commitlint/cli @commitlint/config-conventional`
- [x] Create `commitlint.config.js`
  - Extend conventional config
  - Customize type-enum if needed
- [x] Create commit-msg hook
  - `npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'`
- [x] Test commit message validation
  - Try invalid commit (should fail)
  - Try valid commit (should pass)
- [x] Verify with team conventions
  - Ensure types match our workflow
- [x] Git commit
  - `chore: add commitlint for commit message validation`

---

## 🗄️ Sprint 0.5: Prisma Setup

**Status**: ✅ COMPLETED
**Completed**: 2025-10-31

- [x] Initialize database package
  - Create `packages/database/` structure
  - Create `package.json`
- [x] Install Prisma
  - `pnpm add @prisma/client`
  - `pnpm add -D prisma`
- [x] Initialize Prisma
  - Run `npx prisma init`
  - Configure datasource for PostgreSQL
- [x] Create basic schema
  - Define User model
  - Add necessary fields (users, cards, statements, transactions, categories, etc.)
- [x] Set up Supabase project
  - Create project on supabase.com (Tokyo region)
  - Get connection string (Session Pooler)
  - Add to `.env`
- [x] Create database package index
  - Export PrismaClient
  - Export types
- [x] Update Turbo pipeline
  - Add `db:generate` task
  - Add dependency in `dev` and `build`
- [x] Test Prisma client
  - Run `pnpm db:generate`
  - Verify types are generated
- [x] Integrate with flow app
  - Add `@repo/database` dependency
  - Test import
- [x] Run first migration
  - Successfully executed `npx prisma migrate dev --name init`
  - Created 8 tables (7 core + 1 migrations tracking)
  - Verified in Supabase Dashboard
- [x] Git commits
  - Created comprehensive database setup documentation
  - Added troubleshooting reference guide

---

## 🔧 Sprint 0.6: NestJS Application

**Status**: 📦 Planned  
**Estimated Time**: 1 hour

- [ ] Create NestJS app
  - `cd apps && npx @nestjs/cli new api`
  - Choose pnpm
- [ ] Configure package.json
  - Update scripts (dev, build, start)
  - Add workspace dependencies
- [ ] Install dependencies
  - `@repo/database`
  - `@nestjs/config`
  - `@nestjs/passport`, `passport-jwt`
  - `class-validator`, `class-transformer`
- [ ] Create Prisma module
  - Generate PrismaModule
  - Create PrismaService
  - Make globally available
- [ ] Set up environment variables
  - Create `.env` file
  - Add `DATABASE_URL`
  - Add `PORT=3001`
- [ ] Test NestJS startup
  - Run `pnpm dev` (in apps/api)
  - Verify app runs on port 3001
  - Check health endpoint
- [ ] Update root turbo.json
  - Ensure api is included in dev pipeline
- [ ] Test multi-app dev
  - Run `pnpm dev` from root
  - Verify flow (3000) and api (3001) both run
- [ ] Git commit
  - `feat(api): set up nestjs backend with prisma integration`

---

## 📈 Sprint 0.7: Apex Application

**Status**: 📦 Planned  
**Estimated Time**: 30 minutes

- [ ] Create Next.js app
  - `cd apps && pnpm create next-app@latest apex`
  - TypeScript: Yes
  - App Router: Yes
  - Tailwind: Yes
- [ ] Configure port
  - Update dev script to use port 3002
  - `"dev": "next dev -p 3002"`
- [ ] Add workspace dependencies
  - `@repo/ui`
  - `@repo/chart-engine` (when created)
- [ ] Create basic structure
  - Update home page with placeholder
  - Add navigation if needed
- [ ] Test apex startup
  - Run `pnpm dev --filter=apex`
  - Verify app runs on port 3002
- [ ] Test all apps concurrently
  - Run `pnpm dev` from root
  - Verify flow (3000), apex (3002), api (3001)
- [ ] Update documentation
  - Add apex to README
  - Update project overview
- [ ] Git commit
  - `feat(apex): set up apex app for statistics tracking`

---

## 📊 Overall Progress

**Sprint 0 Completion**: 5/7 sub-sprints (71%)

**Time Spent**: ~2.5 hours
**Time Remaining**: ~1.5 hours

**Blockers**: None
**Risks**: None identified

---

## 🎯 Definition of Done

Sprint 0 is complete when:

- [x] Sprint 0.1: Basic monorepo ✅
- [x] Sprint 0.2: Prettier configured ✅
- [x] Sprint 0.3: Git hooks working ✅
- [x] Sprint 0.4: Commit validation active ✅
- [x] Sprint 0.5: Database accessible ✅
- [ ] Sprint 0.6: API server running
- [ ] Sprint 0.7: All apps running together
- [x] Documentation updated (Database, Troubleshooting, Architecture)
- [ ] Ready to start Sprint 1

---

## 📝 Notes

### 2025-01-15

- Completed Sprint 0.1 in ~25 minutes
- Turborepo setup was smooth with pnpm
- Documentation restructure needed (completed)
- Git workflow established with 7 clean commits
- NODE_ENV issue resolved during setup

### 2025-10-30

- Completed Sprint 0.2 (Prettier Setup)
  - Prettier configuration added with sensible defaults
  - Format scripts added to package.json
  - All files formatted with `pnpm format`
- Completed Sprint 0.3 (Husky + lint-staged)
  - Husky hooks configured successfully
  - Pre-commit hook runs lint-staged automatically
  - `.lintstagedrc.json` configured for TypeScript and markdown files
- Completed Sprint 0.4 (commitlint)
  - commitlint configured with conventional commits
  - Commit message validation working via commit-msg hook
  - Custom type-enum configured in commitlint.config.js
- Development tooling phase complete (Sprint 0.1-0.4)
- Ready to proceed with infrastructure setup (Sprint 0.5-0.7)

### 2025-10-31

- Completed Sprint 0.5 (Prisma Setup + Database Migration)
  - Successfully created Supabase project in Tokyo region
  - Resolved IPv4/IPv6 connection issue by using Session Pooler connection method
  - Created comprehensive database schema with 7 core tables
  - Executed first Prisma migration successfully
  - Tables created: users, cards, statements, transactions, categories, recurring_expenses, saving_rules
  - Created detailed documentation:
    - `/docs/guides/database-setup.md` - Complete setup guide with troubleshooting
    - `/docs/references/database-troubleshooting.md` - Error reference guide
    - Updated `/docs/architecture/database-design.md` with connection architecture decisions
    - Updated `/docs/guides/development-setup.md` with database setup steps
    - Updated `/docs/README.md` navigation structure
  - Key learning: Session Pooler (not Direct Connection) required for IPv4 networks in Supabase
  - Ready to proceed with Sprint 0.6 (NestJS Setup)

---

**Last Updated**: 2025-10-31
**Next Update**: After completing Sprint 0.6
