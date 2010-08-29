var app = require('../server'),
  couchdb = app.db,
  querystring = require('querystring'),
  sys = require('sys');

module.exports = {
  'POST /messages sends message': function(assert){
    var id, mail_options, mail_body, mail_sent;
    
    couchdb.getDoc = function(_id, callback) {
      id = _id;
      callback(null, {email: 'joe@doe.com'});
    };
    
    var node_mail = _(module.moduleCache).detect(function(_, name) {return name.match('node-mail/lib/mail/index')});
    node_mail.exports.Mail = function() {
      return {
        message: function(options) {
          mail_options = options;
          return {
            body: function(body) {
              mail_body = body;
              return {
                send: function() {
                  mail_sent = true;
                }
              };
            }
          }
        }
      };
    };
    
    assert.response(app,
      { url: '/messages',
        method: 'POST',
        data: querystring.stringify({apartment_id: 'apartment-1', message: 'please call me'}),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      },
      {
        status: 201
      },
      function(res) {
        assert.equal(id, 'apartment-1')
        assert.eql(mail_options, {
          to: 'joe@doe.com',
          subject: 'Contact request from four.w4lls',
          from: 'info@w4lls.com',
        });
        assert.equal('Message: please call me', mail_body);
        assert.equal(true, mail_sent);
      });
  }
};