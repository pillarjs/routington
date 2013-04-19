## Routington [![Build Status](https://travis-ci.org/berrington/routington.png)](https://travis-ci.org/berrington/routington)

Routington is a [trie](http://en.wikipedia.org/wiki/Trie)-based URL router. Its goal is only to define and match URLs. It does not handle methods, headers, controllers, views, etc., in anyway. It is faster than traditional, linear, regular expression-matching routers and scales with the number of routes. It is minimal and unopinionated and is intended to be used as a basis for your framework.

### API

#### router Routington = Routington()

```js
var routington = require('routington')
var router = routington()
```

`router`, better worded as `root`, is a special instance of `Node`. All `node`s will have `router` as furthest ancestor.

#### node Node = Routington.node()

A constructor for a node on the trie. You shouldn't construct these yourself. `node` on the other hand has the following properties:

- `child {}Node` - String based child definitions. For example, `node.child['post']` will return a child node with `node.string === 'post'`
- `children []Node` - Name/regex based child definitions
- `ancestors []Node` - Ancestors of the node
- `name` - Name of the node (for parameter matching)
- `string` - String to match
- `regex` - Regular expression to match
- `_regex` - String used to create the regular expression

#### nodes []Node = router.define(route)

```js
var nodes = routington.define('/:identity(page|petition)/:id([0-9a-f]{24})')
```

- `route` is a definition of a route and is an extension of Express' routing syntax. `route`, however, can only be a string.
- `nodes` is an array of `node`s.

Each fragment of the route, delimited by a `/`, can have the following signature:

- `string` - ex `/post`
- `string|string` - `|` separated strings, ex `/post|page`
- `:name` - Wildcard route matched to a name
- `(regex)` - A regular expression
- `:name(regex)`
- `:name(string|regex)`

Each `node` of `nodes` will always have `node.string === ''`. URLs are always treated with a trailing `/` by design.

You should always name your regular expressions otherwise you can't use the captured value. The regular expression is built using `new RegExp('^(' + regex + ')$', 'i')`, so you need to escape your string, ie `\\w`. You can always add names or regular expressions later. For example, I can define:

```js
router.define('/page/taylorswift')
router.define('/page/:id')
```

Then, after all the nodes are defined, I can manually fix them through the node tree.

```js
// The node for `/page`
var page = router.child['page']

// Name all the children as `id`
Object.keys(page.child).map(function (name) {
  return page.child[name]
}).concat(page.children).forEach(function (child) {
  child.name = 'id'
})

// Add a regular expression to the nodes not matched by a string
page.children.forEach(function (child) {
  child.regex = /^(\w{3,30})$/i
})
```

#### match {} = router.match(url)

```js
router.define('/page/:id')
var match = router.match('/page/taylorswift')
```

`match`, if not `null`, will be an object with the following properties:

- `param` - A list of named parameters, ex, `match.param.id === 'taylorswift'`.
- `node` - The matched node

### Browser Support

IE9+

### License

WTFPL

&copy; Jonathan Ong 2013

me@jongleberry.com

[@jongleberry](https://twitter.com/jongleberry)