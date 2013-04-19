## Routington [![Build Status](https://travis-ci.org/berrington/routington.png)](https://travis-ci.org/berrington/routington)

Routington is a [trie-based](http://en.wikipedia.org/wiki/Trie) URL router. It's goal is only to define and match URLs. It does not handle methods, headers, controllers, views, etc., in anyway. It is faster than traditional, linear, regular expression-matching routers and scales with the number of routes. It is minimal and unopinionated and is intended to be used as a basis for your framework.

### API

#### router Routington = Routington()

```js
var routington = require('routington')
var router = routington()
```

`Routington` is a constructor and inherits from `Node`.

#### node Node = Routington.node()

A constructor for a node on the trie. You shouldn't use this yourself. `node` on the other hand has the following properties:

- `branch {}Node` - String based branch definitions. For example, `node.branch['post']` will return a child node with `node.string === 'post'`
- `branches []Node` - Name/regex based branch definitions
- `parents []Node` - Parents of the node in the order of closest to farthest
- `name` - Name of the node. By default, it is just `''`
- `string` - String to match
- `regex` - Regular expression to match
- `_regex` - String used to create the regular expression

#### routes []Node = router.define(route)

```js
var routes = routington.define('/:identity(page|petition)/:id([0-9a-f]{24})')
```

`route` is a definition of a route and is based on Express' router. `routes` is an array of `node`s. Each fragment can have the following signature:

- `string` - Simple string, ex `/post`
- `string|string` - Array of strings separated by a `|`, ex `/post|page`
- `:name` - Wildcard route, but whatever it matches is defined by `name`, ex. `/page/:id` when matched by `/page/taylorswift` will return `match.param.name === 'taylorswift'`
- `(regex)` - A regular expression. You should always name your regular expressions otherwise you can't use the captured value. The regular expression is build as `new RegExp('^(' + regex + ')$', 'i')`, so you need to double escape your string, ie `\\w`.
- `:name(regex)` - A regular expression with a name
- `:name(string|regex)` - The regular expression is smart; it will split it by `|` and if a fragment is a string, it'll match as a string, otherwise as a regex. This will cause issues if your regular expression requires `|`'s. If this is the case, you should edit the `node`s yourself. ex `/page/:id(taylorswift|\\w{3,30})` will match `/page/taylorswift` with a string but `/page/taylor` with a regular expression.

Each `node` of `routes` will always have `node.string === ''`. URLs are always treated with a trailing `/` by design.

You can always add names or regular expressions later. For example, I can define:

```js
router.define('/page/taylorswift')
router.define('/page/:id')
```

Then, after all the routes are defined, I can manually fix them through the node tree.

```js
// The node for `/page`
var pageNode = router.branch['page']
// All the child branches of '/page' defined by a string
var stringBranches = Object.keys(pageNode.branch).map(function (x) {
  return pageNode.branch[x]
})
// All the child nodes
var pageNodeBranches = stringBranches.concat(pageNode.branches)
// Name them all as `id`
pageNodeBranches.forEach(function (node) {
  node.name = 'id'
})
// Add a regular expression to the nodes not defined by a string
pageNode.branches.forEach(function (node) {
  node.regex = /^(\w{3,30})$/i
})
```
#### match {} = router.match(url)

```js
router.define('/page/:id')
var match = router.match('/page/taylorswift')
```

`match` will have the following properties:

- `param` - A list of named parameters. ex, for the above case, `match.param.id === 'taylorswift'`.
- `node` - The matched node

### Browser Support

IE9+

### License

WTFPL

&copy; Jonathan Ong 2013

me@jongleberry.com

[@jongleberry](https://twitter.com/jongleberry)