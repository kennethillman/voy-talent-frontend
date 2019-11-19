
const path          = require('path');

const conf          = require('../config')
const confWP      = require('../configWordpress')


//////////////////////////////////////////////////////
/// WP COPY SCRIPTS
//////////////////////////////////////////////////////

module.exports = function(gulp, $) {
    return function () {
    let stream =

    gulp.src("./voy-styleguide/assets/dest/js/VOY.js")

      .pipe($.using())
      .pipe($.flatten())
      .pipe(gulp.dest($.path.join(confWP.wp.assets, 'scripts')))


    return stream;
    };
};


