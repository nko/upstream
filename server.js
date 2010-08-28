/**
 * Module dependencies.
 */
var _ = require('./public/js/underscore')._;

require.paths.unshift('vendor');
require.paths.unshift('vendor/ejs');
require.paths.unshift('vendor/node-couchdb/lib');

var express = require('express/index'),
    connect = require('connect/index'),
    hl_http_client = require('./lib/highlevel_http_client'),
    querystring = require('querystring'),
    sys     = require('sys');

var app = module.exports = express.createServer();


var couchdb = require('couchdb'), client, db;

var couch_views = require('./lib/couch_views');
var view_helpers = require('./lib/view_helpers');

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.use(express.logger());
  app.use(connect.bodyDecoder());
  app.use(connect.methodOverride());
  app.use(app.router);
  app.use(connect.staticProvider(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(connect.errorHandler({ dumpExceptions: true, showStack: true }));
  app.set('host', 'localhost:3000');
  client = couchdb.createClient(5984, 'localhost');
  db = client.db('w4lls_development');
  google_maps_key = 'ABQIAAAASOw3kHJFc2xCpxnZ-dtD6hT2yXp_ZAY8_ufC3CFXhHIE1NvwkxQSwIsS_zx3Hbvv6Z-pT42CPLo0Qg';
});

app.configure('test', function(){
  app.use(connect.errorHandler());
  app.set('host', 'four.w4lls.com');
  client = couchdb.createClient(5984, 'localhost');
  db = client.db('w4lls_test');
});

app.configure('production', function(){
  app.use(connect.errorHandler());
  app.set('host', 'four.w4lls.com');
  client = couchdb.createClient(443, 'langalex.cloudant.com', 'langalex', process.env.CLOUDANT_PASSWORD);
  db = client.db('w4lls_production');
});

app.db = db;
app.hl_http_client = hl_http_client;

couch_views.update_views(db, _);

// Routes

app.put('/update_views', function(req, res) {
  couch_views.update_views(db, _);
  res.send(201);
});

app.get('/', function(req, res){
  if(req.headers.host != app.settings.host) {
    res.redirect('http://' + app.settings.host + '/', 301);
  } else {
    res.render('index.ejs');  
  };
});

app.post('/apartments', function(req, res) {
  var address = querystring.stringify({address: req.body.address + ', ' + req.body.post_code + ', Berlin, Germany', sensor: 'false'});
  hl_http_client.get('maps.google.com', '/maps/api/geocode/json?' + address, function(err, body) {
    if(err) {
      send_error(res, err);
    } else {
      var location = JSON.parse(body).results[0].geometry.location;
      var doc = _(req.body).extend({lat: location.lat, lng: location.lng, city: 'Berlin', country: 'Germany'});
      db.saveDoc(doc, function(err, results) {
        if(err) {
          send_error(res, err);
        } else {
          res.send(201);
        }
      });
    }
  });
});

app.get('/apartments', function(req, res) {
  db.view('apartment', 'all', function(err, results) {
    res.send(results.rows);
  });
});

function send_error(res, er) {
  res.send(JSON.stringify(er), 500);
};

// Only listen on $ node app.js
if(!module.parent) {
  app.listen(parseInt(process.env.PORT || 3000, 10));
}

