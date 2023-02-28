'use strict';

$(document).ready(function() {
  $('.menu-button').click(function() {
    const menu = $(this).siblings('div');
    const isMenuOpened = $(menu).css('display') === 'flex';

    $(menu).css({'display': isMenuOpened ? 'none' : 'flex'});
  });

  $('.mobile-menu div a, .mobile-menu div button').click(function() {
    $('.mobile-menu > div').hide();
  });

  $('.language > button').click(function() {
    $(this).siblings('div').toggle();
  });

  $('.contact button, .contact-us').click(function(event) {
    event.preventDefault();

    FB.CustomerChat.showDialog();
  });
});