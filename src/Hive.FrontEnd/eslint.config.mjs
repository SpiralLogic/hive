import unicorn from 'eslint-plugin-unicorn';
import testingLibrary from 'eslint-plugin-testing-library';
import parser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import jest from 'eslint-plugin-jest';
import globals from 'globals';
import typescript from '@typescript-eslint/eslint-plugin';

export default [
  'eslint:recommended',
  {
    files: ['src/**/*.{ts,js,tsx,jsx}'],
    plugins: {
      unicorn,
      typescript,
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
        ...globals.browser,
      },
    },
    rules: {
      'no-unused-vars': 'off',
    },
  },
  {
    files: ['test/**/*.*'],
    plugins: { typescript, jest, testingLibrary, prettier },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      parser,
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.jest,
        vi: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'off',
    },
  },
];
