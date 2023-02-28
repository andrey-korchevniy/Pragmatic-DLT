'use strict';

function gtag_report_conversion(url) {
  const callback = function() {
    if (typeof(url) !== 'undefined') {
      window.location = url;
    }
  };

  gtag('event', 'conversion', {
    'send_to': 'AW-794029304/sqAYCNblpIcBEPjZz_oC',
    'event_callback': callback,
  });

  return false;
}

$(document).ready(function() {
    $('a.apply').click(function() {
        fbq('track', 'Lead');
        gtag_report_conversion();
    });
});