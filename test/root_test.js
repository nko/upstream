// Run $ expresso

/**
 * Module dependencies.
 */

var app = require('../server'),
  sys = require('sys');
  
if(process.env.EXPRESS_ENV != 'test') {
  sys.print('please set EXPRESS_ENV to test');
  process.exit(-1);
};


module.exports = {
  'GET / with wrong host redirects to correct host': function(assert) {
    assert.response(app, {
      url: '/',
      method: 'GET',
      headers: {
          'Host': 'nko-upstrea.heroku.com'
        },
      },
      {
        status: 301
      },
      function(res) {
        assert.equal(res.headers.location, 'http://four.w4lls.com/');
      });
  },
  'GET / with correct host renders': function(assert) {
    assert.response(app, {
      url: '/',
      method: 'GET',
      headers: {
          'Host': 'four.w4lls.com'
        },
      },
      {
        status: 200
      });
  }
};

