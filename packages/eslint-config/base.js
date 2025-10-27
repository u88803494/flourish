import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import turboPlugin from 'eslint-plugin-turbo';
import tseslint from 'typescript-eslint';
import pluginUnusedImports from 'eslint-plugin-unused-imports';
import pluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import pluginSonarjs from 'eslint-plugin-sonarjs';
import pluginPerfectionist from 'eslint-plugin-perfectionist';

/**
 * A shared base ESLint configuration optimized for AI-assisted development.
 *
 * This configuration is specifically designed to constrain AI-generated code
 * and prevent common mistakes that AI models frequently make:
 * - Overuse of 'any' types
 * - Missing await/floating promises
 * - Unused imports and variables
 * - Inconsistent import ordering
 * - High cognitive complexity
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommendedTypeChecked,
  pluginSonarjs.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
      'unused-imports': pluginUnusedImports,
      'simple-import-sort': pluginSimpleImportSort,
      perfectionist: pluginPerfectionist,
    },
    rules: {
      // ===== AI Constraint: TypeScript Strict Rules =====
      // Prevents AI from lazily using 'any' types
      '@typescript-eslint/no-explicit-any': 'warn',

      // Forces proper await usage - AI often forgets
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': 'error',

      // Prevents AI from using ! assertions carelessly
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // Enforces proper unused variable handling
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // Optimizes imports with type imports
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],

      // ===== AI Constraint: Unused Imports Auto-removal =====
      // AI often generates excessive imports
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // ===== AI Constraint: Import Sorting =====
      // Automatically fixes AI's inconsistent import ordering
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      // ===== AI Constraint: Code Quality =====
      // Prevents AI from generating overly complex code
      'sonarjs/cognitive-complexity': ['warn', 15],
      'sonarjs/no-duplicate-string': 'off', // Can be disabled per-file if needed

      // ===== General Best Practices =====
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',

      // ===== Turbo Monorepo =====
      'turbo/no-undeclared-env-vars': 'warn',
    },
  },
  {
    // Disable type-aware linting for config files
    files: ['**/*.config.{js,mjs,cjs,ts,mts}'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    ignores: [
      'dist/**',
      '.next/**',
      'node_modules/**',
      '.turbo/**',
      '**/*.config.{js,mjs,cjs,ts,mts}',
      '**/eslint.config.{js,mjs,cjs,ts,mts}',
    ],
  },
];
