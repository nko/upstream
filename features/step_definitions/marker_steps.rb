Then /I should see a marker/ do
  assert page.has_xpath?("//img[@src='http://maps.gstatic.com/intl/en_us/mapfiles/markers/marker_sprite.png']")
end