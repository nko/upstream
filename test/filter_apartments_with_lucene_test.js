// Run $ expresso

/**
 * Module dependencies.
 */

var app = require('../server'),
  couchdb = app.db,
  sys = require('sys');

module.exports = {
  'GET /apartments with lat/lng filters apartments by geo location': function(assert) {
    var path, query;
    
    couchdb.request = function(_path, _query, callback) {
      path = _path;
      query = _query;
      callback(null, {
        rows: [
          {doc: {_id: 'apartment-1', title: 'my apartment'}}
          ]
      })
    };

    assert.response(app, {
      url: '/apartments?north=5.0&south=3.0&east=6.0&west=1.0',
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
        },
      },
      {
        status: 200
      },
      function(res) {
        assert.equal('/_fti/_design/apartment/by_filters', path);
        assert.eql({q: 'lat<float>:[3.0 TO 5.0] AND lng<float>:[1.0 TO 6.0]', include_docs: true}, query);
        assert.eql(JSON.parse(res.body), [{_id: 'apartment-1', title: 'my apartment'}]);
      });
  }
};
