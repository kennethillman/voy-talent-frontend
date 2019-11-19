
const path          = require('path');

const conf          = require('../config')
const confWP      = require('../configWordpress')


//////////////////////////////////////////////////////
/// WP COPY STYLES
//////////////////////////////////////////////////////

module.exports = function(gulp, $) {
    return function () {
    let stream =

    gulp.src(conf.styles.css)

      //.pipe($.using())
      .pipe($.flatten())
      .pipe(gulp.dest($.path.join(confWP.wp.assets, '/styles')))

    return stream;
    };
};


