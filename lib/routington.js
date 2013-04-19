module.exports = Routington

function Routington(options) {
  if (!(this instanceof Routington))
    return new Routington()

  options = options || {}

  this.child = {}
  this.children = []
  this.ancestors = []
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
  var child

  // Find by string
  if (
    typeof options.string === 'string' &&
    (child = this.child[options.string])
  ) return child

  if (options.string)
    return

  var children = this.children
  var l = children.length

  // Find by regex
  if (typeof options.regex === 'string')
    for (var i = 0; i < l; i++)
      if ((child = children[i])._regex === options.regex)
        return child

  if (options.regex)
    return

  // Find by name
  var name = options.name || ''

  for (var j = 0; j < l; j++)
    if ((child = children[j]).name === name)
      return child
}

// Attach a node to this node
Routington.prototype.attach = function (node) {
  if (!(node instanceof Routington))
    node = new Routington(node)

  node.ancestors = [this].concat(this.ancestors)

  if (node.string == null)
    this.children.push(node)
  else
    this.child[node.string] = node

  return node
}