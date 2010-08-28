var sys = require('sys');

var design_docs = {
  apartment: {
    views: {
      all: {
        map: function(doc) {
          if(doc.type == 'apartment') {
            emit(doc.id, null);
          }
        }
      },
      by_tags: {
        map: function(doc) {
          if(doc.type == 'apartment' && doc.tags) {
            doc.tags.forEach(function(tag) {
              emit(doc.tag, 1);
            });
          }
        },
        reduce: '_sum'
      }
    },
    fulltext: {
      by_filters: {
        index: function(doc) {
          if(doc.type == 'apartment') {
            var ret = new Document();
            
            var fields = ['price', 'size', 'lng', 'lat'];
            for(var i in fields) {
              var field = fields[i];
              if(parseFloat(doc[field])) {
                ret.add(parseFloat(doc[field]), {field: field, type: 'float'});
              };
            };

            if(doc.tags) {
              ret.add(doc.tags.join(' '), {field: 'tags', type: 'string'});
            };
            return ret;
          };
          return null;
        }
      }
    }
  }
};

module.exports.update_views = function(db, _) {
  _(design_docs).each(function(doc, name) {
    db.getDoc('_design/' + name, function(er, old_design_doc) {
      if(old_design_doc) {
        doc._rev = old_design_doc._rev;
      };
      db.saveDesign(name, doc);
    });
  });
};