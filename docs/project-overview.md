# Flourish - Project Overview

> Tools for prosperity and growth

---

## 🌱 Vision

**Flourish** is an integrated personal growth platform designed to help individuals achieve true prosperity in finance and performance. Based on Scientology management principles, we believe that through proper data tracking and analysis, everyone can find their path to success.

When money flows and statistics rise, everything will **flourish**.

---

## 🎯 Project Goals

### Primary Goals
1. **Learn Modern Full-Stack Architecture** - Master professional-grade monorepo setup, frontend-backend separation, and best practices
2. **Build Practical Tools** - Create useful applications for personal financial tracking and statistical analysis
3. **Practice Agile Development** - Follow sprint-based development with clear specifications

### Secondary Goals
- Understand DevOps and deployment workflows
- Master TypeScript across the entire stack
- Learn enterprise-level code organization
- Build a portfolio-worthy project

---

## 📦 Applications

### Flow 💰
**Financial Tracking Application**

Flow helps you track and manage finances, letting money flow healthily to create abundance.

**Key Features**:
- Transaction recording (income/expenses)
- Category management
- Budget tracking
- Financial statistics and reports
- Export/import capabilities

**Philosophy**: Money is flow. By tracking and managing financial flow, we create abundance.

---

### Apex 📈
**Statistics Curve Tracking Tool**

Apex helps you plot statistical curves, track performance peaks, and achieve power condition status.

**Key Features**:
- Statistical data input and visualization
- Condition formula calculation (Scientology management)
- Trend analysis
- Curve plotting
- Integration with Flow data

**Philosophy**: Track the apex (peak) of your statistics. Continuously climb upward to reach power condition.

---

## 🏗️ Technical Architecture

### Monorepo Structure
- **Framework**: Turborepo
- **Package Manager**: pnpm
- **Workspace**: Multiple apps and shared packages

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI**: React 19, Tailwind CSS
- **State Management**: TBD (React Query / Zustand)

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Architecture**: Modular, dependency injection
- **API Style**: RESTful

### Database & Auth
- **Database**: Supabase PostgreSQL
- **ORM**: Prisma
- **Authentication**: Supabase Auth
- **Strategy**: Frontend handles auth, backend validates JWT

### Shared Packages
- `@repo/database` - Prisma schema and client
- `@repo/chart-engine` - Curve calculation logic
- `@repo/ui` - Shared UI components
- `@repo/eslint-config` - ESLint configuration
- `@repo/typescript-config` - TypeScript configuration

---

## 🎨 Design Philosophy

### 1. Separation of Concerns
- Frontend: UI rendering, user interaction, state management
- Backend: Business logic, data persistence, authorization
- Authentication: Delegated to Supabase Auth

### 2. Type Safety
- Full TypeScript across frontend and backend
- Shared types between apps
- Prisma generates types from database schema

### 3. Developer Experience
- Hot reload for all apps
- Unified linting and formatting
- Git hooks for quality checks
- Clear documentation

### 4. Specification-Driven Development
- Every feature starts with clear requirements
- Design decisions documented before coding
- Tasks tracked with progress indicators
- All discussions recorded

---

## 🗓️ Development Phases

### Phase 0: Foundation (Current)
Setting up the development environment and tooling
- Sprint 0.1: ✅ Basic monorepo structure
- Sprint 0.2-0.4: Development tooling (Prettier, Husky, commitlint)
- Sprint 0.5-0.7: Core infrastructure (Prisma, NestJS, Apex app)

### Phase 1: Core Features
Building the essential functionality
- Sprint 1: Authentication system
- Sprint 2: Transaction CRUD (Flow)
- Sprint 3: Categories and statistics
- Sprint 4: Chart integration (Apex)

### Phase 2: Enhancement
Adding advanced features and polish
- Advanced reporting
- Data export/import
- Budget management
- Mobile responsiveness

### Phase 3: Deployment
Taking the project to production
- CI/CD setup
- Deployment to Vercel + Railway
- Monitoring and logging
- Documentation finalization

---

## 🌟 What Makes This Project Special

1. **Real Learning Project** - Not a tutorial copy, but a genuine exploration of modern development
2. **Specification-Driven** - Every feature has clear requirements and design docs
3. **Philosophical Foundation** - Based on Scientology management principles, giving it deeper meaning
4. **Production-Quality** - Following enterprise best practices from day one
5. **Well-Documented** - Every decision recorded for future reference

---

## 📚 Related Documents

- [Git Workflow](./guides/git-workflow.md) - Development workflow and commit guidelines
- [Sprint 0 Specs](./sprints/sprint-0-foundation/) - Current sprint specifications
- [NestJS Reference](./references/nestjs-quick-ref.md) - NestJS patterns and tips

---

## 🤝 Acknowledgments

This project draws inspiration from:
- Modern monorepo practices (Vercel, Turborepo)
- Enterprise architecture patterns
- Scientology management technology
- Open source community best practices

---

**Built with ❤️ to learn, grow, and flourish**
