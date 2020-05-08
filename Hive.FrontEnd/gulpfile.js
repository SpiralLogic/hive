var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var fancy_log = require('fancy-log');

var paths = {
  pages: ['src/*.html'],
  css: ['src/css/*'],
  dist: ['dist/**/*']
};

gulp.task('copy-html', () =>
  gulp.src(paths.pages)
    .pipe(gulp.dest('dist'))
);

gulp.task('copy-css', () =>
  gulp.src(paths.css)
    .pipe(gulp.dest('dist/css'))
);

gulp.task('copy-to-api', () =>
  gulp.src(paths.dist)
    .pipe(gulp.dest('../Hive.Api/wwwroot/'))
);

var watcher = watchify(browserify({
  basedir: '.',
  debug: true,
  entries: ['src/js/index.ts']
}).plugin(tsify, { p: 'src/js' }));

var bundle = () => watcher.bundle()
  .pipe(source('index.js'))
  .pipe(gulp.dest('dist/js'));

gulp.task('default', gulp.series(gulp.parallel('copy-html', 'copy-css'), bundle, 'copy-to-api'));
watcher.on('update', gulp.series('default'));
watcher.on('log', fancy_log);