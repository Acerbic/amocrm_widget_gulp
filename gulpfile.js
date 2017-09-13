const gulp = require('gulp');
const Q = require('q');
const runSequence = require('run-sequence');
const zip = require('gulp-zip');
const bump = require('gulp-bump');
const template = require('gulp-template');
const merge2 = require('merge2');

var config_loaded = Q.defer();
var config;

gulp.task('bump', function() {
    return gulp.src('src/manifest.json')
        .pipe(bump({key: {widget: 'version'}}))
        .pipe(gulp.dest('src/'));
});

gulp.task('build', ['config'], function() {
    // берём все файлы и запаковываем

    // но перед этим в манифест подставляем значения из файла
    // конфигурации
    var manifest = gulp.src('src/manifest.json')
        .pipe(template({
            widget_code: config.widget_code,
            widget_secret_key: config.widget_secret_key,
        }));

    var other = gulp.src(['src/**', '!src/manifest.json']);

    return merge2(manifest, other)
        .pipe(zip('widget.zip'))
        .pipe(gulp.dest('./build'));
});

gulp.task('bump-build', function (callback) {
    return runSequence('bump', 'build', callback);
});


gulp.task('config', function() {return config_loaded.promise;});
gulp.task('config-dev', function() {
    config = require('./config/development.json');
    config_loaded.resolve();
});
gulp.task('config-prod', function() {
    config = require('./config/production.json');
    config_loaded.resolve();
});

// повысить версию и собрать в dev конфигурации
gulp.task('default', ['config-dev', 'bump-build']);

// пересобрать в dev версии
gulp.task('dev', ['config-dev', 'build']);
// пересобрать в production версии
gulp.task('prod', ['config-prod', 'build']);