/**
 * Define console log method.
 */
if(typeof console.warn === 'undefined') {
    console.warn = function () {}
}

/**
 * JohnFrieda.
 */
(function(window, jfAPI) {
    var isAuthorring = false;

    /*-----------------------*/
    // ready
    /*-----------------------*/
    $(document).ready(function() {
        isAuthorring = $.fn.isAuthorring();
        if(isAuthorring) {
            $('body').addClass('is-authorring');
        }
        smoothScroll();
        initHeaderSearch();
        setupNavToggle();
        setupHeroTitle();
        initPromoHeader();
        initProductGlossary();
        initCookieBar();
        initWheretobuy();
        initGetTheLook();
        initContentCarousel();
        initShariff();
        initShariffWithNewsCred();
        initFaqCategoryListing();
        initFormAnalytics();
        initPostHeight();
        initFaqSearchLink();
        initBrandHeader();
        initAdhocGallery();
        initShariffAdhocGallery();


        $(document).hover(function(){
            if(window.innerWidth >= "1025"){
                if($(this).closest("jf-Header__nav").length == 0){
                    $(".jf_header_prod_drop_down").hide();

                }
            }
        });

        if(!isAuthorring && location.hostname.indexOf('localhost') < 0) {
            FONTPLUS.attachCompleteEvent(function(){
                setTimeout(function(){
                    adjustYourLookPrompt();
                    $(window).on('resize', function(){
                        adjustYourLookPrompt();
                    })
                }, 100);
            });
        }
    });

    $(window).on('scroll', function() {
        stickyHeader();
    });


    function smoothScroll() {
        var $anchorLink = $('.jf-backToTopLink');
        if (!$anchorLink[0]) return;
        $anchorLink.on('click', function() {
            $('body').animate({scrollTop: 0}, '300');
        })
    }


    /*
  Handle expanding/collapsing the header nav search bar
 */
    function initHeaderSearch() {
        var $headerSearch = $('.jf-Header__navSearch');

        if($('body').hasClass('is-ltAndroid4_3')) {
            $('.js-navSearch .jf-Header__navSearch__inner').wrap('<div class="jf-Header__navSearch__inner--android" />');
            $('.js-navSearch .jf-Header__navSearch__close').wrap('<div class="jf-Header__navSearch__close--android" />');
        }

        $('.js-navSearch .jf-Header__navSearch__link').click(function(){
            $('.jf-Header').toggleClass('is-search-open');
            $('.jf-Header__mainNav').toggleClass('is-search-open');
            if($('.jf-Header__mainNav').hasClass('is-search-open')) {
                var $headerNav = $('.jf-Header__mainNav');
                var bp = $.fn.getBreakpoint();
                if(bp == 'lg') {
                    $headerSearch.width($headerNav.width());
                } else if(bp == 'md') {
                    $headerSearch.width($headerNav.width() - 250);
                } else {
                    $headerSearch.width($headerNav.width() - 210);
                }
            } else {
                $headerSearch.removeAttr('style');
            }
        });

        $('.js-navSearch .jf-Header__navSearch__close').click(function(){
            $('.jf-Header').removeClass('is-search-open');
            $('.jf-Header__mainNav').removeClass('is-search-open');
            $headerSearch.removeAttr('style');
        });
    }


    /*
  Control the sticky header attachment.
 */
    function stickyHeader() {
        if($('.jf-promo')[0] && !$('.jf-promo').hasClass('is-dismissed')) {
            $('body, .jf-Header__wrapper, .jf-Header').toggleClass('is-stuck', $(document).scrollTop() >= 50);
        }
        else {
            $('body, .jf-Header__wrapper, .jf-Header').toggleClass('is-stuck', $(document).scrollTop() >= 1);
        }
    }

    /*
  Toggle the main nav open/closed on smaller screens.
  */
    function setupNavToggle() {
        var navToggle = document.querySelector('.js-mainNavToggle');
        if (navToggle === null) return;
        navToggle.addEventListener('click', onNavToggle);

        function onNavToggle(e) {
            e.currentTarget.classList.toggle('is-open');
            if(!isAuthorring && location.hostname.indexOf('localhost') < 0 && location.hostname.indexOf('192.168') < 0) {
                FONTPLUS.reload(true);
            }
            if (e.detail > 0) { // Mouse click
                e.currentTarget.blur();
            }
            if($('.jf-Header__navToggle').hasClass('is-open')) {
                $('.jf-Header').addClass('is-open');
                var navItemLength = $('.jf-Header__mainNav .l-TextLinkP__list__item').length;
                var navExpandedHeight = navItemLength * $('.jf-Header__mainNav .l-TextLinkP__list__item').first().outerHeight() + 48;
                $('.jf-Header__mainNav').css('height', navExpandedHeight);
            }
            else {
                $('.jf-Header__mainNav').css('height', 0);
                setTimeout(
                    function() {
                        $('.jf-Header').removeClass('is-open');
                    }, 800);
            }
        }
    }

    /*
  HeroTitle carousel
  */
    function setupHeroTitle() {
        if(!isAuthorring) {
            $('.js-heroCarousel').on('init', function(event, slick) {
                playHeroTitleVideo(slick, 0);
            });
            $('.js-heroCarousel').on('afterChange', function(event, slick, currentSlide) {
                playHeroTitleVideo(slick, currentSlide);
            });
			$('.js-heroCarousel').children('.cq-placeholder').remove();
            $('.js-heroCarousel').slick({
                arrows: false,
                autoplay: true,
                autoplaySpeed: 8000,
                dots: true,
                mobileFirst: true,
                speed: 1000,
				slick: '.jf-home_page_hero_title__tile',
                responsive: [
                    {
                        breakpoint: 641,
                        settings: {
                            arrows: true
                        }
                    }
                ]
            });
			if ($('.js-heroCarousel video').length) {
				var videoObj = $(this);
				videoObj.onended = function () {
					$(".slick-slider").slickNext();
				}
			}
        }
    }
    function playHeroTitleVideo(slick, currentSlide) {
        var videoObj = slick.$slides[currentSlide].querySelector('video');
        if(videoObj) {
			videoObj.currentTime = 0;
            videoObj.play();
        }
    }


    function initPromoHeader() {
        var $promo = $('.jf-promo');
        if(!$promo[0]) return;
        var $dismissPromoBtn = $('.js-dismissPromo');

        var lang = $('html').attr('lang');
        var cookieName = 'jf-dismissPromo_' + lang;

        if (isAuthorring) {
            $promo.removeClass('is-dismissed');
            return;
        }

        if (!hasCookie(cookieName)) {
            $promo.removeClass('is-dismissed');
        }

        $dismissPromoBtn.on('click', function() {
            document.cookie = (cookieName + '=true; path=/');
            $promo.addClass('is-dismissed');
        });
    }

    function hasCookie(cookieName) {
        var cookieStr = document.cookie;
        var cookies = cookieStr.split('; ');
        var regexp = new RegExp(cookieName + '(.*)');
        for (var i = 0, len = cookies.length; i < len; i++) {
            if (cookies[i].match(regexp)) return true;
        }
        return false;
    }


    /*
  product glossary
  */
    function initProductGlossary() {
        var $target = $('.js-product_glossary');
        if( !$target[0] || isAuthorring ) return;

        $target.each(function(index, el){
            var $me = $(el);
            var $text = getTextNode($me.find('.jf-product_glossary__info .l-HeadingTitle__h3 span'));

            $text.each(function(textIndex, textEl){
                var $words = $(textEl).parent();

                var pagaraphText = $words.text();
                $words.text(limitWords(3, $words.text()));
            });
        });
    }

    function getTextNode ($target, str) {
        var nodes = $target
        .contents()
        .filter(function () {
            return this.nodeType === 3 // テキストノードか否か
            && /\S/.test(this.data) // 空白か否か
            && $.inArray($(this).parent(), $target) // 直下か否か
            && (typeof str === 'undefined' || str === this.nodeValue); // 文字列の指定がある場合
        });
        return nodes;
    }

    /* from Cog */
    function limitWords(Wordcounts, paraText) {
        var textArray = paraText.split(' ');
        var limitedWords = '';
        var currentloop = 1;
        if(textArray.length <= Wordcounts) {return;}

        if (Wordcounts == 0 || Wordcounts == 1 || Wordcounts == undefined) {
            currentloop = 1;
        } else {
            currentloop = Wordcounts - 1;
        }
        for(var index = 0; index <= currentloop; index++) {
            limitedWords = limitedWords + textArray[index] + ' ';
        }
        limitedWords = limitedWords.trim();

        return limitedWords;
    }


    /*
  Your Look Prompt
  */
    function adjustYourLookPrompt() {
        var $target = $('.js-your_look_prompt');
        if( !$target[0] || isAuthorring ) return;

        $target.each(function(index, el){
            var $me = $(el);
            var $text = $me.find('.l-ImageTextHP__contentsBlock__text');
            var $image = $me.find('.l-ImageTextHP__contentsBlock__image img');

            $image.css({
                height: 'auto'
            }).removeClass('is-autoWidth');
            if($.fn.getBreakpoint() == 'sm') return;

            var setHeight = $text.outerHeight();
            var imgHeight = $image.height();

            if(setHeight > imgHeight) {
                $image.css({
                    height: setHeight
                }).addClass('is-autoWidth');;
            }
        });
    }

    /*
  Where To Buy
  */
    function initWheretobuy() {
        var $target = $('.js-where_to_buy');
        if( !$target[0] || isAuthorring ) return;
        var wtbInitialHeight;
        var $locationsInner;
        $locationsInner = $target.find('.l-BannerLinkP');
        if (isAuthorring) return;

        var $wtbBtnArea = $target.find('.l-TextLinkP');
        var wtbItemNum = $target.find('.l-BannerLinkP__list__item').length;
        if(wtbItemNum <= 4){
            $wtbBtnArea.hide();
        }

        var $locations = $locationsInner.find('.l-BannerLinkP__list__item');


        $(window).resize(function(){
            wtbInitialHeight = initWheretobuyHeight($target, $locations, $locationsInner);
        });
        wtbInitialHeight = initWheretobuyHeight($target, $locations, $locationsInner);
        $target.find('.l-BannerLinkP__list__item').addClass('is-hidden');
        $target.find('.js-anchorLink').click(function(e){
            additionalLocationsToggle($locationsInner,wtbInitialHeight);
        });
    }

    function initWheretobuyHeight($target, $locations, $locationsInner) {
        var wtbInitialHeight;

        if($.fn.getBreakpoint() === 'sm') {
            wtbInitialHeight = $locations.first().outerHeight() * 2;
        } else {
            wtbInitialHeight = $locations.first().outerHeight();
        }
        $locationsInner.css('min-height', wtbInitialHeight);
        if($locations.hasClass('is-hidden')){
            $locationsInner.css('max-height', wtbInitialHeight);
        }

        return wtbInitialHeight;
    }

    function additionalLocationsToggle($locationsInner,wtbInitialHeight) {
        var $morelocations = $('.js-where_to_buy__morelocations');
        var $lesslocations = $('.js-where_to_buy__lesslocations');
        var $locations = $locationsInner.find('.l-BannerLinkP__list__item');
        additionalLocations = Math.ceil($locationsInner.find('.is-hidden').length / 4);
        if(additionalLocations > 0){
            $locationsInner.css('max-height', wtbInitialHeight + wtbInitialHeight * additionalLocations);
            $locations.removeClass('is-hidden');
            $lesslocations.show();
            $morelocations.hide();
        }
        else {
            $locationsInner.css('max-height', wtbInitialHeight);
            $locations.addClass('is-hidden');
            $lesslocations.hide();
            $morelocations.show();
        }
    }



    /*
  Get The Look
  */
    function initGetTheLook() {
        var OPEN_CLASS = 'is-open';
        var TILE_CLASS = '.js-get_the_look__tile';
        var $target = $(TILE_CLASS);

        if( !$target[0] || isAuthorring ) return;

        $target.find('.jf-get_the_look__header a').on('click', function(e) {
            var $me = $(e.currentTarget).parents(TILE_CLASS);

            $me.toggleClass(OPEN_CLASS);
            $me.find('a').blur();
            $me.siblings().removeClass(OPEN_CLASS);
        });

        if($('body').hasClass('is-ltAndroid4_3')) {
            $target.find('.jf-get_the_look__details').on('oTransitionEnd mozTransitionEnd webkitTransitionEnd transitionend', function(){
                if($(this).parents(TILE_CLASS).hasClass('is-open')) {
                    $(this).find('a').css('top','0');
                } else {
                    $(this).find('a').css('top','1px');
                }

            });
        }
    }

    /**
  * COOKIE BAR
  */
    function initCookieBar() {
        var $cookieBar = $('.js-cookie_bar');
        if (!$cookieBar[0]) return;

        // ButtonAction
        $('.js-jf_cookie_bar--accept a').on('click', function(event) {
            toggleCookieBarBox(false, '#jfCookieConfirm');
            toggleCookieBarBox(false, '#jfCookieLearnMore');
        });
        $('.js-jf_cookie_bar--decline a').on('click', function(event) {
            if($(this).parents('#jfCookieConfirm')[0]) {
                toggleCookieBarBox(false, '#jfCookieConfirm', function(){
                    toggleCookieBarBox(true, '#jfCookieDecline');
                });
            } else {
                toggleCookieBarBox(false, '#jfCookieLearnMore', function(){
                    toggleCookieBarBox(true, '#jfCookieDecline');
                });
            }

        });
        $('.js-jf_cookie_bar--learn_more a').on('click', function(event) {
            toggleCookieBarBox(false, '#jfCookieConfirm', function(){
                toggleCookieBarBox(true, '#jfCookieLearnMore');
            });
        });
        $('.js-jf_cookie_bar--continue a').on('click', function(event) {
            toggleCookieBarBox(false, '#jfCookieDecline');
        });

    }

    /**
  * TOGGLE COOKIE BAR
  */
    function toggleCookieBarBox(flg, target, callback) {
        var $overlay = $('.jf-cookie_bar');
        var $popup = $(target);
        if (!$overlay[0] || !$popup[0]) return;

        if (flg) {
            $overlay.fadeIn(200);
            $popup.fadeIn(400, callback);
        } else {
            $overlay.fadeOut(200);
            $popup.fadeOut(400, callback);
        }
    }

    function initContentCarousel() {
        var $wrapper = $('.jf-carousel > ul');
        if (!$wrapper[0]) return;

        // ready
        if ($.fn.getBreakpoint() === 'sm') {
            initSlick($wrapper);
        }

        var timer = 0;
        $(window).on('resize', function() {
            if (timer > 0) {
                clearTimeout(timer);
            }
            timer = setTimeout(toggleSlick($wrapper), 200);
        });
    }

    function toggleSlick($wrapper) {
        if ($.fn.getBreakpoint() === 'sm') {
            if (!$wrapper.hasClass('slick-slider')) {
                initSlick($wrapper);
            }
        } else {
            if ($wrapper.hasClass('slick-slider')) {
                $wrapper.slick('unslick');
            }
        }
    }

    function initSlick($wrapper) {
        $wrapper.slick({
            mobileFirst: true,
            arrows: true,
            prevArrow: '<button type="button" class="slick-prev"></button>',
            nextArrow: '<button type="button" class="slick-next"></button>',
            dots: true,
            adaptiveHeight: false,
            // autoplay: true,
            fade: true,
            centerMode: true
        });
    }

    function initShariff() {
        var $wrapper = $('.jf-shariff');
        if (!$wrapper[0]) return;

        var pinterestImagePath = function () {
            var path = $wrapper.find('img').attr('src');
            if (path === undefined) { return "" }
            if (path.match(/http/)) {
                return path;
            }
            var protocol = window.location.protocol + '//';
            var url = window.location.host;
            return (protocol + url + path);
        }()

        var url = location.href;
        var lang = $('html').attr('lang').split('-')[0];
        var $shariff = $wrapper.find('.shariff');
        if (!$shariff[0].hasOwnProperty('shariff')) {
            $shariff.attr('data-lang', lang);
            $shariff.attr('data-media-url', pinterestImagePath);
            $shariff[0].shariff = new Shariff($shariff[0]);
            $shariff.find('.shariff-button.mail').children('a').attr('href', 'mailto:?body=' + url);

            var $buttons = $shariff.find('.shariff-button');

            addSNSAnalyticsTags($buttons);
        }
    }

    function initShariffWithNewsCred() {
        var $wrapper = $('.jf-shariff-newsCred');
        if (!$wrapper[0]) return;
        $wrapper.each(function() {
            createShariffButtons($(this));
        });
    }

    function createShariffButtons($article) {
        if ($article.find('.shariff').length != 0) return;
        var services = "[&quot;facebook&quot;,&quot;twitter&quot,&quot;pinterest&quot,&quot;mail&quot;]";
        var lang = $('html').attr('lang').split('-')[0];
        var title = $article.data('article-title');
        var url = $article.data('article-path');
        var mediaUrl = $article.data('article-image-url');
        var $shariff = $('<div class="shariff"'
                         + ' data-services="' + services + '"'
                         + ' data-title="' + title + '"'
                         + ' data-url="' + url + '"'
                         + ' data-media-url="' + mediaUrl + '"'
                         + ' data-lang="' + lang + '"'
                         + '></div>');
        $article.append($shariff);
        $shariff.shariff = new Shariff($shariff);
        var $link = $shariff.find('.shariff-button.mail').children('a')
        $link
            .attr('href', 'mailto:?body=' + url)
            .removeAttr('target');

        var $buttons = $shariff.find('.shariff-button');

        addSNSAnalyticsTags($buttons);
    }


    function initAdhocGallery() {
        var filtersArray = [];
        var filters = $('.AdhocGallery__filters');
        var captions = $('.AdhocGallery a .l-Image__caption .cmn-richtext span');

        for(var i = 0; i < captions.length; i++){
            var caption = $(captions[i]).html();
            var finalCaption = $.trim(caption.toUpperCase());
            if( $.inArray(finalCaption,filtersArray) == -1){
                filtersArray.push(finalCaption);
            }
        }
        for(var p = 0; p < filtersArray.length; p++){
            filters.append("<li data-filter='"+filtersArray[p]+"'>"+filtersArray[p]+"</li>"); 
        }
        $("ul.AdhocGallery__filters").on("click","li", function(e){
            e.preventDefault();
            var dataFilterClass = $.trim(($(this).attr('data-filter')));

            $("ul.AdhocGallery__filters li").removeClass('active');

            if(dataFilterClass != "*"){
                $(this).addClass('active');
                var dot = '.';
                var finalDataFilterClass = dot.concat(dataFilterClass);
                var lowerCaseDataFilterClass = finalDataFilterClass.toLowerCase();
                var upperCaseDataFilterClass = finalDataFilterClass.toUpperCase();
                $('.AdhocGallery .l-TileLinkVP__list li.l-TileLinkVP__list__tile').hide();
                $(lowerCaseDataFilterClass).parent().show();
                $(upperCaseDataFilterClass).parent().show();
            }
            else{
                $('.AdhocGallery .l-TileLinkVP__list li.l-TileLinkVP__list__tile').show();
                $(this).addClass('active');
            }
        });
    }

    function initShariffAdhocGallery() {
        var wrapper = $('.AdhocGallery > ul > li');
        if (!wrapper[0]) {
            return;
        }

        wrapper.each(function() {
            var articlePath = $(this).find("> a").prop('href');
            var articleImageUrl = $(this).find("img").prop('src');
            var  shariffDiv = $(this).find('.jf-shariff-adhocGallery');
            shariffDiv.attr('data-article-path', articlePath);
            shariffDiv.attr('data-article-image-url', articleImageUrl);

            window.jfAPI.createShariffButtons(shariffDiv);
        });
    }
    /**
  * add Adobe Analytics Tag to Shariff
  */
    function addSNSAnalyticsTags($buttons) {
        $buttons.each(function(index, el) {
            var $self = $(el);
            var snsName = function() {
                var classes = $self.attr('class').split(' ');
                return classes[classes.length - 1];
            }();
            $self.on('click', function() {
                // Adobe Analytics Tag
                s.linkTrackVars = "events";
                if(snsName == 'facebook') {
                    s.linkTrackEvents="event12";
                    s.events="event12";
                    s.tl(this,'o','fb_share');
                } else if(snsName == 'twitter') {
                    s.linkTrackEvents="event13";
                    s.events="event13";
                    s.tl(this,'o','tw_TWEET');
                } else if(snsName == 'pinterest') {
                    s.linkTrackEvents="event14";
                    s.events="event14";
                    s.tl(this,'o','Pint_pin it');
                } else if(snsName == 'mail') {
                    s.linkTrackEvents="event51";
                    s.events="event51";
                    s.tl(this,'o','Mail_Click');
                }
            });
        });
    }


    /**
   * FAQ Category Listing
  */
    function initFaqCategoryListing() {
        var $target = $('.js-faq_category_listing');

        if( !$target[0] || isAuthorring ) return;

        var $link = $target.find('.l-Image.is-link');

        $link.each(function(){
            var $me = $(this);
            var url = $me.attr('href');
            var path = url.split('?');
            var params;
            var keys = {};

            if(jQuery.isArray(path) && path.length > 1) {
                params = path[1].split('&');
                if(jQuery.isArray(params)) {
                    for(var i = 0; i < params.length; i++) {
                        keys[params[i].split('=')[0]] = params[i].split('=')[1];
                    }
                    if(keys.q) {
                        $me.on('click', function(){
                            addSearchAnalytics(keys.q);
                        });
                    }
                }
            }
        });
    }

    /**
   * Analytics for Search Link
  */
    function initFaqSearchLink() {
        var $target = $('.js-faq_search_product');

        var $link = $target.find('a');

        if( !$link[0] || isAuthorring ) return;

        $link.on('click', function(el) {
            addSearchAnalytics('');
        });
    }
    /*Events for header*/
    function initBrandHeader(){
        $(".jf-Header__navToggle").click(function(){
            if($(this).hasClass("is-open")){
                $("body").addClass("jf_header_overflow");
            }else {
                $("body").removeClass("jf_header_overflow");
            }
        });

        $(".jf_header_gp").on("mouseover",function(event){
            if(window.innerWidth >= "1025"){
                if($(this).hasClass("jf_header_gp_product")){
                    $(".jf_header_prod_drop_down").show();
                }else{
                    $(".jf_header_prod_drop_down").hide();
                }

            }		

        });

        $(".jf_header_prod_drop_down").on("mouseleave",function(event){
            if(window.innerWidth >= "1025"){
                $(".jf_header_prod_drop_down").hide();
                $(".jf-Header__prod__nav__arrow").addClass("jf-Header__prod__nav__arrow__next");
                $(".jf-Header__prod__nav__arrow").removeClass("jf-Header__prod__nav__arrow__down");
            }

        });

        $(".jf-Header__prod__nav__arrow").click(function(event){
            event.preventDefault();
            $(".jf_header_prod_drop_down").toggle();
            if($(".jf_header_prod_drop_down").css("display")=="block"){

                $(".jf-Header__prod__nav__arrow").removeClass("jf-Header__prod__nav__arrow__next");
                $(".jf-Header__prod__nav__arrow").addClass("jf-Header__prod__nav__arrow__down");
                $("#common_text_link_unit_20180217190106470_qBRB").removeClass("jf-Header__txt__color");
                $(".jf-Header__mainNav").addClass("jf-Header__adjust_height");


            }	else {

                $(".jf-Header__prod__nav__arrow").addClass("jf-Header__prod__nav__arrow__next");
                $(".jf-Header__prod__nav__arrow").removeClass("jf-Header__prod__nav__arrow__down");
                $("#common_text_link_unit_20180217190106470_qBRB").addClass("jf-Header__txt__color");
                $(".jf-Header__mainNav").removeClass("jf-Header__adjust_height");
            }
        });	

    }


    /**
   * Analytics for Search Form
  */
    function initFormAnalytics() {
        var $form = $('.js-searchForm');

        if( !$form[0] || isAuthorring ) return;

        $form.on('submit', function(el) {
            var q = $(this).find('input[name=q]').val();

            addSearchAnalytics(q);
        });
    }

    function addSearchAnalytics(q) {
        s.linkTrackVars="prop17,eVar17,events";
        s.linkTrackEvents="event22";
        s.prop17=q;
        s.eVar17="D=c17";
        s.events="event22";
        s.tl(this,'o','On site search');
    }


    /**
   * Resize for Search Result iframe
  */
    function initPostHeight() {
        if (window != window.parent) {
            window.addEventListener('load', function () {
                postHeight();
            });
            window.addEventListener('resize', function () {
                postHeight();
            });

            function postHeight() {
                var height = document.getElementsByTagName("html")[0].scrollHeight;
                window.parent.postMessage(["setHeight", height], "*");
            }
        }
    }

    /**
  * C450x COOKIE BAR show overlay
  */
    jfAPI.showCookieOverlay = function() {
        if(window.MF_CAPTURE) {
            return true;
        }
        toggleCookieBarBox(true, '#jfCookieConfirm');
    }

    /**
  * createShariffButtons
  */
    jfAPI.createShariffButtons = function($article) {
        createShariffButtons($article);
    }

    
    /*Footer signup functions*/
    $(document).ready(function(){

        var formId='#JF_footer_sign_up';

        //form fields
        var emailId='#JF_footer_sign_up_email';
        var submitClass = '.SiteFooter__signupSubmit';

        //email
        var email_errorMsg1='#email_error_msg1';//enter email address
        var email_errorMsg2='#email_error_msg2';//should not be more than 255 chars
        var email_errorMsg3='#email_error_msg3';//invalid email address
        var emailVal = '';

        populatePlaceHolders();

        $(formId + ' input').keypress(function(e){
            //preventFormSubmit(e);
        });

        $(formId + ' input').focusout(function(){
            emailVal = $(emailId).val();
            validateEmailInput(emailVal, email_errorMsg1, email_errorMsg2, email_errorMsg3);
        });

        $(formId + ' input').keyup(function(){
            emailVal = $(emailId).val();
            validateEmailInput(emailVal, email_errorMsg1, email_errorMsg2, email_errorMsg3);
        });

        $(formId + ' ' + submitClass).click(function(e){
            e.preventDefault();
            emailVal = $(emailId).val();

            if(validateEmailInput(emailVal, email_errorMsg1, email_errorMsg2, email_errorMsg3)){
                redirectToNewsletter(emailVal);
            }
        });

    });

    function redirectToNewsletter(ev){
		
		var urln = $('#JF_footer_sign_up_newsletterurl').val();
		if(urln == undefined || urln == ''){
			return;
		}
		if(urln.lastIndexOf('/') == (urln.length - 1)){
			urln = urln.substring(0, urln.length -1);
		}
		if(urln.indexOf('/') != 0){
			urln = '/' + urln;
		}
		var hr = urln + '?emailid=' + ev;
        window.location.href = hr;
    }

    function validateEmailInput(ev, email_errorMsg1, email_errorMsg2, email_errorMsg3){

        $(email_errorMsg1).css('display', 'none');
        $(email_errorMsg2).css('display', 'none');
        $(email_errorMsg3).css('display', 'none');

        if(ev == ''){
            $(email_errorMsg1).css('display', 'block');
            return false;
        }
        else{
            $(email_errorMsg1).css('display', 'none');
        }

        if(ev.length > 255){
            $(email_errorMsg2).css('display', 'block');
            return false;
        }
        else{
            $(email_errorMsg2).css('display', 'none');
        }

        var pattern = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i);
        if (!pattern.test(ev)){
            $(email_errorMsg3).css('display', 'block');
            return false;
        }
        else {
            $(email_errorMsg3).css('display', 'none');
        }

        return true;
    }

    function populatePlaceHolders(){
        var inputs, index;
        inputs = document.getElementsByClassName("form_field_text");
        for (index = 0; index < inputs.length; ++index) {
            var input = inputs[index];
            input .placeholder = $('label[for=' + input .id + ']').text();
        }
    }

    function preventFormSubmit(e){

        var key = e.charCode || e.keyCode || 0;
        if (key == 13) {
            //alert("I told you not to, why did you do it?");
            e.preventDefault();
        }
    }

})(window, window.jfAPI || (window.jfAPI = {}));
