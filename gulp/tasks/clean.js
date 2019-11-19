
const path          = require('path');
const del           = require('del');

const confSgd       = require('../configStyleguide')
const conf          = require('../config')



//////////////////////////////////////////////////////
/// CLEAN
//////////////////////////////////////////////////////

module.exports = function(gulp, $) {
    return function (cb) {
    var stream =

        del([conf.dist.src,conf.dev.src, path.join(confSgd.dist.assets, '/dest/css/'), path.join(confSgd.dist.assets, '/dest/js/')], cb);

    return stream;
    };
};
