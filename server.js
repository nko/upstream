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

var couchdb = require('couchdb'), couch_client, db;

var couch_views = require('./lib/couch_views');
var view_helpers = require('./lib/view_helpers');

var Apartment = require('./models/apartment').Apartment,
  Query = require('./models/query').Query;

sys.puts('RUNNING IN ' + (process.env.EXPRESS_ENV || 'development') + ' environemtn')

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
  couch_client = couchdb.createClient(80, 'langalex.couchone.com', 'w4lls', 'upstream');
  db = couch_client.db('w4lls_development');
});

app.configure('test', function(){
  app.use(connect.errorHandler({ dumpExceptions: true, showStack: true }));
  app.set('host', 'localhost:3000');
  couch_client = couchdb.createClient(80, 'langalex.couchone.com', 'w4lls', 'upstream');
  db = couch_client.db('w4lls_test');
});

app.configure('production', function(){
  app.use(connect.errorHandler());
  app.set('host', 'four.w4lls.com');
  couch_client = couchdb.createClient(80, 'langalex.couchone.com', 'w4lls_production', process.env.COUCHONE_PASSWORD);
  db = couch_client.db('w4lls_production');
});

app.db = db;

app.helpers({
  host: app.settings.host
});

if(!process.env.SKIP_UPDATE_VIEWS) {
  sys.puts('updating view. set SKIP_UPDATE_VIEWS to skip this');
  couch_views.update_views(db, _);
};

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

app.get('/about', function(req, res) {
  res.render('about.ejs');  
});

app.get('/tags', function(req, res) {
  db.view('apartment', 'by_tags', {startkey: req.query.q, endkey: req.query.q + "\u9999", limit: 20, group: true}, function(err, results) {
    if(err) {
      send_error(res, err);
    } else {
      res.send(results.rows.map(function(row) {return row.key}));
    }
  })
});

app.post('/apartments', function(req, res) {
  var address = querystring.stringify({address: req.body.apartment.street + ', ' + req.body.apartment.postcode + ', Berlin, Germany', sensor: 'false'});

  hl_http_client.get('maps.google.com', '/maps/api/geocode/json?' + address, function(err, body) {
    if(err) {
      send_error(res, err);
    } else {
      var location = JSON.parse(body).results[0].geometry.location;
      var doc = Apartment.from_params(req.body.apartment, location, req.body.transloadit);
      db.saveDoc(doc, function(_err, ok) {
        if(_err) {
          send_error(res, _err);
        } else {
          doc._id = ok.id;
          doc._rev = ok.rev;
          res.send(doc, 201);
        }
      });
    }
  });
});

app.get('/apartments', function(req, res) {
  var query = Query.build(req.query);
  if(query.length > 0) {
    db.request('/_fti/_design/apartment/by_filters', {q: query, include_docs: true}, function(err, results) {
      if(err) {
        send_error(res, err);
      } else {
        res.send(results.rows.map(function(row) {return row.doc}));
      }
    });
  } else {
    db.view('apartment', 'all', {include_docs: true}, function(err, results) {
      if(err) {
        send_error(res, err);
      } else {
        res.send(results.rows.map(function(row) {return row.doc}));
      }
    })
  };
  
});

function send_error(res, er) {
  res.send(JSON.stringify(er), 500);
};

// Only listen on $ node app.js
if(!module.parent) {
  app.listen(parseInt(process.env.PORT || 3000, 10));
}

