
const path          = require('path');

const confSgd       = require('../configStyleguide')
const conf          = require('../config')


//////////////////////////////////////////////////////
/// SITE - SCRIPTS
//////////////////////////////////////////////////////

module.exports = function(gulp, $) {
    return function () {
    let stream =

    gulp.src(conf.scripts.src)

      .pipe($.using())
      .pipe($.fileInclude())
      .pipe(gulp.dest("./voy-styleguide/assets/dest/js/"))

    return stream;
    };
};
