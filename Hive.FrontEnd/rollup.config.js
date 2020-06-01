//import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';

export default {
    external: ['preact','preact/compat','preact/devtools']
    input: 'src/js/index.js',
    output: {
        file: '../Hive.Api/wwwroot/bundle.js',
        format: 'es',
    },
    //plugins: [resolve()],
};
