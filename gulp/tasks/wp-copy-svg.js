
const path        = require('path');

const conf        = require('../config')
const confWP      = require('../configWordpress')


//////////////////////////////////////////////////////
/// WP COPY SVG
//////////////////////////////////////////////////////

module.exports = function(gulp, $) {
    return function () {
    let stream =

    gulp.src(conf.svg.sprite)

      // .pipe($.using())
      .pipe($.flatten())
      .pipe(gulp.dest($.path.join(confWP.wp.assets, 'svg')))

    return stream;
    };
};


