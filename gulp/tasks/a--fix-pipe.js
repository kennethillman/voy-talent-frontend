





const fixPipe = function (stream) {

    var origPipe = stream.pipe;
    stream.pipe = function (dest) {
        arguments[0] = dest.on('error', function (error) {
            var nextStreams = dest._nextStreams;
            if (nextStreams) {
                nextStreams.forEach(function (nextStream) {
                    nextStream.emit('error', error);
                });
            } else if (dest.listeners('error').length === 1) {
                throw error;
            }
        });
        var nextStream = fixPipe(origPipe.apply(this, arguments));
        (this._nextStreams || (this._nextStreams = [])).push(nextStream);
        return nextStream;
    };
    return stream;
}

module.exports = function(gulp, $) {
    return function () {

    let origSrc = gulp.src;

    let stream =


    gulp.src = function () {
        return fixPipe(origSrc.apply(this, arguments));
    };



    return stream;
    };
};
