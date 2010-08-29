// Run $ expresso

/**
 * Module dependencies.
 */

var app = require('../server'),
  couchdb = app.db,
  sys = require('sys');

module.exports = {
  'GET /apartments with no parameters lists all': function(assert) {
    var query;
    
    couchdb.view = function(design, view, _query, callback) {
      query = _query;
      callback(null, {
        rows: [
          {doc: {_id: 'apartment-1', title: 'my apartment'}}
        ]
      })
    };
    

    assert.response(app, {
      url: '/apartments',
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
        },
      },
      {
        status: 200
      },
      function(res) {
        assert.eql({include_docs: true}, query);
        assert.eql(JSON.parse(res.body), [{_id: 'apartment-1', title: 'my apartment'}]);
      });
  }
};
