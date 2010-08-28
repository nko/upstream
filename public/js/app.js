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
    // $.ajax({
    //   url: '',
    //   data: this.params,
    //   success: function() {},
    //   
    // });    
    // 
    // this.$element().find('#new_apartment').remove();
  });
});

$(function() {
  w4lls.app.run('#/');
});