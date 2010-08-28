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
  'POST /apartments stores images': function(assert) {
    var doc, google_query;
    couchdb.saveDoc = function(_doc, callback) {
      doc = _doc; 
      callback();
    };
    
    var hl_http_client = _(module.moduleCache).detect(function(_, name) {return name.match('highlevel_http_client.js')});
    
    hl_http_client.exports.get = helpers.google_geo_request({lat: 37.4217080, lng: -122.0829964}, function(query) {
      google_query = query;
    });
    
    assert.response(app, {
      url: '/apartments',
      method: 'POST',
      data: 'apartment[street]=x&transloadit=' + JSON.stringify({results: {thumb: [{url: 'http://transloadit.com/test.jpg'}]}}),
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      },
      {status: 201},
      function(res) {
        assert.eql(doc.images, {thumb: 'http://transloadit.com/test.jpg'});
      });
  }
};