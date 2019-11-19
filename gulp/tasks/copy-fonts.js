
const path          = require('path');

const conf          = require('../config')
const confSgd       = require('../configStyleguide')


//////////////////////////////////////////////////////
/// COPY FONTS
//////////////////////////////////////////////////////

module.exports = function(gulp, $) {
    return function () {
    let stream =

    gulp.src(conf.fonts.src)

      //.pipe($.using())
      .pipe(gulp.dest(path.join(confSgd.dist.assets, 'dest/css/')))
      .pipe(gulp.dest(path.join(conf.dev.assets, '/styles/')))
      .pipe(gulp.dest(path.join(conf.dist.assets, '/styles/')))

    return stream;
    };
};


