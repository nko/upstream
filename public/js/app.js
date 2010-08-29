$(function() {
  // tag editor
  (function() {
    var tag_editor_options = {
      separator: ',',
      completeOnSeparator: true,
      completeOnBlur: true,
      afterAppend: function() {
        $('#filters .view_indicator').css('height', $('#filters ul').css('height'));
      }
    };
    
    $("#apartment_tags, #tags").autocomplete("/tags", {
  		highlight: false,
  		scroll: true
  	});
    
    $("#apartment_tags").tagEditor(_(tag_editor_options).extend({appendTagsTo: '#tags_for_apartment'}));
    $("#tags").tagEditor(_(tag_editor_options).extend({appendTagsTo: '#tags_for_search'}));
    
    $("#tags").bind('tags-changed', function() {
      $(window).trigger('reload-apartments');
    });
  })();
         
  // transloadit
  var transloadit_params = {
    auth: {
      key: '4c791226c09040dd98af27d472ec3211'
    },
    steps: {
      small: {robot: '/image/resize', width: 220, height: 140, use: ':original'},
      middle: {robot: '/image/resize', width: 320, height: 240, use: ':original'},
      big: {robot: '/image/resize', width: 640, height: 480, use: ':original'},
      store: {robot: '/s3/store', use: ['small', 'middle', 'big']}
    },
    redirect_url: 'http://' + w4lls.host + '/apartments'
  }
  
  var stringified_transloadit_params = JSON.stringify(transloadit_params);
  var form = $('#new_apartment form');
  
  form.find('#transloadit_params').val($('<div></div>').text(stringified_transloadit_params).html());
  form.find('#apartment_availability').datepicker();

  // TODO: how to validate when transloadit seems to be always first?
  form.transloadit({
    wait: true,
    autoSubmit: false,
    onSuccess: function(assembly) {          
      form.prepend($('<input type="hidden" name="transloadit"/>').val(JSON.stringify(assembly)));
      form.ajaxSubmit({
        no_file_uploads: true,
        success: function(apartment) {
          if(apartment && apartment.lat && apartment.lng) {
            w4lls.show_apartment(apartment, w4lls.map);
          }
          $("#top_slider").slideUp("normal");
        }
      });
    }
  });
  
  $("#big_add_link, .cancel_link").click(function () {
    $("#top_slider").slideToggle("slow");
    return false;
  });
  
  w4lls.hide_filters = function(filters) {
    var left = '-' + filters.find('ul').css('width');
    filters.animate({left: left});
    filters.addClass('hidden');    
  };
  
  w4lls.show_filters = function(filters) {
    filters.removeClass('hidden');
    filters.animate({left: '-3px'});    
  };
  
  $('.view_indicator').click(function() {
    filters = $('#filters');
    if(filters.hasClass('hidden')) {
      w4lls.show_filters(filters);
    } else {
      w4lls.hide_filters(filters);
    }
    return false;
  });
  
  w4lls.remember_this = function(apartment) {
    var remembered_apartments = $.jStorage.get("w4lls.apartments", []);
    remembered_apartments.push(apartment);
    $.jStorage.set("w4lls.apartments", remembered_apartments);
    
    w4lls.template('show', 'bookmarks', function() {
      $('#bookmarks').append(Mustache.to_html(w4lls.show_template, apartment));
      $('#bookmarks .bookmark:last a').click(function() {
        w4lls.show_details(apartment);
      });
      $('#bookmarks').show();
    });
  };
  
  $(window).resize(function() {
    var map = $('#map'),
      filters = $('#filters'),
      details_container = $('#details_container'),
      map_height = $(window).height() - $("#header").height() - $("#footer").height() - $("#bookmarks").height(),
      filter_height = filters.height();
      
    map.height(map_height);
    filters.css('margin-top', (map_height - parseInt(filters.css('height'), 10)) / 2);
    details_container.css('margin-top', 24).css('height', map_height - 48);
  });
  $(window).trigger("resize");
  
  var filters = $('#filters');
  filters.find('.view_indicator').css('height', filters.find('ul').css('height'));
  
  var details_container = $('#details_container');
  var width = details_container.css('width');
  details_container.css('right', '-' + width);
  w4lls.show_details = function(apartment, callback) {
    var show_big_details = function() {
      var filters = $('#filters'),
        details_container = $('#details_container'),
        width = details_container.css('width');

      apartment.has_phone = function() { return apartment.phone != undefined; }
      apartment.has_email = function() { return apartment.email != undefined; }

      details_container.html(Mustache.to_html(w4lls.big_details_template, apartment));
      w4lls.hide_filters(filters);
      details_container.animate({right: '-3px'});

      w4lls.close_details_container = function() {
        w4lls.show_filters(filters);
        details_container.animate({right: '-' + width});
      }
      details_container.click(w4lls.close_details_container);
      
      callback(apartment);
    };
    
    w4lls.template('big_details', 'apartments', show_big_details);
  };
  
  w4lls.template = function(template, path, callback) {
    if(w4lls[template + '_template']) {
      callback();
    } else {
      $.get('/views/' + path + '/' + template + '.mustache', function(_template) {
        w4lls[template + '_template'] = _template;
        callback();
      });
    }
  };
  
  w4lls.send_request = function(apartment) {
    var details_container = $('#details_container'),
      contact_request = details_container.find('#contact_request');
    
    contact_request.find('.close_request').click(function(evt) {
      contact_request.hide();
      details_container.find('#details').show();
      details_container.click(w4lls.close_details_container);
      contact_request.find('.close_request').unbind('click');
      evt.stopPropagation();
    });
    
    contact_request.find('form').ajaxForm({
      success: function() {
        contact_request.hide();
        contact_request.find('.close_request').unbind('click');
        details_container.click(w4lls.close_details_container);
        var details = details_container.find('#details');
        details.show();
        details.append('<div class="success">Your request was sent successfully.</div>');
        details.find('.success').delay('4000').fadeOut(function() { $(this).remove(); });
      }
    });
    
    details_container.unbind('click');
    
    details_container.find('#details').hide();
    contact_request.show();
  };
  
  // fix for HTML5 placeholder
  $('[placeholder]').focus(function() {
    var input = $(this);
    if (input.val() == input.attr('placeholder')) {
      input.val('');
      input.removeClass('placeholder');
    }
  }).blur(function() {
    var input = $(this);
    if (input.val() == '') {
      input.addClass('placeholder');
      input.val(input.attr('placeholder'));
    }
  }).blur();
  
  $('[placeholder]').parents('form').submit(function() {
    $(this).find('[placeholder]').each(function() {
      var input = $(this);
      if (input.val() == input.attr('placeholder')) {
        input.val('');
      }
    })
  });
});