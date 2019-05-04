//
// SCRIPTS - Polyfills
//
// ////////////////////////////////////////////////////


(function() {

   const VOY = window.VOY || {};

    VOY.polyfills = {

        /*///////////////////////////////////////////////////////////////////////////////////////////////////////
            Polyfill to remove click delays on browsers with touch UIs
            https://github.com/ftlabs/fastclick
        *////////////////////////////////////////////////////////////////////////////////////////////////////////

        fastclick: (function () {
            if (window.FastClick) {
                window.FastClick.attach(document.body);
            }
        })(),

        /*///////////////////////////////////////////////////////////////////////////////////////////////////////
            Add svg support to browser that don't support it.
            https://github.com/jonathantneal/svg4everybody
        *////////////////////////////////////////////////////////////////////////////////////////////////////////

        svg4everybody: (function () {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = window.VOY_PRESET.path.scripts.polyfills+'svg4everybody.js';
            script.setAttribute('async', '');
            document.getElementsByTagName('head')[0].appendChild(script);
            script.onload = function () {
                window.svg4everybody();
            };
        })(),

    };

})();
