const gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    minifycss = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    babel = require('gulp-babel'),
    minifyinline = require('gulp-minify-inline'),
    critical = require('critical'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    minifyhtml = require('gulp-minify-html');

// HTML minifier
gulp.task('mini-html', function() {
  var opts = {
    conditionals: true,
    spare: true
  };

  return gulp.src('src/*.html')
    .pipe(minifyhtml(opts))
    .pipe(gulp.dest('app/'));
});

gulp.task('mini-html-1', function() {
  var opts = {
    conditionals: true,
    spare: true
  };

  return gulp.src('*.html')
    .pipe(minifyhtml(opts))
    .pipe(gulp.dest('app'));
});

gulp.task('mini-critical-html', function() {
    var opts = {
        conditionals: true,
        spare: true
    };
    return gulp.src('*.html')
        .pipe(minifyhtml(opts))
        .pipe(gulp.dest('app'));
});

gulp.task('mini-inline', function() {
  gulp.src('*.html')
    .pipe(minifyinline())
    .pipe(gulp.dest('app'))
});

// JavaScript  minifier
gulp.task('mini-js', function() {
  gulp.src('src/js/*.js')
    .pipe(babel({
      presets: ['es2015']
     }))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'));
});

// CSS minifier
gulp.task('mini-css', function() {
  gulp.src('src/css/*.css')
    .pipe(minifycss({compatibility: 'ie11'}))
    .pipe(gulp.dest('app/css'));
});


gulp.task('critical', function () {
  critical.generate({
    base: 'src',
    src: 'index.html',
    css: ['src/css/style.css'],
    dimensions: [{
      width: 320,
      height: 480
    },{
      width: 768,
      height: 1024
    },{
      width: 1280,
      height: 960
    }],
    dest: 'app/index.html',
    minify:true,
    inline: true
  });
});

// Image optimize
gulp.task('optimize-image', function() {
    gulp.src('src/images/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('app/images'));
});


// Image compress
gulp.task('compress-image', function() {
  gulp.src('src/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('app/images'));
})

// I watching U workin'
gulp.task('watch', function() {
  gulp.watch('src/*.html', ['mini-html']);
  gulp.watch('src/*.html', ['mini-inline']);
  gulp.watch('src/js/*.js', ['mini-js']);
  gulp.watch('src/css/*.css', ['mini-css']);
  gulp.watch('src/images/*', ['optimize-image']);
});

gulp.task('default', ['mini-html','mini-css', 'compress-image']);
// gulp.task('more',['critical','mini-html-1']);
