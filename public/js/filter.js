$(function() {
  $(window).resize(function() {
    $('#map').height($(window).height() - $("#header").height() - $("#footer").height() - $("#bookmarks").height());
  });
  $(window).trigger("resize");

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
});