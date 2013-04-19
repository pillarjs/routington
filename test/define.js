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
    routes2[0].should.equal(route)
  })

  it('should create a first level child', function () {
    var router = routington()

    var routes = router.define('/asdf')
    routes.should.have.length(1)

    var route = routes[0]
    route.string.should.equal('')
    route.name.should.equal('')
    route.parent.parent.should.equal(router)
    route.parent.child[''].should.equal(route)

    route = route.parent
    route.string.should.equal('asdf')
    route.name.should.equal('')
    route.parent.should.equal(router)
  })

  it('should create a second level child', function () {
    var router = routington()

    var routes = router.define('/asdf/wqer')
    routes.should.have.length(1)

    var route = routes[0]
    route.string.should.equal('')

    var parent = route.parent
    parent.string.should.equal('wqer')
    parent.parent.string.should.equal('asdf')
    parent.parent.parent.should.equal(router)
  })

  it('should define a named route', function () {
    var router = routington()

    var routes = router.define('/:id')
    routes.should.have.length(1)

    var route = routes[0]
    route.name.should.equal('')
    route.string.should.equal('')

    var parent = route.parent
    parent.name.should.equal('id')
  })

  it('should define a regex route', function () {
    var router = routington()

    var routes = router.define('/:id(\\w{3,30})')
    routes.should.have.length(1)

    var route = routes[0]
    route.name.should.equal('')
    route.string.should.equal('')

    var parent = route.parent
    parent.name.should.equal('id')
    parent._regex.should.equal('\\w{3,30}')
    parent.regex.test('asd').should.be.ok
    parent.regex.test('a').should.not.be.ok
  })

  it('should define multiple regex routes', function () {
    var router = routington()

    var routes = router.define('/:id(\\w{3,30}|[0-9a-f]{24})')
    routes.should.have.length(1)

    var route = routes[0].parent
    route.name.should.equal('id')
    route._regex.should.equal('\\w{3,30}|[0-9a-f]{24}')
    route.regex.test('asdf').should.be.ok
    route.regex.test('1234123412341234').should.be.ok
    route.regex.test('a').should.not.be.ok
  })

  it('should define multiple unnamed regex routes', function () {
    var router = routington()

    var routes = router.define('/(\\w{3,30}|[0-9a-f]{24})')
    routes.should.have.length(1)

    var route = routes[0].parent
    route.name.should.equal('')
    route._regex.should.equal('\\w{3,30}|[0-9a-f]{24}')
    route.regex.test('asdf').should.be.ok
    route.regex.test('1234123412341234').should.be.ok
    route.regex.test('a').should.not.be.ok
  })

  it('should define a named route with a string and regex', function () {
    var router = routington()

    var routes = router.define('/:id(\\w{3,30}|asdf)')
    routes.should.have.length(2)

    var route1 = routes[1].parent
    route1.name.should.equal('id')
    route1._regex.should.equal('\\w{3,30}')

    var route2 = routes[0].parent
    route2.name.should.equal('id')
    route2.string.should.equal('asdf')
  })

  it('should define multiple string routes', function () {
    var router = routington()

    var routes = router.define('/asdf|qwer')
    routes.should.have.length(2)

    var route1 = routes[0].parent
    route1.name.should.equal('')
    route1.string.should.equal('asdf')

    var route2 = routes[1].parent
    route2.name.should.equal('')
    route2.string.should.equal('qwer')
  })

  it('should define multiple string routes using regex', function () {
    var router = routington()

    var routes = router.define('/:id(asdf|qwer)')
    routes.should.have.length(2)

    var route1 = routes[0].parent
    route1.name.should.equal('id')
    route1.string.should.equal('asdf')

    var route2 = routes[1].parent
    route2.name.should.equal('id')
    route2.string.should.equal('qwer')
  })

  it('should support optional parameters /:param?', function () {
    var router = routington()

    var routes = router.define('/x?')
    routes.should.have.length(2)
    routes[0].parent.parent.should.equal(routes[1].parent.parent)
  })

  it('should not duplicate string routes', function () {
    var router = routington()

    var routes2 = router.define('/asdf')
    routes2.should.have.length(1)
    var route2 = routes2[0].parent

    var routes1 = router.define('/:id(asdf)')
    routes1.should.have.length(1)
    var route1 = routes1[0].parent

    route1.should.equal(route2)
    route1.name.should.equal('')
    route2.name.should.equal('')
  })

  it('should not duplicate regex routes', function () {
      var router = routington()

      var routes1 = router.define('/:a(\\w{3,30})')
      routes1.should.have.length(1)
      var route1 = routes1[0].parent

      var routes2 = router.define('/:b(\\w{3,30})')
      routes2.should.have.length(1)
      var route2 = routes2[0].parent

      route1.should.equal(route2)
      route1.name.should.equal('a')
      route2.name.should.equal('a')
  })

  it('should multiply every child', function () {
      var router = routington()

      router.define('/a|b/c|d').should.have.length(4)
      router.define('/a|b|c/d|e|f').should.have.length(9)
      router.define('/1|4/2|3/6|2').should.have.length(8)
  })

  it('should not care for trailing slashes', function () {
    var router = routington()

    var routes1 = router.define('/asdf/')
    routes1.should.have.length(1)

    var routes2 = router.define('/asdf')
    routes2.should.have.length(1)

    routes1[0].should.equal(routes2[0])
  })

  it('should not care for null or root paths', function () {
    var router = routington()

    var routes1 = router.define('')
    routes1.should.have.length(1)

    var routes2 = router.define('/')
    routes2.should.have.length(1)

    routes1[0].should.equal(routes2[0])
  })

  // To do:
  // Routers like /asdf*asdf
  it('should not support * outside a regex', function () {
    var router = routington()

    assert.throws(function () {
      router.define('/*')
    })
    assert.throws(function () {
      router.define('/*/')
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