var http = require('http'), parse_url = require('url').parse;

var get = function(host, query, callback) {
  var client = http.createClient(80, host),
    request = client.request(query, {'Host': host});
  request.addListener('response', function (response) {
    var data = [];
    if(response.statusCode == '200') {
      response.setEncoding('utf-8');
      response.addListener('data', function (chunk) {
        data.push(chunk);
      });
      response.addListener('end', function() {
        callback(null, data.join(''), response);
      });
    } else {
      if(response.statusCode.toString().substring(0,2) == '30') {
        var url = parse_url(response.headers.location);

        get(url.host, url.pathname, callback);
      } else {
        callback(response.statusCode, null, response);
      };
    };
  });
  request.end();
}

module.exports.get = get;
