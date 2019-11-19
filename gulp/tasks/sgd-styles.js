
const path          = require('path');

const confSgd       = require('../configStyleguide')


//////////////////////////////////////////////////////
/// STYLEGUIDE - STYLES
//////////////////////////////////////////////////////

module.exports = function(gulp, $) {
    return function () {
    let stream =

    gulp.src(confSgd.styles)

      //.pipe($.using())
      .pipe(
      $.sass({
        onError: function(err) {
          return notify().write(err);
        }
      })
    )
    .pipe(gulp.dest(path.join(confSgd.dist.assets, 'dest/css/')))
    .pipe($.browserSync.stream());

    return stream;
    };
};
