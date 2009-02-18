var app = {
  host: backendHost,

  init: function() {
    $.gadgeteer.simpleRequest('/test');
  }
}

$.gadgeteer(app.init, app.host);
