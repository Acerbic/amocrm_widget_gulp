const gulp = require('gulp');
const runSequence = require('run-sequence');
const zip = require('gulp-zip');
const bump = require('gulp-bump');
const template = require('gulp-template');
const merge2 = require('merge2');

/**
 * Сюда будет загружена конфигурация из файла
 * config.json, выбранная на основании переменной
 * окружения NODE_ENV
 */
let config;

/**
 * Поднимаем версию виджета в манифесте
 */
gulp.task('bump', function () {
    return gulp.src('./widget-src/manifest.json')
        .pipe(bump({key: {widget: 'version'}}))
        .pipe(gulp.dest('./widget-src/'));
});

/**
 * На основании загруженной конфигурации собираем виджет
 */
gulp.task('build', ['config'], function () {

    // в манифест подставляем значения из конфигурации
    let manifest = gulp.src('./widget-src/manifest.json')
        .pipe(template({
            widget_code: config.widget_code,
            widget_secret_key: config.widget_secret_key,
        }));

    // Все остальные файлы (кроме манифеста) - просто копируем как есть
    let other = gulp.src(['./widget-src/**', '!./widget-src/manifest.json']);

    // Собираем обработанные файлы в один поток, зипуем и сохраняем
    return merge2(manifest, other)
        .pipe(zip('widget.zip'))
        .pipe(gulp.dest('./build'));
});

/**
 * сперва запускаем bump, затем build.
 * Эта задача завершается, когда завершается build
 */
gulp.task('bump-build', function (done) {
    return runSequence('bump', 'build', done);
});

/**
 * Выбираем конфигурацию сборки из config.json
 */
gulp.task('config', function (done) {
    let env = process.env.NODE_ENV === undefined ? "development" : process.env.NODE_ENV;
    let configfile = require('./config.json');
    if (configfile[env] === undefined) {
        throw "no config can be loaded for " + env;
    }
    config = configfile[env];
    done();
});