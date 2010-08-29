$(function() {
  var reload_with_given_address = function(evt) {
    $.get('/geolocation?q=' + escape($('#searchform #s').val()), function(geolocation) {
      var location = new google.maps.LatLng(geolocation.lat, geolocation.lng);
      w4lls.map.setCenter(location);
      w4lls.map.setZoom(15);
    });
    evt.preventDefault();
    evt.stopPropagation();
  };
  $('#searchform').submit(reload_with_given_address);
  $('#searchform #s').change(reload_with_given_address);
  
  var price_slider = $("#price_range");
	price_slider.slider({
		range: true,
		min: 10,
		max: 2000,
		step: 50,
		values: [10, 2000],
		slide: function(event, ui) {
			$("#price_amount").val('€' + ui.values[0] + ' - €' + ui.values[1]);			
		}
	});
	
	var space_slider = $('#space_range');
	space_slider.slider({
		range: true,
		min: 10,
		max: 2000,
		step: 50,
		values: [10, 2000],
		slide: function(event, ui) {
			$("#space_amount").val('m²' + ui.values[0] + ' - m²' + ui.values[1]);			
		}
	});
	
	var min = price_slider.slider("values", 0),
	  max = price_slider.slider("values", 1);
	$("#price_amount").val('€' + min + ' - €' + max);

	var min = space_slider.slider("values", 0),
	  max = space_slider.slider("values", 1);
	$("#space_amount").val('m²' + min + ' - m²' + max);
	
  $('.reload_apartments').change(function() {
    w4lls.load_apartments();
  });
	
	$(window).bind('reload-apartments', function() {
	  w4lls.load_apartments();
  });
});
