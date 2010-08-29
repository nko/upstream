var Apartment = require('../models/apartment').Apartment,
  sys = require('sys');

module.exports = {
  '#from_params with tags': function(assert) {
    var apartment = Apartment.from_params({tags: [{}, 'balcony,shower']}, {});
    assert.eql(['balcony', 'shower'], apartment.tags);
  },
};


