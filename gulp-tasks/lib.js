const gulp = require('gulp');
const rollup = require('gulp-rollup');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify-es').default;
const header = require('gulp-header');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const del = require('del');

const pkg = require('../package.json');
const banner = [
	'/**',
	' * @package <%= pkg.name %> - <%= pkg.description %>',
	' * @version v<%= pkg.version %>',
	' * @link <%= pkg.homepage %>',
	' * @author <%= pkg.author.name %> | <%= pkg.author.url %>',
	' * @license <%= pkg.license %>',
	' */',
	'',
].join('\n');

function libStyles() {
	return gulp
		.src('./src/scss/pokamnieto.scss')
		.pipe(
			sass({ outputStyle: 'expanded' }).on('error', sass.logError),
		)
		.pipe(rename('pokamnieto.css'))
		.pipe(header(banner, { pkg }))
		.pipe(gulp.dest('./dist/css'))

		.pipe(
			sass({
				outputStyle: 'compressed',
			}).on('error', sass.logError),
		)
		.pipe(rename('pokamnieto.min.css'))
		.pipe(header(banner, { pkg }))
		.pipe(gulp.dest('./dist/css'));
}

function umd() {
	process.env.NODE_ENV = 'release';

	return gulp
		.src('./src/js/**/*.js')
		.pipe(
			rollup({
				output: { name: 'Pokamnieto', format: 'umd' },
				input: './src/js/pokamnieto.js',
			}),
		)
		.pipe(babel())
		.pipe(rename('pokamnieto.js'))
		.pipe(header(banner, { pkg }))
		.pipe(gulp.dest('./dist/js'))

		.pipe(uglify())
		.pipe(rename('pokamnieto.min.js'))

		.pipe(header(banner, { pkg }))
		.pipe(gulp.dest('./dist/js'));
}

function clean() {
	return del(['./dist']);
}

const build = gulp.series(clean, umd, libStyles);

function watch() {
	gulp.watch(['./src/**/*.js'], build);
}

module.exports = {
	buildLib: build,
	watchLib: watch,
};
