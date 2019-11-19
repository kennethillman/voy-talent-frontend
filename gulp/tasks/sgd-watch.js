
const confSgd       = require('../configStyleguide')


//////////////////////////////////////////////////////
/// STYLEGUIDE - WATCH
//////////////////////////////////////////////////////

module.exports = function(gulp, $) {
    return function () {

    const reload = $.browserSync.reload

    console.log('STYLEGUIDE - WATCH');

    let stream =

      // Watch scss files
      gulp.watch(confSgd.watch.styles, gulp.parallel(["styles-all"]));

      // Watch js files
      gulp.watch(confSgd.watch.scripts, gulp.parallel(["scripts-all"]));

      // Watch template files
      gulp.watch(confSgd.watch.templates, gulp.parallel(["sgd-nunjucks"]));

      /*
          (i) -> Each task above is ending with ".pipe($.browserSync.stream());"
                 Thats the key for browsersync to live update the screen
      */

    return stream;
    };
};

