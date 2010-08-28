$(function() {

  $(window).resize(function() {
    $('#map').height($(window).height() - $("#header").height() - $("#footer").height() - $("#bookmarks").height());
  });
  $(window).trigger("resize");

  var amount_slider = $("#slider-range");
	amount_slider.slider({
		range: true,
		min: 10,
		max: 2000,
		step: 50,
		values: [10, 2000],
		slide: function(event, ui) {
			$("#amount").val('$' + ui.values[0] + ' - $' + ui.values[1]);
			
		}
	});
	
	var min = amount_slider.slider("values", 0),
	  max = amount_slider.slider("values", 1);
	$("#amount").val('$' + min + ' - $' + max);

  $("form#ui input").filter(":checkbox,:radio").checkbox();




  
});
