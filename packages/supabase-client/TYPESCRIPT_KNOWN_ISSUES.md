# TypeScript Known Issues

## Supabase PostgREST-js Type Inference Limitation

### Problem

When using Supabase queries with relations (e.g., `.select('*, category:categories(*)')`), TypeScript's type inference becomes extremely complex and fails with errors like:

```
Argument of type 'string' is not assignable to parameter of type '("user_id" extends keyof ...
```

### Root Cause

The Supabase PostgREST-js library generates deeply nested conditional types for queries with relations. When chaining methods like `.eq()` after `.select()` with relations, TypeScript cannot complete type inference within reasonable time/memory constraints.

### Tracking Issues

- https://github.com/supabase/postgrest-js/issues/568
- https://github.com/supabase/supabase/issues/20562
- https://github.com/orgs/supabase/discussions/28490

### Current Workaround

We use `// @ts-expect-error` comments to suppress these type errors. The queries are still type-safe at runtime because:

1. Return types are explicitly declared (`Promise<TransactionWithRelations[]>`)
2. Input parameters are type-checked
3. Data transformations are applied before return
4. Supabase validates queries at runtime

### When to Remove

Once Supabase team improves type inference for relations (expected in 2025), remove all `// @ts-expect-error` comments and use the `QueryData` helper type instead:

```typescript
const query = supabase.from('transactions').select('*, category:categories(*), card:cards(*)');

type TransactionsResult = QueryData<typeof query>;

const { data, error } = await query.eq('user_id', userId).order('date', { ascending: false });
```

### Affected Files

- `src/features/transactions/server.ts` - All functions with relations
- Future features with similar relation patterns

### Alternative Approaches Tried

1. ✗ `QueryData` helper - Doesn't solve `.eq()` type checking
2. ✗ `noStrictGenericChecks: true` - Doesn't affect Next.js build
3. ✗ Type assertions (`as any`) - Still requires `@ts-expect-error` for intermediate calls
4. ✗ Splitting query definition - TypeScript still checks method chains
5. ✓ `// @ts-expect-error` - Cleanly suppresses the error with documentation

## Impact

- **Compilation**: May show "Unused @ts-expect-error" warnings if Next.js caching causes inconsistent type checking
- **Runtime**: No impact - queries work correctly
- **Development**: Slightly reduced type safety in query building, but return types are still enforced
- **Maintenance**: Easy to remove once Supabase fixes the issue

Last Updated: 2025-11-16
