$(function() {
  var bookmarks = $.jStorage.get("w4lls.apartments", []);
  if(bookmarks.length > 0) {
    bookmarks.forEach(function(bookmark) {
      w4lls.template('show', 'bookmarks', function() {
        $('#bookmarks ul').append(Mustache.to_html(w4lls.show_template, bookmark));
        $('#bookmarks ul .bookmark:last a').click(function() {
          w4lls.show_details(bookmark);
        });
        $('#bookmarks').show();
      });      
    });
    $('#bookmarks').show();
  }
  
  $("#bookmarks").carousel();
});