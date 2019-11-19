
const path          = require('path');
const confSgd       = require('../configStyleguide')

//////////////////////////////////////////////////////
/// STYLEGUIDE - SCRIPTS
//////////////////////////////////////////////////////

module.exports = function(gulp, $) {
    return function () {
    let stream =

    gulp.src(confSgd.scripts)
    .pipe($.using())
    .pipe($.concat("index.js"))
    .pipe(gulp.dest(path.join(confSgd.dist.assets, '/dest/js/')))
    .pipe($.browserSync.stream());

    return stream;
    };
};
