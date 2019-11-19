
const conf          = require('../config')


//////////////////////////////////////////////////////
/// LINT STYLES
//////////////////////////////////////////////////////

module.exports = function(gulp, $) {
    return function () {
    let stream =

    gulp.src(conf.linting.styles)

      //.pipe($.using())
      .pipe($.sassLint())
      .pipe($.sassLint.format())
      .pipe($.sassLint.failOnError())

    return stream;
    };
};
