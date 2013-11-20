var router = require('./')()

router.define('/')
router.define('/:nav(about)')
router.define('/:identity(page)/:id([0-9a-f]{24}|\\w{3,30})')
router.define('/:identity(page)/:id([0-9a-f]{24}|\\w{3,30})/:nav(posts)/:tab(new)')

suite('routington', function () {
  set('mintime', 1000)

  bench('/', function () {
    router.match('/')
    router.match('/about')
  })

  bench('/about', function () {
    router.match('/')
    router.match('/about')
  })

  bench('/page/taylorswift', function () {
    router.match('/page/taylorswift')
    router.match('/page/taylorswift/posts')
    router.match('/page/taylorswift/posts/new')
  })

  bench('/page/taylorswift/posts/new', function () {
    router.match('/page/taylorswift')
    router.match('/page/taylorswift/posts')
    router.match('/page/taylorswift/posts/new')
  })
})