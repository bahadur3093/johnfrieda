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
    initC190_filterImage();
	initC270Carousel();
	c190_Carousel();

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
  
  function initC190_filterImage() {
    var $c190__imageTextVP = $('.c190__imageTextVP');
    if (!$c190__imageTextVP[0]) return;

    var length = $c190__imageTextVP.length;
    for (var i = 0; i < length; i++) {
      var $outer = $c190__imageTextVP.eq(i).find('.l-ImageTextVP__contentsBlock');
      var $inner = $outer.find('.l-ImageTextVP__contentsBlock__text');
      $inner.wrapInner('<div class="l-ImageTextVP__contentsBlock__text__inner">');
    }
  }
  /**
   * C190 CAROUSEL
   *
   */
   function initC270Carousel() {
    var $carousel = $('.js-C270Carousel');
    if (!$carousel[0]) return;
    if($.fn.isAuthorring()) {
      $carousel.find('.c270__textblock, .c270__buttons').css({
        'position': 'relative',
        'bottom': 'auto'
      });
      $carousel.find('.l-SlideImagePUnit').css('backgroundColor', '#999');
    } else {
      $carousel.each(function(index){
        var $target = $(this).find('.g-SlideImageP__list');
        if ($target[0].slick === undefined) return true; // slickの初期化がされていない場合、continue
        var $items = $target.find('.l-SlideImagePUnit');
        var autoplay = $target.slick('slickGetOption', 'autoplay');
        var $nav = $target.find('.g-SlideImageP__nav');
        if($target[0]) {
          if($items.length > 1) {
            $target.on('touchmove', function(event){
              if(autoplay && !$target.hasClass('is-pause')) {
                $target.slick('slickPause');
                $target.addClass('is-pause');
              }
            });
            $target.on('beforeChange', function(event, slick, currentSlide, nextSlide){
              if(autoplay && $target.hasClass('is-pause')) {
                $target.slick('slickPlay');
                $target.removeClass('is-pause');
              }
            });

            $nav.find('button').on('mousedown touchstart', function(){
              if(autoplay && !$target.hasClass('is-pause')) {
                $target.slick('slickPause');
                $target.addClass('is-pause');
              }
            });
            $nav.find('button').on('mouseup touchend', function(){
              if(autoplay && $target.hasClass('is-pause')) {
                $target.slick('slickPlay');
                $target.removeClass('is-pause');
              }
            });

            $target.find('.js-c270__prev, .js-c270__next').on('mousedown', function(){
              if(autoplay && !$target.hasClass('is-pause')) {
                $target.slick('slickPause');
                $target.addClass('is-pause');
              }
            });
            $target.find('.js-c270__prev, .js-c270__next').on('mouseup', function(){
              if(autoplay && $target.hasClass('is-pause')) {
                $target.slick('slickPlay');
                $target.removeClass('is-pause');
              }
            });

            $target.on('touchstart', function(){
              if(autoplay && !$target.hasClass('is-pause')) {
                $target.slick('slickPause');
                $target.addClass('is-pause');
              }
            });
            $target.on('touchend', function(){
              if(autoplay && $target.hasClass('is-pause')) {
                $target.slick('slickPlay');
                $target.removeClass('is-pause');
              }
            });

            if ($.fn.isBreakpointLg()) {
              $target.find('.g-SlideImagePUnit *').on('mouseover', function(){
                if(autoplay && !$target.hasClass('is-pause')) {
                  $target.slick('slickPause');
                  $target.addClass('is-pause');
                }
              });
              $target.find('.g-SlideImagePUnit *').on('mouseout', function(){
                if(autoplay && $target.hasClass('is-pause')) {
                  $target.slick('slickPlay');
                  $target.removeClass('is-pause');
                }
              });
            }

            $target.find('.js-c270__prev').on('click', function(){
              $target.slick('slickPrev');
            });
            $target.find('.js-c270__next').on('click', function(){
              $target.slick('slickNext');
            });

            $target.on('beforeChange', function(){
              $target.find('.c270__navi').hide();
            });
            $target.on('afterChange', function(){
              $target.find('.c270__navi').show();
            });
          } else {
            $target.find('.c270__navi').remove();
          }
        }
      });
    }
  }

   
   
   function c190_Carousel() {
    var C190Carousel = (".js-C190Carousel");
    {
      $(C190Carousel).find(".l-ColumnUnit").slick({
      autoplay: true,
      autoplaySpeed: 5000,
      arrows: false,
      dots: true,
      slidesToShow: 3,
      slidesToScroll: 3,
      infinite: true,
      initialSlide: 0,
      responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        initialSlide: 0,
        dots: true
      }
    },
    {
      breakpoint: 641,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
      });
    }
  }
})(window, window.jfAPI || (window.jfAPI = {}));

