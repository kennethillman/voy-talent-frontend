# voy-talent-frontend
Design in code for upcoming site

## Basic Setup

1.  Clone / Download

2.  Install dependencies

```
$ npm install
```

3.  Run on `http://localhost:3000/`

```
$ gulp
```

## Gulp tasks

```
$ gulp (default)
$ gulp --prod (dist files)
```

```
$ gulp watch (default task)
```

Watches for changes to scss, js and nunjucks (njk) files. Compiles and reloads browser on save.

```
$ gulp styles
```

Compiles sass to css.

```
$ gulp lint
```

Lints scss and js files.

```
$ gulp merge
```

Concats and minifies css (inc vendor) and js files.

```
$ gulp build
```

Runs any compiling tasks and merge.

