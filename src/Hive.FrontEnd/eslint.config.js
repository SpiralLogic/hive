import unicorn from 'eslint-plugin-unicorn';
import testingLibrary from 'eslint-plugin-testing-library';
import prettier from 'eslint-plugin-prettier';
import vitest from 'eslint-plugin-vitest';
import globals from 'globals';
// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint'
export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['src/**/*.{ts,js,tsx,jsx}', 'test/**/*.{ts,js,tsx,jsx}'],
        plugins: {
            unicorn,
            '@typescript-eslint': tseslint.plugin,
            typescript: tseslint.plugin,
            prettier
        },
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
        languageOptions: {
            sourceType: 'module',
            ecmaVersion: 'latest',
            parser: tseslint.parser,
            parserOptions: {project: 'tsconfig.json',      tsconfigRootDir: import.meta.dirname,
        },
            globals: {
                ...globals.node,
                ...globals.browser,
            },
        },
        rules: {
            'no-unused-vars': 'off',
        },
    },
    {
        ...testingLibrary.configs.recommended,
        files: ['test/**/*.{ts,js,tsx,jsx}'],
        plugins: {vitest, testingLibrary},
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
        languageOptions: {
            sourceType: 'module',
            ecmaVersion: 'latest',
            parser: tseslint.parser,
            parserOptions: {project: 'tsconfig.json'},
            globals: {
                ...globals.jest,
                vi: 'readonly',
                vitest: 'readonly',
            },
        },
    },
);
