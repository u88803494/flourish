# @repo/supabase-client

Supabase client package with feature-based architecture for Flourish monorepo.

## Architecture

This package follows a **feature-based structure** with clear separation between server and client code:

```
src/
├── features/          # Feature modules (auth, transactions, etc.)
│   ├── auth/         # Authentication feature
│   ├── transactions/ # Transactions feature
│   └── ...           # Other features (cards, categories, etc.)
├── lib/              # Core library
│   ├── server/       # Server-side Supabase client
│   └── client/       # Browser Supabase client + React Query provider
└── shared/           # Shared utilities and types
    ├── types/        # Auto-generated database types
    └── utils/        # Query keys factory
```

## Installation

This package is part of the Flourish monorepo and is consumed by Flow and Apex apps.

```bash
# In your app's package.json
{
  "dependencies": {
    "@repo/supabase-client": "workspace:*",
    "@tanstack/react-query": "^5.17.0"
  }
}
```

## Quick Start

### 1. Setup Provider

Wrap your app with `ReactQueryProvider`:

```typescript
// app/layout.tsx
import { ReactQueryProvider } from '@repo/supabase-client/provider'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  )
}
```

### 2. Configure Environment Variables

Create `.env.local` in your app:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Use in Components

#### Server Component Pattern

```typescript
// app/transactions/page.tsx (Server Component)
import { getTransactions } from '@repo/supabase-client/transactions/server'
import { TransactionsList } from './TransactionsList'

export default async function TransactionsPage() {
  const initialTransactions = await getTransactions(userId)

  return <TransactionsList initialTransactions={initialTransactions} />
}
```

#### Client Component Pattern

```typescript
// app/transactions/TransactionsList.tsx (Client Component)
'use client'

import { useTransactionsQuery } from '@repo/supabase-client/transactions'

export function TransactionsList({ initialTransactions }) {
  const { data: transactions, isLoading } = useTransactionsQuery(
    userId,
    initialTransactions // No loading flash!
  )

  return (
    <ul>
      {transactions.map(tx => (
        <li key={tx.id}>{tx.merchant_name} - ${tx.amount}</li>
      ))}
    </ul>
  )
}
```

## Features

### Auth

```typescript
// Server Actions
import { getUser, signIn, signOut, signUp } from '@repo/supabase-client/auth/server';

// React Query Hooks
import {
  useAuthQuery,
  useSignInMutation,
  useSignOutMutation,
  useSignUpMutation,
} from '@repo/supabase-client/auth';

// Types
import type { AuthUser, SignInCredentials } from '@repo/supabase-client/auth';
```

**Example: Sign In Form**

```typescript
'use client'

import { useSignInMutation } from '@repo/supabase-client/auth'

export function SignInForm() {
  const signIn = useSignInMutation()

  async function handleSubmit(e) {
    e.preventDefault()
    const formData = new FormData(e.target)

    await signIn.mutateAsync({
      email: formData.get('email'),
      password: formData.get('password'),
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" />
      <input name="password" type="password" />
      <button disabled={signIn.isPending}>
        {signIn.isPending ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  )
}
```

### Transactions

```typescript
// Server Actions
import {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '@repo/supabase-client/transactions/server';

// React Query Hooks
import {
  useTransactionsQuery,
  useTransactionQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} from '@repo/supabase-client/transactions';

// Types
import type {
  Transaction,
  TransactionInsert,
  TransactionWithRelations,
} from '@repo/supabase-client/transactions';
```

**Example: Create Transaction**

```typescript
'use client'

import { useCreateTransactionMutation } from '@repo/supabase-client/transactions'

export function CreateTransactionForm({ userId }) {
  const createMutation = useCreateTransactionMutation(userId)

  async function handleSubmit(e) {
    e.preventDefault()
    const formData = new FormData(e.target)

    await createMutation.mutateAsync({
      user_id: userId,
      merchant_name: formData.get('merchant'),
      amount: parseFloat(formData.get('amount')),
      date: formData.get('date'),
      type: 'EXPENSE',
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="merchant" placeholder="Merchant" />
      <input name="amount" type="number" step="0.01" />
      <input name="date" type="date" />
      <button disabled={createMutation.isPending}>Create</button>
    </form>
  )
}
```

## Architecture Patterns

### Server Component + initialData Pattern (Recommended)

This pattern provides the best UX with **zero loading flashes**:

1. **Server Component** fetches initial data (SSR)
2. Pass `initialData` to **Client Component**
3. Client Component uses React Query with `initialData`
4. Background refetch keeps data fresh

```typescript
// Server Component
async function Page() {
  const data = await getData() // Server-side fetch
  return <ClientComponent initialData={data} />
}

// Client Component
function ClientComponent({ initialData }) {
  const { data } = useQuery({ initialData }) // Instant render, no loading state
  return <div>{data}</div>
}
```

### Benefits

- ✅ **Zero Loading Flash**: Initial data renders immediately
- ✅ **SEO Friendly**: Server-rendered content
- ✅ **Type Safe**: Full TypeScript support
- ✅ **Optimistic Updates**: Instant UI feedback
- ✅ **Cache Invalidation**: Automatic refetch after mutations

## Type Generation

TypeScript types are auto-generated from your Supabase schema:

```bash
# From project root
npx supabase gen types typescript --linked > packages/supabase-client/src/shared/types/database.ts

# Or use the package script
cd packages/supabase-client
pnpm generate-types
```

## Query Keys

Centralized query keys for easy cache management:

```typescript
import { queryKeys } from '@repo/supabase-client';

// Invalidate all transactions
queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });

// Invalidate specific user's transactions
queryClient.invalidateQueries({ queryKey: queryKeys.transactions.list(userId) });
```

## Testing

Test pages are available in both Flow and Apex apps:

- **Auth Test**: `/test/auth`
- **Transactions Test**: `/test/transactions`

Run `pnpm dev` and visit these pages to verify integration.

## Development

```bash
# Generate TypeScript types from Supabase
pnpm generate-types

# Type check
pnpm type-check
```

## Future Features

The following features are planned but not yet implemented:

- Cards (`features/cards/`)
- Categories (`features/categories/`)
- Statements (`features/statements/`)
- Recurring Expenses (`features/recurring-expenses/`)
- Saving Rules (`features/saving-rules/`)

Each feature will follow the same pattern as Auth and Transactions.
