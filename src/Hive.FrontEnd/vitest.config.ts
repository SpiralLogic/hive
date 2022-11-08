import { mergeConfig } from 'vite';
import { defineConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    root: './test',
    base: 'http://localhost',
    test: {
      root: './src',
      include: ['**/src/*.test.*'],
      exclude: ['./src/__snapshots__/**'],
      setupFiles: ['./vitest.setup.ts'],
      typecheck: { checker: 'tsc' },
      clearMocks: true,
      environment: 'jsdom',
      environmentOptions: { url: 'http://localhost' },
      globals: true,
      reporters: ['dot'],
      coverage: {
        reporter: ['text', 'json', 'html'],
        reportsDirectory: '../reports/__coverage__',
      },
    },
  })
);
