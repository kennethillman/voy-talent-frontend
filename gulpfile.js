"use strict";

const gulp = require("gulp");

// Load all required plugins (listed in package.json)
const plugins = require("gulp-load-plugins")({
  pattern: "*"
});

console.log(plugins); // Logs loaded plugins in terminal

const reload = plugins.browserSync.reload;

// Loads BrowserSync
gulp.task("browser-sync", () => {
  plugins.browserSync.init({
    server: {
      baseDir: "./voy-styleguide"
    }
  });
});

// Renders Nunjucks
gulp.task("njk", () =>
  // Gets .html and .njk files in pages
  gulp
    .src("./voy-styleguide/pages/**/*.+(html|njk)")
    // Adding data to Nunjucks
    .pipe(
      plugins.data(() => {
        return require("./voy-styleguide/data.json");
      })
    )
    // Renders template with nunjucks
    .pipe(
      plugins.nunjucksRender({
        path: ["./voy-styleguide/templates"]
      })
    )
    // output files in app folder
    .pipe(gulp.dest("./voy-styleguide"))
);

//////////////////////////////
// STYLEGUIDE
// - Compile Sass
//////////////////////////////

gulp.task("styles-sgd", () =>
  gulp
    .src("./voy-styleguide/assets/scss/index.scss")
    .pipe(
      plugins.sass({
        onError: function(err) {
          return notify().write(err);
        }
      })
    )
    .pipe(gulp.dest("./voy-styleguide/assets/dest/css/"))
);


//////////////////////////////
// DESIGN SYSTEM
// - Compile Sass
//////////////////////////////

gulp.task("styles-ds", () =>
  gulp
    .src("./voy-ds/voy-ds.scss")
    .pipe(
      plugins.sass({
        onError: function(err) {
          return notify().write(err);
        }
      })
    )
    .pipe(gulp.dest("./voy-styleguide/assets/dest/css/"))
);





gulp.task("styles-all", ["styles-ds", "styles-sgd"]);


// Compile JS
gulp.task("scripts", () =>
  gulp
    .src("./voy-styleguide/assets/js/**/*.js")
    .pipe(plugins.concat("index.js"))
    .pipe(gulp.dest("./voy-styleguide/assets/dest/js/"))
);

// Linters
gulp.task("lint-styles", () =>
  gulp
    .src(["./voy-styleguide/assets/scss/**/*.scss", "!assets/scss/vendor/**/*.scss"])
    .pipe(plugins.sassLint())
    .pipe(plugins.sassLint.format())
    .pipe(plugins.sassLint.failOnError())
);

gulp.task("lint-scripts", () =>
  gulp
    .src(["./voy-styleguide/assets/js/**/*.js", "!node_modules/**"])
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError())
);

// Merge and minify files
gulp.task("sgd-concat-styles", () =>
  gulp
    .src(["./voy-styleguide/assets/css/index.css", "./voy-styleguide/assets/css/vendor/**/*.css"])
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.concat("styles.css"))
    .pipe(plugins.minifyCss())
    .pipe(
      plugins.rename({
        suffix: ".min"
      })
    )
    .pipe(
      plugins.autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false
      })
    )
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest("./voy-styleguide/assets/dist/css/"))
);


// Merge and minify files
gulp.task("ds-concat-styles", () =>
  gulp
    .src(["./voy-styleguide/assets/css/index.css"])
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.concat("styles.css"))
    .pipe(plugins.minifyCss())
    .pipe(
      plugins.rename({
        suffix: ".min"
      })
    )
    .pipe(
      plugins.autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false
      })
    )
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest("./voy-styleguide/assets/dist/css/"))
);

gulp.task("concat-js", () =>
  gulp
    .src(["./voy-styleguide/assets/js/index.js", "./voy-styleguide/assets/js/vendor/**/*.js"])
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.concat("bundle.js"))
    .pipe(plugins.uglify())
    .pipe(
      plugins.rename({
        suffix: ".min"
      })
    )
    .pipe(plugins.sourcemaps.write())
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

gulp.task("build", ["styles-ds", "styles-sgd", "merge"]); // Compile sass, concat and minify css + js
gulp.task("default", ["watch"]); // Default gulp task
gulp.task("lint", ["lint-styles", "lint-scripts"]); // Lint css + js files
gulp.task("merge", ["concat-styles", "concat-js"]); // Merge & minify css + js
