import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';
import pluginNext from '@next/eslint-plugin-next';
import { config as baseConfig } from './base.js';

/**
 * A custom ESLint configuration for Next.js applications.
 *
 * Extends the base configuration with React, Next.js, and browser-specific rules.
 * Includes strict React Hooks enforcement to catch common AI mistakes.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const nextJsConfig = [
  ...baseConfig,
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommendedTypeChecked,
  {
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
  {
    plugins: {
      '@next/next': pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs['core-web-vitals'].rules,
    },
  },
  {
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,

      // ===== CRITICAL: AI Constraint - React Hooks Rules =====
      // AI frequently violates these rules by using hooks in conditions/loops
      'react-hooks/rules-of-hooks': 'error',
      // AI often misses dependencies in useEffect/useCallback/useMemo
      'react-hooks/exhaustive-deps': 'warn',

      // ===== React Best Practices =====
      // React scope no longer necessary with new JSX transform
      'react/react-in-jsx-scope': 'off',

      // TypeScript handles type checking, prop-types are redundant
      'react/prop-types': 'off',

      // Security: prevents tabnabbing vulnerability
      'react/jsx-no-target-blank': 'error',

      // AI often uses array index as key, which causes issues
      'react/no-array-index-key': 'warn',

      // Style: self-closing components
      'react/self-closing-comp': 'warn',
    },
  },
];
