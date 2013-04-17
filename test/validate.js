var routington = require('../')
var isValidURL = routington.isValidURL
var validate = routington.validate

describe('Route validation', function () {
  it('should be path-y', function () {
    isValidURL('home').should.not.be.ok
  })

  it('should allow null paths', function () {
    isValidURL('').should.be.ok
  })

  it('should allow trailing slashes', function () {
    isValidURL('/laksjdfljasdf/').should.be.ok
    isValidURL('/lkajsdlfkjasdklfj').should.be.ok
  })

  it('should allow root path', function () {
    isValidURL('/').should.be.ok
  })

  it('should not allow protocol-less paths', function () {
    isValidURL('//home').should.not.be.ok
  })

  it('should not allow multiple slashes anywhere', function () {
    isValidURL('/alksdjf//lajsdlfkjasdf').should.not.be.ok
  })
})