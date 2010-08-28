w4lls.app = $.sammy(function() {
  this.use(Sammy.Mustache);
  this.element_selector = '#wrapper';
  
  this.get('#/', function() {});
  
  this.swap = function(content) {
    this.$element().append(content);
  };
  
  this.get('#/apartments/new', function(context) {
    this.partial('../views/apartments/new.mustache');
    
    $('#new_apartment form').ajaxForm({
      success: function() {
        $('#new_apartment').remove();
        context.redirect('#/');
      }
    });
  });
});

$(function() {
  w4lls.app.run('#/');
});