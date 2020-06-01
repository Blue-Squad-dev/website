const gulp = require('gulp'),
    watch = require('gulp-watch'),
    minCss = require('gulp-clean-css')
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
        var backendFileNm = instance.appFileNm ? instance.appFileNm : 'app';
        var file = '';
        instance.cssFilesWPath.forEach(function(value) {
            if (value.charAt(0) != '!') {
                file = file + '\n' + '@import url(\'/' + value.replace(pathConfig.path, '')  + '\');';
            }
        });
        fs.writeFileSync(pathConfig.path  + instance.cssDest + '/' + backendFileNm + '.css', file);
    },
    buildJsImport = function (instance) {
        var backendFileNm = instance.appFileNm ? instance.appFileNm : 'app';
        fs.writeFileSync(pathConfig.path  + instance.jsDest + '/' + backendFileNm + '.js.json', JSON.stringify(instance.libJsFiles.concat(instance.jsFiles)));
    };


async function buildCss(instance, index){
    var backendFileNm = instance.appFileNm ? instance.appFileNm : 'app';
    console.log('Running build-css for index ' + index);
    console.log(pathConfig.path + instance.cssDest);
    buildCssImport(instance.cssFilesWPath, instance);
    return gulp.src(instance.cssFilesWPath)
        .pipe(rebaseUrls())
        .pipe(replace(pathConfig.path, '/'))
        .pipe(autoprefixer())
        .pipe(concat(backendFileNm  + '.min.css'))
        .pipe(minCss())
        .pipe(gulp.dest(pathConfig.path + instance.cssDest))
        .on('end', function(){ log('Completed CSS Files for index ' + index); });

};


async function buildJs(instance, index){
    var backendFileNm = instance.appFileNm ? instance.appFileNm : 'app';
    console.log('Running build-js for index ' + index);
    buildJsImport(instance);
    gulp.src(instance.jsFilesWPath)
        .on('error', function () {
            console.log(error.toString());
            this.emit('end');
        }).pipe(babel({
            presets: [['@babel/preset-env']],
            ignore: [
                "*"
            ]
        }))
        .pipe(concat(backendFileNm + '-js.js'))
        .pipe(babelminify())
        .pipe(gulp.dest(pathConfig.path + instance.jsDest))
        .on('end', function(){ log('Completed Primary JS Files for index ' + index); });

    gulp.src(instance.libJsFilesWPath)
        .on('error', function () {
            console.log(error.toString());
            this.emit('end');
        })
        .pipe(concat(backendFileNm +'-lib.js'))
        .pipe(gulp.dest(pathConfig.path + instance.jsDest))
        .on('end', function(){ log('Completed Lib JS Files for index ' + index); });

    gulp.src([
        (pathConfig.path + instance.jsDest + 'app-lib.js'),
        (pathConfig.path + instance.jsDest + 'app-js.js'),
        ])
        .on('error', function (error) {
            console.log(error.toString());
            this.emit('end');
        })
        .pipe(concat(backendFileNm +'.min.js'))
        .pipe(gulp.dest(pathConfig.path + instance.jsDest))
        .on('end', function(){ log('Completed Combined JS File for index ' + index); });
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
        libJsFilesWPath.push(pathConfig.path + jsFile);
    });


    instance.cssFilesWPath = cssFilesWPath;
    instance.jsFilesWPath = jsFilesWPath;
    instance.libJsFilesWPath = libJsFilesWPath;
}


gulp.task('watch', function() {
    console.log('restarting watch');
    gulp.watch('./gulpconfig.js',{ interval: 2000}, process.exit);
    gulp.watch('./gulpfile.js',{ interval: 2000}, process.exit);

    config.instances.forEach(function (instance, index) {
        console.log('Starting Instance');
        setUp(instance);
        buildJs(instance, index);
        buildCss(instance, index);
		try {
			gulp.watch(
				instance.cssFilesWPath, {interval: 2000},
				function () {
					try {
						buildCss(instance, index);
					} catch(error) {
						console.log(error);
					}
				}
			);
		} catch(error) {
			console.log(error);
		}
		try {
			gulp.watch(
				instance.jsFilesWPath,
				{interval: 2000},
				function () {
					try {
					 buildJs(instance, index);
					} catch(error) {
						console.log(error);
					}
				   
				}
			);
		} catch(error) {
			console.log(error);
		}
    });
});
