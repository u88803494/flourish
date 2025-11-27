# Flourish 🌱

> Tools for prosperity and growth

**Flourish** is an integrated personal growth platform designed to help you achieve true prosperity in finance and performance. Based on Scientology management principles, we believe that through proper data tracking and analysis, everyone can find their path to success.

## 🎯 Vision

When money flows and statistics rise, everything will **flourish**.

## 📦 What's Inside?

This monorepo includes:

### Applications

- **`flow`** 💰 - Financial tracking application (Next.js)
  - Track and manage your finances
  - Let money flow healthily and create abundance

- **`apex`** 📈 - Statistics curve tracking tool (Next.js)
  - Plot statistical curves
  - Track performance peaks
  - Continuously climb upward
  - *(Coming soon)*

- **`api`** 🔧 - Backend API service (Archived, Supabase-first) ✅
  - Logic handled by Supabase (RLS, Edge Functions)
  - Database operations via Supabase CLI and SQL

### Shared Packages

- **`@repo/ui`** - Shared React component library
- **`@repo/database`** - Prisma schema and client ✅
- **`@repo/chart-engine`** - Curve chart core logic *(Coming soon)*
- **`@repo/eslint-config`** - ESLint configurations
- **`@repo/typescript-config`** - TypeScript configurations

All packages and applications are 100% [TypeScript](https://www.typescript.org/).

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router) + React 19 + TypeScript
- **Backend**: Supabase (Edge Functions / PostgreSQL) ✅
- **Database**: Supabase PostgreSQL + Prisma ✅
- **Auth**: Supabase Auth *(Sprint 12)*
- **Monorepo**: Turborepo + pnpm ✅
- **Styling**: Tailwind CSS ✅
- **Linting**: ESLint + Prettier ✅

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+

### Development

```bash
# Install dependencies
pnpm install

# Start all applications in development mode
pnpm dev
# flow (3100), apex (3200)

# Start a specific application
pnpm dev --filter=flow        # Financial tracking app
pnpm dev --filter=apex        # Statistics tracking (coming soon)
```

### Build

```bash
# Build all applications
pnpm build

# Build a specific application
pnpm build --filter=flow
```

### Lint

```bash
# Lint all applications
pnpm lint
```

## 🚀 Deployment

### Environments

- **Staging**: `https://flourish-api-staging.onrender.com` (testing environment)
- **Production**: `https://flourish-api-production.onrender.com` (live environment)

### Workflow

```bash
# 1. Create feature branch
git checkout -b feat/your-feature

# 2. Test in staging (optional)
git checkout staging
git merge feat/your-feature
git push origin staging  # Auto-deploys to staging

# 3. Create PR to main
# → Review → Merge → Auto-deploys to production
```

See [Git Workflow Guide](./docs/deployment/git-workflow.md) for complete deployment process.

### Setup Guides

- **[Render Staging](./docs/deployment/render-staging-setup.md)** - Set up staging environment
- **[Render Production](./docs/deployment/render-production-setup.md)** - Set up production environment
- **[Keep-Alive](./docs/deployment/keep-alive-setup.md)** - Configure monitoring

## 📖 Documentation

Comprehensive documentation is available in the [`docs/`](./docs/) directory:

### General Documentation

- [00-discussion-summary.md](./docs/00-discussion-summary.md) - Complete project discussion and decisions
- [01-tech-comparison.md](./docs/01-tech-comparison.md) - Technology selection analysis
- [NestJS Quick Reference (Archived)](./docs/archive/nestjs-references/nestjs-quick-ref.md)
- [05-dev-tooling-plan.md](./docs/05-dev-tooling-plan.md) - Development tooling plan
- [06-complete-sprint-plan.md](./docs/06-complete-sprint-plan.md) - Complete sprint planning
- [07-git-workflow-and-commit-guidelines.md](./docs/07-git-workflow-and-commit-guidelines.md) - Git workflow and commit message guidelines

### Deployment Documentation

- [Git Workflow Guide](./docs/deployment/git-workflow.md) - Branching strategy and deployment workflow
- [Render Staging Setup](./docs/deployment/render-staging-setup.md) - Staging environment setup guide
- [Render Production Setup](./docs/deployment/render-production-setup.md) - Production environment setup guide
- [Keep-Alive Setup](./docs/deployment/keep-alive-setup.md) - UptimeRobot configuration guide
- [Backend Hosting Comparison](./docs/deployment/backend-hosting-comparison.md) - Platform comparison analysis
- [Render Deployment Guide](./docs/deployment/render-deployment-guide.md) - Complete Render deployment guide

## 🗂️ Project Structure

```
flourish/
├── apps/
│   ├── flow/              # 💰 Financial tracking app (Next.js)
│   ├── apex/              # 📈 Statistics curve tool (placeholder)
│   └── api/               # 🔧 Backend API (Archived, Supabase-first) ✅
├── packages/
│   ├── ui/                # 🎨 Shared UI components
│   ├── database/          # 🗄️ Prisma + Supabase client ✅
│   ├── chart-engine/      # 📊 Chart core logic (placeholder)
│   ├── typescript-config/ # ⚙️ Shared TypeScript config
│   └── eslint-config/     # ⚙️ Shared ESLint config
├── docs/                  # 📚 Project documentation
├── .serena/               # 🧠 Project knowledge & memory
├── turbo.json             # Turborepo configuration
└── package.json           # Workspace configuration
```

## 📅 Development Roadmap

### Release 0: Foundation ✅ (100% Complete)

- [x] Sprint 1: Basic monorepo structure ✅ (2025-10-28)
- [x] Sprint 2: Prettier setup ✅ (2025-10-30)
- [x] Sprint 3: Husky + lint-staged ✅ (2025-10-30)
- [x] Sprint 4: commitlint ✅ (2025-10-30)
- [x] Sprint 5: Prisma setup ✅ (2025-10-31)
- [x] Sprint 6: NestJS application (Archived) ✅ (2025-11-04)
  - Backend with Prisma integration (Archived)
  - Health check endpoints (liveness, readiness, full) (Archived)
- [x] Sprint 7: Apex application ✅ (2025-11-04)
  - Next.js 16 statistics tracking tool
  - Beautiful landing page with "Coming soon" features preview
  - Port 3200 configuration complete
  - Ready for feature development in Release 1

### Release 0+: Infrastructure Hardening ✅ (100% Complete)

- [x] Sprint 8: Deployment & CI/CD Setup ✅ (2025-11-07)
  - Dual environment deployment (Staging + Production)
  - Render hosting configuration
  - Vercel frontend deployment
  - Git workflow established (feat → staging → main)
  - Complete deployment documentation
  - Keep-alive monitoring setup
- [x] Sprint 9: Supabase Migration ✅ (2025-11-21)
  - Complete migration to Supabase-first architecture
  - Database schema with RLS policies
  - Supabase client package
  - MCP integration
- [x] Sprint 10: Documentation Agent Setup ✅ (2025-11-22)
  - AGENTS.md, CLAUDE.md, ARCHITECTURE.md created
  - Project glossary and terminology
  - MCP setup guide
- [x] Sprint 11: Sprint Numbering Refactoring ✅ (2025-11-23)
  - Standardized Sprint numbering (0.X → X)
  - Updated all documentation references

### Release 1: Core Features (In Progress)

- [ ] Sprint 12: Authentication system
- [ ] Sprint 13: Transaction CRUD
- [x] Sprint 14: Documentation Standardization ✅ (In Progress)
- [ ] Sprint 15: Chart integration

## 🤝 Contributing

This is a personal learning project, but suggestions and feedback are welcome!

## 📄 License

Private project for personal use.

---

**Built with ❤️ to learn modern full-stack architecture**
