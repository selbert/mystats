var gulp = require('gulp'),
    concat = require('gulp-concat');

gulp.task('default', function() {
  gulp.src(['bower_components/angular/angular.min.js', 'client/*.js'])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('public/js/'));
});

