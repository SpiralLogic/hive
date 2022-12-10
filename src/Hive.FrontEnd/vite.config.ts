import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [preact()],
  root: './src',
  build: { outDir: '../public', emptyOutDir: true },
  envPrefix: 'HIVE_',
  envDir: './env',
  publicDir: './static',
});
