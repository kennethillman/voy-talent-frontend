//
// SCRIPTS - Helpers
//

function voyDebounce(func, wait = 10, immediate = true) {
  let timeout;
  return function() {
    let context = this, args = arguments;
    let later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};


(function() {
    // COOKIES

    const VOY = window.VOY || {};

    VOY.helpers.isMobile = function() {
        if (window.matchMedia('only screen and (max-width:767px)').matches) {
            return true;
        }
        return false;
    };

}());


