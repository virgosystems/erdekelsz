var Gadget = {
  host: backendHost,

  init: function() {
    $.gadgeteer.simpleRequest('/profiles/'+$.gadgeteer.owner.id, true);
  }
}

$.gadgeteer(Gadget.init, {host: Gadget.host});
