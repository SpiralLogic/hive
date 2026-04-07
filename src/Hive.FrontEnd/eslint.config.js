import unicorn from 'eslint-plugin-unicorn';
import testingLibrary from 'eslint-plugin-testing-library';
import vitest from '@vitest/eslint-plugin';
import globals from 'globals';
import css from '@eslint/css';
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tsEslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import prettier from 'eslint-plugin-prettier';

const tsTsxGlob = ['src/**/*.ts', 'src/**/*.tsx', 'test/**/*.ts', 'test/**/*.tsx'];
const prettierFiles = [...tsTsxGlob, 'src/**/*.css', 'eslint.config.js'];

export default defineConfig(
  { files: tsTsxGlob, ...eslint.configs.recommended },
  ...tsEslint.configs.recommended.map((config) => ({
    ...config,
    files: tsTsxGlob,
  })),
  { files: tsTsxGlob, ...unicorn.configs.all },
  {
    files: tsTsxGlob,
    plugins: {
      '@typescript-eslint': tsEslint.plugin,
      unicorn: unicorn.configs.all.plugins.unicorn,
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      parser: tsEslint.parser,
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.es2024,
      },
    },
    rules: {
      'no-unused-vars': 'off',
      'unicorn/filename-case': [
        'error',
        {
          cases: { kebabCase: true, camelCase: true, pascalCase: true },
        },
      ],
      'unicorn/prevent-abbreviations': [
        'error',
        {
          allowList: {
            ref: true,
            props: true,
            Props: true,
          },
        },
      ],
      'unicorn/no-useless-undefined': ['error', { checkArguments: false }],
    },
  },
  {
    files: ['src/**/*.css'],
    plugins: { css },
    language: 'css/css',
    rules: {
      ...css.configs.recommended.rules,
      // Project uses nesting, custom properties in calc(), and newer UI features; baseline rule is too strict vs Stylelint standard we replaced.
      'css/use-baseline': 'off',
      'css/no-invalid-properties': 'off',
      'css/no-important': 'off',
    },
  },
  {
    ...testingLibrary.configs['flat/dom'],
    files: ['test/**/*.ts', 'test/**/*.tsx'],
    plugins: {
      ...testingLibrary.configs['flat/dom'].plugins,
      vitest,
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      parser: tsEslint.parser,
      globals: {
        ...vitest.configs.env.languageOptions.globals,
      },
    },
    rules: {
      ...testingLibrary.configs['flat/dom'].rules,
      ...vitest.configs.recommended.rules,
    },
  },
  {
    files: prettierFiles,
    plugins: { prettier },
    rules: {
      'prettier/prettier': 'error',
    },
  },
  eslintConfigPrettier
);
