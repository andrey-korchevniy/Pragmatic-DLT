'use strict';

$(document).ready(function() {
  const language = window.location.pathname.endsWith('-zh.html') ?
      'chinese' :
      'english';

  const READ_MORE_TEXTS = {
    default: language === 'english' ? 'read more' : '了解更多',
    toggled: language === 'english' ? 'hide' : '收藏',
  };

  $('.offer').click(function() {
    const openedOffer = $('.offer.toggled')[0];
    const anotherOfferOpened = openedOffer && !($(openedOffer).is(this));
    const toggled = $(this).hasClass('toggled');
    const readMoreBtn = $(this).find('.read-more');

    const showOffer = () => {
      $(this).addClass('toggled');
      $(readMoreBtn).siblings('img').css({'display': 'block'});
      $(this).find('p').slideDown(300);
      $(readMoreBtn).siblings('.deliverable').show();
      $(readMoreBtn).text(READ_MORE_TEXTS.toggled);
    };

    const hideOffer = () => {
      $(this).removeClass('toggled');
      $(readMoreBtn).siblings('img').hide();
      $(this).find('p').slideUp(300);
      $(readMoreBtn).siblings('.deliverable').hide();
      $(readMoreBtn).text(READ_MORE_TEXTS.default);
    };

    const hideOpenedOffer = () => {
      $(openedOffer).removeClass('toggled');
      $(openedOffer).find('img').hide();
      $(openedOffer).find('p').hide();
      $(openedOffer).find('.deliverable').hide();
      $(openedOffer).find('.read-more').text(READ_MORE_TEXTS.default);
    };

    if ($(window).width() > 960) {
      return;
    }

    if (anotherOfferOpened) {
      hideOpenedOffer();
      showOffer();
    } else if (toggled) {
      hideOffer();
    } else {
      showOffer();
    }
  });

  $('.team-member').click(function() {
    const info = $(this).children('.info');
    const openedInfo = $('.team-member .info.toggled')[0];
    const anotherInfoOpened = openedInfo && !($(openedInfo).is(info));
    const toggled = $(info).hasClass('toggled');

    const showInfo = () => {
      $(info).addClass('toggled');
      $(info).children('.bio').slideDown(300);
      $(this).find('.badge .read-more').hide();
    };

    const hideInfo = (element) => {
      $(element).removeClass('toggled');
      $(element).children('.bio').slideUp(300);
      $(element).find('.badge .read-more').show();
    };

    if (anotherInfoOpened) {
      hideInfo(openedInfo);
      showInfo();
    } else if (toggled) {
      hideInfo(info);
    } else {
      showInfo();
    }
  });

  /* Scroll */
  $('a[href*="#"]').
      not('[href="#"]').
      not('[href="#0"]').
      not('[href="#contact"]').
      click(function(event) {
        if (
            location.pathname.replace(/^\//, '') ===
            this.pathname.replace(/^\//, '')
            &&
            location.hostname === this.hostname
        ) {
          let target = $(this.hash);
          target = target.length ?
              target :
              $('[name=' + this.hash.slice(1) + ']');

          if (target.length) {
            event.preventDefault();

            $('html, body').animate({
              scrollTop: target.offset().top,
            }, 600, function() {
              const $target = $(target);
              $target.focus();

              if ($target.is(':focus')) {
                return false;
              } else {
                $target.attr('tabindex', '-1');
                $target.focus();
              }
            });
          }
        }
      });

  $('a.insight').each(function(){
    $clamp(this, {clamp: 3});
  });
});