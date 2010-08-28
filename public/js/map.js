$(function() {
  w4lls.load_map = function() {
    if(GBrowserIsCompatible()) {
      var map = new GMap2(document.getElementById("map"));
      map.setCenter(new GLatLng(52.52, 13.37), 11);
      map.setUIToDefault();
      return map;
    };
  }
  
  w4lls.load_apartments = function(map) {
    // get the apartments from the server
    var apartments = [];
    
    var bounds = map.getBounds();
    var southWest = bounds.getSouthWest();
    var northEast = bounds.getNorthEast();
    var lngSpan = northEast.lng() - southWest.lng();
    var latSpan = northEast.lat() - southWest.lat();
    for (var i = 0; i < 10; i++) {
      var point = new GLatLng(southWest.lat() + latSpan * Math.random(),
          southWest.lng() + lngSpan * Math.random());
      map.addOverlay(new GMarker(point));
    }
  }
  
  w4lls.map = w4lls.load_map();
  w4lls.load_apartments(w4lls.map);
  
});