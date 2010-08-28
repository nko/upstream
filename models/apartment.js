module.exports.Apartment = {
  from_params: function(params, location, transloadit){
    var apartment =  _(params).extend({type: 'apartment', lat: location.lat, lng: location.lng, city: 'Berlin', country: 'Germany'});
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
