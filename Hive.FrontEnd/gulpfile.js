/// <binding BeforeBuild='build-deploy' Clean='clean' ProjectOpened='default' />
const gulp = require('gulp');
const browserify = require('browserify');
const watchify = require('watchify');
const source = require('vinyl-source-stream');
const tsify = require('tsify');
const fancy_log = require('fancy-log');
const rimraf = require('rimraf');

const FRONTEND_DIR = '../Hive.FrontEnd/';
const API_DIR = '../Hive.Api/';

const sourceFiles = {
  html: FRONTEND_DIR + 'src/**/*.html',
  css: FRONTEND_DIR + 'src/css/**/*.css',
  js: FRONTEND_DIR + 'dist/js/**/*.js',
  build: FRONTEND_DIR + 'dist/**'
};

const outputDirs = {
  js: FRONTEND_DIR + 'dist/js/',
  css: FRONTEND_DIR + 'dist/css/',
  html: FRONTEND_DIR + 'dist/',
  deploy: API_DIR + 'wwwroot/'
};

const b = browserify({
  basedir: '.',
  debug: true,
  cache: {},
  packageCache: {},
  entries: [FRONTEND_DIR + 'src/js/index.ts']
});

b.plugin(tsify, { p: FRONTEND_DIR + 'src/js' });

const bundle = () =>
  b.bundle()
    .pipe(source('index.js'))
    .pipe(gulp.dest(outputDirs.js));

gulp.task('watch',
  gulp.parallel(
    () =>
      gulp.watch([sourceFiles.css, sourceFiles.html], {
        usePolling: true,
        interval: 100,
        events: 'all'
      }, gulp.series(gulp.parallel('build-html', 'build-css'), 'deploy')),
    () =>
      b.plugin(watchify, { delay: 100, ignoreWatch: ['**/node_modules/**'] })
        .on('update', gulp.series('build-js', 'deploy'))
        .bundle()
        .on('log', fancy_log)
  )
);

gulp.task('build-html',
  () =>
    gulp.src(sourceFiles.html)
      .pipe(gulp.dest(outputDirs.html))
);

gulp.task('build-css',
  () =>
    gulp.src(sourceFiles.css)
      .pipe(gulp.dest(outputDirs.css))
);

gulp.task('build-js', bundle);

gulp.task('clean',
  gulp.parallel(
    (cb) => rimraf(outputDirs.deploy + '**', cb),
    (cb) => rimraf(sourceFiles.build, cb),
    (cb) => rimraf(FRONTEND_DIR + 'src/**/*.js', cb),
    (cb) => rimraf(FRONTEND_DIR + 'src/**/*.js.map', cb),
  )
);

gulp.task('build', gulp.parallel('build-js', 'build-css', 'build-html'));

gulp.task('deploy',
  (cb) => {
    gulp.src(sourceFiles.build)
      .pipe(gulp.dest(outputDirs.deploy));
    cb();
  }
);

gulp.task('build-deploy', gulp.series('build', 'deploy'));

gulp.task('rebuild', gulp.series('clean', 'build-deploy'));

gulp.task('default', gulp.series('rebuild', 'watch'));