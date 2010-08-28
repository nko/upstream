module.exports.Query = {
  build: function(params) {
    var query = [];
    if(params.north) {
      query.push('lat<float>:[' + params.south + ' TO ' + params.north + '] AND lng<float>:[' + params.west + ' TO ' + params.east + ']');
    };
    if(params.price_min) {
      query.push('price<float>:[' + params.price_min + ' TO ' + params.price_max + ']');
    };
    if(params.size_min) {
      query.push('size<float>:[' + params.size_min + ' TO ' + params.size_max + ']');
    };
    if(params.rooms_min) {
      query.push('rooms<int>:[' + params.rooms_min + ' TO ' + params.rooms_max + ']');
    };
    return query.join(' AND ');
  }
};