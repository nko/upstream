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
    var map = new google.maps.Map(document.getElementById("map"), myOptions);
    
    return map;
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
  
  w4lls.load_apartments = function(map) {
    $.get('/apartments', function(apartments) {
      apartments.forEach(function(apartment) {
          w4lls.show_apartment(apartment, map);
      });
    });    
  };

  w4lls.map = w4lls.load_map();
  w4lls.load_apartments(w4lls.map);    
});