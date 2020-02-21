const gulp = require('gulp'),
    watch = require('gulp-watch'),
    minCss = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    babel = require('gulp-babel'),
    babelminify = require('gulp-babel-minify'),
    log = require('fancy-log'),
    rebaseUrls = require('gulp-css-rebase-urls'),
    replace = require('gulp-replace'),
    fs = require('fs'),
    _ = require('underscore');

var pathConfig = {
        path: '../'
    },
    config = require('./gulpconfig.js'),
    buildCssImport = function (files, instance) {
        var backendFileNm = 'app';
        var file = '';
        instance.cssFilesWPath.forEach(function (value) {
            if (value.charAt(0) != '!') {
                file = file + '\n' + '@import url(\'' + value.replace(pathConfig.path, '') + '\');';
            }
        });
        console.log(file);
        fs.writeFileSync('/' + backendFileNm + '.css', file);
    },
    buildJsImport = function (instance) {
        fs.writeFileSync(pathConfig.path + instance.jsDest + '/app.js.json', JSON.stringify(instance.libJsFiles.concat(instance.jsFiles)));
    };


function buildCss(instance, index) {
    var backendFileNm = 'app';
    console.log('Running build-css for index ' + index);
    buildCssImport(instance.cssFilesWPath, instance);
    return gulp.src(instance.cssFilesWPath)
        .pipe(rebaseUrls())
        .pipe(replace(pathConfig.path, '/'))
        .pipe(autoprefixer({browsers: ['firefox esr', 'last 4 versions']}))
        .pipe(concat(backendFileNm + '.min.css'))
        .pipe(minCss())
        .pipe(gulp.dest(pathConfig.path + instance.cssDest))
        .on('end', function () {
            log('Completed CSS Files for index ' + index);
        });

};


function buildJs(instance, index) {
    var backendFileNm = 'app';
    console.log('Running build-js for index ' + index);
    buildJsImport(instance);
    gulp.src(instance.jsFilesWPath, {allowEmpty: true})
        .on('error', function () {
            this.emit('end');
        }).pipe(babel({
        presets: [['@babel/preset-env']],
        ignore: [
            "*"
        ]
    }), {allowEmpty: true})
        .pipe(concat(backendFileNm + '-js.js'), {allowEmpty: true})
        .pipe(babelminify(), {allowEmpty: true})
        .pipe(gulp.dest(pathConfig.path + instance.jsDest), {allowEmpty: true})
        .on('end', function () {
            log('Completed Primary JS Files for index ' + index);
        });

    gulp.src(instance.libJsFilesWPath, {allowEmpty: true})
        .on('error', function () {
            this.emit('end');
        })
        .pipe(concat(backendFileNm + '-lib.js'), {allowEmpty: true})
        .pipe(gulp.dest(pathConfig.path + instance.jsDest), {allowEmpty: true})
        .on('end', function () {
            log(instance.libJsFilesWPath);
            log('Completed Lib JS Files for index ' + index);
        });
    gulp.src([('../tugthr_dev/js/app-lib.js'), ('../tugthr_dev/js/app-js.js')], {allowEmpty: true})
        .on('error', function () {
            this.emit('end');
        })
        .pipe(concat('app.min.js'), {allowEmpty: true})
        .pipe(gulp.dest(pathConfig.path + instance.jsDest), {allowEmpty: true})
        .on('end', function () {
            log('Completed Primary JS Files for index ' + index);
        });
}

function setUp(instance) {
    cssFilesWPath = [];
    jsFilesWPath = [];
    libJsFilesWPath = [];
    instance.cssFiles.forEach(function (cssFile) {
        cssFilesWPath.push(pathConfig.path + cssFile);
    });
    instance.jsFiles.forEach(function (jsFile) {
        jsFilesWPath.push(pathConfig.path + jsFile);
    });
    instance.libJsFiles.forEach(function (jsFile) {
        libJsFilesWPath.push('../tugthr_dev' + jsFile);
    });
    instance.cssFilesWPath = cssFilesWPath;
    instance.jsFilesWPath = jsFilesWPath;
    instance.libJsFilesWPath = libJsFilesWPath;
}


gulp.task('watch', function () {
    console.log('restarting watch');
    gulp.watch('./gulpconfig.js', {interval: 2000}, process.exit);
    gulp.watch('./gulpfile.js', {interval: 2000}, process.exit);

    config.instances.forEach(function (instance, index) {
        console.log('Starting Instance');
        setUp(instance);
        buildJs(instance, index);
        buildCss(instance, index);
        gulp.watch(
            instance.cssFilesWPath, {interval: 2000},
            function () {
                buildCss(instance, index);
            }
        );
        gulp.watch(
            instance.jsFilesWPath,
            {interval: 2000},
            function () {
                buildJs(instance, index);
            }
        );
    });
});

