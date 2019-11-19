/////////////////////////////////////////////////////////////////
// CONFIG - VENDORS
/////////////////////////////////////////////////////////////////

module.exports = {

  vendors: {
        js: {
            src: [
                './bower_components/bootstrap/dist/js/bootstrap.min.js',
                './bower_components/jquery/dist/jquery.min.js',
                './src/assets/bin/bootstrap-4.0.0-alpha/dist/js/bootstrap.min.js'
            ],
            dest: './dist/assets/js/vendors'
        },
        css: {
            src: [
                './bower_components/font-awesome/css/font-awesome.min.css',
                './bower_components/font-awesome/css/font-awesome.css.map',
                './bower_components/bootstrap/dist/css/bootstrap.min.css',
                './bower_components/bootstrap/dist/css/bootstrap.min.css.map'
            ],
            dest: './dist/assets/css/vendors'
        },
        sass: {
            // NOTE: This is to perform operations on the sass files
            src: [
                './bower_components/font-awesome/scss/**/*.scss', // ex
                './src/assets/bin/bootstrap-4.0.0-alpha/scss/**/*.scss' // ex
            ],
            opts: { },
            dest: './dist/assets/css/vendors'
        },
        less: {
            src: [
                './bower_components/bootstrap/less/**/*.less'
            ],
            opts: { },
            dest: './dist/assets/css/vendors'
        },
        fonts: {
            src: [
             './bower_components/bootstrap/fonts/**/*.*',
             './bower_components/font-awesome/fonts/**/*.*'
            ],
            dest: './dist/assets/fonts'
        }
    }

}
