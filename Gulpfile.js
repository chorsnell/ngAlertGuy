// Instantiate gulp plugins
var gulp = require('gulp'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	minifyCSS = require('gulp-minify-css'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	fs = require('fs'),
	path = require('path'),
	merge = require('merge-stream'),
	rename = require('gulp-rename');

// SCSS > Concatenated + Minified CSS
gulp.task('sass', function () {
	return gulp.src('./ngAlertGuy.scss')
		.pipe(sourcemaps.init())
		.pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(concat('ngAlertGuy.css'))
		.pipe(sourcemaps.write())
		.pipe(minifyCSS())
		.pipe(concat('ngAlertGuy.min.css'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./'));
});

// Run all tasks
gulp.task('default', ['sass']);