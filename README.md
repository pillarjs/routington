## Routington

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]
[![Gittip][gittip-image]][gittip-url]

Routington is a [trie](http://en.wikipedia.org/wiki/Trie)-based URL router.
Its goal is only to define and match URLs.
It does not handle methods, headers, controllers, views, etc., in anyway.
It is faster than traditional, linear, regular expression-matching routers, although insignficantly,
and scales with the number of routes.

The purpose of this router isn't for performance,
but to bring more structure to URL routing.
The intention is for you to build a framework on top either in node.js or in the browser.

Implementations:

  - [koa-trie-router](https://github.com/koajs/trie-router) - for [koa](https://github.com/koajs)
  - [wayfarer](https://github.com/yoshuawuyts/wayfarer)

### API

#### node Node = Routington()

```js
var routington = require('routington')
var router = routington()
```

`router` is the root `Node` in the trie. All `node`s will have `router` as furthest ancestor.

#### Node

Every node on a tree is an instance of `Node`. You only construct the root. A `node` has the following properties:

- `child {}Node` - String based child definitions.
  For example, `node.child['post']` will return a child node with `node.string === 'post'`
- `children []Node` - Name/regex based child definitions
- `parent Node` - The parent of the node
- `name` - Name of the node (for parameter matching)
- `string` - String to match the URL fragment
- `regex` - Regular expression to match the URL fragment

#### nodes []Node = router.define(route)

```js
var nodes = router.define('/:identity(page|petition)/:id([0-9a-f]{24})')
```

- `route` is a definition of a route and is an extension of Express' routing syntax.
  `route`, however, can only be a string.
- `nodes` is an array of `node`s.

Each fragment of the route, delimited by a `/`, can have the following signature:

- `string` - ex `/post`
- `string|string` - `|` separated strings, ex `/post|page`
- `:name` - Wildcard route matched to a name
- `(regex)` - A regular expression match without saving the parameter (not recommended)
- `:name(regex)`- Named regular expression match

You should always name your regular expressions otherwise you can't use the captured value.
The regular expression is built using `new RegExp('^(' + regex + ')$', 'i')`,
so you need to escape your string, ie `\\w`.
You can always pre-define names or regular expressions before. For example, I can define:

```js
router.define('/page/:id(\\w{3,30})')

// later, :id will have the same regexp
// so you don't have to repeat yourself
router.define('/page/:id/things')
```

#### match {} = router.match(url)

```js
router.define('/page/:id(\\w{3,30})')
var match = router.match('/page/taylorswift')
```

`match`, unless `null`, will be an object with the following properties:

- `param` - A list of named parameters, ex, `match.param.id === 'taylorswift'`.
- `node` - The matched node.
  Will always have `name.string === ''`.

### Building a Router on top of Routington

Each URL you define creates a node,
and you are free to do whatever you'd like with each node as long you don't overwrite any prototype properties (basically just `define`, `match`, and `parse`).
Adding any features to routington shouldn't be necessary.

For example, suppose you want to attach callbacks to a node by extending routington:

```js
router.get('/:id/:controller', function (req, res, next) {
  console.log('do something')
})
```

You can attach the middleware to a `node.GET` array:

```js
router.get = function (path, handler) {
  var node = router.define(path)[0]
  node.GET = node.GET || []
  node.GET.push(handler)
}
```

Now, dispatching is easy:

```js
function dispatcher(req, res, next) {
  var match = router.match(url.parse(req.url).pathname)
  if (!match)
    // this is a 404

  var node = match.node
  var callbacks = node[req.method]
  if (!callbacks)
    // this is a 405

  // execute all the callbacks.
  // async.series won't actually work here,
  // but you get the point.
  async.series(callbacks, next)
}
```

Properties attached to the node will be exposed on the match.
For example,
suppose you wanted to label a node:

```js
var node = router.define('/:id/:controller')[0]
node.label = 'controller'
```

When matched, it will be available via `match.node.label`:

```js
var match = router.match('/someid/somecontroller')
assert(match.node.label === 'label')
```

Since reaching into `match.node` is a little inconvenient and you probably don't want your end users to touch it,
you should expose in your dispatcher:

```js
var match = router.match(url.parse(req.url).pathname)

// ...

req.param = match.param
req.label = match.node.label
```

### Browser Support

IE9+

[npm-image]: https://img.shields.io/npm/v/routington.svg?style=flat-square
[npm-url]: https://npmjs.org/package/routington
[github-tag]: http://img.shields.io/github/tag/pillarjs/routington.svg?style=flat-square
[github-url]: https://github.com/pillarjs/routington/tags
[travis-image]: https://img.shields.io/travis/pillarjs/routington.svg?style=flat-square
[travis-url]: https://travis-ci.org/pillarjs/routington
[coveralls-image]: https://img.shields.io/coveralls/pillarjs/routington.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/pillarjs/routington?branch=master
[david-image]: http://img.shields.io/david/pillarjs/routington.svg?style=flat-square
[david-url]: https://david-dm.org/pillarjs/routington
[license-image]: http://img.shields.io/npm/l/routington.svg?style=flat-square
[license-url]: LICENSE.md
[downloads-image]: http://img.shields.io/npm/dm/routington.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/routington
[gittip-image]: https://img.shields.io/gittip/jonathanong.svg?style=flat-square
[gittip-url]: https://www.gittip.com/jonathanong/
