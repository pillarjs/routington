module.exports = Routington

function Routington(options) {
  if (!(this instanceof Routington))
    return new Routington()

  options = options || {}

  this.child = {}
  this.children = []
  this.name = options.name || ''

  var string = options.string
  var regex = options.regex

  if (typeof string === 'string') {
    this.string = string
  } else if (typeof regex === 'string') {
    this._regex = regex
    this.regex = new RegExp('^(' + regex + ')$', 'i')
  }
}

// Find || (create && attach) a child node
Routington.prototype.add = function (options) {
  return this.find(options)
    || this.attach(options)
}

// Find a child node based on a bunch of options
Routington.prototype.find = function (options) {
  // Find by string
  if (typeof options.string === 'string')
    return this.child[options.string]

  var child
  var children = this.children
  var l = children.length

  // Find by regex
  if (typeof options.regex === 'string')
    for (var i = 0; i < l; i++)
      if ((child = children[i])._regex === options.regex)
        return child

  // Find by name
  else if (options.name)
    for (var j = 0; j < l; j++)
      if ((child = children[j]).name === options.name)
        return child
}

// Attach a node to this node
Routington.prototype.attach = function (node) {
  if (!(node instanceof Routington))
    node = new Routington(node)

  node.parent = this

  if (node.string == null)
    this.children.push(node)
  else
    this.child[node.string] = node

  return node
}