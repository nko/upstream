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
  
  w4lls.load_apartments = function(map) {
    // get the apartments from the server
    var apartments = [];
    
    // var bounds = map.getBounds();
    // var southWest = bounds.getSouthWest();
    // var northEast = bounds.getNorthEast();
    // var lngSpan = northEast.lng() - southWest.lng();
    // var latSpan = northEast.lat() - southWest.lat();
    // for (var i = 0; i < 10; i++) {
    //   var point = new GLatLng(southWest.lat() + latSpan * Math.random(),
    //       southWest.lng() + lngSpan * Math.random());
    //   map.addOverlay(new GMarker(point));
    // }
  }
  
  w4lls.map = w4lls.load_map();
  w4lls.load_apartments(w4lls.map);
});