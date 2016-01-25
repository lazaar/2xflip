'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var config = require('../build/config/config');
var replace = require('gulp-replace-task');

gulp.task('config', function (done) {

    gutil.log(gutil.colors.green('Configuration de l\'environnment : ', config.get('env')));

    gulp.src('build/config/templates/configConstantes.js')
        .pipe(replace({
            patterns: [
                {
                    match      : 'logDebug',
                    replacement: config.get('logDebug')
                }
            ]
        }))
        .pipe(gulp.dest('src/app/constants/'))
        .on('end', done);
});