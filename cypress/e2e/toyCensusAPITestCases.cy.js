import { faker } from '@faker-js/faker';

describe('Toy Census API Test Suite', () => {
  describe('Toy Census API POSITIVE Test Cases', () => {
    beforeEach(() => {
      cy.fixture('toyCensusAPIBody').its(0).as('requestBodyOne')
      cy.fixture('toyCensusAPIBody').its(1).as('requestBodyTwo')
      cy.fixture('toyCensusAPIBody').its(2).as('requestBodyThree')
    })
  
    it('should return count by gender', () => {
      cy.get('@requestBodyTwo').then((requestBody) => {
        requestBody.actionType = 'CountByGender'
        return requestBody
      })
      .as('modifiedRequestBody')
  
      cy.get('@modifiedRequestBody').then((requestBody)=> {
        cy.request({
          method: "POST",
          url: "https://census-toy.nceng.net/prod/toy-census",
          body: requestBody
        }).then((response) => {
          expect(response.status).to.eq(200)
          cy.verifyResponseDuration(response)
          cy.verifyHeaderContentType(response)
          cy.getExpectedMaleCount(requestBody).then(expectedMaleCount => {
            cy.getExpectedFemaleCount(requestBody).then(expectedFemaleCount => {
              expect(response.body).to.deep.members([
                { name: 'male', value: expectedMaleCount },
                { name: 'female', value: expectedFemaleCount }
              ])
            })
          })
          //verify structure of response body i.e. it is an object, contains expected keys and their types
          cy.verifyResponseBodyStructureForCountByGender(response)
        })
      })
    })
  
    it('should return count by country with top 10 results', () => {
      const topCount = 10
      cy.get('@requestBodyThree').then((requestBody) => {
        requestBody.actionType = 'CountByGender'
        requestBody.top = topCount
        return requestBody
      })
      .as('modifiedRequestBody')
  
      cy.get('@modifiedRequestBody').then((requestBody)=> {
        cy.request({
          method: "POST",
          url: "https://census-toy.nceng.net/prod/toy-census",
          body: requestBody
        }).then((response) => {
          //verify status code
          expect(response.status).to.eq(200)
          //verify response duration is acceptable i.e. < 1000ms
          cy.verifyResponseDuration(response)
          //verify response header.content-type contains 'application/json'
          cy.verifyHeaderContentType(response)
          //verify reponse body is an array
          cy.verifyResponseBodyIsAnArray(response)
          //verify reponse body contains a max of ${topCount) elements
          cy.verifyTopCountIsNotExceeded(response, topCount)
          //verify structure of response body i.e. it is an object, contains 
          cy.verifyResponseBodyStructureForCountByGender(response)
        })
      })
    })
  
    it('should return count by country', () => {
      cy.get('@requestBodyThree').then((requestBody) => {
        requestBody.actionType = 'CountByCountry'
        return requestBody
      })
      .as('modifiedRequestBody')
  
      cy.get('@modifiedRequestBody').then((requestBody) => {
        cy.request({
          method: 'POST',
          url: 'https://census-toy.nceng.net/prod/toy-census',
          body: requestBody
        }).then((response) => {
          expect(response.status).to.eq(200)
          expect(response).to.have.property('body')
          cy.verifyResponseDuration(response)
          cy.verifyHeaderContentType(response)
          cy.verifyResponseBodyIsAnArray(response)
          cy.getExpectedCountByCountryArray(requestBody).then(expectedResponse => {
              expect(response.body).to.deep.include.members(expectedResponse)
          })
        })
      })
    })
  
    it('should return count by country with top 10 results', () => {
      const topCount = 10
      cy.get('@requestBodyThree').then((requestBody) => {
        requestBody.actionType = 'CountByCountry'
        requestBody.top = topCount
        return requestBody
      })
      .as('modifiedRequestBody')
  
      cy.get('@modifiedRequestBody').then((requestBody) => {
        cy.request({
          method: 'POST',
          url: 'https://census-toy.nceng.net/prod/toy-census',
          body: requestBody
        }).then((response) => {
          expect(response.status).to.eq(200)
          expect(response).to.have.property('body')
          cy.verifyResponseDuration(response)
          cy.verifyHeaderContentType(response)
          cy.verifyResponseBodyIsAnArray(response)
          cy.verifyTopCountIsNotExceeded(response, topCount)
          cy.getExpectedCountByCountryArray(requestBody, topCount).then(expectedResponse => {
              expect(response.body).to.deep.include.members(expectedResponse)
          })
        })
      })
    })
  
    it('should return count by complexity', () => {
        cy.get('@requestBodyThree').then((requestBody) => {
            requestBody.actionType = 'CountPasswordComplexity'
            requestBody.users.forEach((user) => {
                user.login.password = faker.internet.password()
            })
            return requestBody
        })
        .as('modifiedRequestBody')
    
        cy.get('@modifiedRequestBody').then((requestBody) => {
            cy.request({
                method: 'POST',
                url: 'https://census-toy.nceng.net/prod/toy-census',
                body: requestBody
            }).then((response) => {
                expect(response.status).to.eq(200)
                expect(response).to.have.property('body')
                cy.verifyResponseDuration(response)
                cy.verifyHeaderContentType(response)
                cy.verifyResponseBodyIsAnArray(response)
                cy.getExpectedCountPasswordComplexityArray(requestBody).then(expectedResponse => {
                    expect(response.body).to.deep.members(expectedResponse)
                })
            })
        })
    })
  })

  describe('Toy Census API NEGATIVE Test Cases', () => {
	beforeEach(() => {
		cy.fixture('toyCensusAPIBody').its(0).as('requestBodyOne')
		cy.fixture('toyCensusAPIBody').its(1).as('requestBodyTwo')
		cy.fixture('toyCensusAPIBody').its(2).as('requestBodyThree')
	  })
  
	  it('should not return responseBody when actionType is missing', () => {
		  cy.get('@requestBodyTwo').then((requestBody) => {
			  delete requestBody.actionType
			  return requestBody
		  })
		  .as('modifiedRequestBody')
  
		  cy.get('@modifiedRequestBody').then((requestBody) => {
			cy.request({
			  method: 'POST',
			  url: 'https://census-toy.nceng.net/prod/toy-census',
			  body: requestBody
			}).then((response) => {
			  expect(response.status).to.eq(200)
			  expect(response).to.not.have.property('body')
			  cy.verifyResponseDuration(response)
			  cy.verifyHeaderContentType(response)
			})
		  })
	  })
  
	  it('should not return responseBody when actionType is invalid', () => {
		  cy.get('@requestBodyTwo').then((requestBody) => {
			  requestBody.actionType = 'invalidActionType'
			  return requestBody
		  })
		  .as('modifiedRequestBody')
  
		  cy.get('@modifiedRequestBody').then((requestBody) => {
			cy.request({
			  method: 'POST',
			  url: 'https://census-toy.nceng.net/prod/toy-census',
			  body: requestBody
			}).then((response) => {
			  expect(response.status).to.eq(200)
			  expect(response).to.not.have.property('body')
			  cy.verifyResponseDuration(response)
			  cy.verifyHeaderContentType(response)
			})
		  })
	  })
  
	  it('should not return responseBody when top is invalid(String)', () => {
		  cy.get('@requestBodyTwo').then((requestBody) => {
			  requestBody.top = 'invalidTop'
			  return requestBody
		  })
		  .as('modifiedRequestBody')
  
		  cy.get('@modifiedRequestBody').then((requestBody) => {
			cy.request({
			  method: 'POST',
			  url: 'https://census-toy.nceng.net/prod/toy-census',
			  body: requestBody
			}).then((response) => {
			  expect(response.status).to.eq(200)
			  expect(response).to.not.have.property('body')
			  cy.verifyResponseDuration(response)
			  cy.verifyHeaderContentType(response)
			})
		  })
	  })
  
	  it('should return correct responseBody when top is invalid(negative number) and actionType is CountByCountry', () => {
		  cy.get('@requestBodyThree').then((requestBody) => {
			  requestBody.actionType = 'CountByCountry'
			  requestBody.top = -1
			  return requestBody
		  })
		  .as('modifiedRequestBody')
  
		  cy.get('@modifiedRequestBody').then((requestBody) => {
			cy.request({
			  method: 'POST',
			  url: 'https://census-toy.nceng.net/prod/toy-census',
			  body: requestBody
			}).then((response) => {
			  expect(response.status).to.eq(200)
			  expect(response).to.have.property('body')
			  cy.verifyResponseDuration(response)
			  cy.verifyHeaderContentType(response)
			  cy.getExpectedCountByCountryArray(requestBody).then(expectedResponse => {
				  expect(response.body).to.deep.include.members(expectedResponse)
			  })
			})
		  })
	  })
  
	  it('should return correct responseBody when top is missing and actionType is CountByGender', () => {
		  cy.get('@requestBodyThree').then((requestBody) => {
			  requestBody.actionType = 'CountByGender'
			  delete requestBody.top
			  return requestBody
		  })
		  .as('modifiedRequestBody')
  
		  cy.get('@modifiedRequestBody').then((requestBody) => {
			cy.request({
			  method: 'POST',
			  url: 'https://census-toy.nceng.net/prod/toy-census',
			  body: requestBody
			}).then((response) => {
			  expect(response.status).to.eq(200)
			  expect(response).to.have.property('body')
			  cy.verifyResponseDuration(response)
			  cy.verifyHeaderContentType(response)
			  cy.getExpectedMaleCount(requestBody).then(expectedMaleCount => {
				  cy.getExpectedFemaleCount(requestBody).then(expectedFemaleCount => {
					expect(response.body).to.deep.members([
					  { name: 'male', value: expectedMaleCount },
					  { name: 'female', value: expectedFemaleCount }
					])
				  })
				})
				//verify structure of response body i.e. it is an object, contains expected keys and their types
				cy.verifyResponseBodyStructureForCountByGender(response)
			})
		  })
	  })
  
	  it('should return correct responseBody when top is missing and actionType is CountPasswordComplexity', () => {
		  cy.get('@requestBodyThree').then((requestBody) => {
			  requestBody.actionType = 'CountPasswordComplexity'
			  requestBody.users.forEach((user) => {
				  user.login.password = faker.internet.password()
			  })
			  delete requestBody.top
			  return requestBody
		  })
		  .as('modifiedRequestBody')
  
		  cy.get('@modifiedRequestBody').then((requestBody) => {
			  cy.request({
				  method: 'POST',
				  url: 'https://census-toy.nceng.net/prod/toy-census',
				  body: requestBody
			  }).then((response) => {
				  expect(response.status).to.eq(200)
				  expect(response).to.have.property('body')
				  cy.verifyResponseDuration(response)
				  cy.verifyHeaderContentType(response)
				  cy.getExpectedCountPasswordComplexityArray(requestBody).then(expectedResponse => {
					  expect(response.body).to.deep.members(expectedResponse)
				  })
			  })
		  })
	  })
  })
})