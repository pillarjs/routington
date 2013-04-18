var routington = require('../')

describe('Route definitions', function () {
  it('should create the root', function () {
    var router = routington()
    router.should.be.an.instanceof(routington.node)

    var routes = router.define('')
    routes.should.have.length(1)

    var route = routes[0]
    route.should.be.an.instanceof(routington.node)
    route.string.should.equal('')
    route.name.should.equal('')
    route.parents[0].should.equal(router)

    router.branch[''].should.equal(route)

    var routes2 = router.define('/')
    routes2.should.have.length(1)
    routes2[0].should.equal(route)
  })

  it('should create a first level branch', function () {
    var router = routington()

    var routes = router.define('/asdf')
    routes.should.have.length(1)

    var route = routes[0]
    route.string.should.equal('')
    route.name.should.equal('')
    route.parents[1].should.equal(router)
    route.parents[0].branch[''].should.equal(route)

    route = route.parents[0]
    route.string.should.equal('asdf')
    route.name.should.equal('')
    route.parents[0].should.equal(router)
  })

  it('should create a second level branch', function () {
    var router = routington()

    var routes = router.define('/asdf/wqer')
    routes.should.have.length(1)

    var route = routes[0]
    route.string.should.equal('')

    var parents = route.parents
    parents.should.have.length(3)
    parents[0].string.should.equal('wqer')
    parents[1].string.should.equal('asdf')
    parents[2].should.equal(router)
  })

  it('should define a named route', function () {
    var router = routington()

    var routes = router.define('/:id')
    routes.should.have.length(1)

    var route = routes[0]
    route.name.should.equal('')
    route.string.should.equal('')

    var parent = route.parents[0]
    parent.name.should.equal('id')
  })

  it('should define a regex route', function () {
    var router = routington()

    var routes = router.define('/:id(\\w{3,30})')
    routes.should.have.length(1)

    var route = routes[0]
    route.name.should.equal('')
    route.string.should.equal('')

    var parent = route.parents[0]
    parent.name.should.equal('id')
    parent._regex.should.equal('\\w{3,30}')
    parent.regex.test('asd').should.be.ok
    parent.regex.test('a').should.not.be.ok
  })

  it('should define multiple regex routes', function () {
    var router = routington()

    var routes = router.define('/:id(\\w{3,30}|[0-9a-f]{24})')
    routes.should.have.length(1)

    var route = routes[0].parents[0]
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

    var route = routes[0].parents[0]
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

    var route1 = routes[1].parents[0]
    route1.name.should.equal('id')
    route1._regex.should.equal('\\w{3,30}')

    var route2 = routes[0].parents[0]
    route2.name.should.equal('id')
    route2.string.should.equal('asdf')
  })

  it('should define multiple string routes', function () {
    var router = routington()

    var routes = router.define('/asdf|qwer')
    routes.should.have.length(2)

    var route1 = routes[0].parents[0]
    route1.name.should.equal('')
    route1.string.should.equal('asdf')

    var route2 = routes[1].parents[0]
    route2.name.should.equal('')
    route2.string.should.equal('qwer')
  })

  it('should define multiple string routes using regex', function () {
    var router = routington()

    var routes = router.define('/:id(asdf|qwer)')
    routes.should.have.length(2)

    var route1 = routes[0].parents[0]
    route1.name.should.equal('id')
    route1.string.should.equal('asdf')

    var route2 = routes[1].parents[0]
    route2.name.should.equal('id')
    route2.string.should.equal('qwer')
  })

  it('should not duplicate string routes', function () {
    var router = routington()

    var routes2 = router.define('/asdf')
    routes2.should.have.length(1)
    var route2 = routes2[0].parents[0]

    var routes1 = router.define('/:id(asdf)')
    routes1.should.have.length(1)
    var route1 = routes1[0].parents[0]

    route1.should.equal(route2)
    route1.name.should.equal('')
    route2.name.should.equal('')
  })

  it('should not duplicate regex routes', function () {
      var router = routington()

      var routes1 = router.define('/:a(\\w{3,30})')
      routes1.should.have.length(1)
      var route1 = routes1[0].parents[0]

      var routes2 = router.define('/:b(\\w{3,30})')
      routes2.should.have.length(1)
      var route2 = routes2[0].parents[0]

      route1.should.equal(route2)
      route1.name.should.equal('a')
      route2.name.should.equal('a')
  })

  it('should multiply every branch', function () {
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

  it('should support a trailing *', function () {
    var router = routington()

    var routes = router.define('/*')
    routes.should.have.length(1)
    routes[0].should.equal(router)

    var routes2 = router.define('/asdf/*')
    routes.should.have.length(1)
    var route2 = routes2[0]

    route2.string.should.equal('asdf')
  })

  it('should not support intermediary *', function () {
    // To do
  })
})