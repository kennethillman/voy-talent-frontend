
const path          = require('path');

const conf          = require('../config')
const confWP      = require('../configWordpress')


//////////////////////////////////////////////////////
/// WP COPY FONTS
//////////////////////////////////////////////////////

module.exports = function(gulp, $) {
    return function () {
    let stream =

    gulp.src(conf.fonts.src)

      //.pipe($.using())
      .pipe(gulp.dest($.path.join(confWP.wp.assets, 'styles')))


    return stream;
    };
};


