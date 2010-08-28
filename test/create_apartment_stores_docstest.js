// Run $ expresso

/**
 * Module dependencies.
 */

var app = require('../server'),
  couchdb = app.db,
  sys = require('sys'),
  querystring = require('querystring'),
  helpers = require('./helpers');

module.exports = {
  'POST /apartments gets position and stores doc': function(assert){
    var doc, google_query;
    couchdb.saveDoc = function(_doc, callback) {
      doc = _doc; 
      callback(null, {});
    };
    
    var hl_http_client = _(module.moduleCache).detect(function(_, name) {return name.match('highlevel_http_client.js')});
    
    hl_http_client.exports.get = helpers.google_geo_request({lat: 37.4217080, lng: -122.0829964}, function(query) {
      google_query = query;
    });
    
    assert.response(app, {
      url: '/apartments',
      method: 'POST',
      data: querystring.stringify({'apartment[title]': 'test apartment', 'apartment[street]': 'broadway 5', 'apartment[postcode]': '10999'}),
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      },
      {status: 201},
      function(res) {
        assert.equal(querystring.unescape(google_query), '/maps/api/geocode/json?address=broadway 5, 10999, Berlin, Germany&sensor=false');
        assert.eql(doc, {type: 'apartment', title: 'test apartment', street: 'broadway 5', city: 'Berlin', country: 'Germany', postcode: '10999', lat: 37.4217080, lng: -122.0829964});
      });
  }
};