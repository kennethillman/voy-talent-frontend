/////////////////////////////////////////////////////////////////
// CONFIG
/////////////////////////////////////////////////////////////////

const env = require("yargs");

module.exports = {
  prod: env.argv.prod, // $ gulp --prod === true
  styles: {
        src:        './voy-ds/voy-ds.scss',
        print:      '',
        critical:   '',
        css:        './voy--*/**/*.+(css|map)',
    },
    scripts: {
        src:        './voy-ds/ds--js/VOY.js',
        polyfills:  './voy-ds/ds--js/polyfills/*.js',
        vendor:     './voy-ds/ds--js/vendor/*.js',
        merged:     './voy-styleguide/assets/dest/js/*.js',
        inline:     {
            src: '',
            dist: ''
          }
    },
    linting: {
        styles:     './voy-ds/**/*.scss',
        scripts:    './voy-ds/**/*.js',
    },
    svg: {
      icons:        './voy-ds/ds-assets/svg/icons/*.svg',
      sprite:       './voy--dev/**/*.svg',
    },
    fonts: {
      src:          './voy-ds/ds-assets/fonts/*.*'
    },
    dev:     {
        src: './voy--dev/',
        assets: './voy--dev/assets/'
    },
    dist:     {
        src: './voy--dist/',
        assets: './voy--dist/assets/'
    }

}
