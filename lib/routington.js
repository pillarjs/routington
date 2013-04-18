var util = require('util')

var node = require('./node')

util.inherits(Routington, node)

module.exports = Routington

Routington.node = node

// Basically just creates a top level node
function Routington() {
  if (!(this instanceof Routington))
    return new Routington()

  node.call(this)
}