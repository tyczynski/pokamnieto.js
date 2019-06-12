const gulp = require('gulp');
const rollup = require('gulp-rollup');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify-es').default;
const headerComment = require('gulp-header-comment');

const distFolder = './dist';
const libName = 'ScrollObserver';
const srcPath = './src/**/*.js';
const inputPath = './src/ScrollObserver.js';

const header = `
  License: <%= pkg.license %>
  Generated on <%= moment().format('YYYY/MM/DD HH:mm') %>
  Author: <%= pkg.author.name %> | <%= pkg.author.url %>
  Copyright (c) 2019 <%= pkg.author.name %>
`;

function amd() {
  process.env.NODE_ENV = 'release';

  return gulp
    .src(srcPath)
    .pipe(
      rollup({
        output: { name: libName, format: 'amd' },
        input: inputPath,
      }),
    )

    .pipe(rename(`${libName}.amd.js`))
    .pipe(gulp.dest(distFolder))

    .pipe(uglify())
    .pipe(rename(`${libName}.amd.min.js`))

    .pipe(headerComment(header))
    .pipe(gulp.dest(distFolder));
}

function umd() {
  process.env.NODE_ENV = 'release';

  return gulp
    .src(srcPath)
    .pipe(
      rollup({
        output: { name: libName, format: 'umd' },
        input: inputPath,
      }),
    )

    .pipe(rename(`${libName}.js`))
    .pipe(gulp.dest(distFolder))

    .pipe(uglify())
    .pipe(rename(`${libName}.min.js`))

    .pipe(headerComment(header))
    .pipe(gulp.dest(distFolder));
}

function esm() {
  process.env.NODE_ENV = 'release';

  return gulp
    .src(srcPath)
    .pipe(
      rollup({
        output: { name: libName, format: 'es' },
        input: inputPath,
      }),
    )

    .pipe(rename(`${libName}.esm.js`))

    .pipe(headerComment(header))
    .pipe(gulp.dest(distFolder));
}

exports.build = gulp.series(gulp.parallel(umd, esm, amd));
