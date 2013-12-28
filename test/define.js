var assert = require('assert')

var routington = require('../')

describe('Route definitions', function () {
  it('should create the root', function () {
    var router = routington()
    router.should.be.an.instanceof(routington)

    var routes = router.define('')
    routes.should.have.length(1)

    var route = routes[0]
    route.should.be.an.instanceof(routington)
    route.string.should.equal('')
    route.name.should.equal('')
    route.parent.should.equal(router)

    router.child[''].should.equal(route)

    var routes2 = router.define('/')
    routes2.should.have.length(1)
    routes2[0].parent.should.equal(route)
  })

  it('should create a first level child', function () {
    var router = routington()

    var routes = router.define('/asdf')
    routes.should.have.length(1)

    var route = routes[0]
    route.string.should.equal('asdf')
    route.name.should.equal('')
    route.parent.parent.should.equal(router)
    route.parent.child['asdf'].should.equal(route)

    route = route.parent
    route.string.should.equal('')
    route.name.should.equal('')
    route.parent.should.equal(router)
  })

  it('should create a second level child', function () {
    var router = routington()

    var routes = router.define('/asdf/wqer')
    routes.should.have.length(1)

    var route = routes[0]
    route.string.should.equal('wqer')

    var parent = route.parent
    parent.string.should.equal('asdf')
    parent.parent.string.should.equal('')
    parent.parent.parent.should.equal(router)
  })

  it('should define a named route', function () {
    var router = routington()

    var routes = router.define('/:id')
    routes.should.have.length(1)

    var route = routes[0]
    route.name.should.equal('id')

    var parent = route.parent
    parent.string.should.equal('')
  })

  it('should define a regex route', function () {
    var router = routington()

    var routes = router.define('/:id(\\w{3,30})')
    routes.should.have.length(1)

    var route = routes[0]
    route.name.should.equal('id')
    route.regex.toString().should.equal('/^(\\w{3,30})$/i')
    route.regex.test('asd').should.be.ok
    route.regex.test('a').should.not.be.ok
  })

  it('should define multiple regex routes', function () {
    var router = routington()

    var routes = router.define('/:id(\\w{3,30}|[0-9a-f]{24})')
    routes.should.have.length(1)

    var route = routes[0]
    route.name.should.equal('id')
    route.regex.toString().should.equal('/^(\\w{3,30}|[0-9a-f]{24})$/i')
    route.regex.test('asdf').should.be.ok
    route.regex.test('1234123412341234').should.be.ok
    route.regex.test('a').should.not.be.ok
  })

  it('should define multiple unnamed regex routes', function () {
    var router = routington()

    var routes = router.define('/(\\w{3,30}|[0-9a-f]{24})')
    routes.should.have.length(1)

    var route = routes[0]
    route.name.should.equal('')
    route.regex.toString().should.equal('/^(\\w{3,30}|[0-9a-f]{24})$/i')
    route.regex.test('asdf').should.be.ok
    route.regex.test('1234123412341234').should.be.ok
    route.regex.test('a').should.not.be.ok
  })

  it('should define multiple string routes', function () {
    var router = routington()

    var routes = router.define('/asdf|qwer')
    routes.should.have.length(2)

    var route1 = routes[0]
    route1.name.should.equal('')
    route1.string.should.equal('asdf')

    var route2 = routes[1]
    route2.name.should.equal('')
    route2.string.should.equal('qwer')
  })

  it('should define multiple string routes using regex', function () {
    var router = routington()

    var routes = router.define('/:id(asdf|qwer)')
    routes.should.have.length(2)

    var route1 = routes[0]
    route1.name.should.equal('id')
    route1.string.should.equal('asdf')

    var route2 = routes[1]
    route2.name.should.equal('id')
    route2.string.should.equal('qwer')
  })

  it('should not duplicate string routes', function () {
    var router = routington()

    var routes2 = router.define('/asdf')
    routes2.should.have.length(1)
    var route2 = routes2[0]

    var routes1 = router.define('/:id(asdf)')
    routes1.should.have.length(1)
    var route1 = routes1[0]

    route1.should.equal(route2)
    route1.name.should.equal('')
    route2.name.should.equal('')
  })

  it('should multiply every child', function () {
      var router = routington()

      router.define('/a|b/c|d').should.have.length(4)
      router.define('/a|b|c/d|e|f').should.have.length(9)
      router.define('/1|4/2|3/6|2').should.have.length(8)
  })

  it('should care for trailing slashes', function () {
    var router = routington()

    var routes1 = router.define('/asdf/')
    routes1.should.have.length(1)

    var routes2 = router.define('/asdf')
    routes2.should.have.length(1)

    routes1[0].should.not.equal(routes2[0])
  })

  it('should care for null or root paths', function () {
    var router = routington()

    var routes1 = router.define('')
    routes1.should.have.length(1)

    var routes2 = router.define('/')
    routes2.should.have.length(1)

    routes1[0].should.not.equal(routes2[0])
  })

  // To do:
  // Routers like /asdf*asdf
  it('should not support * outside a regex', function () {
    var router = routington()

    assert.throws(function () {
      router.define('/*')
    })
    assert.throws(function () {
      router.define('/asdf/*')
    })
    assert.throws(function () {
      router.define('/*asdf')
    })
    assert.throws(function () {
      router.define('/asdf*')
    })
    assert.throws(function () {
      router.define('/*?')
    })

    assert.doesNotThrow(function () {
      router.define('/:id(.*)')
    })
  })
})