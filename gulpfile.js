const gulp = require('gulp');
const runSequence = require('run-sequence');
const zip = require('gulp-zip');
const bump = require('gulp-bump');
const template = require('gulp-template');
const merge2 = require('merge2');

let config;

/**
 * Поднимаем версию виджета в манифесте
 */
gulp.task('bump', function () {
    return gulp.src('./src/manifest.json')
        .pipe(bump({key: {widget: 'version'}}))
        .pipe(gulp.dest('./src/'));
});

/**
 * На основании загруженной конфигурации собираем виджет
 */
gulp.task('build', ['config'], function () {

    // в манифест подставляем значения из конфигурации
    let manifest = gulp.src('src/manifest.json')
        .pipe(template({
            widget_code: config.widget_code,
            widget_secret_key: config.widget_secret_key,
        }));

    // Все остальные файлы (кроме манифеста) - просто копируем как есть
    let other = gulp.src(['src/**', '!src/manifest.json']);

    // Собираем обработанные файлы в один поток, зипуем и сохраняем
    return merge2(manifest, other)
        .pipe(zip('widget.zip'))
        .pipe(gulp.dest('./build'));
});

gulp.task('bump-build', function (done) {
    return runSequence('bump', 'build', done);
});

/**
 * Выбираем конфигурацию сборки из config.json
 */
gulp.task('config', function (done) {
    let configfile = require('./config.json');
    if (configfile[process.env.NODE_ENV] === undefined) {
        throw "no config can be loaded for " + process.env.NODE_ENV;
    }
    config = configfile[process.env.NODE_ENV];
    done();
});