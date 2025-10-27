import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import { config as baseConfig } from './base.js';

/**
 * A custom ESLint configuration for NestJS backend applications.
 *
 * Extends the base configuration with Node.js environment and backend-specific rules.
 * Shares all the AI-constraint rules from base config.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const nestJsConfig = [
  ...baseConfig,
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
  },
  {
    // NestJS-specific rules
    rules: {
      // Backend can use console for logging (though structured logging is better)
      'no-console': 'off',
    },
  },
  {
    ignores: ['dist/**'],
  },
];
