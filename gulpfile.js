// include gulp
var gulp = require('gulp');

// include plug-ins
var jshint = require('gulp-jshint'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    changed = require('gulp-changed'),
    less = require('gulp-less'),
    todo = require('gulp-todo'),
    clean = require('gulp-clean'),
    gutil = require('gulp-util'),
    header = require('gulp-header'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css'),
    pkg = require('./package.json'),
    SRC = './',
    DEST = './dist/';

var jsSRC = [
  'js/file1.js',
  'js/file2.js',
  'js/folder/*.js',
  'js/file3.js'
];

var headerComment =
    '// MIT licensed, Written by Alexey Novak, 201X\n' +
    '// version ' + pkg.version + '\n';

gulp.task('clean', function() {
  gulp.src(DEST + '**/*.*', { read: false })
    .pipe(clean({ force: true }))
    .on('error', gutil.log);
});

gulp.task('jshint', function() {
  gulp.src(SRC + 'js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .on('error', gutil.log);
});

gulp.task('images', function() {
  gulp.src(SRC + 'imgs/**/*')
    .pipe(changed(DEST + 'imgs'))
    .pipe(cache(
      imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest(DEST + 'imgs'))
    .on('error', gutil.log);
});

gulp.task('less', function() {
  gulp.src(SRC + 'less/**/*.less')
    .pipe(changed(SRC + 'css'))
    .pipe(less())
    .pipe(gulp.dest(SRC + 'css'))
    .on('error', gutil.log);
});

gulp.task('minify-css', function() {
  gulp.src(SRC + 'css/**/*.css')
    .pipe(minifyCSS({ keepBreaks: true }))
    .pipe(concat([pkg.name, pkg.version, 'min', 'css'].join('.')))
    .pipe(gulp.dest(DEST + 'css'))
    .on('error', gutil.log);
});

gulp.task('minify-js', function() {
  gulp.src(jsSRC)
    .pipe(
      concat([pkg.name, pkg.version, 'min', 'js'].join('.'), { newLine: ';' }))
    .pipe(uglify())
    .pipe(header(headerComment))
    .pipe(gulp.dest(DEST + 'js'))
    .on('error', gutil.log);
});

gulp.task('watch', function() {

  // Watch .js files
  gulp.watch(SRC + 'js/*.js', ['jshint', 'minify-js']);

  // Watch .less files
  gulp.watch(SRC + 'less/**/*.less', ['less', 'minify-css']);

  // Watch image files
  gulp.watch(SRC + 'imgs/**/*', ['images']);

});

gulp.task('todo', function() {
  gulp.src(SRC + 'js/**/*.js')
    .pipe(todo())
    .pipe(gulp.dest(SRC))
    .on('error', gutil.log);
});

gulp.task('copy', function() {
  gulp.src(SRC + '*.html')
    .pipe(gulp.dest(DEST));

  gulp.src(SRC + 'libs/**/*.*')
    .pipe(gulp.dest(DEST + 'libs'));
});

// Default Task
gulp.task('default', [
  'clean',
  'jshint',
  'less',
  'minify-css',
  'minify-js',
  'todo',
  'images',
  'copy'
]);