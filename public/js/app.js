w4lls.app = $.sammy(function() {
  this.use(Sammy.Mustache);
  this.element_selector = '#wrapper';
  
  this.get('#/', function() {});
  
  this.swap = function(content) {
    this.$element().append(content);
  };
  
  this.get('#/apartments/new', function() {
    this.partial('../views/apartments/new.mustache');
  });
  
  this.post('#/apartments', function() {
    var params = {};
    for(attribute in this.params) {
      if(typeof(this.params[attribute]) !== "function") {
        params[attribute] = this.params[attribute];
      }
    }
    $.ajax({
      url: 'http://localhost:3000/apartments',
      type: 'POST',
      data: params
    });    
    
    this.$element().find('#new_apartment').remove();
    this.redirect('#/');
  });
});

$(function() {
  w4lls.app.run('#/');
});