# Development Setup Guide

This guide will help you set up the Flourish development environment.

---

## 📋 Prerequisites

### Required Software

- **Node.js**: v20.x or higher ([Download](https://nodejs.org/))
- **pnpm**: v9.x or higher
- **Git**: Latest version

### Install pnpm

```bash
npm install -g pnpm
```

### Verify Installation

```bash
node --version  # Should be v20.x or higher
pnpm --version  # Should be v9.x or higher
git --version
```

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
cd /path/to/your/workspace
git clone [repository-url] flourish
cd flourish
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install dependencies for all apps and packages in the monorepo.

### 3. Set Up Environment Variables

```bash
# Copy example env files (when they exist)
cp .env.example .env

# For each app:
cp apps/flow/.env.example apps/flow/.env
cp apps/api/.env.example apps/api/.env
```

Configure the environment variables with your values.

### 3.5. Set Up Database

> 📚 **詳細步驟**：見 [Database Setup Guide](./database-setup.md)

```bash
# 1. Ensure DATABASE_URL is in .env
# Should use Session Pooler: postgresql://postgres.PROJECT_ID:PASSWORD@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres

# 2. Run Prisma migrations
npx prisma migrate dev --name init --schema=packages/database/prisma/schema.prisma

# 3. Verify database setup
npx prisma generate --schema=packages/database/prisma/schema.prisma
```

Your database is now ready!

### 4. Start Development Servers

```bash
# Start all applications
pnpm dev

# Or start a specific app
pnpm dev --filter=flow
pnpm dev --filter=api
pnpm dev --filter=apex
```

### 5. Access Applications

- **Flow** (財務追蹤): http://localhost:3000
- **API** (後端): http://localhost:3001
- **Apex** (統計曲線): http://localhost:3002

---

## 🗂️ Project Structure

```
flourish/
├── apps/
│   ├── flow/          # Next.js - Financial tracking
│   ├── apex/          # Next.js - Statistics curves
│   └── api/           # NestJS - Backend API
├── packages/
│   ├── ui/            # Shared React components
│   ├── database/      # Prisma schema & client
│   ├── chart-engine/  # Curve calculation logic
│   ├── eslint-config/ # ESLint configuration
│   └── typescript-config/ # TypeScript configuration
├── docs/              # Project documentation
└── turbo.json         # Turborepo configuration
```

---

## 🛠️ Development Workflow

### Working on a Feature

1. **Create a feature branch**

   ```bash
   git checkout -b feature/sprint-X-feature-name
   ```

2. **Make your changes**
   - Edit files
   - Test locally
   - Follow coding standards

3. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

   See [Git Workflow](./git-workflow.md) for commit conventions.

4. **Push your branch**
   ```bash
   git push origin feature/sprint-X-feature-name
   ```

---

## 📦 Common Commands

### Build Commands

```bash
# Build all apps and packages
pnpm build

# Build a specific app
pnpm build --filter=flow
```

### Lint and Format

```bash
# Lint all code
pnpm lint

# Format code with Prettier
pnpm format

# Check formatting
pnpm format:check
```

### Type Checking

```bash
# Type check all packages
pnpm check-types
```

### Database Commands

```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# Create migration
pnpm db:migrate

# Open Prisma Studio
pnpm db:studio
```

---

## 🔧 IDE Setup

### Recommended: Visual Studio Code

#### Extensions

Install these extensions for the best development experience:

- **ESLint** - `dbaeumer.vscode-eslint`
- **Prettier** - `esbenp.prettier-vscode`
- **Prisma** - `Prisma.prisma`
- **Tailwind CSS IntelliSense** - `bradlc.vscode-tailwindcss`

#### Settings

Create `.vscode/settings.json` (if not exists):

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

---

## 🐛 Troubleshooting

### Port Already in Use

If you get a port conflict:

```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 [PID]
```

Or change the port in the app's `package.json`:

```json
{
  "scripts": {
    "dev": "next dev -p 3003"
  }
}
```

### Turbo Command Not Found

```bash
# Reinstall dependencies
pnpm install
```

### NODE_ENV Issues

```bash
# Unset NODE_ENV
unset NODE_ENV

# Then reinstall
pnpm install
```

### Prisma Client Not Generated

```bash
# Navigate to database package
cd packages/database

# Generate client
pnpm db:generate
```

### Type Errors

```bash
# Rebuild all packages
pnpm build

# Or clean and rebuild
pnpm clean
pnpm install
pnpm build
```

---

## 🔐 Environment Variables

### Supabase

```env
DATABASE_URL="postgresql://..."
SUPABASE_URL="https://..."
SUPABASE_ANON_KEY="..."
SUPABASE_JWT_SECRET="..."
```

### Application

```env
NODE_ENV="development"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
pnpm test

# Run tests for a specific app
pnpm test --filter=api

# Run tests in watch mode
pnpm test:watch
```

---

## 📚 Additional Resources

- [Project Overview](../project-overview.md)
- [Git Workflow](./git-workflow.md)
- [Sprint 0 Tasks](../sprints/sprint-0-foundation/tasks.md)
- [Turborepo Docs](https://turbo.build/repo/docs)

---

## 🆘 Getting Help

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the [Implementation docs](../sprints/sprint-0-foundation/implementation.md)
3. Check Git commit history for recent changes
4. Search existing issues in the repository

---

**Happy coding! 🚀**
