$(function() {
  if (GBrowserIsCompatible()) {
    var map = new GMap2(document.getElementById("map"));
    map.setCenter(new GLatLng(52.52, 13.37), 11);
    map.setUIToDefault();
  };
});