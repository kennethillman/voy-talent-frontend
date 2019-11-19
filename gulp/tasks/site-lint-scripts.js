
const conf          = require('../config')


//////////////////////////////////////////////////////
/// SITE - LINT SCRIPTS
//////////////////////////////////////////////////////

module.exports = function(gulp, $) {
    return function () {
    let stream =

    gulp.src(conf.linting.scripts)

      //.pipe($.using())
      .pipe($.eslint())
      .pipe($.eslint.format())
      .pipe($.eslint.failAfterError())

    return stream;
    };
};

