import { config } from '@repo/eslint-config/react-internal';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...config,
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
