$(function() {
  // tag editor
  (function() {
    var options = {
      separator: ',',
      completeOnSeparator: true
    };
    $("#apartment_tags").tagEditor(options);
    $("#tags").tagEditor(options);
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
    $("#top_slider").slideToggle("normal");
    return false;
  });
  
  w4lls.hide_filters = function(filters) {
    filters.animate({left: '-305px'});
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
  
  var details_container = $('#details_container');
  var width = details_container.css('width');
  details_container.css('right', '-' + width);
  
  w4lls.show_details = function(apartment) {
    var show_big_details = function() {
      var filters = $('#filters'),
        details_container = $('#details_container'),
        width = details_container.css('width');

      details_container.html(Mustache.to_html(w4lls.big_details_template, apartment));
      w4lls.hide_filters(filters);
      details_container.animate({right: '-3px'});
      
      details_container.click(function() {
        w4lls.show_filters(filters);
        details_container.animate({right: '-' + width});
      });      
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
  }
});