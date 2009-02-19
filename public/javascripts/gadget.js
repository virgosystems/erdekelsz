var Gadget = {
  host: backendHost,

  init: function() {
    $.gadgeteer.simpleRequest('/profiles/'+$.gadgeteer.owner.id, true);
  },

  linkBehaviours: {
    navigate: function() {
      var m;
      if (m = $(this).attr('href').match(/^\/profile\/([^\/]*)$/)) {
        var profileId = m[1];
        return ["canvas", {navigateTo: m[0], signedNavigate: true}, profileId];
      }
    },
  }
}

$.gadgeteer(Gadget.init, {
  host: Gadget.host,
  linkBehaviours: Gadget.linkBehaviours
});
