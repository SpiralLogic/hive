import resolve from '@rollup/plugin-node-resolve';
import cleanup from 'rollup-plugin-cleanup';
import copy from 'rollup-plugin-copy';
import sizes from 'rollup-plugin-sizes';

export default {
    input: './src/dist/index.js',
    output: {
        dir: '../Hive.Api/wwwroot/js/',
        format: 'es',
        sourcemap: true,
        compact: true,
    },
    plugins: [
        resolve(),
        cleanup({
            comments: 'none',
            sourceMap: true,
        }),
        sizes({ details: true }),
        copy({
            targets: [
                {
                    src: 'src/css',
                    dest: '../Hive.Api/wwwroot',
                },
                {
                    src: 'src/index.html',
                    dest: '../Hive.Api/wwwroot',
                },
            ],
        }),
    ],
};
