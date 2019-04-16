"use strict";

const gulp = require("gulp");

// Load all required plugins (listed in package.json)
const $ = require("gulp-load-plugins")({
  pattern: "*"
});

console.log($); // Logs loaded plugins in terminal

const reload = $.browserSync.reload;


/////////////////////////////////////////////////////////////////
// CONFIG
/////////////////////////////////////////////////////////////////


const config = {
    dev: $.yargs.argv.dev,
    prod: $.yargs.argv.prod,
    styles: {
        src:        './voy-ds/voy-ds.scss', 
        print:      '',
        critical:   '',
        styleguide: './voy-styleguide/assets/dest/css/',
        dev:        './voy--dev/styles/',
        dist:       './voy--dist/styles/',
    },
    scripts: {
        src:        [], 
        polyfills:  '',
        inline:     '',
        inlinedist: '', 
    },
    linting: {
        styles:     '', 
        scripts:    '', 
    },
    watch: {        
        scripts:    [],
        styles:     [],
    },
    svg: {
      icons:        './voy-ds/ds-assets/svg/icons/*.svg',
    },
    dev:            './voy--dev/',
    dist:           './voy--dist/'
}


/////////////////////////////////////////////////////////////////
// FIX GULP PIPE
// (i) -> ERROR HANDLING AND PIPE FIX FOR GULP SRC
/////////////////////////////////////////////////////////////////

let origSrc = gulp.src;

gulp.src = function () {
    return fixPipe(origSrc.apply(this, arguments));
};

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

/////////////////////////////////////////////////////////////////
// CLEAN
/////////////////////////////////////////////////////////////////

/*
  (i) -> WIP -> NEED SOME LOVE - 
  * When to clean what
*/

gulp.task('clean:dev', (cb) => $.del([config.dev], cb));
gulp.task('clean:dist', (cb) => $.del([config.dist], cb));
gulp.task('clean', ['clean:dev','clean:dist']);


/////////////////////////////////////////////////////////////////
// SVG SPRITE
/////////////////////////////////////////////////////////////////

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

gulp.task("svg-sprite", () =>
  gulp
    .src(config.svg.icons)
    .pipe($.using())
    .pipe($.svgSprite(spriteConfig))
    .pipe(gulp.dest(config.dev))
    .pipe(gulp.dest(config.dist))
);


/////////////////////////////////////////////////////////////////
// BROWSER SYNC
/////////////////////////////////////////////////////////////////

// Loads BrowserSync
gulp.task("browser-sync", () => {
  $.browserSync.init({
    server: {
      baseDir: "./voy-styleguide"
    }
  });
});

/////////////////////////////////////////////////////////////////
// NUNJUCKS
/////////////////////////////////////////////////////////////////

// Renders Nunjucks
gulp.task("njk", () =>
  // Gets .html and .njk files in pages
  gulp
    .src("./voy-styleguide/pages/**/*.+(html|njk)")
    // Adding data to Nunjucks
    .pipe(
      $.data(() => {
        return require("./voy-styleguide/data.json");
      })
    )
    // Renders template with nunjucks
    .pipe(
      $.nunjucksRender({
        path: ["./voy-styleguide/templates"]
      })
    )
    // output files in app folder
    .pipe(gulp.dest("./voy-styleguide"))
);


/////////////////////////////////////////////////////////////////
// STYLES
/////////////////////////////////////////////////////////////////

gulp.task("styles-sgd", () =>
  gulp
    .src("./voy-styleguide/assets/scss/index.scss")
    .pipe(
      $.sass({
        onError: function(err) {
          return notify().write(err);
        }
      })
    )
    .pipe(gulp.dest("./voy-styleguide/assets/dest/css/"))
);

gulp.task("styles-ds", () =>
  gulp
    .src(config.styles.src)
    .pipe($.sourcemaps.init())
    .pipe(
      $.sass({
        outputStyle: 'compact',
        onError: function(err) {
          return notify().write(err);
        }
      })
    )
    .pipe($.if(config.prod, $.minifyCss()))
    .pipe($.if(config.prod, $.rename({ suffix: '.min' })))
    .pipe($.if(config.prod, $.sourcemaps.write('.'), $.sourcemaps.write()))
    .pipe(gulp.dest(config.styles.styleguide))
    .pipe($.if(!config.prod, gulp.dest(config.styles.dev), gulp.dest(config.styles.dist)))
    
);

gulp.task("styles-all", ["styles-ds", "styles-sgd"]);


/////////////////////////////////////////////////////////////////
// SCRIPTS
/////////////////////////////////////////////////////////////////

// Compile JS
gulp.task("scripts", () =>
  gulp
    .src("./voy-styleguide/assets/js/**/*.js")
    .pipe($.concat("index.js"))
    .pipe(gulp.dest("./voy-styleguide/assets/dest/js/"))
);


/////////////////////////////////////////////////////////////////
// LINT
/////////////////////////////////////////////////////////////////

// Linters
gulp.task("lint-styles", () =>
  gulp
    .src(["./voy-styleguide/assets/scss/**/*.scss", "!assets/scss/vendor/**/*.scss"])
    .pipe($.sassLint())
    .pipe($.sassLint.format())
    .pipe($.sassLint.failOnError())
);

gulp.task("lint-scripts", () =>
  gulp
    .src(["./voy-styleguide/assets/js/**/*.js", "!node_modules/**"])
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError())
);


/////////////////////////////////////////////////////////////////
// MERGE (Concat)
/////////////////////////////////////////////////////////////////

// Merge and minify files
gulp.task("sgd-concat-styles", () =>
  gulp
    .src(["./voy-styleguide/assets/css/index.css", "./voy-styleguide/assets/css/vendor/**/*.css"])
    .pipe($.sourcemaps.init())
    .pipe($.concat("styles.css"))
    .pipe($.minifyCss())
    .pipe(
      $.rename({
        suffix: ".min"
      })
    )
    .pipe(
      $.autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false
      })
    )
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest("./voy-styleguide/assets/dist/css/"))
);

// Merge and minify files
gulp.task("ds-concat-styles", () =>
  gulp
    .src(["./voy-styleguide/assets/css/index.css"])
    .pipe($.sourcemaps.init())
    .pipe($.concat("styles.css"))
    .pipe($.minifyCss())
    .pipe(
      $.rename({
        suffix: ".min"
      })
    )
    .pipe(
      $.autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false
      })
    )
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest("./voy-styleguide/assets/dist/css/"))
);

gulp.task("concat-js", () =>
  gulp
    .src(["./voy-styleguide/assets/js/index.js", "./voy-styleguide/assets/js/vendor/**/*.js"])
    .pipe($.sourcemaps.init())
    .pipe($.concat("bundle.js"))
    .pipe($.uglify())
    .pipe(
      $.rename({
        suffix: ".min"
      })
    )
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest("./voy-styleguide/assets/dist/js/"))
);

// Gulp tasks
gulp.task("watch", ["browser-sync"], () => {
  // Watch sass files
  gulp.watch(["./voy-styleguide/assets/**/*.scss", "./voy-ds/**/*.scss"], ["styles-all", reload]);

  // Watch js files
  gulp.watch(["./voy-styleguide/assets/**/*.js","./voy-ds/**/*.js"], ["scripts", reload]);

  // Watch njk files
  gulp.watch(
    ["./voy-styleguide/pages/**/*.+(html|njk)", "./voy-styleguide/templates/**/*.+(html|njk)"],
    ["njk", reload]
  );
});


/////////////////////////////////////////////////////////////////
// GULP TASKS
/////////////////////////////////////////////////////////////////

gulp.task("build", [ "svg-sprite", "styles-all", "scripts", "merge"]); // Compile sass, concat and minify css + js
gulp.task("default", [ "svg-sprite", "styles-all", "scripts", "watch"]); // Default gulp task
gulp.task("lint", ["lint-styles", "lint-scripts"]); // Lint css + js files
gulp.task("merge", ["concat-styles", "concat-js"]); // Merge & minify css + js



