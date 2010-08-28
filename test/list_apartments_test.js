// Run $ expresso

/**
 * Module dependencies.
 */

var app = require('../server'),
  couchdb = app.db,
  sys = require('sys');

module.exports = {
  'GET /apartments': function(assert) {
    couchdb.view = function(design, view, query, callback) {
      callback(null, {
        rows: [
          {_id: 'apartment-1', title: 'my apartment'}
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
        assert.eql(JSON.parse(res.body), [{_id: 'apartment-1', title: 'my apartment'}]);
      });
  }
};
