$(function() {
  w4lls.load_map = function() {
    var initialLocation = new google.maps.LatLng(52.52, 13.37);
    var myOptions = {
      zoom: 11,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center: initialLocation,
      scrollwheel: false,
      navigationControl: true,
      navigationControlOptions: {
        position: google.maps.ControlPosition.RIGHT
      },
      scaleControl: true,
      scaleControlOptions: {
        position: google.maps.ControlPosition.BOTTOM
      }
    };
    
    w4lls.map = new google.maps.Map(document.getElementById("map"), myOptions);
    google.maps.event.addListener(w4lls.map, 'dragend', function() {
      w4lls.load_apartments();
    });
    
    w4lls.load_apartments();
  };
  
  w4lls.show_apartment = function(apartment, map) {
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(apartment.lat, apartment.lng),
      title: apartment.title
    });
    w4lls.apartments.push(marker);

    function build_info_window() {
      var content = w4lls.mustache(w4lls.show_template, apartment);
      var infowindow = new google.maps.InfoWindow({ content: content });

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker);
      });      
    }
    
    if(w4lls.show_template) {
      build_info_window();
    } else {
      $.get('/views/apartments/show.mustache', function(template) {
        w4lls.show_template = template;
        build_info_window();
      });
    }
    
    marker.setMap(map);
  };
  
  w4lls.clear_apartments = function() {
    w4lls.apartments.forEach(function(apartment) {
      apartment.setMap(null);
    });
  };
  
  w4lls.load_apartments = function(map, filters) {
    map = map || w4lls.map;
    
    var url = '/apartments',
      bounds = map.getBounds();
    if(bounds) {
      var shared = $('#filters .shared'),
        entire = $('#filters .entire'),
        min_price = $("#price_range").slider("values", 0),
        max_price = $("#price_range").slider("values", 1),
        min_space = $('#space_range').slider("values", 0),
        max_space = $('#space_range').slider("values", 1),
        tags = $('#filters #tags').val(),
        url = '/apartments?north=' + bounds.T.b + '&south=' + bounds.T.c + 
          '&west=' + bounds.L.b + '&east=' + bounds.L.c;
    }
    
    $.get(url, function(apartments) {
      apartments.forEach(function(apartment) {
          w4lls.clear_apartments();
          w4lls.show_apartment(apartment, map);
      });
    });
  };

  w4lls.load_map();
});