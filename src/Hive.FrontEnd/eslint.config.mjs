import unicorn from 'eslint-plugin-unicorn';
import testingLibrary from 'eslint-plugin-testing-library';
import parser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import vitest from 'eslint-plugin-vitest';
import globals from 'globals';
import ts from '@typescript-eslint/eslint-plugin';

export default [
  {
    files: ['src/**/*.{ts,js,tsx,jsx}', 'test/**/*.{ts,js,tsx,jsx}'],
    plugins: {
      unicorn,
      '@typescript-eslint': ts,
      typescript: ts,
      prettier,
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      parser,
      parserOptions: { project: 'tsconfig.json' },
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      'no-unused-vars': 'off',
      ...ts.configs['eslint-recommended'].rules,
      ...ts.configs['recommended'].rules,
    },
  },
  {
    files: ['test/**/*.{ts,js,tsx,jsx}'],
    plugins: { vitest,  testingLibrary },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      parser,
      parserOptions: { project: 'tsconfig.json' },
      globals: {
        ...globals.jest,
        vi: 'readonly',
        vitest: 'readonly',
      },
    },
  },
];
