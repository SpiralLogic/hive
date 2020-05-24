const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './src/js/index.ts',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist/js'),
    },
    devtool: 'inline-source-map',
    plugins: [new HtmlWebpackPlugin({
        filename: '../index.html',
        template: './src/index.html'
    })],
    target: 'web', // enum
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: [/node_modules/, /__tests__/, /coverage/],

            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts'],
    }, externals: {
        // Use external version of React
        'react': 'React',
        'react-dom': 'ReactDOM'
    }
};