# Flourish Project Architecture

**Last Updated**: 2025-10-31

## Project Structure

```
flourish/
├── apps/
│   ├── flow/           # Next.js - Financial tracking (Port 3000)
│   ├── api/            # NestJS - Backend API (Port 6888) [In Progress]
│   └── apex/           # Next.js - Statistics curves (Port 3100) [Planned]
├── packages/
│   ├── database/       # Prisma schema & client
│   ├── ui/             # Shared React components
│   ├── chart-engine/   # Curve calculation logic
│   ├── eslint-config/  # ESLint configuration
│   └── typescript-config/ # TypeScript configuration
├── docs/               # Project documentation (Traditional Chinese)
└── turbo.json          # Turborepo configuration
```

## Technology Stack

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Shared @flourish/ui package

### Backend

- **Framework**: NestJS 10
- **Port**: 6888 (發發發)
- **Database Access**: Prisma Client via workspace package

### Database

- **Provider**: Supabase (PostgreSQL)
- **Region**: Tokyo (ap-northeast-1)
- **ORM**: Prisma
- **Connection**: Session Pooler (resolves IPv4/IPv6 issues)

### Monorepo

- **Tool**: Turborepo
- **Package Manager**: pnpm (workspace protocol)
- **Dependency Format**: `workspace:*`

## Database Schema

7 core tables:

1. `users` - User accounts
2. `cards` - Credit card information
3. `statements` - Monthly statements
4. `transactions` - Transaction records
5. `categories` - Expense categories
6. `recurring_expenses` - Recurring expense templates
7. `saving_rules` - Savings rules configuration

## Port Configuration

| Application | Port | Framework | Status         |
| ----------- | ---- | --------- | -------------- |
| Flow        | 3000 | Next.js   | ✅ Running     |
| Apex        | 3100 | Next.js   | ⏳ Planned     |
| API         | 6888 | NestJS    | 🔄 In Progress |
| PostgreSQL  | 5432 | Supabase  | ✅ Running     |

**Rationale**:

- Frontend apps: 3xxx range (Next.js auto-switches if port busy)
- Backend API: 6888 (memorable, auspicious, avoids conflicts)
- NestJS doesn't auto-switch ports, so dedicated range needed

## Development Workflow

### Git Flow

1. Create Issue
2. Create feature branch (`feat/sprint-X-name`)
3. Develop with multiple commits
4. Push and create Draft PR
5. Review and approve
6. Merge to main

### Commit Convention

- Conventional Commits (commitlint enforced)
- Format: `type(scope): description`
- Types: feat, fix, docs, chore, style, refactor, test

### Documentation

- All docs in Traditional Chinese
- Technical terms kept in English
- Comprehensive setup and troubleshooting guides

## Key Design Decisions

### Statement-Centric Architecture

- Primary workflow: monthly PDF statement processing
- Not daily transaction entry
- Bulk import after AI recognition

### Pre-Deduction System

- Budget visibility after subscriptions
- Annual fee amortization (÷12)
- Fixed salary tracking

### Multi-Card Support

- 20+ cards total
- 2-5 active cards per month
- Card-specific statement processing

## Environment Configuration

### Development

```env
DATABASE_URL=postgresql://postgres.PROJECT_ID:PASSWORD@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_ID.supabase.co
PORT=6888  # API
```

### Important Notes

- Always use Session Pooler (not Direct Connection)
- `.env` files not committed (in .gitignore)
- `.env.example` templates provided
