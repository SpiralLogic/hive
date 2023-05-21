import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import * as path from 'path';
const projectRootDir = path.resolve(__dirname);

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [preact({babel:{babelrc:false,configFile:false}})],
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
});
