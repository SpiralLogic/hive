/// <reference types="vitest" />
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import * as path from 'path';
const projectRootDir = path.resolve(__dirname);

export default defineConfig({
  plugins: [preact({ babel: { babelrc: false, configFile: false } })],
  root: './src',
  resolve: {
    alias: [
      {
        find: '@hive',
        replacement: path.resolve(projectRootDir, 'src'),
      },
    ],
  },
  build: { outDir: '../public', emptyOutDir: true },
  envPrefix: 'HIVE_',
  envDir: './env',
  publicDir: './static',
  test: {
    root: './',
    include: ['./test/src/**/*.test.*'],
    exclude: ['./test/src/__snapshots__/**'],
    setupFiles: ['./test/vitest.setup.ts'],
    outputFile: './reports/__tests__/test-results.json',
    typecheck: { checker: 'tsc' },
    clearMocks: true,
    environment: 'jsdom',
    environmentOptions: { url: 'http://localhost' },
    globals: true,
    reporters: ['dot'],
    coverage: {
      provider: 'istanbul',
      enabled: true,
      reporter: ['text', 'lcov'],
      reportsDirectory: './reports/__coverage__',
    },
  },
});
