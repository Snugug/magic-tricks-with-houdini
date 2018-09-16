'use strict';

//////////////////////////////
// Require Gulp and grab Armadillo
//////////////////////////////
const gulp = require('gulp');
const clean = require('del');
const sync = require('browser-sync');

require('gulp-armadillo')(gulp);

gulp.task('js', () => {
  return gulp.src('.www/js/**/*.js')
    .pipe(sync.stream({
      match: '**/*.js',
    }));
});

gulp.task('js:watch', () => {
  return gulp.watch(['.www/js/**/*.js'], ['js']);
});

gulp.task('copy:js', () => {
  return gulp.src('js/**/*.min.js')
    .pipe(gulp.dest('.www/js'));
});

gulp.task('copy:js:watch', () => {
  return gulp.watch(['js/**/*.min.js'], ['copy:js']);
});

gulp.task('clean:deploy:html', cb => {
  return clean([
    '.www/**/*.html',
    '!.www/index.html',
  ], cb);
});
