var app = {
  host: backendHost,

  init: function() {
    console.log('app init');
    $.gadgeteer.simpleRequest('/profiles/'+$.gadgeteer.owner.id, true);
  }
}

$.gadgeteer(app.init, {host: app.host});
