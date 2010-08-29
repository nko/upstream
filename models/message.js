var node_mail = require('../vendor/node-mail/lib/mail/index');

module.exports.Message = (function() {
  var _mail;
  
  return {
    send: function(to, text) {
      mail().message({
        from: 'info@w4lls.com',
        to: to,
        subject: 'Contact request from four.w4lls'
      }).body("Message: " + text).send(function(err) {
        console.log(err);
      });
    }
  };
  
  function mail() {
    if(!_mail) {
      _mail = node_mail.Mail({
        host: 'smtp.sendgrid.net',
        port: 25,
        username: process.env.SENDGRID_USERNAME,
        password: process.env.SENDGRID_PASSWORD,
        domain: process.env.SENDGRID_DOMAIN
      });
    };
    return _mail;
  }
  
})();


