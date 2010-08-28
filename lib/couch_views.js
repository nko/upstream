var sys = require('sys');

var all_views = {
  apartment: {
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
  }
};

module.exports.update_views = function(db, _) {
  _(all_views).each(function(views, design_doc) {
    db.getDoc('_design/' + design_doc, function(er, old_design_doc) {
      var doc = {views: views};
      if(old_design_doc) {
        doc._rev = old_design_doc._rev;
      };
      db.saveDesign(design_doc, doc);
    });
  });
};