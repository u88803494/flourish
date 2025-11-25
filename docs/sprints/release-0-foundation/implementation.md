# Sprint 0: Foundation - Implementation

This document describes the technical implementation approach for Sprint 0.

---

## 🏗️ Architecture Overview

### Monorepo Structure

```
flourish/
├── apps/
│   ├── flow/          # Next.js - Financial tracking
│   ├── apex/          # Next.js - Statistics curves
│   ├── api/           # NestJS - Backend API
│   └── docs/          # Next.js - Documentation site (optional)
├── packages/
│   ├── ui/            # Shared React components
│   ├── database/      # Prisma schema & client
│   ├── chart-engine/  # Curve calculation logic
│   ├── eslint-config/ # ESLint configuration
│   └── typescript-config/ # TypeScript configuration
├── docs/              # Project documentation (Markdown)
└── turbo.json         # Turborepo configuration
```

---

## 📦 Sprint 1: Basic Monorepo (COMPLETED)

### Implementation Steps

1. **Create Turborepo**

   ```bash
   pnpm dlx create-turbo@latest flourish
   ```

2. **Rename and Configure**
   - Rename `apps/web` → `apps/flow`
   - Update `package.json` name
   - Create placeholder directories

3. **Documentation Structure**

   ```
   docs/
   ├── README.md
   ├── project-overview.md
   ├── guides/
   ├── references/
   └── sprints/
   ```

4. **Git Commits**
   - Follow Conventional Commits
   - Atomic commits (one logical change per commit)
   - Clear, descriptive messages

### Technical Decisions

**Decision**: Use Turborepo `basic` template

- **Rationale**: Learn from ground up, understand each piece
- **Alternative**: `with-prisma` template (faster but less educational)

**Decision**: pnpm as package manager

- **Rationale**: Fast, efficient, good monorepo support
- **Alternative**: npm, yarn

---

## 🎨 Sprint 2: Prettier Setup

### Configuration

**`.prettierrc`**:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### Scripts

```json
{
  "format": "prettier --write \"**/*.{ts,tsx,md,json}\"",
  "format:check": "prettier --check \"**/*.{ts,tsx,md,json}\""
}
```

---

## 🪝 Sprint 3: Husky + lint-staged

### Setup Process

1. Install packages
2. Initialize Husky: `npx husky install`
3. Configure lint-staged
4. Create pre-commit hook

### Configuration

**`.lintstagedrc`**:

```json
{
  "*.{js,jsx,ts,tsx}": ["prettier --write", "eslint --fix"],
  "*.{json,md,yml,yaml}": ["prettier --write"]
}
```

---

## 📝 Sprint 4: commitlint

### Configuration

**`commitlint.config.js`**:

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore', 'revert', 'wip'],
    ],
  },
};
```

### Git Hook

```bash
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

---

## 🗄️ Sprint 5: Prisma Setup

### Package Structure

```
packages/database/
├── prisma/
│   └── schema.prisma
├── src/
│   └── index.ts
├── package.json
└── tsconfig.json
```

### Basic Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Turbo Configuration

Update `turbo.json` to include Prisma generate in the pipeline:

```json
{
  "pipeline": {
    "db:generate": {
      "cache": false
    },
    "dev": {
      "dependsOn": ["^db:generate"]
    }
  }
}
```

---

## 🔧 Sprint 6: NestJS Application

### Setup

```bash
cd apps
npx @nestjs/cli new api
```

### Module Structure

```
apps/api/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── auth/
│   ├── transactions/
│   └── prisma/
│       ├── prisma.module.ts
│       └── prisma.service.ts
```

### Key Integrations

- Prisma integration via `@repo/database`
- ConfigModule for environment variables
- CORS configuration for frontend

---

## 📈 Sprint 7: Apex Application

### Setup

```bash
cd apps
pnpm create next-app@latest apex
```

### Configuration

- Port 3002 (to avoid conflict with flow)
- Shared packages: `@repo/ui`, `@repo/chart-engine`
- Basic page structure

---

## 🧪 Testing Strategy

### Development Testing

- Manual testing: `pnpm dev` for each app
- Verify hot reload works
- Check error handling

### Integration Testing

- All apps run concurrently
- Database connections work
- API endpoints respond

---

## 🚀 Deployment Considerations

### Development Environment

- Local: All apps on localhost with different ports
- Database: Supabase (cloud) or local PostgreSQL

### Production (Future)

- Flow & Apex: Vercel
- API: Railway
- Database: Supabase (production instance)

---

## 🔐 Security Considerations

### Environment Variables

- Never commit `.env` files
- Use `.env.example` for documentation
- Separate dev and production configs

### Authentication

- Supabase Auth handles user management
- NestJS validates JWT tokens
- No passwords stored in our database

---

## 📊 Performance Considerations

### Turborepo Caching

- Build artifacts cached
- Speeds up subsequent builds
- Remote caching available (Vercel)

### Development

- Turbopack for Next.js (faster than Webpack)
- Hot reload for all apps
- Incremental type checking

---

## 🐛 Common Issues and Solutions

### Issue: NODE_ENV conflicts

**Solution**: Unset NODE_ENV before running `pnpm install`

### Issue: Port already in use

**Solution**: Check which apps are running, configure different ports

### Issue: Turbo command not found

**Solution**: Ensure devDependencies are installed: `pnpm install`

---

## 📚 References

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Prisma with Turborepo](https://www.prisma.io/docs/guides/other/monorepo)

---

**Last Updated**: 2025-11-04
**Status**: Living document, updated as implementation progresses
