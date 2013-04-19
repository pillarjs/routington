var Routington = require('./routington')

/*

  @url {string}

  returns {object} {
    param: {
      {name}: {string}
    },
    node: {node}
  }

*/

Routington.prototype.match = function (url) {
  var match = {
    param: {}
  }

  var frags = url.split('/').slice(1)
  var length = frags.length
  if (frags[length - 1] !== '')
    length = frags.push('')

  var root = this
  var frag, node, nodes, regex, name

  top:
  while (length) {
    frag = frags.shift()
    length = frags.length

    // Check by name
    if (node = root.branch[frag]) {
      if (name = node.name)
        match.param[name] = frag

      if (!length) {
        match.node = node
        return match
      }

      root = node
      continue top
    }

    // Check array of names/regexs
    nodes = root.branches
    for (var i = 0, l = nodes.length; i < l; i++) {
      node = nodes[i]

      if (!(regex = node.regex) || regex.test(frag)) {
        if (name = node.name)
          match.param[name] = frag

        if (!length) {
          match.node = node
          return match
        }

        root = node
        continue top
      }
    }
  }
}