// Run $ expresso

/**
 * Module dependencies.
 */

var app = require('../server'),
  couchdb = app.db,
  hl_http_client = app.hl_http_client,
  sys = require('sys'),
  querystring = require('querystring');

module.exports = {
  'POST /apartments': function(assert){
    var doc, google_query;
    couchdb.saveDoc = function(_doc, callback) {
      doc = _doc; 
      callback();
    };
    
    hl_http_client.get = function(host, query, callback) {
      google_query = query;
      callback(null, JSON.stringify(
        {
          "results": [ {
            "geometry": {
              "location": {
                "lat": 37.4217080,
                "lng": -122.0829964
              }
            }
          } ]
        }
        ));
    } 
    
    assert.response(app, {
      url: '/apartments',
      method: 'POST',
      data: 'title=test+apartment&address=broadway+5&post_code=10999',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      },
      {
        status: 201
      },
      function(res) {
        assert.equal(querystring.unescape(google_query), '/maps/api/geocode/json?address=broadway 5, 10999, Berlin, Germany&sensor=false')
        assert.eql(doc, {title: 'test apartment', address: 'broadway 5', city: 'Berlin', country: 'Germany', post_code: '10999', lat: 37.4217080, lng: -122.0829964});
      });
  }
};