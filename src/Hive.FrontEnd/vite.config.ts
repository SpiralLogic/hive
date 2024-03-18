import {defineConfig} from 'vitest/config';
import preact from '@preact/preset-vite';

const projectRootDir = path.resolve(__dirname);

let httpsSettings = {};
import child_process from 'child_process';
import path from 'path';
import fs from 'fs';

if (!process.env.CI) {
    const baseFolder =
        process.env.APPDATA !== undefined && process.env.APPDATA !== ''
            ? `${process.env.APPDATA}/ASP.NET/https`
            : `${process.env.HOME}/.aspnet/https`;

    const certificateArg = process.argv
        .map((arg) => RegExp(/--name=(?<value>.+)/i).exec(arg))
        .filter(Boolean)[0];
    const certificateName = certificateArg ? certificateArg.groups.value : 'reactapp2.client';

    if (!certificateName) {
        console.error(
            'Invalid certificate name. Run this script in the context of an npm/yarn script or pass --name=<<app>> explicitly.'
        );
        process.exit(-1);
    }

    const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
    const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

    if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
        if (
            0 !==
            child_process.spawnSync(
                'dotnet',
                ['dev-certs', 'https', '--export-path', certFilePath, '--format', 'Pem', '--no-password'],
                {stdio: 'inherit'}
            ).status
        ) {
            throw new Error('Could not create certificate.');
        }
    }
    httpsSettings = {
        key: fs.readFileSync(keyFilePath),
        cert: fs.readFileSync(certFilePath),
    };
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [preact({babel: {babelrc: false, configFile: false}})],
    root: './src',
    css: {transformer: 'lightningcss'},
    resolve: {
        alias: [
            {
                find: '@hive',
                replacement: path.resolve(projectRootDir, 'src'),
            },
        ],
    },
    build: {outDir: '../public', emptyOutDir: true, cssMinify: 'lightningcss'},
    envPrefix: 'HIVE_',
    envDir: './env',
    publicDir: './static',
    server: {
        proxy: {
            '/api': {
                target: 'https://localhost:5001',
                changeOrigin: false,
                secure: false,
            },
            '/game': {
                target: 'https://localhost:5001',
                changeOrigin: false,
                secure: false,
            },
            '/new': {
                target: 'https://localhost:5001',
                changeOrigin: false,
                secure: false,
            },
            '/gamehub': {
                target: 'wss://localhost:5001',
                ws: true,
                secure: false,
            },
        },
        port: 5174,
        https: httpsSettings,

    },
    test: {
        root: './',
        include: ['./test/src/**/*.test.*'],
        exclude: ['./test/src/__snapshots__/**', './src/svg/**'],
        setupFiles: ['./test/vitest.setup.ts'],
        outputFile: './reports/frontend/test-results.json',
        typecheck: {checker: 'tsc'},
        clearMocks: true,
        environment: 'jsdom',
        environmentOptions: {url: 'http://localhost'},
        globals: true,
        reporters: ['dot'],
        coverage: {
            provider: 'v8',
            all: false,

            enabled: true,
            reporter: ['text', 'lcov'],
            reportsDirectory: './reports/frontend/',
        },
    },
});
