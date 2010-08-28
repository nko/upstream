// // Run $ expresso
// 
// /**
//  * Module dependencies.
//  */
// 
// var app = require('../server');
// var sys = require('sys');
// 
// module.exports = {
//   'POST /apartments': function(assert){
//     assert.response(app, {url: '/apartments'}, {status: 201});
//   }
// };


// Run $ expresso

/**
 * Module dependencies.
 */

var app = require('../server'),
  couchdb = app.db,
  sys = require('sys');

module.exports = {
  'POST /apartments': function(assert){
    var doc;
    
    couchdb.saveDoc = function(docid, _doc) {
      doc = _doc;
    };
    
    assert.response(app, {
      url: '/apartments',
      method: 'POST',
      data: 'title=test+apartment',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      },
      {
        status: 201
      },
      function(res) {
        assert.eql(doc, {title: 'test apartment'});
      });
  },
  'GET /apartments': function(assert){
    couchdb.view = function(design, view, callback) {
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