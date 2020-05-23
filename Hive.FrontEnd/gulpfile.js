/* eslint-disable @typescript-eslint/no-var-requires */
/// <binding BeforeBuild='build-deploy' Clean='clean' ProjectOpened='default' />
const gulp = require('gulp');
const browserify = require('browserify');
const watchify = require('watchify');
const source = require('vinyl-source-stream');
const tsify = require('tsify');
const fancyLog = require('fancy-log');
const rimraf = require('rimraf');
const { src } = require('gulp');
const eslint = require('gulp-eslint');

const FRONTEND_DIR = '../Hive.FrontEnd/';
const API_DIR = '../Hive.Api/';

const sourceFiles = {
    html: FRONTEND_DIR + 'src/**/*.html',
    css: FRONTEND_DIR + 'src/css/**/*.css',
    ts: FRONTEND_DIR + 'src/js/**',
};

const outputDirs = {
    js: FRONTEND_DIR + 'dist/js/',
    css: FRONTEND_DIR + 'dist/css/',
    html: FRONTEND_DIR + 'dist/',
    root: FRONTEND_DIR + 'dist/',
};

const deployDirs = {
    root: API_DIR + 'wwwroot/',
    js: API_DIR + 'wwwroot/js/',
    css: API_DIR + 'wwwroot/css/',
    html: API_DIR + 'wwwroot/',
};

const b = browserify({
    basedir: '.',
    debug: true,
    cache: {},
    packageCache: {},
    entries: [FRONTEND_DIR + 'src/js/index.ts'],
});

b.plugin(tsify, { p: FRONTEND_DIR + 'src/js' });

const bundle = () => b.bundle().pipe(source('index.js')).pipe(gulp.dest(outputDirs.js));

gulp.task(
    'watch',
    gulp.parallel(
        () =>
            gulp.watch(
                [sourceFiles.css, sourceFiles.html],
                {
                    delay: 1000,
                    ignoredFiles: [sourceFiles.js],
                    events: ['add', 'change'],
                },
                gulp.series(gulp.parallel('build-html', 'build-css'), 'deploy'),
            ),
        () =>
            b
                .plugin(watchify, {
                    delay: 1000,
                    ignoreInitial: true,
                    ignoreWatch: ['**/node_modules/**', sourceFiles.css, sourceFiles.html],
                })
                .on('update', gulp.series('build-js', 'deploy-js'))
                .bundle()
                .on('log', fancyLog),
    ),
);

gulp.task('build-html', () => gulp.src(sourceFiles.html).pipe(gulp.dest(outputDirs.html)));

gulp.task('build-css', () => gulp.src(sourceFiles.css).pipe(gulp.dest(outputDirs.css)));

gulp.task('build-js', bundle);

gulp.task('lint', () =>
    gulp
        .src(sourceFiles + '**/*')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError()),
);

gulp.task(
    'clean',
    gulp.parallel(
        (cb) => rimraf(deployDirs.root + '**/*', cb),
        (cb) => rimraf(outputDirs.root + '**/*', cb),
        (cb) => rimraf(FRONTEND_DIR + 'src/**/*.js', cb),
        (cb) => rimraf(FRONTEND_DIR + 'src/**/*.js.map', cb),
    ),
);

gulp.task('build', gulp.parallel('build-js', 'build-css', 'build-html'));

gulp.task('deploy-assets', (cb) => {
    gulp.src(outputDirs.css + '**').pipe(gulp.dest(deployDirs.css));
    gulp.src(outputDirs.html + '**').pipe(gulp.dest(deployDirs.html));
    cb();
});

gulp.task('deploy-js', (cb) => {
    gulp.src(outputDirs.js + '**').pipe(gulp.dest(deployDirs.js));
    cb();
});

gulp.task('deploy', gulp.parallel('deploy-js', 'deploy-assets'));

gulp.task('build-deploy', gulp.series('build', 'deploy'));

gulp.task('rebuild', gulp.series('clean', 'build-deploy'));

gulp.task('default', gulp.series('rebuild', 'watch'));
