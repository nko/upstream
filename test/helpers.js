module.exports = {
  google_geo_request: function(options, test_callback) {
    options = options || {};
    return function(host, query, callback) {
      if(test_callback) {
        test_callback(query);
      };
      
      callback(null, JSON.stringify(
        {
          "results": [ {
            "geometry": {
              "location": {
                "lat": options.lat || 54.421,
                "lng": options.lng || 13.082
              }
            }
          } ]
        }
      ));
    }
  }
}