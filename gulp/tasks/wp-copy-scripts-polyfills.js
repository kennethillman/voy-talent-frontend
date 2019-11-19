
const path          = require('path');

const conf          = require('../config')
const confWP      = require('../configWordpress')


//////////////////////////////////////////////////////
/// WP COPY SCRIPTS
//////////////////////////////////////////////////////

module.exports = function(gulp, $) {
    return function () {
    let stream =

    gulp.src(conf.scripts.polyfills)

      //.pipe($.using())
      .pipe($.flatten())
      .pipe(gulp.dest($.path.join(confWP.wp.assets, 'scripts/polyfills')))

    return stream;
    };
};


