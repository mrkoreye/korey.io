var gulp = require('gulp');
var sass = require('gulp-sass');
var del = require('del');
var inject = require('gulp-inject-string');
var htmlmin = require('gulp-htmlmin');
var runSequence = require('run-sequence');
var fs = require('fs');
var rename = require('gulp-rename');
var gulpStylelint = require('gulp-stylelint');
var imagemin = require('gulp-imagemin');
var connect = require('gulp-connect');
var uglify = require('gulp-uglify');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var s3 = require('gulp-s3-upload')({});
var cloudfront = require('gulp-cloudfront-invalidate');

gulp.task('build', function(callback) {
  return runSequence(
    'lint:scss',
    'clean',
    'copy:assets',
    'scss',
    'postcss',
    'js',
    'image:minify',
    'inject:html',
    'inject:js',
    'inject:css',
    'html:min',
    'inject:build-comment',
    'rename-index',
    callback
  );
});

gulp.task('clean', function() {
  return del([
    'build',
    'index.html'
  ])
});

gulp.task('image:minify', function() {
  return gulp.src('assets/**/*')
    .pipe(imagemin([
      imagemin.jpegtran({progressive: true})
    ]))
    .pipe(gulp.dest('assets'))
});

gulp.task('lint:scss', function() {
  return gulp
    .src('src/**/*.scss')
    .pipe(gulpStylelint({
        reporters: [{
            formatter: 'string', 
            console: true
        }]
    }));
})

gulp.task('scss', function() {
  return gulp.src('src/**/*.scss')
    .pipe(sass({
        outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(gulp.dest('build'));
});

gulp.task('copy:assets', function() {
  return gulp.src('assets/**')
    .pipe(gulp.dest('build/assets'));
});

gulp.task('postcss', function() {
  return gulp.src('build/**/*.css')
    .pipe(postcss([ autoprefixer() ]))
    .pipe(gulp.dest('build'));
});

gulp.task('js', function() {
  return gulp.src('src/**/*.js')
    // .pipe(uglify())
    .pipe(gulp.dest('build'));
});

gulp.task('html:min', function() {
  return gulp.src('build/shell.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('inject:html', function() {
  return gulp.src('src/shell.html')
    .pipe(inject.after('<body>', fs.readFileSync('src/main.html').toString()))
    .pipe(gulp.dest('build'));
});

gulp.task('inject:js', function() {
  return gulp.src('build/shell.html')
    .pipe(inject.after('<script>', fs.readFileSync('build/main.js').toString()))
    .pipe(gulp.dest('build'));
});

gulp.task('inject:css', function() {
  return gulp.src('build/shell.html')
    .pipe(inject.after('<style>', fs.readFileSync('build/main.css').toString()))
    .pipe(gulp.dest('build'));
});

gulp.task('inject:build-comment', function() {
  return gulp.src('build/shell.html')
    .pipe(inject.prepend('<!-- Generated: ' + Date() + ' -->\n'))
    .pipe(gulp.dest('build'));
});

gulp.task('rename-index', function() {
  return gulp.src('build/shell.html')
    .pipe(rename('index.html'))
    .pipe(gulp.dest('build'));
});

gulp.task('watch', function() {
  return gulp.watch(['src/*'], function() {
    runSequence('build', 'reload');
  });
});

gulp.task('connect', function() {
  return connect.server({
    root: ['build'],
    livereload: true
  });
});
 
gulp.task('reload', function () {
  return gulp.src('src/**')
    .pipe(connect.reload());
});
 
gulp.task('develop', function() {
  return runSequence(
    'build', 
    'watch', 
    'connect'
  );
});

gulp.task('upload:s3', function() {
  return gulp.src('build/**')
    .pipe(s3({
      Bucket: 'korey.io',
      ACL: 'public-read'
    }));
});

gulp.task('deploy', function() {
  runSequence('build', 'upload:s3', 'invalidate:cloudfront');
});

// Invalidating cloudfront is kind of an anti-pattern, since using
// versioned assets is the better way to go. But since all we have
// is an index.html file and no assets to download, it makes sense to do it here
gulp.task('invalidate:cloudfront', function () {
  return gulp.src('*')
    .pipe(cloudfront({
      distribution: 'E2ILC7C1FNY554',
      paths: ['/index.html']
    }));
});