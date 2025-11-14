# @repo/supabase-client

Supabase client package with feature-based architecture for Flourish monorepo.

## Architecture

This package follows a **feature-based structure** with clear separation between server and client code:

```
src/
├── features/          # Feature modules (auth, transactions, etc.)
├── lib/               # Core library (server/client instances)
└── shared/            # Shared utilities and types
```

## Installation

This package is part of the Flourish monorepo and is consumed by Flow and Apex apps.

```bash
# In your app's package.json
{
  "dependencies": {
    "@repo/supabase-client": "workspace:*"
  }
}
```

## Usage

Documentation will be added as features are implemented.

## Features

- ✅ Feature-based organization
- ✅ Server Actions for data mutations
- ✅ React Query for client-side caching
- ✅ TypeScript types auto-generated from Supabase schema
- ✅ Server Component + initialData pattern support

## Development

```bash
# Generate TypeScript types from Supabase
pnpm generate-types

# Type check
pnpm type-check
```
