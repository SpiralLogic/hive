import {defineConfig} from 'vite';
import preact from '@preact/preset-vite';

// https://vitejs.dev/config/
export default defineConfig(({mode}) => ({
    plugins: [preact()],
    root: './src',
    build: {outDir: '../public', sourcemap: mode === 'development'},
    envPrefix: 'HIVE_',
    envDir: './env',
}));
