var gulp = require('gulp'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify');

gulp.task('default', function() {
  gulp.src([
        'bower_components/angular/angular.js',
        'bower_components/d3/d3.js',
        'bower_components/moment/moment.js',
        'bower_components/n3-line-chart/build/line-chart.js',
        'client/*.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('public/javascript/'));

  gulp.src([
      'client/*.css'])
    .pipe(concat('main.css'))
    .pipe(gulp.dest('public/stylesheets/'));
});

gulp.task('watch', function() {
    gulp.watch('client/*.*', ['default']);
});
