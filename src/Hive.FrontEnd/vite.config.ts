/**
 * Vite 8 uses Rolldown for production builds; customize via `build.rolldownOptions` (or deprecated `build.rollupOptions` alias).
 * Do not add a separate `rolldown` npm package — the bundler is provided by Vite.
 */
import {defineConfig} from 'vitest/config';
import preact from '@preact/preset-vite';

const projectRootDirectory = path.resolve(import.meta.dirname);

let httpsSettings = {};
import child_process from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

if (!process.env.CI && !process.env.IS_DOCKER) {
    const baseFolder =
        process.env.APPDATA !== undefined && process.env.APPDATA !== ''
            ? `${process.env.APPDATA}/ASP.NET/https`
            : `${process.env.HOME}/.aspnet/https`;

    const certificateArgument = process.argv
        .map((argument) => new RegExp(/--name=(?<value>.+)/i).exec(argument))
        .find(Boolean);
    const certificateName = certificateArgument?.groups?.value ?? 'reactapp2.client';

    if (!certificateName) {
        const error = 'Invalid certificate name. Run this script in the context of a npm/yarn script or pass --name=<<app>> explicitly.';
        console.error(
            error
        );
        throw new Error(error)
    }
    // Ensure baseFolder exists before using it for file paths
    if (!fs.existsSync(baseFolder)) {
        fs.mkdirSync(baseFolder, { recursive: true });
    }

    const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
    const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

    if (!fs.existsSync(certFilePath) &&
        0 !==
        child_process.spawnSync(
            'dotnet',
            ['dev-certs', 'https', '--export-path', certFilePath, '--format', 'Pem', '--no-password'],
            {stdio: 'inherit'}
        ).status
    ) {
        throw new Error('Could not create certificate.');
    }

    const pemContent = fs.readFileSync(certFilePath, 'utf8');
    const keyMatch = pemContent.match(/-----BEGIN PRIVATE KEY-----[\s\S]*?-----END PRIVATE KEY-----/);
    const certMatch = pemContent.match(/-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/);
    const key = fs.existsSync(keyFilePath)
        ? fs.readFileSync(keyFilePath)
        : keyMatch
            ? Buffer.from(keyMatch[0], 'utf8')
            : null;
    const cert = certMatch ? Buffer.from(certMatch[0], 'utf8') : null;
    if (key && cert) {
        httpsSettings = { key, cert };
    }
}

export default defineConfig({
    plugins: [preact({babel: {babelrc: false, configFile: false}})],
    root: './src',
    css: {transformer: 'lightningcss'},
    resolve: {
        alias: [
            {
                find: '@hive',
                replacement: path.resolve(projectRootDirectory, 'src'),
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
        unstubGlobals: true,
        unstubEnvs: true,
        sequence: {shuffle:true},
        globals: true,
        reporters: ['dot'],
        coverage: {
            provider: 'v8',
            enabled: true,
            reporter: ['text', 'lcov'],
            reportsDirectory: './reports/frontend/',
        },
    },
});
