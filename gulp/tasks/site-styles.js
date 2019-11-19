
const path          = require('path');

const confSgd       = require('../configStyleguide')
const conf          = require('../config')


//////////////////////////////////////////////////////
/// SITE - LINT STYLES
//////////////////////////////////////////////////////

module.exports = function(gulp, $) {
    return function () {
    let stream =

    gulp.src(conf.styles.src)

      .pipe($.using())
      .pipe($.sourcemaps.init())
      .pipe(
        $.sass({
          outputStyle: 'compact',
          onError: function(err) {
            return notify().write(err);
          }
        })
      )
      .pipe($.if(conf.prod, $.minifyCss()))
      .pipe($.if(conf.prod, $.rename({ suffix: '.min' })))
      .pipe($.if(conf.prod, $.sourcemaps.write('.'), $.sourcemaps.write()))
      .pipe(gulp.dest(path.join(confSgd.dist.assets, 'dest/css/')))
      .pipe($.if(!conf.prod, gulp.dest(path.join(conf.dev.assets, '/styles/')), gulp.dest(path.join(conf.dist.assets, '/styles/'))))



    return stream;
    };
};


