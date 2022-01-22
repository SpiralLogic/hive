require('esbuild')
  .build({
    entryPoints: ['./src/index.tsx'],
    bundle: true,
    define: { 'process.env.NODE_ENV': `"${process.env.NODE_ENV}"` },
    inject: ['./inject.shim.js'],
    loader: {
      '.svg': 'text',
    },
    minify: process.env.NODE_ENV !== 'development',
    outfile: './public/js/hive.js',
    sourcemap: process.env.NODE_ENV === 'development',
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    watch: {
      onRebuild(error, result) {
        if (error) console.error('watch build failed:', error);
        else console.log('watch build succeeded:', result);
      },
    },
  })
  .then((result) => console.log(result));
