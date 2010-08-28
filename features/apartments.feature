Feature: Apartments
  In order to rent out apartments
  As a user
  I want to add and see apartments
  
  Scenario: add an apartment
    When I go to the start page
      And I follow "add apartment"
      And I fill in "Title" with "Meine Wohnung"
      And I fill in "Description" with "Schön sonnig, ruhige Lage"
      And I fill in "Street" with "Tasdorferstr. 24"
      And I fill in "Postcode" with "10365"
      And I fill in "Number of Rooms" with "3"
      And I fill in "Size" with "96"
      And I fill in "Date of Availability" with "2010-10-08"
      And I fill in "Duration" with "unbegrenzt"
      And I check "Shared Apartment"
      And I fill in "Email" with "frank@upstre.am"
      And I fill in "Phone" with "+493012345678"
      And I press "add apartment"
    Then I should see a marker
      And I should not see "Date of Availability"
  
  
