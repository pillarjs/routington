module.exports = Node

function Node(options) {
  options = options || {}

  this.branch = {}
  this.branches = []
  this.parents = []
  this.name = options.name || ''

  var string = options.string
  var regex = options.regex

  if (typeof string === 'string') {
    this.string = string
  } else if (typeof regex === 'string') {
    this._regex = regex
    this.regex = new RegExp('^(' + regex + ')$')
  }
}

// Find or create && attach
Node.prototype.add = function (options) {
  return this.find(options) || this.attach(options)
}

// Find a node based on a bunch of options
Node.prototype.find = function (options) {
  var branch

  // Find by string
  if (
    typeof options.string === 'string' &&
    (branch = this.branch[options.string])
  ) return branch

  if (options.string) return

  var branches = this.branches
  var l = branches.length

  // Find by regex
  if (typeof options.regex === 'string')
    for (var i = 0; i < l; i++)
      if ((branch = branches[i])._regex === options.regex)
        return branch

  if (options.regex) return

  // Find by name
  var name = options.name || ''

  for (var j = 0; j < l; j++)
    if ((branch = branches[j]).name === name)
      return branch
}

// Attach a node to this node
Node.prototype.attach = function (node) {
  if (!(node instanceof Node))
    node = new Node(node)

  node.parents = [this].concat(this.parents)

  if (node.string == null)
    this.branches.push(node)
  else
    this.branch[node.string] = node

  return node
}