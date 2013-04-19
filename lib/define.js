var Routington = require('./routington')

/*

  @url {string}

  returns []node

*/
Routington.prototype.define = function (url) {
  if (typeof url !== 'string')
    throw new Error('Only strings can be defined.')

  var frags = url.split('/').slice(1)
  if (frags[frags.length - 1] !== '')
    frags.push('')

  return Define(frags, this)
}

function Define(frags, root) {
  var frag = frags[0]
  var info = Routington.parse(frag)
  var name = info.name

  if (frag === '?')
    throw new TypeError('? parameters are not supported.')
  if (frag === '*')
    throw new TypeError('* parameters are not supported.')
  if (frag[0] === '*' || frag[frag.length - 1] === '*')
    throw new TypeError('* are not supported outside a regex.')

  var nodes = Object.keys(info.string).map(function (x) {
    return {
      name: name,
      string: x
    }
  })

  if (info.regex) {
    nodes.push({
      name: name,
      regex: info.regex
    })
  }

  if (!nodes.length) {
    nodes = [{
      name: name
    }]
  }

  nodes = nodes.map(root.add, root)

  return frags.length - 1
    ? flatten(nodes.map(Define.bind(null, frags.slice(1))))
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