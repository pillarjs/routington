var Routington = require('./routington')

/*

  @url {string}

  returns []node

*/
Routington.prototype.define = function (url) {
  var frags = url.split('/').slice(1)
  // Fragments must always end with a '' || '*'
  if (!~['*', ''].indexOf(frags[frags.length - 1]))
    frags.push('')

  return Define(frags, this)
}

function Define(frags, root) {
  var length = frags.length
  var frag = frags[0]
  if (frag === '*' && length === 1)
    return [root]

  var info = Routington.parse(frag)
  frags = frags.slice(1)
  length--

  var nodes = Object.keys(info.string).map(function (x) {
    return {
      name: info.name,
      string: x
    }
  })

  if (info.regex) {
    nodes.push({
      name: info.name,
      regex: info.regex
    })
  }

  if (!nodes.length) {
    nodes = [{
      name: info.name
    }]
  }

  nodes = nodes.map(root.add, root)

  return length
    ? flatten(nodes.map(Define.bind(null, frags)))
    : nodes
}

function flatten(arr, tmp) {
  tmp = tmp || []

  if (Array.isArray(arr)) {
    arr.forEach(function (x) {
      flatten(x, tmp)
    })
  } else {
    tmp.push(arr)
  }

  return tmp
}