var sys = require('sys');

var all_views = {
  apartment: {
    all: {
      map: function(doc) {
        if(doc.type == 'apartment') {
          emit(doc.id, null);
        }
      }
    }
  }
};

module.exports.update_views = function(db, _) {
  _(all_views).each(function(views, design_doc) {
    _(views).each(function(functions, view) {
      db.getDoc('_design/' + design_doc, function(er, old_design_doc) {
        var doc = {views: views};
        if(old_design_doc) {
          doc._rev = old_design_doc._rev;
        };
        db.saveDesign(design_doc, doc);
      });
    });
  });
};