// Run $ expresso

/**
 * Module dependencies.
 */

var app = require('../server'),
  couchdb = app.db,
  sys = require('sys');

module.exports = {
  'Get /tags returns matching tags': function(assert){
    var query;
    couchdb.view = function(design, view, _query, callback) {
      query = _query;
      callback(null, {
        rows: [
          {key: 'bathtub'},
          {key: 'balcony'}
        ]
      })
    };
    
    assert.response(app, {
      url: '/tags?q=ba',
      method: 'GET'},
      {status: 200},
      function(res) {
        assert.eql(query, {startkey: 'ba', endkey: "ba\u9999", limit: 20, group: true})
        assert.eql(JSON.parse(res.body), ['bathtub', 'balcony']);
      });
  }
};