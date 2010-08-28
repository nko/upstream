Then /I should see a marker/ do
  assert page.has_xpath?("//img[@src='http://maps.gstatic.com/intl/en_ALL/mapfiles/markerTransparent.png']")
end