/////////////////////////////////////////////////////////////////
// CONFIG
/////////////////////////////////////////////////////////////////

module.exports = {
    browserSync: {
        opts: {
            baseDir:  './voy-styleguide',
            port:     4000
        },
        watch: [
            // './voy-styleguide/**/*.js',
            './voy-styleguide/**/*.html'
        ]
    },
    nunjucks: {
      src: './voy-styleguide/pages/**/*.+(html|njk)',
      data: '/voy-styleguide/data.json',
      path: './voy-styleguide/templates'
    },
    watch: {
      // styles: ["./voy-styleguide/assets/**/*.scss", "./voy-ds/**/*.scss"],
      styles: ["./voy-styleguide/assets/scss/**/*.scss", "./voy-ds/**/*.scss"],
      // scripts: ["./voy-styleguide/assets/**/*.js","./voy-ds/**/*.js"],
      scripts: ["./voy-styleguide/assets/js/**/*.js","./voy-ds/**/*.js"],
      templates: ["./voy-styleguide/pages/**/*.+(html|njk)", "./voy-styleguide/templates/**/*.+(html|njk)"],
      browserSyncReload: []
    },
    styles:   './voy-styleguide/assets/scss/sgd.scss',
    scripts:   './voy-styleguide/assets/js/*.js',




  //dist:     {'./voy-styleguide/assets/dest/css/'
   dist:     {
        src: './voy-styleguide/',
        assets: './voy-styleguide/assets/'
    }



    // gulp tasks based on environment

// -------------------------------------------- autoprefixer
    // autoprefixer: {
    //     opts: {
    //         browsers: ['last 3 versions']
    //     }
    // },
// --------------------------------------------- browsersync
    // browsersync: {
    //     opts: {
    //         server: './src/'
    //     },
    //     watch: [
    //         './src/assets/styles/css/**/*.css',
    //         './src/assets/scripts/js/**/*.js',
    //         './src/**/*.html'
    //     ]
    // },
// --------------------------------------------------- clean
    // clean: {
    //     folders: [
    //         './dist/'
    //     ]
    // },



}
