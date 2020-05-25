const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const path = require('path');
const chalk = require('chalk');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/js/index.ts',
    output: {
        filename: 'js/index.js',
        path: path.resolve(__dirname, '../Hive.Api/wwwroot/'),
    },
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [
        new CleanWebpackPlugin({
            verbose: true,
            cleanStaleWebpackAssets: true,
        }),
        new CopyPlugin({
                patterns: [
                    {from: './src/css', to: 'css'},
                    {from: './src/index.html', to: './'}
                ]
            }
        ),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html'
        }),
        new ProgressBarPlugin({
            format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
            clear: false
        }),
    ],
    target: 'web', // enum
    module: {
        rules: [{
            test: /\.ts(x)?$/,
            use: ['awesome-typescript-loader'],
            exclude: [/node_modules/, /__tests__/, /coverage/],
                }, {
            test: /\.html$/,
            loader: 'raw-loader'
        }
        ]
    },
    resolve: {
        'alias': {
            'react': 'preact/compat',
            'react-dom/test-utils': 'preact/test-utils',
            'react-dom': 'preact/compat',
            // Must be below test-utils
        },
        externals: {
            // Use external version of React
            'react': 'React',
            'react-dom': 'ReactDOM',
        },
        extensions: ['.tsx', '.ts'],
    },
    externals: {
        // Use external version of React
        'react': 'React',
        'react-dom': 'ReactDOM',
    },
    watch: true,
    watchOptions: {
        aggregateTimeout: 200,
        poll: 1000,
        ignored: [/node_modules/, /__tests__/, /coverage/],
    }
}