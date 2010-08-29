var _ = require('../public/js/underscore')._;

module.exports.Apartment = {
  from_params: function(params, location, transloadit){
    var apartment =  _(params).extend({type: 'apartment', lat: location.lat, lng: location.lng, city: 'Berlin', country: 'Germany'});
    if(apartment.tags && apartment.tags[1]) {
      var string = String(apartment.tags[1]).toString();
      apartment.tags = string.split(',');
    };
    
    if(transloadit) {
      var json = JSON.parse(transloadit);
      apartment.images = _(json.results).reduce(function(memo, images, name) {
        memo[name] = images[0].url;
        return memo;
      }, {});
    };
    return apartment;
  }
};
