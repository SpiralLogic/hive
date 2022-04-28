const esbuild = require('esbuild');
const fs = require('fs');

const createIndexHtmlFile = (metafile) => {
  const outputFiles = Object.keys(metafile.outputs).map((file) => file.replace(/^public/, ''));

  const createOutputsHtml = (extension, replaceFn) =>
    outputFiles
      .filter((k) => !!k.endsWith(`.${extension}`))
      .map(replaceFn)
      .join('\n  ');

  const cssLinks = createOutputsHtml(
    'js',
    (scriptFile) => `<script type="module" src="${scriptFile}"></script>`
  );
  const scripts = createOutputsHtml(
    'css',
    (cssFile) => `<link rel="stylesheet" type="text/css" href="${cssFile}" />`
  );

  const indexTemplate = fs.readFileSync('./src/index.html').toString();
  const indexHtml = indexTemplate.replace('[css]', cssLinks).replace('[scripts]', scripts);

  fs.writeFileSync('./public/index.html', indexHtml);
  console.log('index.html written');
};
const buildProperties = {
  entryPoints: ['./src/index.tsx'],
  bundle: true,
  define: { 'process.env.NODE_ENV': `"${process.env.NODE_ENV}"` },
  inject: ['./inject.shim.js'],
  loader: {
    '.svg': 'text',
  },
  entryNames: '[name]-[hash]',
  minify: process.env.NODE_ENV !== 'development',
  outfile: './public/js/hive.js',
  sourcemap: process.env.NODE_ENV === 'development',
  jsxFactory: 'h',
  jsxFragment: 'Fragment',
  metafile: true,
};
if (!process.env.WATCH) {
  const { metafile } = esbuild.buildSync(buildProperties);
  createIndexHtmlFile(metafile);
} else {
  esbuild
    .build({
      ...buildProperties,
      watch: {
        onRebuild(error, result) {
          if (error) console.error('watch build failed:', error);
          else {
            createIndexHtmlFile(result.metafile);
            console.log('watch rebuild succeeded');
          }
        },
      },
    })
    .then((result) => {
      createIndexHtmlFile(result.metafile);
    });
}
