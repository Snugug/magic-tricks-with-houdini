'use strict';

//////////////////////////////
// Require Gulp and grab Armadillo
//////////////////////////////
var gulp = require('gulp');

require('gulp-armadillo')(gulp, {
  tasks: {
    dist: {
      copy: [
        'copy:dist',
        'copy:js',
        'imagemin:dist',
        'usemin',
      ],
    },
  },
});

gulp.task('copy:js', () => {
  gulp.src('js/**/*.min.js')
    .pipe(gulp.dest('.dist/js'));
});
