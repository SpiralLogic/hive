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
        extensions: ['.tsx', '.ts'],
    },
    externals: {
        // Use external version of React
   //    'preact/compat': 'preact/compat',
    }
}
