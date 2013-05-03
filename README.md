## Routington [![Build Status](https://travis-ci.org/berrington/routington.png)](https://travis-ci.org/berrington/routington)

Routington is a [trie](http://en.wikipedia.org/wiki/Trie)-based URL router. Its goal is only to define and match URLs. It does not handle methods, headers, controllers, views, etc., in anyway. It is faster than traditional, linear, regular expression-matching routers, although insignficantly, and scales with the number of routes.

The purpose of this router isn't for performance, but to bring more structure to URL routing. The intention is for you to build a framework on top of it either on node.js or the browser.

For a node.js implementation, we have built [connectington](https://github.com/berrington/connectington). This can be used either as a standalone or as a replacement for Express' router.

### API

#### node Node = Routington()

```js
var routington = require('routington')
var router = routington()
```

`router` is the root `Node` in the trie. All `node`s will have `router` as furthest ancestor.

#### Node

Every node on a tree is an instance of `Node`. You only construct the root. `node` on the other hand has the following properties:

- `child {}Node` - String based child definitions. For example, `node.child['post']` will return a child node with `node.string === 'post'`
- `children []Node` - Name/regex based child definitions
- `parent Node` - The parent of the note
- `name` - Name of the node (for parameter matching)
- `string` - String to match
- `regex` - Regular expression to match

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
- `:name(regex)`- Named regular expression match
- `:name(string|regex)` - Named regular expression or string match

Each `node` of `nodes` will always have `node.string === ''`. URLs are always treated with a trailing `/` by design.

You should always name your regular expressions otherwise you can't use the captured value. The regular expression is built using `new RegExp('^(' + regex + ')$', 'i')`, so you need to escape your string, ie `\\w`. You can always pre-define names or regular expressions before. For example, I can define:

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
- `node` - The matched node. Will have `name.string === ''`

### Browser Support

IE9+

### License

WTFPL

&copy; Jonathan Ong 2013

me@jongleberry.com

[@jongleberry](https://twitter.com/jongleberry)