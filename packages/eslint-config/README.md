# @repo/eslint-config

Shared ESLint configuration for the Flourish monorepo, **specifically optimized for AI-assisted development**.

## 🎯 Design Philosophy

This configuration is designed to **constrain AI-generated code** and prevent common mistakes that AI models (Claude, Cursor, GitHub Copilot) frequently make:

| AI Mistake           | Our Defense                                |
| -------------------- | ------------------------------------------ |
| Overuses `any` types | `@typescript-eslint/no-explicit-any` warns |
| Forgets `await`      | `no-floating-promises` errors              |
| Violates Hooks rules | `react-hooks/rules-of-hooks` errors        |
| Misses dependencies  | `react-hooks/exhaustive-deps` warns        |
| Over-imports         | `unused-imports` auto-removes              |
| Messy import order   | `simple-import-sort` auto-fixes            |
| Complex nested logic | `sonarjs/cognitive-complexity` warns       |

## 📦 Available Configurations

### `@repo/eslint-config/base`

Base TypeScript configuration with AI-constraint rules.

- TypeScript strict mode (type-checked)
- Automatic unused import removal
- Import sorting
- Code quality checks (SonarJS)
- Turbo monorepo support

### `@repo/eslint-config/next-js`

For Next.js applications.

- Extends base config
- React + React Hooks strict rules
- Next.js recommended rules
- Browser globals

### `@repo/eslint-config/react-internal`

For React component libraries.

- Extends base config
- React + React Hooks strict rules
- No Next.js-specific rules
- Browser globals

### `@repo/eslint-config/nestjs`

For NestJS backend applications.

- Extends base config
- Node.js globals
- Backend-specific rules

## 🚀 Usage

### For Next.js Apps

```javascript
// apps/your-app/eslint.config.js
import { nextJsConfig } from '@repo/eslint-config/next-js';

export default [
  ...nextJsConfig,
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: './tsconfig.json',
      },
    },
  },
];
```

### For React Libraries

```javascript
// packages/ui/eslint.config.mjs
import { config } from '@repo/eslint-config/react-internal';

export default config;
```

### For NestJS Backend

```javascript
// apps/api/eslint.config.js
import { nestJsConfig } from '@repo/eslint-config/nestjs';

export default [
  ...nestJsConfig,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: './tsconfig.json',
      },
    },
  },
];
```

## 🛡️ AI Constraint Rules Explained

### TypeScript Strict Rules

#### `@typescript-eslint/no-explicit-any: warn`

**Why**: AI loves using `any` as a shortcut. This warns when `any` is used, forcing proper typing.

**Example**:

```typescript
// ❌ Bad (AI often does this)
const getData = (param: any) => param;

// ✅ Good
const getData = <T>(param: T): T => param;
```

#### `@typescript-eslint/no-floating-promises: error`

**Why**: AI frequently forgets to `await` async functions.

**Example**:

```typescript
// ❌ Bad (AI often does this)
async function processData() {
  fetchData(); // Missing await!
}

// ✅ Good
async function processData() {
  await fetchData();
}
```

### React Hooks Rules (CRITICAL)

#### `react-hooks/rules-of-hooks: error`

**Why**: AI frequently violates Hooks rules by using them in conditions or loops.

**Example**:

```tsx
// ❌ Bad (AI often does this)
const Component = () => {
  if (condition) {
    const [state] = useState(0); // Hook in condition!
  }
};

// ✅ Good
const Component = () => {
  const [state] = useState(0);
  if (condition) {
    // Use state here
  }
};
```

#### `react-hooks/exhaustive-deps: warn`

**Why**: AI often misses dependencies in `useEffect`/`useCallback`/`useMemo`.

**Example**:

```tsx
// ⚠️ AI often does this
useEffect(() => {
  console.log(value); // Missing 'value' in deps!
}, []);

// ✅ Good
useEffect(() => {
  console.log(value);
}, [value]);
```

### Import Management

#### `unused-imports/no-unused-imports: error`

**Why**: AI generates imports then doesn't use them. Auto-removed with `--fix`.

#### `simple-import-sort/imports: error`

**Why**: AI's import order is inconsistent. Auto-sorted with `--fix`.

### Code Quality

#### `sonarjs/cognitive-complexity: warn (15)`

**Why**: Prevents AI from generating overly complex nested logic.

## 🔧 Strictness Philosophy

We use **errors** (not warnings) for rules that:

- Cause runtime failures (Hooks violations, floating promises)
- Create security vulnerabilities
- Lead to bugs (missing dependencies)

We use **warnings** for:

- Style improvements (`no-explicit-any`)
- Code quality suggestions (complexity)

**Note**: We removed `eslint-plugin-only-warn` to enforce true strictness. AI needs errors, not warnings it can ignore.

## 📊 Plugin Details

### Core Plugins

- `@eslint/js` - JavaScript recommended rules
- `typescript-eslint` - TypeScript support (type-checked mode)
- `eslint-config-prettier` - Disables conflicting formatting rules

### AI Constraint Plugins

- `eslint-plugin-unused-imports` - Auto-removes unused imports
- `eslint-plugin-simple-import-sort` - Auto-sorts imports
- `eslint-plugin-sonarjs` - Code quality and bug detection
- `eslint-plugin-perfectionist` - Object/array sorting

### Framework Plugins

- `eslint-plugin-react` - React best practices
- `eslint-plugin-react-hooks` - Hooks rules enforcement
- `@next/eslint-plugin-next` - Next.js-specific rules
- `eslint-plugin-turbo` - Turborepo/monorepo rules

## 🧪 Testing Your Config

Create a test file to verify all rules work:

```typescript
// test-ai-constraints.tsx
import React, { useState, useEffect } from 'react';

// ❌ Should warn: explicit any
const badFunction = (param: any) => param;

// ❌ Should error: Hook in condition
const BadComponent = () => {
  if (true) {
    const [state] = useState(0);
  }
  return null;
};

// ⚠️ Should warn: missing dependency
const MissingDeps = ({ value }) => {
  useEffect(() => {
    console.log(value);
  }, []); // Missing 'value' in deps
  return null;
};

// ❌ Should error: floating promise
const asyncBad = async () => {
  fetchData(); // No await
};
```

Run: `pnpm lint` and verify all errors are caught!

## 🔄 Automatic Fixes

Many rules auto-fix with:

```bash
pnpm lint --fix
```

Auto-fixed rules:

- ✅ Unused imports removed
- ✅ Imports sorted
- ✅ Formatting (via Prettier)
- ✅ Self-closing components
- ✅ Const vs let

## 📝 Configuration Tips

### Disable Rules Per-File

If a specific file needs to disable a rule:

```typescript
/* eslint-disable sonarjs/no-duplicate-string */
// File with many duplicate strings (e.g., test fixtures)
```

### Adjust Complexity Threshold

If 15 is too strict for your team:

```javascript
{
  rules: {
    "sonarjs/cognitive-complexity": ["warn", 20],
  }
}
```

## 🆚 Comparison with my-website

This config improves upon `my-website`'s configuration:

| Feature           | my-website            | Flourish    |
| ----------------- | --------------------- | ----------- |
| React Hooks rules | ❌ Missing            | ✅ Enforced |
| Type-checked mode | ❌ No                 | ✅ Yes      |
| Floating promises | ❌ No                 | ✅ Caught   |
| only-warn plugin  | ✅ Yes (anti-pattern) | ❌ Removed  |
| Strictness        | Warnings              | Errors      |

## 📚 Resources

- [TypeScript ESLint](https://typescript-eslint.io/)
- [React Hooks Rules](https://react.dev/reference/rules/rules-of-hooks)
- [SonarJS Rules](https://github.com/SonarSource/eslint-plugin-sonarjs)
- [Turborepo ESLint Guide](https://turbo.build/repo/docs/guides/tools/eslint)

---

**Built with ❤️ to constrain AI and maintain code quality.**
