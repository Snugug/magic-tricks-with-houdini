'use strict';

//////////////////////////////
// Require Gulp and grab Armadillo
//////////////////////////////
var gulp = require('gulp');

require('gulp-armadillo')(gulp);

gulp.task('copy:js', () => {
  return gulp.src('js/**/*.min.js')
    .pipe(gulp.dest('.www/js'));
});

gulp.task('copy:js:watch', () => {
  return gulp.watch(['js/**/*.min.js'], ['copy:js']);
});
