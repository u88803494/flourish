export default [
  {
    files: ['src/**/*.ts', 'test/**/*.ts'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: null, // Will be set by the @typescript-eslint parser
    },
    rules: {
      // Possible Problems
      'no-console': ['warn', { allow: ['error', 'warn', 'log'] }],
      'no-debugger': 'error',
      'no-constant-condition': 'error',
      'no-unreachable': 'error',

      // Best Practices
      eqeqeq: ['error', 'always'],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-invalid-this': 'error',
      'no-loop-func': 'error',
      'no-new': 'error',
      'no-throw-literal': 'error',
      radix: ['error', 'always'],
      'require-await': 'error',

      // Variables
      'no-shadow': 'off', // Disabled in favor of @typescript-eslint/no-shadow
      'no-unused-vars': 'off', // Disabled in favor of @typescript-eslint/no-unused-vars

      // Stylistic
      'array-bracket-spacing': ['error', 'never'],
      'comma-dangle': ['error', 'always-multiline'],
      'comma-spacing': 'error',
      indent: ['error', 2],
      'key-spacing': 'error',
      'keyword-spacing': 'error',
      'no-trailing-spaces': 'error',
      'no-multiple-empty-lines': ['error', { max: 2 }],
      'object-curly-spacing': ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
      'space-before-blocks': 'error',
      'space-before-function-paren': [
        'error',
        {
          anonymous: 'always',
          named: 'never',
          asyncArrow: 'always',
        },
      ],
      'space-infix-ops': 'error',
    },
  },
];
