var Routington = require('./routington')

Routington.define = Define

/*

  @url {string}

  returns @branches {array} [
    {branch}
  ]

*/
Routington.prototype.define = function (url) {
  var frags = url.split('/').slice(1)
  // Fragments must always end with a '' || '*'
  if (!~['*', ''].indexOf(frags[frags.length - 1]))
    frags.push('')

  return Define(frags, this)
}

function Define(frags, root) {
  var info = Routington.parse(frags[0])
  frags = frags.slice(1)

  var nodes = info.strings.map(function (x) {
    return {
      name: info.name,
      string: x
    }
  }).concat(info.regexs.map(function (x) {
    return {
      name: info.name,
      regex: x
    }
  }))

  if (!nodes.length) {
    nodes = [{
      name: info.name
    }]
  }

  nodes = nodes.map(root.add, root)

  return frags.length
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