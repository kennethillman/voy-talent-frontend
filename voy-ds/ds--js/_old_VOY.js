
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/* INDEPENDENT HELPERS */
/////////////////////////////////////////////////////////////////////////////////////////////////////////

// DEBOUNCE

function debounce(func, wait = 10, immediate = true) {
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/* GLOBALS */
/////////////////////////////////////////////////////////////////////////////////////////////////////////

let w, wy, d, dw, dh

w = window
wy = w.scrollY
d = document


/*
  (i) -> Always have document width and height, even if resizing or device orinetiton change occurs
*/
function documentWidth() {
  dw = d.documentElement.clientWidth
  console.log('dw global -> ' + dw)
}
function documentHeight() {
  dw = d.documentElement.clientHeight
}
window.addEventListener('resize', debounce(documentWidth));
window.addEventListener('resize', debounce(documentHeight));

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/* INIT */
/////////////////////////////////////////////////////////////////////////////////////////////////////////

function init() {

  // Globals
  documentWidth()
  documentHeight()

  // S-header
  // sHeaderNavTight()


// console.log('dw init -> ' + dw)


}

init();

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/* S-HEADER */
/////////////////////////////////////////////////////////////////////////////////////////////////////////

// INIT







// SCROLL


function sHeaderNavTight() {

  let header, headerH

  h = document.querySelector('.s-header')
  hh = h.offsetHeight
  wy = w.scrollY

  // if (dw >= 768) {
  //     return
  // }

  //   console.log('wy ' + wy)
  // console.log('hh ' + hh)

  if (wy < hh) {
    // Scrolling UP
    h.classList.remove('-is-tight');
  } else {
    // Scrolling DOWN
    h.classList.add('-is-tight');
  }

  scrollPos = wy;
}

window.addEventListener('scroll', debounce(sHeaderNavTight));





function checkPositionBread() {
  let windowY = window.scrollY;
  let voyBread = document.querySelector('.s-breadcrumbs');
  let voyBreadCrumbsTop = voyBread.offsetTop;
  let voyBreadCrumbTrigger = voyBreadCrumbsTop - voyNavHeight;
  console.log('voyBreadCrumbTrigger -> ' + voyBreadCrumbTrigger);

  if (windowY < voyBreadCrumbTrigger) {
    // Scrolling UP
    voyBread.classList.add('is-not-fixed');
    voyBread.classList.remove('is-fixed');
  } else {
    // Scrolling DOWN
    voyBread.classList.add('is-fixed');
    voyBread.classList.remove('is-not-fixed');
  }

  scrollPos = windowY;
}



//window.addEventListener('scroll', debounce(checkPositionNav));
//window.addEventListener('scroll', debounce(checkPositionBread));
