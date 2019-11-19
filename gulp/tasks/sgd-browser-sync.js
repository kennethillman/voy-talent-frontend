
const confSgd       = require('../configStyleguide')


//////////////////////////////////////////////////////
/// STYLEGUIDE - BROWSER SYNCSTYLEGUIDE - BROWSER SYNC
//////////////////////////////////////////////////////

module.exports = function(gulp, $) {
    return function () {

    console.log('STYLEGUIDE - BROWSER SYNC');

    let stream =

    $.browserSync.init({
      server: {
        baseDir: confSgd.browserSync.opts.baseDir
      },
      port: confSgd.browserSync.opts.port
    });

    return stream;
    };
};



