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
  }
  
  w4lls.show_apartment = function(apartment, map) {
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(apartment.lat, apartment.lng),
      title: apartment.title
    });

    marker.setMap(map);    
  }
  
  w4lls.load_apartments = function(map) {
    // console.log("AAAAAAAAA");
    // $.ajax({
    //   url: '/apartments',
    //   type: 'GET',
    //   timeout: 3000,
    //   success: function() { console.log('success'); },
    //   error: function() { console.log('error'); }
    // });
    // var apartments = $.get('/apartments', function(apartments) {
    //   console.log(apartments);
    //   apartments.forEach(function(apartment) {
          // w4lls.show_apartment(apartment, map);
    //   });
    // });    
  }
  
  w4lls.map = w4lls.load_map();
  w4lls.load_apartments(w4lls.map);    
});