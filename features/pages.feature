Feature: Start page
  In order to know the basics are working
  As a dev
  I want a start page
  
  Scenario: view start page
    When I go to the start page
    Then I should see "four.w4lls"
  
  Scenario: view about pahe
    When I go to the start page
      And I follow "About us"
    Then I should see "About us"
  
  
  