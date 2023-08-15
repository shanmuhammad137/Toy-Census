# Toy-census
 
## Automation Stack
- **Cypress @12.11.0**
- **JavaScript**

### Why Cypress?
Cypress is a powerful and easy-to-use JavaScript testing framework that is well-suited for API automation testing. Some of the key reasons why you may have chosen to use Cypress for your API automation test project are:

1. Easy Setup: Cypress is easy to set up and configure, and has excellent documentation and support.
2. Fast Test Execution: Cypress provides fast test execution, which is critical for API testing where response times are important.
3. Rich Set of Assertions: Cypress has a rich set of built-in assertions that make it easy to write clear, concise test scripts that verify the behavior of your API endpoints.
4. Easy Debugging: Cypress provides an interactive test runner that makes it easy to debug failing tests, which can save you a lot of time during development.
5. End-to-End Testing: Cypress supports end-to-end testing, which means that you can test your API endpoints in combination with other parts of your application, such as the UI or the backend.

Overall, Cypress is a great choice for API automation testing because of its ease of use, speed, and powerful features.

## Pre-requisites
1. Node.js v14.xx, v16.00, v18.00++
2. npm
3. IDE

## Installation & Running
1. Clone the project.
2. In the root directory run: 
```npm install```
3. To open Cypress Runner: 
```npx cypress open```
4. Select **E2E Testing** from the Cypress Runner
5. Run the **toyCensusAPITestCases.cy.js** file

## Description

### Folder Structure
- The Test Cases are implemented in **toyCensusAPITestCases.cy.js** file in ```Toy-census/cypress/e2e/``` folder.
- The helper/common methods or cypress custom commands are implemented in **command.js** file in ```Toy-census/support``` folder.
  - example of custom commands ```cy.getExpectedCountByCountryArray``` or ```cy.getExpectedCountPasswordComplexityArray```
- The Test Data or fixtures can be found in **toyCensusAPIBody.json** file in ```toy-census/fixtures``` folder.

### Test Cases Implemented
1. should return count by gender
2. should return count by country with top 10 results
3. should return count by country
4. should return count by country with top 10 results
5. should return count by complexity
6. should return count by complexity with top 10 results
7. should not return responseBody when actionType is invalid
8. should not return responseBody when top is invalid(String)
9. should return correct responseBody when top is invalid(negative number) and actionType is CountByCountry
10. should return correct responseBody when top is missing and actionType is CountByGender
11. should return correct responseBody when top is missing and actionType is CountPasswordComplexity

Other Test Cases that could've been implemented include: -
1. Verify that a request with no users array returns an error response.
2. Verify that a request with an empty users array returns an error response.
3. Verify that a request with invalid data in the users array returns an error response etc

### Bugs/Improvements
- The API sometimes returns a wrong response when actionType=CountByCountry and Top parameter is valid integer
- The API returns a wrong response when actiontype=CountPasswordComplexity
- No error message when users array is empty
- No error message when users array is missing
- No error message when Top parameter is invalid(string)/number
- No error message when actionType parameter is invalid
- No error message when actionType parameter is missing
