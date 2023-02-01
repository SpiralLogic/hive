import { mergeConfig } from 'vite';
import { defineConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    root: './',
    base: 'http://localhost',
    test: {
      root: './',
      include: ['./test/src/**/*.test.*'],
      exclude: ['./test/src/__snapshots__/**'],
      setupFiles: ['./test/vitest.setup.ts'],
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
        reportsDirectory: './reports/__coverage__',
      },
    },
  })
);
