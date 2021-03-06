(function(window) {
    // ///////////////////////////////////////////////////////////////////////////////////////////////////////
    // //// PATTERN
    // ///////////////////////////////////////////////////////////////////////////////////////////////////////
        VOY = window.VOY || {},
        VOY.sections = VOY.sections || {};

        VOY.sections.header = {
            el: 's-header',
            navBarInitOffset: null,
            wpAdminBarHeight: null,

            init(){
                // Calculate offsets
                //VOY.partials.header.adminBarHeight = $('#wpadminbar').height();
                //VOY.partials.header.navBarInitOffset = $('.header-bottom').offset().top;

                //Init function calls
                VOY.sections.header.openSearch();
                VOY.sections.header.closeSearch();
                VOY.sections.header.toggleMobileMenu();
                VOY.sections.header.tightHeader();
                VOY.sections.header.stickyBreadcrumbs();


            },
            openSearch() {
              document.querySelector('#toggle-search').onclick = function() {
                document.body.classList.toggle('-visible-search');
                document.getElementById("search-input").focus();
              };
            },
            closeSearch() {
              document.querySelector('#search-input').onblur = function() {
                document.body.classList.remove('-visible-search');
              };
            },
            toggleMobileMenu() {
              document.querySelector('#toggle-mobile-menu').onclick = function() {
                document.body.classList.toggle('-visible-mobile-menu');
              };
            },
            tightHeader() {

              h = document.querySelector('.s-header')
              hh = h.offsetHeight
              wy = window.scrollY

              if(!VOY.helpers.isMobile()) {

                if (wy < hh) {
                  h.classList.remove('-is-tight');
                  document.body.classList.remove('-header-is-tight');
                  document.body.classList.remove('-breadcrumb-no-image');
                  document.body.classList.remove('-visible-search');
                } else {
                  h.classList.add('-is-tight');
                  document.body.classList.add('-header-is-tight');
                }

                scrollPos = wy;

              } else {
                h.classList.remove('-is-tight');
                document.body.classList.remove('-breadcrumb-no-image');
                document.body.classList.remove('-header-is-tight');
              }

            },


            stickyBreadcrumbs() {


              h = document.querySelector('.s-header')
              hh = h.offsetHeight
              b = document.querySelector('.s-breadcrumbs')
              f = document.querySelector('.n2-section-smartslider')
              fh = 0
              ft = 0
              wy = window.scrollY

              if(!b){
                return;
              }

              if (document.body.classList.contains('-has-featured-image')){


                // IF IMAGE
                if (f) {
                  fh = f.offsetHeight
                  ft = f.offsetTop
                }

                trigger = (ft + fh) - hh

                if(!VOY.helpers.isMobile()) {

                  if (wy < trigger) {
                    b.classList.remove('-sticky');
                  } else {
                    b.classList.add('-sticky');
                  }

                  scrollPos = wy;

                } else {
                  h.classList.remove('-sticky');
                }


              } else {

                // IF NO IMAGE
                document.body.classList.add('-breadcrumb-no-image');

              }



            },

            resizeCleanUp() {
              document.body.classList.remove('-visible-search');
              document.body.classList.remove('-visible-mobile-menu');
            },

        };

    // ///////////////////////////////////////////////////////////////////////////////////////////////////////
    //  if element don't exist, don't go further
        if (!document.getElementsByClassName(VOY.sections.header.el).length) {
            return;
        }

    /////////////////////////////////////////////////////////////////////////////////////////////////////
    // SCROLL
    /////////////////////////////////////////////////////////////////////////////////////////////////////

    //     $(window).scroll(() => {
    //         VOY.partials.header.stickyBlogNavbar();
    //     });

      window.addEventListener('scroll', function(e) {

        voyDebounce(VOY.sections.header.tightHeader());
        voyDebounce(VOY.sections.header.stickyBreadcrumbs());

      });

    // // ///////////////////////////////////////////////////////////////////////////////////////////////////////
    // // //// READY
    // // ///////////////////////////////////////////////////////////////////////////////////////////////////////

      document.addEventListener('DOMContentLoaded', function(){
          VOY.sections.header.init();
      }, false);


    /////////////////////////////////////////////////////////////////////////////////////////////////////
    // LOAD
    /////////////////////////////////////////////////////////////////////////////////////////////////////

      let reWi = 0;

      window.onload = function(){
        // Set inital width
        reWi = window.innerWidth;



    // function documentWidth() {
    //   dw = document.documentElement.clientWidth
    //   console.log('dw global -> ' + dw)
    // }
    // function documentHeight() {
    //   dw = document.documentElement.clientHeight
    // }

    // window.addEventListener('resize', VOY.helpers.debounce(documentWidth));
    // window.addEventListener('resize', VOY.helpers.debounce(documentHeight));



      }


    // // ///////////////////////////////////////////////////////////////////////////////////////////////////////
    // // //// RESIZE
    // // ///////////////////////////////////////////////////////////////////////////////////////////////////////


      window.addEventListener('resize', function(e) {
        if (reWi !== window.innerWidth) {
            // Code here
            voyDebounce(VOY.sections.header.tightHeader());
            voyDebounce(VOY.sections.header.resizeCleanUp());

            // Set the new window width
            reWi = window.innerWidth;
        }
      });

    // ///////////////////////////////////////////////////////////////////////////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////////////////////////////////
    }(window));
