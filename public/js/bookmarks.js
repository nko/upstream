$(function() {
  var bookmarks = $.jStorage.get("w4lls.apartments", []);
  if(bookmarks.length > 0) {
    bookmarks.forEach(function(bookmark) {
      w4lls.template('show', 'bookmarks', function() {
        $('#bookmarks .slides').append(Mustache.to_html(w4lls.show_template, bookmark));
        $('#bookmarks .slides .bookmark:last a.details').click(function() {
          w4lls.show_details(bookmark, function(apartment) {
            $('.remember_this').click(function(evt) { w4lls.add_bookmark(apartment); evt.stopPropagation(); evt.preventDefault(); });
            $('.send_request').click(function(evt) { w4lls.send_request(apartment); evt.stopPropagation(); evt.preventDefault(); });
          });
        });
        $('#bookmarks .slides .bookmark:last a.delete_bookmark').click(function() {
          w4lls.delete_bookmark(bookmark, this);
        });
        $('#bookmarks').show();
      });      
    });
    $('#bookmarks').show();
  }
  
  $("#bookmarks").loopedCarousel();
});
