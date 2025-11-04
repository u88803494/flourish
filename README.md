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
  - _(Coming soon)_

- **`api`** 🔧 - Backend API service (NestJS) ✅
  - Business logic processing
  - Database operations with Prisma
  - Health check endpoints (liveness, readiness)
  - TypeScript strict mode enabled
  - Runs on `http://localhost:3001`

### Shared Packages

- **`@repo/ui`** - Shared React component library
- **`@repo/database`** - Prisma schema and client ✅
- **`@repo/chart-engine`** - Curve chart core logic _(Coming soon)_
- **`@repo/eslint-config`** - ESLint configurations
- **`@repo/typescript-config`** - TypeScript configurations

All packages and applications are 100% [TypeScript](https://www.typescriptlang.org/).

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router) + React 19 + TypeScript
- **Backend**: NestJS 11 + TypeScript (Strict mode) ✅
- **Database**: Supabase PostgreSQL + Prisma ✅
- **Auth**: Supabase Auth _(Sprint 1)_
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
# flow (3000), apex (3002), api (3001)

# Start a specific application
pnpm dev --filter=flow        # Financial tracking app
pnpm dev --filter=api         # Backend API
pnpm dev --filter=apex        # Statistics tracking (coming soon)

# Check API health
curl http://localhost:3001/health
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

## 📖 Documentation

Comprehensive documentation is available in the [`docs/`](./docs/) directory:

- [00-discussion-summary.md](./docs/00-discussion-summary.md) - Complete project discussion and decisions
- [01-tech-comparison.md](./docs/01-tech-comparison.md) - Technology selection analysis
- [02-nestjs-quick-ref.md](./docs/02-nestjs-quick-ref.md) - NestJS quick reference
- [05-dev-tooling-plan.md](./docs/05-dev-tooling-plan.md) - Development tooling plan
- [06-complete-sprint-plan.md](./docs/06-complete-sprint-plan.md) - Complete sprint planning
- [07-git-workflow-and-commit-guidelines.md](./docs/07-git-workflow-and-commit-guidelines.md) - Git workflow and commit message guidelines

## 🗂️ Project Structure

```
flourish/
├── apps/
│   ├── flow/              # 💰 Financial tracking app (Next.js)
│   ├── apex/              # 📈 Statistics curve tool (placeholder)
│   └── api/               # 🔧 Backend API (NestJS, port 3001) ✅
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

### Phase 0: Foundation ✅ (85% Complete)

- [x] Sprint 0.1: Basic monorepo structure ✅ (2025-10-28)
- [x] Sprint 0.2: Prettier setup ✅ (2025-10-30)
- [x] Sprint 0.3: Husky + lint-staged ✅ (2025-10-30)
- [x] Sprint 0.4: commitlint ✅ (2025-10-30)
- [x] Sprint 0.5: Prisma setup ✅ (2025-10-31)
- [x] Sprint 0.6: NestJS application ✅ (2025-11-04)
  - NestJS backend with Prisma integration
  - Health check endpoints (liveness, readiness, full)
  - TypeScript strict mode enabled
  - ESLint & Prettier configured
  - Unit & E2E tests passing
- [ ] Sprint 0.7: Apex application _(Next)_

### Phase 0+: Infrastructure Hardening (Planned)

- [ ] Sprint 0.8: CI/CD & Testing Infrastructure _(2-3 weeks)_
- [ ] Sprint 0.9: Security Foundations _(2-3 weeks)_

### Phase 1: Core Features

- [ ] Sprint 1: Authentication system
- [ ] Sprint 2: Transaction CRUD
- [ ] Sprint 3: Categories and statistics
- [ ] Sprint 4: Chart integration

## 🤝 Contributing

This is a personal learning project, but suggestions and feedback are welcome!

## 📄 License

Private project for personal use.

---

**Built with ❤️ to learn modern full-stack architecture**
