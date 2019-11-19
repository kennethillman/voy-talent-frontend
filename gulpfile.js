"use strict";

const gulp = require("gulp");

// Load all required plugins (listed in package.json)
const $ = require("gulp-load-plugins")({
  pattern: "*"
});

// console.log($); // Logs loaded plugins in terminal


/////////////////////////////////////////////////////////////////
// CONFIGS
/////////////////////////////////////////////////////////////////

const conf           = require('./gulp/config')
const confSgd        = require('./gulp/configStyleguide')

// Extras
const confVendors    = require('./gulp/configVendors')
const confWP         = require('./gulp/configWordpress')


/////////////////////////////////////////////////////////////////
// LINT
/////////////////////////////////////////////////////////////////

// Linters
// gulp.task("lint-styles", () =>
//   gulp
//     .src(["./voy-styleguide/assets/scss/**/*.scss", "!assets/scss/vendor/**/*.scss"])
//     .pipe($.sassLint())
//     .pipe($.sassLint.format())
//     .pipe($.sassLint.failOnError())
// );

// gulp.task("lint-scripts", () =>
//   gulp
//     .src(["./voy-styleguide/assets/js/**/*.js", "!node_modules/**"])
//     .pipe($.eslint())
//     .pipe($.eslint.format())
//     .pipe($.eslint.failAfterError())
// );


/////////////////////////////////////////////////////////////////
// MERGE (Concat)
/////////////////////////////////////////////////////////////////

// Merge and minify files
// gulp.task("sgd-concat-styles", () =>
//   gulp
//     .src(["./voy-styleguide/assets/css/index.css", "./voy-styleguide/assets/css/vendor/**/*.css"])
//     .pipe($.sourcemaps.init())
//     .pipe($.concat("styles.css"))
//     .pipe($.minifyCss())
//     .pipe(
//       $.rename({
//         suffix: ".min"
//       })
//     )
//     .pipe(
//       $.autoprefixer({
//         browsers: ["last 2 versions"],
//         cascade: false
//       })
//     )
//     .pipe($.sourcemaps.write())
//     .pipe(gulp.dest("./voy-styleguide/assets/dist/css/"))
// );

// // Merge and minify files
// gulp.task("ds-concat-styles", () =>
//   gulp
//     .src(["./voy-styleguide/assets/css/index.css"])
//     .pipe($.sourcemaps.init())
//     .pipe($.concat("styles.css"))
//     .pipe($.minifyCss())
//     .pipe(
//       $.rename({
//         suffix: ".min"
//       })
//     )
//     .pipe(
//       $.autoprefixer({
//         browsers: ["last 2 versions"],
//         cascade: false
//       })
//     )
//     .pipe($.sourcemaps.write())
//     .pipe(gulp.dest("./voy-styleguide/assets/dist/css/"))
// );

// gulp.task("concat-js", () =>
//   gulp
//     .src(["./voy-styleguide/assets/js/index.js", "./voy-styleguide/assets/js/vendor/**/*.js"])
//     .pipe($.sourcemaps.init())
//     .pipe($.concat("bundle.js"))
//     .pipe($.uglify())
//     .pipe(
//       $.rename({
//         suffix: ".min"
//       })
//     )
//     .pipe($.sourcemaps.write())
//     .pipe(gulp.dest("./voy-styleguide/assets/dist/js/"))
// );

// // Gulp tasks
// gulp.task("watch", ["browser-sync"], () => {
//   // Watch sass files
//   gulp.watch(["./voy-styleguide/assets/**/*.scss", "./voy-ds/**/*.scss"], ["styles-all", reload]);

//   // Watch js files
//   gulp.watch(["./voy-styleguide/assets/**/*.js","./voy-ds/**/*.js"], ["scripts-ds", reload]);

//   // Watch njk files
//   gulp.watch(
//     ["./voy-styleguide/pages/**/*.+(html|njk)", "./voy-styleguide/templates/**/*.+(html|njk)"],
//     ["njk", reload]
//   );
// });


/////////////////////////////////////////////////////////////////
// GET TASKS
/////////////////////////////////////////////////////////////////

function getTask(task) {
  return require('./gulp/tasks/' + task)(gulp, $);
}

// Global
                                getTask('a--fix-pipe')
gulp.task('copy-fonts',         getTask('copy-fonts'));
gulp.task('clean',              getTask('clean'));

// Site
gulp.task('site-styles',        getTask('site-styles'));
gulp.task('site-scripts',       getTask('site-scripts'));
gulp.task('site-lint-styles',   getTask('site-lint-styles'));
gulp.task('site-lint-scripts',  getTask('site-lint-scripts'));
gulp.task('site-svg-sprite',    getTask('site-svg-sprite'));

// Styleguide
gulp.task('sgd-nunjucks',       getTask('sgd-nunjucks'));
gulp.task('sgd-styles',         getTask('sgd-styles'));
gulp.task('sgd-scripts',        getTask('sgd-scripts'));
gulp.task('sgd-browser-sync',   getTask('sgd-browser-sync'));
gulp.task('sgd-watch',          getTask('sgd-watch'));

// Wordpress
gulp.task('wp-copy-fonts',              getTask('wp-copy-fonts'));
gulp.task('wp-copy-scripts-core',       getTask('wp-copy-scripts-core'));
gulp.task('wp-copy-scripts-vendor',     getTask('wp-copy-scripts-vendor'));
gulp.task('wp-copy-scripts-polyfills',  getTask('wp-copy-scripts-polyfills'));
gulp.task('wp-copy-styles',             getTask('wp-copy-styles'));
gulp.task('wp-copy-svg',                getTask('wp-copy-svg'));


/////////////////////////////////////////////////////////////////
// GROUPED TASKS
/////////////////////////////////////////////////////////////////

gulp.task("styles-all", gulp.parallel(["site-styles", "sgd-styles"]));
gulp.task("scripts-all", gulp.parallel(["site-scripts", "sgd-scripts"]));


/////////////////////////////////////////////////////////////////
// DEFAULT
/////////////////////////////////////////////////////////////////

gulp.task('wp',
  gulp.series("site-svg-sprite", "site-styles", "sgd-styles", "site-scripts", "sgd-scripts", gulp.parallel(['wp-copy-fonts','wp-copy-styles','wp-copy-svg','wp-copy-scripts-core','wp-copy-scripts-vendor','wp-copy-scripts-polyfills']))
);

gulp.task('default',
  gulp.series('clean', gulp.parallel("copy-fonts", "site-svg-sprite", "site-styles", "sgd-styles", "site-scripts", "sgd-scripts", "sgd-browser-sync", "sgd-watch"),
  function() {done()})
);


// --------------------------------------- Default Gulp Task
// gulp.task('default', gulp.series(
//   gulp.parallel('sass', 'ts'), 'sync')
// );

// ---------------------------------------------- gulp build
// vendors - task which moves and operates on node_modules
// and bower_components dependencies
// moveDist: moves dist folder to another location
// on the file system (useful for multiple repos e.g. gh-pages)
// gulp.task('build', gulp.series('clean',
//   gulp.parallel('scripts', 'styles', 'html'), 'vendors', 'moveDist')
// );



