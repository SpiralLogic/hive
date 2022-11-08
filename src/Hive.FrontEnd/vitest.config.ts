import { mergeConfig } from 'vite';
import { defineConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(viteConfig, defineConfig({
  root: './test', base: 'http://localhost',
  test: {
    root: './src',
    include: ['**/*'],
    exclude: ['./src/__snapshots__/**'],
    setupFiles: ['./jest.setup.ts'],
    typecheck: { checker: 'tsc' },
    clearMocks: true,
    environment: 'happy-dom',
    globals: true,
    reporters: ['dot'],
  },
}));