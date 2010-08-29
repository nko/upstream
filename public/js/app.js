$(function() {
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
  
  $("#big_add_link").click(function () {
    $("#top_slider").slideToggle("normal");
    return false;
  });
  
  w4lls.remember_this = function() {
    
  };
  
  w4lls.show_details = function(apartment) {
    var show_big_details = function() {
      $("#details_container").html(Mustache.to_html(w4lls.big_details_template, apartment));
      $("#details_container").removeClass("hidden");
      $("#details_container").click(function() {
        $("#details_container").addClass("hidden");
      });      
    };
    
    w4lls.template('big_details', show_big_details);
  };
  
  w4lls.template = function(template, callback) {
    if(w4lls[template + '_template']) {
      callback();
    } else {
      $.get('/views/apartments/' + template + '.mustache', function(_template) {
        w4lls[template + '_template'] = _template;
        callback();
      });
    }
  }
});