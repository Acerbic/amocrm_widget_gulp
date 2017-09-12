const gulp = require('gulp');
const zip = require('gulp-zip');
const bump = require('gulp-bump');
// const dotenv = require('dotenv');
const Q = require('q');
const template = require('gulp-template');
const gulpmerge = require('merge2');

var config_loaded = Q.defer();
var config;

gulp.task('bump', function() {
    gulp.src('src/manifest.json')
        .pipe(bump({key: {widget: 'version'}}))
        .pipe(gulp.dest('src/'));
});

var buildfunction = function() {
    // берём все файлы и запаковываем

    // но перед этим в манифест подставляем значения из файлов
    // конфигурации
    var manifest = gulp.src('src/manifest.json')
        .pipe(template({
            widget_code: config.widget_code,
            widget_secret_key: config.widget_secret_key,
        }));

    var other = gulp.src(['src/**', '!src/manifest.json']);

    gulpmerge(manifest, other)
        .pipe(zip('widget.zip'))
        .pipe(gulp.dest('./build'));
};

gulp.task('build', ['config'], buildfunction);

gulp.task('bump-build', ['config', 'bump'], buildfunction);

gulp.task('default', ['config-dev', 'bump-build']);

gulp.task('config', function() {return config_loaded.promise;});
gulp.task('config-dev', function() {
    config = require('./config/development.json');
    config_loaded.resolve();
});
gulp.task('config-prod', function() {
    config = require('./config/production.json');
    config_loaded.resolve();
});

gulp.task('dev', ['config-dev', 'build']);
gulp.task('prod', ['config-prod', 'build']);