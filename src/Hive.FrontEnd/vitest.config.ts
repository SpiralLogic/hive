import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: './',
  base: 'http://localhost',
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
      provider: 'v8',
      enabled: true,
      reporter: ['text', 'lcov'],
      reportsDirectory: './reports/__coverage__',
      100: true,
    },
  },
});
