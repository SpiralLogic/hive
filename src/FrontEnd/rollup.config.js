import resolve from '@rollup/plugin-node-resolve';
import cleanup from 'rollup-plugin-cleanup';
import copy from 'rollup-plugin-copy';

export default {
    input: './src/dist/index.js',
    output: {
        dir: '../Api/Hive.Api/wwwroot/js/',
        format: 'es',
        sourcemap: true,
        compact: true,
    },
    watch: {clearScreen: false},
    plugins: [
        resolve(),
        cleanup({
            comments: 'none',
            sourceMap: true,
        }),
        copy({
            targets: [
                {
                    src: 'src/static/css',
                    dest: '../Api/Hive.Api/wwwroot',
                },
                {
                    src: 'src/static/index.html',
                    dest: '../Api/Hive.Api/wwwroot',
                },
            ],
        }),
    ],
};
