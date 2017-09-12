const gulp = require('gulp');
const zip = require('gulp-zip');
const bump = require('gulp-bump');

gulp.task('bump', function() {
    gulp.src('src/manifest.json')
        .pipe(bump({key: {widget: 'version'}}))
        .pipe(gulp.dest('src/'));
});

var zipfunction = function() {
    // берём все файлы и запаковываем
    gulp.src('src/**')
        .pipe(zip('widget.zip'))
        .pipe(gulp.dest('build/'));
};

gulp.task('zip', zipfunction);

gulp.task('bump-build', ['bump'], zipfunction);

gulp.task('default', ['bump-build']);