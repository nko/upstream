// Run $ expresso

/**
 * Module dependencies.
 */

var app = require('../server'),
  sys = require('sys'),
  querystring = require('querystring'),
  helpers = require('./helpers');

module.exports = {
  'GET /geolocation gets position': function(assert){
    var google_query;    
    var hl_http_client = _(module.moduleCache).detect(function(_, name) {return name.match('highlevel_http_client.js')});
    
    hl_http_client.exports.get = helpers.google_geo_request({lat: 1, lng: 1});
    
    assert.response(app, {
      url: '/geolocation?q=Meine%20Adresse%2017',
      method: 'GET'},
      {status: 200},
      function(res) {
        assert.eql(JSON.parse(res.body), {lat: 1, lng: 1});
      });
  }
};