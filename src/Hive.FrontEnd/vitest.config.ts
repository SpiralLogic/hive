import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: './',
  base: 'http://localhost',
  test: {
    root: './test',
    include: ['./src/**/*.test.*'],
    exclude: ['./src/__snapshots__/**'],
    setupFiles: ['./vitest.setup.ts'],
    outputFile: './reports/__tests__/test-results.xml',
    typecheck: { checker: 'tsc' },
    clearMocks: true,
    environment: 'jsdom',
    environmentOptions: { url: 'http://localhost' },
    globals: true,
    reporters: ['dot'],
    coverage: {
      enabled: true,
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: '../reports/__coverage__',
    },
  },
});
