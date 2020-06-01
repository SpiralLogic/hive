import { ErrorInfo } from 'ts-loader/dist/interfaces';
import { Chalk } from 'chalk';

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    context: process.cwd(), // to automatically find tsconfig.json
    entry: './src/js/index.ts',
    output: {
        filename: 'js/index.js',
        path: path.resolve(__dirname, '../Hive.Api/wwwroot/'),
        pathinfo: false,
    },
    mode: 'production',
    devtool: 'eval-cheap-module-source-map',
    plugins: [
        new CleanWebpackPlugin({
            verbose: true,
            cleanStaleWebpackAssets: true,
        }),
        new ForkTsCheckerWebpackPlugin({
            eslint: true,
        }),
        new CopyPlugin({
            patterns: [
                { from: './src/css', to: 'css' },
                { from: './src/index.html', to: './' },
            ],
        }),
    ],
    target: 'web', // enum
    module: {
        rules: [
            {
                test: /.tsx?$/,
                include: path.resolve(__dirname, 'src/js'),
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            experimentalWatchApi: true,
                            logInfoToStdOut: true,
                            colors: true,
                            errorFormatter: customErrorFormatter,
                            onlyCompileBundledFiles: true,
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.mjs', '.js', '.json'],
        modules: [path.resolve(__dirname), 'node_modules'],
    },
    externals: {
        preact: 'preact',
    },
    optimization: {
        usedExports: true,
    },
    stats: {
        // Examine all modules
        maxModules: Infinity,
        // Display bailout reasons
        optimizationBailout: true,
    },
};

function customErrorFormatter(error: ErrorInfo, colors: Chalk): string {
    const messageColor = error.severity === 'warning' ? colors.bold.yellow : colors.bold.red;
    const e = Object.keys(error) as (keyof ErrorInfo)[];
    return 'Does not compute.... ' + messageColor(e.map((key) => `\n${key}: ${error[key]}`));
}
