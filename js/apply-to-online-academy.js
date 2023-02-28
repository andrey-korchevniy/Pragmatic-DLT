'use strict';

$(document).ready(function() {
  extractSource();

  $('form.gform').submit(handleFormSubmit);

  $('button.usd').click(function() {
    $('form.usd').submit();
  });

  $('button.bitcoin').click(handleBitcoinPayment);
  
  $('button.interkassa').click(function() {
    $('form.interkassa').submit();
  });
});

function extractSource() {
  var urlParams = new URLSearchParams(window.location.search);

  if (urlParams.has('source')) {
    const source = urlParams.get('source');

    $("input[name='source']").val(source);
  }
}

function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const data = getFormData(form);

  $('.gform button[type=submit]').prop('disabled', true).text('Please wait...');

  $.ajax({
    url: form.action,
    dataType: 'text',
    type: 'post',
    data: encodeData(data),
    success: handleRegistration,
    error: function() {
      alert('Ooops, something went wrong! Please reload page');
    },
  });
}

function getFormData(form) {
  const elements = form.elements;
  const fields = extractFields(elements);
  const formData = collectFormData(fields, elements);

  formData.formDataNameOrder = JSON.stringify(fields);
  formData.formGoogleSheetName = form.dataset.sheet || 'responses';
  formData.formGoogleSendEmail = form.dataset.email || '';

  return formData;
}

function extractFields(elements) {
  return Object.keys(elements).filter(function(k) {
    return (elements[k].name !== 'honeypot');
  }).map(function(k) {
    if (elements[k].name !== undefined) {
      return elements[k].name;
      // special case for Edge's html collection
    } else if (elements[k].length > 0) {
      return elements[k].item(0).name;
    }
  }).filter(function(item, pos, self) {
    return self.indexOf(item) === pos && item;
  });
}

function collectFormData(fields, elements) {
  let data = {};

  fields.forEach(function(name) {
    const element = elements[name];

    // singular form elements just have one value
    data[name] = element.value;

    // when our element has multiple items, get their values
    if (element.length) {
      let data = [];

      for (let i = 0; i < element.length; i++) {
        const item = element.item(i);

        if (item.checked || item.selected) {
          data.push(item.value);
        }
      }

      data[name] = data.join(', ');
    }
  });

  return data;
}

function encodeData(data) {
  return Object.keys(data).map(function(k) {
    return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
  }).join('&');
}

function handleRegistration() {
  $('.gform').hide();
  $('.success-enrollment').css({'display': 'flex'});
}

function handleBitcoinPayment() {
  const name = $('form.gform input[name=name]').val();
  const email = $('form.gform input[name=email]').val();

  $.ajax({
    url: 'https://pragmaticdlt.com/bitcoin',
    type: 'post',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify({name, email}),
    success: handleBitcoinServerResponse,
    error: function() {
      alert('Ooops, something went wrong');
    }
  });
}

function handleBitcoinServerResponse(result) {
  $('.pay').hide();
  $('.pay-bitcoin').css({'display': 'flex'});

  $('.pay-bitcoin img').prop('src', `data:image/png;base64, ${result.response.data.qrCode}`);
  $('.pay-bitcoin .amount b').text(result.response.data.amount);
  $('.pay-bitcoin .address').text('Address: ' + result.response.data.address);
}
