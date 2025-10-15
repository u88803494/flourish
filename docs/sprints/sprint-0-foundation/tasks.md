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

**Status**: 📦 Planned  
**Estimated Time**: 15 minutes

- [ ] Install Prettier
  - `pnpm add -D -w prettier`
  
- [ ] Create `.prettierrc` configuration
  - Define formatting rules
  - Set consistent style (semi, quotes, etc.)
  
- [ ] Create `.prettierignore`
  - Ignore `node_modules`, `.next`, etc.
  
- [ ] Add format scripts to root `package.json`
  - `format`: Format all files
  - `format:check`: Check formatting (for CI)
  
- [ ] Format existing codebase
  - Run `pnpm format`
  - Review changes
  
- [ ] Test formatting
  - Make a small change
  - Run format
  - Verify auto-formatting works
  
- [ ] Git commit
  - `chore: add prettier for code formatting`

---

## 🪝 Sprint 0.3: Husky + lint-staged

**Status**: 📦 Planned  
**Estimated Time**: 20 minutes

- [ ] Install packages
  - `pnpm add -D -w husky lint-staged`
  
- [ ] Initialize Husky
  - Run `npx husky install`
  - Add `prepare` script to `package.json`
  
- [ ] Create `.lintstagedrc` configuration
  - Configure for TypeScript files
  - Configure for JSON/MD files
  
- [ ] Create pre-commit hook
  - `npx husky add .husky/pre-commit "npx lint-staged"`
  
- [ ] Test pre-commit hook
  - Make a change
  - Stage files
  - Attempt commit
  - Verify auto-format and lint runs
  
- [ ] Document the workflow
  - Update development guide if needed
  
- [ ] Git commit
  - `chore: add husky and lint-staged for pre-commit checks`

---

## 📝 Sprint 0.4: commitlint Setup

**Status**: 📦 Planned  
**Estimated Time**: 15 minutes

- [ ] Install commitlint
  - `pnpm add -D -w @commitlint/cli @commitlint/config-conventional`
  
- [ ] Create `commitlint.config.js`
  - Extend conventional config
  - Customize type-enum if needed
  
- [ ] Create commit-msg hook
  - `npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'`
  
- [ ] Test commit message validation
  - Try invalid commit (should fail)
  - Try valid commit (should pass)
  
- [ ] Verify with team conventions
  - Ensure types match our workflow
  
- [ ] Git commit
  - `chore: add commitlint for commit message validation`

---

## 🗄️ Sprint 0.5: Prisma Setup

**Status**: 📦 Planned  
**Estimated Time**: 30 minutes

- [ ] Initialize database package
  - Create `packages/database/` structure
  - Create `package.json`
  
- [ ] Install Prisma
  - `pnpm add @prisma/client`
  - `pnpm add -D prisma`
  
- [ ] Initialize Prisma
  - Run `npx prisma init`
  - Configure datasource for PostgreSQL
  
- [ ] Create basic schema
  - Define User model
  - Add necessary fields
  
- [ ] Set up Supabase project
  - Create project on supabase.com
  - Get connection string
  - Add to `.env`
  
- [ ] Create database package index
  - Export PrismaClient
  - Export types
  
- [ ] Update Turbo pipeline
  - Add `db:generate` task
  - Add dependency in `dev` and `build`
  
- [ ] Test Prisma client
  - Run `pnpm db:generate`
  - Verify types are generated
  
- [ ] Integrate with flow app
  - Add `@repo/database` dependency
  - Test import
  
- [ ] Git commit
  - `feat(database): set up prisma with shared database package`

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

**Sprint 0 Completion**: 1/7 sub-sprints (14%)

**Time Spent**: ~25 minutes  
**Time Remaining**: ~3.5 hours

**Blockers**: None  
**Risks**: None identified

---

## 🎯 Definition of Done

Sprint 0 is complete when:
- [x] Sprint 0.1: Basic monorepo ✅
- [ ] Sprint 0.2: Prettier configured
- [ ] Sprint 0.3: Git hooks working
- [ ] Sprint 0.4: Commit validation active
- [ ] Sprint 0.5: Database accessible
- [ ] Sprint 0.6: API server running
- [ ] Sprint 0.7: All apps running together
- [ ] All documentation updated
- [ ] Ready to start Sprint 1

---

## 📝 Notes

### 2025-01-15
- Completed Sprint 0.1 in ~25 minutes
- Turborepo setup was smooth with pnpm
- Documentation restructure needed (completed)
- Git workflow established with 7 clean commits
- NODE_ENV issue resolved during setup

---

**Last Updated**: 2025-01-15  
**Next Update**: After completing Sprint 0.2
