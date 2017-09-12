const gulp = require('gulp');
const zip = require('gulp-zip');

gulp.task('default', function() {
    // берём все файлы и запаковываем
    gulp.src('src/**')
        .pipe(zip('widget.zip'))
        .pipe(gulp.dest('build'))
});