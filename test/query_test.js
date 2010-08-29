// Run $ expresso

/**
 * Module dependencies.
 */

var Query = require('../models/query').Query,
  sys = require('sys');

module.exports = {
  '#build with price': function(assert) {
    var query = Query.build({price_min: '3', price_max: '4'});
    assert.equal('price<int>:[3 TO 4]', query);
  },
  '#build with rooms': function(assert) {
    var query = Query.build({rooms_min: '3', rooms_max: '4'});
    assert.equal('rooms<int>:[3 TO 4]', query);
  },
  '#build with size': function(assert) {
    var query = Query.build({size_min: '3', size_max: '4'});
    assert.equal('size<int>:[3 TO 4]', query);
  },
  '#build with geolocation': function(assert) {
    var query = Query.build({north: '5.0', south: '3.0', east: '6.0', west: '1.0'});
    assert.equal('lat<float>:[3.0 TO 5.0] AND lng<float>:[1.0 TO 6.0]', query);
  },
  '#build with geolocation queries from smaller to larger value': function(assert) {
    var query = Query.build({north: '3.0', south: '5.0', east: '1.0', west: '6.0'});
    assert.equal('lat<float>:[3.0 TO 5.0] AND lng<float>:[1.0 TO 6.0]', query);
  },
  '#build with multiple attributes': function(assert) {
    var query = Query.build({size_min: '3', size_max: '4', rooms_min: '6', rooms_max: '8'});
    assert.equal('size<int>:[3 TO 4] AND rooms<int>:[6 TO 8]', query);
  },
  
};
