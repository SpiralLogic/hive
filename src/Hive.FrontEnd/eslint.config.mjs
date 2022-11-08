import unicorn from 'eslint-plugin-unicorn';
import testingLibrary from 'eslint-plugin-testing-library';
import kentcdodds from 'eslint-config-kentcdodds';
import parser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';

export default [
  unicorn.configs.recommended,
  {
    files: ['src/**/*', 'test/**/*'],
    plugins: {
      unicorn,
      kentcdodds,
      prettier,
    }, languageOptions: { sourceType: 'module', ecmaVersion: 'latest', parser },
  },
  {
    files: ['test/**/*'],
    plugins: {
      testingLibrary, prettier,
    }, languageOptions: {
      sourceType: 'module', ecmaVersion: latest, parser, globals: {
        vi: 'readonly',
      },
    },
  },
];