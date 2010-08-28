w4lls.app = $.sammy(function() {
  this.use(Sammy.Mustache);
  this.element_selector = '#wrapper';
  
  this.get('#/', function() {});
  
  this.swap = function(content) {
    this.$element().append(content);
    this.trigger('done-swapping');
  };
  
  this.get('#/apartments/new', function(context) {
    w4lls.app.bind('done-swapping', function() {
      var stringified_transloadit_params = JSON.stringify(w4lls.transloadit_params),
        form = $('#new_apartment form');
      
      form.find('#transloadit_params').val($('<div></div>').text(stringified_transloadit_params).html());
      form.transloadit({
        wait: true,
        autoSubmit: false,
        onSuccess: function(assembly) {          
          form.ajaxSubmit({
            no_file_uploads: true,
            success: function(apartment) {
              if(apartment && apartment.lat && apartment.lng) {
                w4lls.show_apartment(apartment, w4lls.map);
              }
              $('#new_apartment').remove();
              context.redirect('#/');
            }
          });
        }
      });      
    });
    this.partial('../views/apartments/new.mustache');
  });
});

$(function() {
  $(window).resize(function() {
    $('#map').height($(window).height() - $("#header").height() - $("#footer").height() - $("#bookmarks").height());
  });
  $(window).trigger("resize");
  
  w4lls.app.run('#/');
  
  w4lls.transloadit_params = {
    auth: {
      key: '4c791226c09040dd98af27d472ec3211'
    },
    steps: {
      small: {robot: '/image/resize', width: 220, height: 140, use: ':original'},
      middle: {robot: '/image/resize', width: 320, height: 240, use: ':original'},
      big: {robot: '/image/resize', width: 640, height: 480, use: ':original'}
    },
    redirect_url: 'http://' + w4lls.host + '/apartments'
  }
  // sliders
  $(function() {
		$("#slider-range").slider({
			range: true,
			min: 10,
			max: 2000,
			step: 50,
			values: [10, 2000],
			slide: function(event, ui) {
				$("#amount").val('$' + ui.values[0] + ' - $' + ui.values[1]);
			}
		});
		$("#amount").val('$' + $("#slider-range").slider("values", 0) + ' - $' + $("#slider-range").slider("values", 1));
	});
  
  $("form#ui input").filter(":checkbox,:radio").checkbox();
  
});