$.gadgeteer = function(callback, options) {
  // If called with callback, notify it if we're ready
  if ($.isFunction(callback)) {
    options = options || {};
    $.gadgeteer.defaultTarget = options.defaultTarget || '#page';
    $.gadgeteer.host = options.host || '';

    // Setup link behaviours
    if (options.linkBehaviours) {
      $.gadgeteer.linkBehaviours = options.linkBehaviours;
      // All anchor tags will perform an ajax call
      $('a').livequery('click', function(e) {
        $.gadgeteer.handleLinkBehaviour.call($(this), e);
      }).removeAttr('onclick');
    }

    if (!options.noAjaxForms) {
      // All forms will submit through an ajax call
      $('form').livequery('submit', function(e) {
        e.preventDefault();
        var form = $(this);
        var action = form.attr('action');
        var target = form.hasClass('silent') ? null : $.gadgeteer.defaultTarget;
        $.ajax({
          url: action.charAt(0) == '/' ? $.gadgeteer.host + action : action,
          type: form.attr('method') || 'GET',
          data: [$.param(form.formToArray()), $.param($.gadgeteer.viewer.osParams())].join("&"),
          dataType: 'html',
          auth: 'SIGNED',
          target: target
        });
      });
    }

    // Wait for everything to load then call the callback
    setTimeout(function() {
      if ($.gadgeteer.viewer && $.gadgeteer.owner) {
        // Navigate away if params tell so
        var navTo = gadgets.views.getParams().navigateTo;
        if (navTo) {
          $.gadgeteer.simpleRequest(navTo);
        } else {
          callback();
        }
      } else {
        setTimeout(arguments.callee, 50);
      }
    }, 50);

  } else { // if called with no arguments it means we're initializing
    // Get information about the viewer and owner
    $.getData('/people/@viewer/@self', function(data, status) {
      $.gadgeteer.viewer = data[0];
      $.gadgeteer.viewer.osParams = function() {return $.gadgeteer._osParams.call($.gadgeteer.viewer, 'viewer')};
    });
    $.getData('/people/@owner/@self', function(data, status) {
      $.gadgeteer.owner = data[0];
      $.gadgeteer.owner.osParams = function() {return $.gadgeteer._osParams.call($.gadgeteer.owner, 'owner')};
    });
  }
}

$.extend($.gadgeteer, {
  _osParams: function(name) {
    var params = {};
    for (var attr in this) {
      if (!$.isFunction(this[attr])) {
        var underscore = attr.replace(/([A-Z])/, '_$1').toLowerCase();
        params['os_'+name+'_'+underscore] = this[attr];
      }
    }
    return params;
  },

  simpleRequest: function(href) {
    var params = {}
    if (href.indexOf('os_viewer_id') == -1) params.os_viewer_id = $.gadgeteer.viewer.id;
    if (href.indexOf('os_owner_id') == -1) params.os_owner_id = $.gadgeteer.owner.id;
    $.ajax({
      type: 'GET',
      data: $.param(params),
      url: href.charAt(0) == '/' ? $.gadgeteer.host + href : href,
      dataType: 'html',
      target: $($.gadgeteer.defaultTarget)
    });
  },

  regularRequest: function(e) {
    // regular request (i.e. normal anchor click through) is a no-op
  },

  ajaxRequest: function(e) {
    e.preventDefault();
    var host = document.location.host;
    var link = $(this);
    var href = link.attr('href');
    var _href = link[0].getAttribute('href');

    //hack for IE href attr bug
    if (_href.match(host)) {
      var l = _href.search(host)+host.length;
      href = _href.substring(l);
    }

    if (href.charAt(0) == '/') href = $.gadgeteer.host + href;

    var params = {};
    var method = link.hasClass('post') ? 'post' : link.hasClass('put') ? 'put' : link.hasClass('delete') ? 'delete' : 'get';
    if (method != 'get') params._method = method;
    if (link.hasClass('signed'))
      params = $.extend(false, params, $.gadgeteer.viewer.osParams());
    else
      params = $.extend(false, params, {os_viewer_id: $.gadgeteer.viewer.id, os_owner_id: $.gadgeteer.owner.id});

    var target = link.hasClass('silent') ? null : $.gadgeteer.defaultTarget;
    $.ajax({
      type: method == 'get' ? 'GET' : 'POST',
      url: href,
      data: params,
      dataType: target ? 'html' : null,
      auth: link.hasClass('signed') ? 'SIGNED' : null,
      target: target
    });
  },

  navigateRequest: function(view, params, ownerId, e) {
    e.preventDefault();
    view = gadgets.views.getSupportedViews()[view];
    gadgets.views.requestNavigateTo(view, params, ownerId); 
  },

  handleLinkBehaviour: function(e) {
    var link = $(this);
    var matched = false;
    $.each($.gadgeteer.linkBehaviours, function(behaviour, callback) {
      var match;
      if ($.isFunction(callback) && (match = callback.call(link, e))) {
        var params = match === true ? [] : ($.isFunction(match.push) ? match : Array(match));
        params.push(e);
        //console.log('calling ', behaviour, ' link behaviour for ', link, ' with ', params);
        var handler = behaviour+'Request';
        handler = $.gadgeteer.linkBehaviours.handlers && $.gadgeteer.linkBehaviours.handlers[handler] || $.gadgeteer[handler];
        handler.apply(link, params);
        matched = true;
        return false;
      }
    });
    if (!matched) {
     var def = $.gadgeteer.linkBehaviours.defaultBehavior || 'ajax';
     //console.log('calling DEFAULT ', def, ' link behaviour for ', link, ' with ', e);
     $.gadgeteer[def+'Request'].call(link, e);
    }
  }

});


// Initialize gadgeteer
$($.gadgeteer)
