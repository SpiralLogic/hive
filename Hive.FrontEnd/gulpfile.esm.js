import gulp from 'gulp';
import browserify from 'browserify';
import watchify from 'watchify';
import source from 'vinyl-source-stream';
import tsify from 'tsify';
import fancy_log from 'fancy-log';

const paths = {
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

const watcher = watchify(browserify({
  basedir: '.',
  debug: true,
  entries: ['src/js/index.ts']
}).plugin(tsify, { p: 'src/js' }));

const bundle = () => watcher.bundle()
  .pipe(source('index.js'))
  .pipe(gulp.dest('dist/js'));

gulp.task('default', gulp.series(gulp.parallel('copy-html', 'copy-css'), bundle, 'copy-to-api'));
watcher.on('update', gulp.series('default'));
watcher.on('log', fancy_log);