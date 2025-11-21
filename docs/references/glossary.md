# Glossary

**Purpose**: Project terminology reference for consistent communication

**Last Updated**: 2025-11-21
**Status**: Active

---

## 📖 How to Use This Glossary

**For Developers**:

- Use these terms consistently in code, docs, and communication
- Add new terms as the project evolves
- Update definitions when architecture changes

**For AI Agents**:

- Reference this glossary when encountering unfamiliar terms
- Use canonical terms in generated code and documentation
- Maintain consistency across all outputs

---

## 🌱 Project & Brand

### Flourish

**Definition**: Integrated personal growth platform combining financial tracking and performance statistics.

**Philosophy**: "When money flows and statistics rise, everything will flourish."

**Components**:

- Flow (financial tracking)
- Apex (performance statistics)

**Status**: Active development, Phase 0 complete

---

## 🏗️ Architecture Terms

### Supabase-first Architecture

**Definition**: Architecture pattern using Supabase as primary backend, eliminating custom API servers.

**Replaced**: NestJS + Render architecture (deprecated in Sprint 0.8)

**Benefits**: $0 cost, 70% less maintenance, 60% faster development

### Monorepo

**Definition**: Single repository containing multiple apps and packages using Turborepo + pnpm workspaces.

### RLS (Row Level Security)

**Definition**: PostgreSQL feature enforcing data access control at database level.

### ADR (Architecture Decision Record)

**Definition**: Document recording significant architectural decisions.

**Location**: docs/decisions/

---

## 📱 Applications

### Flow

**Full Name**: Flow - Financial Tracking Application

**Port**: 3100 (development)

**URL**: https://flourish-flow.vercel.app

### Apex

**Full Name**: Apex - Performance Statistics Application

**Port**: 3200 (development)

**URL**: https://flourish-apex.vercel.app

---

## 📦 Packages

### @repo/supabase-client

**Purpose**: Centralized Supabase client configuration and React hooks

### @repo/database

**Purpose**: Database schema reference using Prisma (reference only)

### @repo/ui

**Purpose**: Shared React components with Tailwind CSS

---

## 🗄️ Database Terms

### Migration

**Definition**: SQL file defining database schema changes

**Location**: supabase/migrations/

### Schema

**Definition**: Database structure definition (tables, columns, relationships)

### Transaction

**Definition**: Single financial transaction record (income or expense)

---

## 🔐 Security Terms

### JWT (JSON Web Token)

**Definition**: Token-based authentication standard used by Supabase Auth

### Anon Key

**Purpose**: Public API key safe for frontend use

### Service Role Key

**Purpose**: Admin API key bypassing RLS policies (⚠️ NEVER expose to frontend!)

---

## 🚀 Deployment Terms

### Vercel

**Definition**: Frontend hosting platform with global CDN

### Supabase Cloud

**Definition**: Managed PostgreSQL hosting with BaaS features

**Project Ref**: fstcioczrehqtcbdzuij

---

## 🏃 Development Terms

### Sprint

**Definition**: Time-boxed development iteration with specific goals

**Numbering**: Will be renumbered from 0.1-0.11 to 01-11 in Sprint 11

### Phase

**Definition**: Major development milestone consisting of multiple sprints

### MCP (Model Context Protocol)

**Definition**: Standard for AI agents to access external tools and services

### Conventional Commits

**Format**: \`<type>(<scope>): <subject>\`

---

## 🎨 UI/UX Terms

### Design Tokens

**Definition**: Centralized design values (colors, spacing, typography)

### Component

**Definition**: Reusable React UI building block

### Server Component

**Definition**: React component that runs on the server (Next.js 15 feature)

### Client Component

**Definition**: React component that runs in browser

---

## 📊 Data Terms

### KPI (Key Performance Indicator)

**Definition**: Measurable value tracking financial performance

### Category

**Definition**: Classification for transactions (income or expense)

### Recurring Expense

**Definition**: Automated expense that repeats on schedule

### Saving Rule

**Definition**: Automated rule for saving money based on conditions

---

## 🛠️ Tool Terms

### Turborepo

**Definition**: Monorepo build system for JavaScript/TypeScript

### pnpm

**Definition**: Fast, disk-efficient package manager

### Prettier

**Definition**: Code formatter for consistent style

### Husky

**Definition**: Git hooks manager

---

## 📝 Documentation Terms

### Diataxis Framework

**Definition**: Documentation structure framework with 4 categories (Tutorials, How-to, Reference, Explanation)

**Reference**: https://diataxis.fr/

### CLAUDE.md

**Purpose**: Primary AI agent instruction file

### AGENTS.md

**Purpose**: AI agent collaboration and workflow guide

### ARCHITECTURE.md

**Purpose**: System architecture documentation

---

## 🔗 Acronyms & Abbreviations

| Abbr | Full Term                         |
| ---- | --------------------------------- |
| ADR  | Architecture Decision Record      |
| API  | Application Programming Interface |
| CRUD | Create, Read, Update, Delete      |
| JWT  | JSON Web Token                    |
| KPI  | Key Performance Indicator         |
| MCP  | Model Context Protocol            |
| RLS  | Row Level Security                |
| UUID | Universally Unique Identifier     |

---

**Maintained By**: Flourish Team
**Last Review**: Sprint 10 (2025-11-21)
