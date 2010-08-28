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
        sys.puts(doc);
        assert.eql(doc, {title: 'test apartment'});
      });
  }
};