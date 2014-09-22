
var assert = require('http-assert')

var Routington = require('./routington')

/*

  @url {string}

  returns {object} {
    param: {
      {name}: {string}
    },
    node: {routington}
  }

*/

Routington.prototype.match = function (url) {
  var root = this
  var frags = url.split('/')
  var length = frags.length

  var match = {
    param: {}
  }

  var frag, node, nodes, regex, name

  top:
  while (length) {
    frag = decode(frags.shift())
    assert(frag !== -1, 404, 'malformed url: ' + url)
    length = frags.length

    // Check by name
    if (node = root.child[frag]) {
      if (name = node.name) match.param[name] = frag

      if (!length) {
        match.node = node
        return match
      }

      root = node
      continue top
    }

    // Check array of names/regexs
    nodes = root.children
    for (var i = 0, l = nodes.length; i < l; i++) {
      node = nodes[i]

      if (!(regex = node.regex) || regex.test(frag)) {
        if (name = node.name) match.param[name] = frag

        if (!length) {
          match.node = node
          return match
        }

        root = node
        continue top
      }
    }

    // No string or regex match, 404
    return
  }
}

function decode(string) {
  try {
    return decodeURIComponent(string)
  } catch (err) {
    return -1
  }
}
