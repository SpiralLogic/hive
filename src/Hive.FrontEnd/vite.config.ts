import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  root: './src',
  build: { outDir: '../public' },
  envPrefix: 'HIVE_',
  envDir: './env',
  publicDir: './static',
});
