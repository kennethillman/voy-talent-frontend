
const path          = require('path');

const conf          = require('../config')
const confSgd       = require('../configStyleguide')


//////////////////////////////////////////////////////
/// STYLEGUIDE - NUNJUCKS
//////////////////////////////////////////////////////

module.exports = function(gulp, $) {
    return function () {
    let stream =

    gulp
      .src(confSgd.nunjucks.src)
      .pipe($.using())
      // Adding data to Nunjucks
      // .pipe(
      //   $.data(() => {
      //     return require(confSgd.nunjucks.data); // NOT WORKING
      //   })
      // )
      // Renders template with nunjucks
      .pipe(
        $.nunjucksRender({
          path: confSgd.nunjucks.path
        })
      )
      // output files in app folder
      .pipe(gulp.dest(path.join(confSgd.dist.src, '')))
      .pipe($.browserSync.stream());


    return stream;
    };
};

