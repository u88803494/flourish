# NestJS API Archive

**Archive Date**: 2025-11-21
**Reason**: Migrated to Supabase architecture (ADR 001)
**Status**: No longer actively maintained
**Last Commit**: 3c1091c feat(api): add staging environment to NODE_ENV validation

---

## What Was This?

The NestJS API (`apps/api/`) was a backend service that:

- Provided REST endpoints for Flow and Apex apps
- Managed database operations via Prisma
- Handled health checks and monitoring
- Implemented TypeScript strict mode
- Ran on port 6888 (development)

### Technology Stack

- **Framework**: NestJS 11
- **Language**: TypeScript 5.7.3
- **ORM**: Prisma (via `@flourish/database`)
- **Testing**: Jest + Supertest
- **Port**: 6888

### Main Features

1. **Health Check Endpoints** (`/health`, `/health/db`)
2. **Compression** (gzip response compression)
3. **Validation** (Zod integration)
4. **Environment Config** (development, staging, production)

---

## Why Was It Removed?

As documented in **ADR 001 - Architecture Simplification**, we migrated to pure Supabase architecture because:

### Cost Reduction

- Supabase: **$0/month** (Free tier)
- NestJS + Render: **$7+/month**
- **Savings: 100%**

### Maintenance Reduction

- No separate backend infrastructure to manage
- No deployment pipeline for backend
- **~70% less maintenance work**

### Development Speed

- Auto-generated REST API from database schema
- No manual endpoint creation needed
- **~60% faster development**

### Perfect Feature Fit

- Flourish's core needs (CRUD + statistics) are standard operations
- Supabase excels at these with Row Level Security
- Future complex logic can use Edge Functions

---

## Directory Structure (At Archive Time)

```
apps/api/
├── src/
│   ├── main.ts              # Application entry point
│   ├── app.module.ts        # Root module
│   ├── app.controller.ts    # Health check endpoints
│   ├── app.service.ts       # Health check logic
│   └── config/
│       └── environment.ts   # Environment validation
├── test/
│   ├── app.e2e-spec.ts      # E2E tests
│   └── jest-e2e.json        # E2E test config
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── nest-cli.json            # NestJS CLI config
└── README.md                # NestJS starter docs
```

---

## What Replaced It?

### Supabase Services

| NestJS Component | Supabase Equivalent             |
| ---------------- | ------------------------------- |
| REST endpoints   | Auto-generated REST API         |
| Prisma ORM       | Direct PostgreSQL               |
| Auth middleware  | Supabase Auth + JWT             |
| Validation       | Row Level Security (RLS)        |
| Health checks    | Supabase Dashboard              |
| Database access  | `@repo/supabase-client` package |

### Migration Details

See: [Sprint 9 - Supabase Migration Plan](../../sprints/sprint-0-foundation/09-supabase-migration-plan.md)

---

## If You Need This Later

### Restore from Git

All code is available in Git history:

```bash
# View the last state
git log --oneline -- apps/api/

# Checkout at specific commit
git checkout 3c1091c -- apps/api/

# Or create a branch from before deletion
git checkout -b restore-nestjs <commit-before-deletion>
```

### Use as Template

The archived code can serve as a template for:

- Microservices architecture
- Complex backend logic requiring custom API
- Integration with third-party services not supported by Supabase
- Future hybrid architecture (Supabase + selective NestJS endpoints)

### Deployment Documentation

If you restore this API, refer to:

- [Render Deployment Archive](../render-deployment/)
- Deployment guides for Render Staging and Production
- Keep-Alive monitoring setup

---

## Related Documentation

### Architecture Decisions

- [ADR 001 - Architecture Simplification](../../decisions/001-architecture-simplification.md)
- [Sprint 8 Deployment Evaluation](../../sprints/sprint-0-foundation/08-deployment-evaluation.md)

### Migration Documentation

- [Sprint 9 Overview](../../sprints/sprint-0-foundation/overview.md)
- [Supabase Migration Plan](../../sprints/sprint-0-foundation/09-supabase-migration-plan.md)

### Deployment Archive

- [Render Deployment Archive](../render-deployment/)

---

## Lessons Learned

### What Worked Well

- ✅ TypeScript strict mode from the start
- ✅ Health check endpoints for monitoring
- ✅ Clean module organization
- ✅ Comprehensive testing setup

### What Could Be Better

- Over-engineering for current needs
- Deployment complexity (Render monitoring, keep-alive)
- Maintenance overhead for small team

### Key Takeaway

**"Use the simplest architecture that meets your requirements"**

For Flourish's current scope (CRUD + statistics), Supabase's built-in features are perfect. If requirements change, we can always add complexity incrementally.

---

**Archived By**: Claude Code (Sprint 9, Task 4)
**Archive Date**: 2025-11-21
**Status**: Complete
