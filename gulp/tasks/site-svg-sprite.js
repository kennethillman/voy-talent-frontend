
const path          = require('path');

const conf          = require('../config')
const confSgd       = require('../configStyleguide')

let spriteConfig = {
        shape:     {
            id: {
                generator: 'voy-', // set the symbol id (%s == filename without extension)
            },
        },
        mode:      {
            symbol: { // use the «symbol» mode: https://github.com/jkphl/svg-sprite/blob/master/docs/configuration.md#defs--symbol-mode
                dest:       '.', // make output destination relative to «gulp.dest()»
                dimensions: '%s', // don't add the default "-dims" string, just use the value from «prefix»
                prefix:     '%s', // selectors used in SCSS output
                sprite:     'svg-sprite.svg', // .svg sprite output path
            },
        },
    };


//////////////////////////////////////////////////////
/// SVG SPRITE
//////////////////////////////////////////////////////

module.exports = function(gulp, $) {
    return function () {
    let stream =

    gulp.src(conf.svg.icons)


      // .pipe($.using())
      .pipe($.svgSprite(spriteConfig))
      .pipe(gulp.dest(path.join(conf.dev.src, '')))
      .pipe(gulp.dest(path.join(conf.dist.src, '')))


    return stream;
    };
};



