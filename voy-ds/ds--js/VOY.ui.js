//
// SCRIPTS - UI
//
// ////////////////////////////////////////////////////



(function() {

   const VOY = window.VOY || {};

    /* ///////////////////////////////////////////////////////////////////////////////////////////////////////
        VOY UI
    */// /////////////////////////////////////////////////////////////////////////////////////////////////////

    VOY.ui = {
        truncate() {
            function getLineHeightInPx (lineHeight) {
                if (typeof lineHeight == 'string' && lineHeight.indexOf('px') > -1) {
                    lineHeight = parseFloat(lineHeight).toFixed(2);
                } else {
                    // rem -> px (http://tzi.fr/js/convert-em-in-px).
                    lineHeight = lineHeight * parseFloat(getComputedStyle(document.documentElement).fontSize);
                    lineHeight = lineHeight.toFixed(2);
                }
                return lineHeight;
            }
            if (jQuery && jQuery().dotdotdot) {
                $('.js-clamp').each(function () {
                    var $this = $(this);
                    $this.dotdotdot({
                        watch: true,
                        height: function () {
                            var rows = $this.data('clamp') || 5;
                            return Math.ceil(getLineHeightInPx($this.css('line-height'))*rows);
                        }
                    });
                });
            }
        },

    };


    /* ///////////////////////////////////////////////////////////////////////////////////////////////////////
        VOY UI Wcag
    */// /////////////////////////////////////////////////////////////////////////////////////////////////////

    // .clicked - Adds "-clicked" class on all clicked links to be able to seperate tab och and clicked focus styles.
    // .triggerClick - Makes a container clickable, triggers first link or wrapper with classname js-wcag-trigger-this.

    VOY.ui.wcag = {
        clicked() {
            var el =  $('a, .btn, .js-wcag-trigger-click');
            el.on('mousedown', function() {
                    el.removeClass('-clicked');
                    $(this).addClass('-clicked');
                    return true;
                });
        },
        triggerClick() {
            $('body').on('click', '.js-wcag-trigger-click', function(e) {
                e.preventDefault();

                let url = $(this).find('.js-wcag-trigger-this').attr('href');

                if (!url || url && '' === url.trim()){
                    url = $('a', $(this)).first().attr('href');
                }

                if (url && '' !== url.trim()) {
                    // cmd/ctrl was pressed when clicking, this should open in a new tab/window
                    if (e.metaKey) {
                        return window.open(url, '_blank');
                    }

                    return window.location.assign(url);
                }
            });
        },
    };

    /* ///////////////////////////////////////////////////////////////////////////////////////////////////////
        VOY UI infiniteScroll
    */// /////////////////////////////////////////////////////////////////////////////////////////////////////

    VOY.ui.infiniteScroll = {
        config: {
            // debug: false,
            viewPortThreshold: 3,
            scrollWin: $(window),
            windowHeight: $(window).height(),
            dataContainer: '.data-infinite-scroll',
            mainContainer: '#main',
            articlePost: 'article.post',
            relatedContent: '.t-single-related-content',
            useSinglePostTheContentLoader: false,
            categoryLayout: [],
            postsPerPage: 0,
            injectAds: true,
            useNativeBooster: true,
        },
        nextLoading: false,
        trackScroll: false,
        pageCount: 1,
        postCount: 0,
        adCount: 1,
        adCountMobile: 1,
        init() {

            // Archive page
            if ((VOY.helpers.isArchive || VOY.helpers.isArchiveAuthor) && !VOY.helpers.isPost) {
                VOY.ui.infiniteScroll.config.viewPortThreshold = 5;
                VOY.ui.infiniteScroll.postCount = $(`${this.config.mainContainer} .data-grid-teaser`).length;
            }

            // Init scrollTracker for single post page
            if (VOY.helpers.isPost || VOY.helpers.isRecipe || (VOY.helpers.isBlog && VOY.helpers.isHome)) {
                VOY.ui.scrollTracker.init();
            }

            if (this.config.useNativeBooster) {
                VOY.ui.nativeBooster.init();
            }

            VOY.ui.infiniteScroll.trackScroll = true;

            const layoutName = 'front_page_sections.json';

            $.getJSON(window.location.protocol + '//' + window.location.host + '/wp-content/themes/VOY-editorial/assets/' + layoutName, function(json) {
                if (VOY.helpers.isMobile()) {
                    VOY.ui.infiniteScroll.config.categoryLayout = json.filter(function(el) { return el !== 'ad'; });
                } else {
                    VOY.ui.infiniteScroll.config.categoryLayout = json.filter(function(el) { return el !== 'm_ad'; });
                }

                VOY.ui.infiniteScroll.config.postsPerPage = json.filter(function(el) { return el !== 'ad' && el !== 'm_ad' && el !== 'newsletter'; }).length;
            });

            this.config.scrollWin.scroll(() => {
                if (VOY.ui.infiniteScroll.trackScroll) {
                    VOY.ui.infiniteScroll.handleLoad();
                }
            });
        },
        handleLoad() {
            if (!VOY.ui.infiniteScroll.nextLoading && this.viewIsBelowTrigger()) {
                // when this is true load the next part
                VOY.ui.infiniteScroll.nextLoading = true;

                // Check if type is Grid Archive
                if ((VOY.helpers.isArchive || VOY.helpers.isArchiveAuthor) && !VOY.helpers.isPost) {
                    // Use grid template loading
                    if (VOY.ui.infiniteScroll.postCount === VOY.ui.infiniteScroll.config.postsPerPage * VOY.ui.infiniteScroll.pageCount) {
                        this.useGridTemplate();
                    } else {
                        VOY.ui.infiniteScroll.trackScroll = false;
                    }
                } else {
                    // Normal infinite loading
                    if (this.config.useNativeBooster) {
                        VOY.ui.nativeBooster.checkForBoostedPromotion(this.getPrevPost.bind(this));
                    } else {
                        this.getPrevPost();
                    }
                }
            }
        },

        viewIsBelowTrigger() {
            // Archive infinite logic
            if ((VOY.helpers.isArchive || VOY.helpers.isArchiveAuthor) && !VOY.helpers.isPost) {
                const scrollTop = $(window).scrollTop();
                const elementOffset = $('.p-footer').offset().top;
                const distance = elementOffset - scrollTop;
                const viewportDistance = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) * 2.5;

                return distance < viewportDistance;
            }

            const loadTrigger = this.config.windowHeight * this.config.viewPortThreshold;
            return ($(window).scrollTop() + this.config.windowHeight > $(document).height() - loadTrigger);
        },
        getPrevPost() {
            const main = $(this.config.mainContainer);
            const articlePost = this.config.articlePost;
            const lastPost = $(main).find(articlePost).last();
            const currentId = $(lastPost).find(this.config.dataContainer).attr('data-current-id');
            const loaderInfinite = $(lastPost).find(this.config.dataContainer).find('.c-loader-infinite');
            const previousPost = {
                id:                 $(lastPost).find(this.config.dataContainer).attr('data-prev-id'),
                title:              $(lastPost).find(this.config.dataContainer).attr('data-prev-title'),
                url:                $(lastPost).find(this.config.dataContainer).attr('data-prev-url'),
            };

            let prevIdLength = 0;
            if (previousPost.id) {
                prevIdLength = previousPost.id.length;
            }

            if (prevIdLength > 0 && currentId !== previousPost.id) {
                let prevPost = '';
                const self = this;

                $.ajax({
                    url         : previousPost.url,
                    dataType    : 'html',
                    cache       : true,
                    beforeSend() {
                        $(loaderInfinite).toggle();
                    },
                    success(data) {
                        prevPost = $(data).find(articlePost);
                        main.append(prevPost);
                    },
                    complete() {
                        VOY.ui.infiniteScroll.postCount++;
                        VOY.ui.infiniteScroll.adCount++;
                        VOY.ui.infiniteScroll.nextLoading = false;
                        VOY.ui.scrollTracker.setPostsElements();
                        VOY.ui.scrollTracker.setObserverOnArticlePosts();
                        if (VOY.ui.singlePostTheContentLoader.isActive && VOY.ui.infiniteScroll.config.useSinglePostTheContentLoader) {
                            VOY.ui.singlePostTheContentLoader.handlePostContentLoad(prevPost);
                        }
                        $(loaderInfinite).toggle();
                    },
                    error(jqXHR, message) {
                        console.log('ui.infiniteScroll: getPrevPost error', jqXHR, message);
                    },
                });
            }
        },
        useGridTemplate() {
            const main = $(this.config.mainContainer);
            const scrollData = $(main).find(this.config.dataContainer).last();
            const queryParams = $(scrollData).data('json-query');

            queryParams.paged++;

            // Build the next query string
            const params = $.param(queryParams);

            let requestTime = 0,
                protocol = window.location.protocol,
                host = window.location.host;
            let requestUrl = `${protocol}//${host}/wp-json/btdm/v1/archive/?${params}`;

            if (VOY.helpers.isBlog && !VOY.helpers.isOwnDomainBlog) {
                const blogPathname = window.location.pathname.split('/');
                const blogNamespace = blogPathname[1];
                requestUrl = `${protocol}//${host}/${blogNamespace}/wp-json/btdm/v1/archive/?${params}`;
            }

            $.ajax({
                url         : requestUrl,
                dataType    : 'json',
                cache       : true,
                beforeSend() {
                    requestTime = new Date().getTime();
                    $('.c-spinner').css('display', 'block');
                    // console.log('ui.infiniteScroll: request', requestUrl);
                },
                success(data) {
                    // console.log('ui.infiniteScroll: response (', new Date().getTime() - requestTime, 'ms )');
                    main.append(data);
                },
                complete() {
                    VOY.ui.infiniteScroll.pageCount++;
                    VOY.ui.infiniteScroll.nextLoading = false;
                    VOY.ui.infiniteScroll.postCount = $(`${VOY.ui.infiniteScroll.config.mainContainer} .teaser`).length;
                    $('.c-spinner').css('display', 'none');
                },
                // timeout: 1000,
                error(jqXHR, message) {
                //    console.log('ui.infiniteScroll: getPrevPost error', message);
                    // if(message === 'timeout') {
                    //  //   console.log('ui.infiniteScroll: timeout reached');
                    // }
                    // errors?
                },
            });
        },
    };


    /* ////////////////////////////////////////////////d///////////////////////////////////////////////////////
        VOY UI scrolltracker
    */// /////////////////////////////////////////////////////////////////////////////////////////////////////

    VOY.ui.scrollTracker = {
        config: {
            // debug: false,
            scrollWin: $(window),
            triggerHistoryManager: true,
            depthMod: 0.05,
            dataContainer: '.data-post-data',
            articlePost: 'article.post',
            articleTitle: '.entry-title',
            articleHeader: '.entry-header',
        },
        windowHeight: window.innerHeight,
        currentPost: {},
        postElementsArray: [],
        trackScroll: false,
        previousScrollPosition: 0,
        startTime: 0,
        data: {
            posts: {},
            currentPost: {},
        },

        setCurrentPost(el) {
            const postHeight = el.offsetHeight;
            const postId = el.id;
            const postOffsetTop = el.offsetTop;
            const postContentElement = document.getElementById(`data-${postId}`);
            const postTitle = postContentElement.dataset.postTitle;
            const postUrl = postContentElement.dataset.postUrl;

            const postElComputedStyle = getComputedStyle(el);
            const postElMarginTop = parseInt(postElComputedStyle.marginTop || 0, 10);
            const postElMarginBottom = parseInt(postElComputedStyle.marginBottom || 0, 10);
            const postHeightWithMargins = postHeight + postElMarginBottom + postElMarginTop;

            VOY.ui.scrollTracker.currentPost = {
                postTarget: el,
                postHeight,
                postId,
                postOffsetTop,
            };

            let scrollDepthProgress = {
                25: false,
                50: false,
                75: false,
                100: false,
            };

            if (VOY.ui.scrollTracker.data.posts[postId]) { // if post already exist use that data instead
                scrollDepthProgress = VOY.ui.scrollTracker.data.posts[postId].scrollDepthProgress;
            }

            VOY.ui.scrollTracker.data.posts[postId] = {
                currentScrollDepth: 0,
                id: postId,
                postUrl,
                postTitle,
                height: postHeightWithMargins,
                offset: postOffsetTop,
                scrollDepthProgress: {
                    25: scrollDepthProgress['25'],
                    50: scrollDepthProgress['50'],
                    75: scrollDepthProgress['75'],
                    100: scrollDepthProgress['100'],
                },
            };
        },

        postChangedCallback() {
            VOY.ui.scrollTracker.startTime = Date.now();

            if (VOY.ui.scrollTracker.config.triggerHistoryManager) {
                VOY.ui.historyManager.pushHistoryState(false);
            }
        },

        setPostsElements() {
            const articles = document.getElementsByTagName('article');
            const postElementsArray = [...articles].filter(item => item.classList.contains('post'));
            VOY.ui.scrollTracker.postElementsArray = postElementsArray;
        },

        sendThatCurrentPostHasChangedToTracker() {
            const postObject = VOY.ui.scrollTracker.data.posts[VOY.ui.scrollTracker.currentPost.postId];
            VOY.ui.scrollTracker.postChangedCallback();
            VOY.eventBus.trigger('virtualPageview', postObject);
            VOY.ui.scrollTracker.data.currentPost = postObject;
        },

        sendScrollDepthProgress(depthProgress, postId) {
            const lastDepthTime = Date.now() - VOY.ui.scrollTracker.startTime;
            VOY.ui.scrollTracker.data.posts[postId].scrollDepthProgress[depthProgress] = true;
            VOY.ui.scrollTracker.data.posts[postId].lastDepthProgression = depthProgress;
            VOY.ui.scrollTracker.data.posts[postId].lastDepthTime = lastDepthTime;
            VOY.eventBus.trigger('postScrollDepth', depthProgress);
            VOY.eventBus.trigger('postScrollTime', { depthProgress, lastDepthTime });
        },

        getCurrentScrollDepth() {
            const {
                postHeight,
                postOffsetTop,
            } = VOY.ui.scrollTracker.currentPost;
            const currentViewport = window.scrollY + this.windowHeight;
            const currentPostViewportInterim = (currentViewport - postOffsetTop) / postHeight;

            return currentPostViewportInterim + this.config.depthMod;
        },

        handleScrollTracker() {
            const { postId } = VOY.ui.scrollTracker.currentPost;
            const postObject = VOY.ui.scrollTracker.data.posts[postId];
            const currentScrollDepth = this.getCurrentScrollDepth();
            postObject.currentScrollDepth = currentScrollDepth;

            if (currentScrollDepth >= 0.25 && !VOY.ui.scrollTracker.data.posts[postId].scrollDepthProgress['25']) {
                this.sendScrollDepthProgress('25', postId);
            }
            if (currentScrollDepth >= 0.50 && !VOY.ui.scrollTracker.data.posts[postId].scrollDepthProgress['50']) {
                this.sendScrollDepthProgress('50', postId);
            }
            if (currentScrollDepth >= 0.75 && !VOY.ui.scrollTracker.data.posts[postId].scrollDepthProgress['75']) {
                this.sendScrollDepthProgress('75', postId);
            }
            if (currentScrollDepth >= 1.0 && !VOY.ui.scrollTracker.data.posts[postId].scrollDepthProgress['100']) {
                this.sendScrollDepthProgress('100', postId);
            }
        },

        setObserverOnArticlePosts() {
            const postElementsArray = VOY.ui.scrollTracker.postElementsArray;
            const previousNumberOfIntersectedElements = VOY.ui.scrollTracker.intersectionCounterOnElements;
            for (let i = previousNumberOfIntersectedElements; i < postElementsArray.length; i++) { // only observe new posts
                VOY.ui.scrollTracker.observer.observe(postElementsArray[i]);
                VOY.ui.scrollTracker.intersectionCounterOnElements++;
            }
        },

        // Keeps track if ads dynamic adds into the DOM under the #main element and then trigger recalculate on currentPost
        setMutationObserver() {
            const mainTarget = document.getElementById('main');

            const mutationOption = {
                attributes: true, // listen for attributes changes
                subtree: true, // listen for child elements and not only changes to the mainTarget element
            };

            const mutationCallback = entries => {
                entries.forEach(entry => {
                    if (entry.type === 'attributes' && entry.attributeName === 'data-load-complete') {
                        this.setCurrentPost(VOY.ui.scrollTracker.currentPost.postTarget); // recalculate height and measurement if ads has dynamic been loaded after first render
                    }
                });
            };

            VOY.ui.scrollTracker.mutationObserver = new MutationObserver(mutationCallback);
            VOY.ui.scrollTracker.mutationObserver.observe(mainTarget, mutationOption);
        },

        isElementInViewport(element) {
            const currentRect = element.getBoundingClientRect();
            const isElementInViewportFromTop = currentRect.top <= window.innerHeight;
            const isElementStillInViewportFromTopToBottom = currentRect.top + currentRect.height >= 0;

            return isElementInViewportFromTop && isElementStillInViewportFromTopToBottom;
        },

        getIndexOfCurrentPostInArray() {
            return VOY.ui.scrollTracker.postElementsArray.findIndex(item => (
                item.id === VOY.ui.scrollTracker.currentPost.postId
            ));
        },

        getElementInViewPort() {
            let newPostElementToTrack;

            // Get currentIndex in array of post for previous active post to decide which index to start from
            const currentIndexInPostArray = this.getIndexOfCurrentPostInArray();

            if (VOY.ui.scrollTracker.isScrollDirectionDown) { // if scroll down traverse the the array forward to check for currentPost in viewport
                let i = currentIndexInPostArray + 1;
                for (i; i < VOY.ui.scrollTracker.postElementsArray.length; i++) {
                    if (this.isElementInViewport(VOY.ui.scrollTracker.postElementsArray[i])) {
                        newPostElementToTrack = VOY.ui.scrollTracker.postElementsArray[i];
                        break; // break loop when finding first post in viewport
                    }
                }
            } else {
                let i = currentIndexInPostArray - 1;
                for (i; i >= 0; i--) {
                    if (this.isElementInViewport(VOY.ui.scrollTracker.postElementsArray[i])) {
                        newPostElementToTrack = VOY.ui.scrollTracker.postElementsArray[i];
                        break; // break loop when finding first post in viewport
                    }
                }
            }

            if (!newPostElementToTrack) { // fallback if no post is available in viewport
                newPostElementToTrack = VOY.ui.scrollTracker.postElementsArray[0];
            }

            return newPostElementToTrack;
        },

        setIntersectionObserver() {
            const options = {
                root: null, // listen on document
                threshold: [0, 1],
            };
            VOY.ui.scrollTracker.intersectionCounterOnElements = 0;

            /*
            * Using intersection to determine currentPost in viewport.
            * Special solution due to intersection callback sometimes does not fire event that currentPost has left the viewport.
            * Can't rely on entry.isIntersection for currentPost so need to check for every post that leave viewport
            */
            const intersectionCallback = (entries) => {
                entries.forEach(() => {
                    const isCurrentPostStillInViewport = this.isElementInViewport(VOY.ui.scrollTracker.currentPost.postTarget);

                    if (!isCurrentPostStillInViewport) {
                        const activePostInViewPort = this.getElementInViewPort(); // check which post that are in viewport

                        VOY.ui.scrollTracker.setCurrentPost(activePostInViewPort);
                        this.sendThatCurrentPostHasChangedToTracker();
                    }
                });
            };

            VOY.ui.scrollTracker.observer = new IntersectionObserver(intersectionCallback, options);
            this.setObserverOnArticlePosts();
        },

        setScrollDirection() {
            const windowScrollY = window.scrollY;
            VOY.ui.scrollTracker.isScrollDirectionDown = window.scrollY > VOY.ui.scrollTracker.previousScrollPosition;
            VOY.ui.scrollTracker.previousScrollPosition = windowScrollY;
        },

        init() {
            this.setPostsElements();

            if (VOY.ui.scrollTracker.postElementsArray.length) {
                this.setCurrentPost(VOY.ui.scrollTracker.postElementsArray[0]);
                this.setMutationObserver();
                this.setIntersectionObserver();
                VOY.ui.scrollTracker.trackScroll = true;
                VOY.ui.scrollTracker.startTime = Date.now();
                let scrollTimeout;

                this.config.scrollWin.scroll(() => {
                    if (VOY.ui.scrollTracker.trackScroll && !scrollTimeout) {
                        scrollTimeout = setTimeout(() => {
                            scrollTimeout = null;
                            VOY.ui.scrollTracker.handleScrollTracker();
                            this.setScrollDirection();
                        }, 100);
                    }
                });
                VOY.ui.historyManager.init();
            }
        },
    };









}());
