// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('verifyResponseDuration', (response) => {
    cy.wrap([]).then (() => {
        expect(response.duration, 'Response Time(ms)').to.be.lessThan(5000)
    })
})

Cypress.Commands.add('verifyHeaderContentType', (response) => {
    cy.wrap([]).then (() => {
        expect(response.headers['content-type'], 'content-type').to.include('application/json')
    })
})

Cypress.Commands.add('getExpectedMaleCount', (requestBody) => {
    const expectedMaleCount = requestBody.users.filter((user) => user.gender === 'male').length
    expect(expectedMaleCount).to.be.a('number')
    return expectedMaleCount
})

Cypress.Commands.add('getExpectedFemaleCount', (requestBody) => {
    const expectedFemaleCount = requestBody.users.filter((user) => user.gender === 'female').length
    expect(expectedFemaleCount).to.be.a('number')
    return expectedFemaleCount
})

Cypress.Commands.add('verifyResponseBodyIsAnArray', (response) => {
    expect(response.body).to.be.an('array')
})

Cypress.Commands.add('verifyTopCountIsNotExceeded', (response, topCount) => {
    expect(response.body).to.have.lengthOf.at.most(topCount)
})

Cypress.Commands.add('verifyResponseBodyStructureForCountByGender', (response) => {
    const expectedProperties = ['name', 'value']
    response.body.forEach((item) => {
        expect(item).to.be.an('object')
        expect(Object.keys(item)).to.have.members(expectedProperties)
        expect(typeof item.name).to.equal('string')
        expect(typeof item.value).to.equal('number')
    })
})

Cypress.Commands.add('getExpectedCountByCountryArray', (requestBody) => {
    const expectedCountsByCountry = {};
    requestBody.users.forEach((item) => {
        if (expectedCountsByCountry[item.nat]) {
            expectedCountsByCountry[item.nat]++;
        } 
        else {
            expectedCountsByCountry[item.nat] = 1;
        }
    })
    const expectedResponse = Object.keys(expectedCountsByCountry)
        .map((key) => ({ name: key, value: expectedCountsByCountry[key] }))
        .sort((a, b) => b.value - a.value)

    return expectedResponse
})

Cypress.Commands.add('getExpectedCountByCountryArray', (requestBody, topCount) => {
    const expectedCountsByCountry = {};
    requestBody.users.forEach((item) => {
        if (expectedCountsByCountry[item.nat]) {
            expectedCountsByCountry[item.nat]++;
        } 
        else {
            expectedCountsByCountry[item.nat] = 1;
        }
    })
    const expectedResponse = Object.keys(expectedCountsByCountry)
        .map((key) => ({ name: key, value: expectedCountsByCountry[key] }))
        .sort((a, b) => b.value - a.value)
        .slice(0, topCount)

    return expectedResponse
})

Cypress.Commands.add('getExpectedCountPasswordComplexityArray', (requestBody) => {
    const expectedComplexity = requestBody.users.map((user) => {
        const nonAlphanumericChars = user.login.password.match(/[^A-Za-z0-9]/g) || [];
        return {
          name: user.login.password,
          value: nonAlphanumericChars.length,
        }
      })
    
    expectedComplexity.sort((a, b) => b.value - a.value);
    
    return expectedComplexity
})