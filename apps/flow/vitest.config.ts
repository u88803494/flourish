/**
 * Vitest Configuration for Flow App
 * Testing Framework: Vitest + Testing Library
 *
 * Features:
 * - React component testing
 * - Code coverage reporting
 * - Mock setup for Next.js and Supabase
 */

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    // Test environment
    environment: 'jsdom',

    // Global setup
    globals: true,
    setupFiles: ['./tests/setup.ts'],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],

      // Include patterns
      include: ['app/**/*.tsx', 'app/**/*.ts', 'components/**/*.tsx', 'lib/**/*.ts'],

      // Exclude patterns
      exclude: [
        'app/layout.tsx',
        'app/**/page.tsx', // Test content components instead
        'app/api/**', // API routes tested separately
        '**/*.test.tsx',
        '**/*.test.ts',
        '**/*.config.ts',
        '**/types.ts',
        'tests/**',
      ],

      // Report configuration
      reportsDirectory: './coverage',

      // Coverage thresholds (Sprint 12 targets)
      thresholds: {
        autoUpdate: false,
        lines: 60,
        functions: 60,
        branches: 60,
        statements: 60,
      },
    },

    // Test match patterns
    include: ['tests/unit/**/*.test.{ts,tsx}', 'tests/integration/**/*.test.{ts,tsx}'],

    // Timeout configuration
    testTimeout: 10000,
    hookTimeout: 10000,

    // Reporter configuration
    reporters: ['verbose', 'html'],
    outputFile: {
      html: './test-results/index.html',
    },

    // Mock configuration
    clearMocks: true,
    restoreMocks: true,

    // Parallel execution
    maxConcurrency: 5,

    // Watch mode
    watch: false,
  },

  // Path resolution
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@/app': path.resolve(__dirname, './app'),
      '@/components': path.resolve(__dirname, './components'),
      '@/lib': path.resolve(__dirname, './lib'),
    },
  },
});
