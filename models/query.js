module.exports.Query = {
  build: function(params) {
    var query = [];
    if(params.north) {
      query.push(range_query('lat', 'float', params.south, params.north));
      query.push(range_query('lng', 'float', params.west, params.east));
    };
    if(params.price_min) {
      query.push(range_query('price', 'int', params.price_min, params.price_max));
    };
    if(params.size_min) {
      query.push(range_query('size', 'int', params.size_min, params.size_max));
    };
    if(params.rooms_min) {
      query.push(range_query('rooms', 'int', params.rooms_min, params.rooms_max));
    };
    return query.join(' AND ');

    function range_query(field, type, min, max) {
      var values = [min, max].sort();
      return field + '<' + type + '>:[' + values[0] + ' TO ' + values[1] + ']';
    }
  }
};