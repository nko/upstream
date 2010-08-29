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
});