const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const createIndexHtmlFile = (metafile) => {
  const outputFiles = Object.keys(metafile.outputs).map((file) => file.replace(/^public/, ''));

  const createOutputsHtml = (extension, replaceFn) =>
    outputFiles
      .filter((k) => !!k.endsWith(`.${extension}`))
      .map(replaceFn)
      .join('\n  ');

  const scripts = createOutputsHtml(
    'js',
    (scriptFile) => `<script type="module" src="${scriptFile}"></script>`
  );
  const cssLinks = createOutputsHtml(
    'css',
    (cssFile) => `<link rel="stylesheet" type="text/css" href="${cssFile}" />`
  );

  const indexTemplate = fs.readFileSync(path.resolve(__dirname, './src/index.html')).toString();
  const indexHtml = indexTemplate.replace('[scripts]', scripts).replace('[css]', cssLinks);

  const writePath = path.resolve(__dirname, './public/index.html');
  fs.writeFileSync(writePath, indexHtml);
  console.log('index.html written');
  console.log('NODE_ENV: ' + process.env.NODE_ENV);
};

const buildProperties = {
  entryPoints: ['./src/index.tsx'],
  bundle: true,
  minify: process.env.NODE_ENV !== 'development',
  define: { 'process.env.NODE_ENV': `"${process.env.NODE_ENV}"` },
  sourcemap: process.env.NODE_ENV === 'development',
  inject: ['./inject.shim.js'],
  loader: {
    '.svg': 'text',
  },
  entryNames: '[name]-[hash]',
  outfile: './public/js/hive.js',
  jsxFactory: 'h',
  jsxFragment: 'Fragment',
  metafile: true,
  platform: 'browser',
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
