var app = {
  host: backendHost,

  init: function() {
    console.log('app init');
    $.gadgeteer.simpleRequest('/test');
  }
}

$.gadgeteer(app.init, {host: app.host});
