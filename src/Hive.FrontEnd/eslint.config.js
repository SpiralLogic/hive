import unicorn from 'eslint-plugin-unicorn';
import testingLibrary from 'eslint-plugin-testing-library';
import prettier from 'eslint-plugin-prettier';
import vitest from 'eslint-plugin-vitest';
import globals from 'globals';
// @ts-check

import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint'

export default tsEslint.config(
    eslint.configs.recommended,
    ...tsEslint.configs.recommended,
    unicorn.configs['flat/all'],
    {
        files: ['src/**/*.{ts,js,tsx,jsx}', 'test/**/*.{ts,js,tsx,jsx}'],
        plugins: {
            '@typescript-eslint': tsEslint.plugin,
            typescript: tsEslint.plugin,
            prettier,
            unicorn: unicorn.configs["flat/all"].plugins.unicorn,
        },
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
        languageOptions: {
            sourceType: 'module',
            ecmaVersion: 'latest',
            parser: tsEslint.parser,
            parserOptions: {
                project: 'tsconfig.json',
                tsconfigRootDir: import.meta.dirname,
            },
            globals: {
                ...globals.node,
                ...globals.browser,
                ...globals.es2024,

            },
        },
        rules: {
            'no-unused-vars': 'off',
            "unicorn/filename-case": [
                "error",
                {
                    "cases": {"kebabCase": true, "camelCase": true, "pascalCase": true}
                }
            ],"unicorn/prevent-abbreviations": [
                "error",
                {
                    "allowList": {
                        "ref": true,
                        "props": true,
                    }
                }
            ]
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
            parser: tsEslint.parser,
            parserOptions: {project: 'tsconfig.json'},
            globals: {
                ...globals.jest,
                vi: 'readonly',
                vitest: 'readonly',
            },
        },
    },
);
