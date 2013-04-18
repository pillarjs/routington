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

// A test for supported URLs
// Mostly so people don't complain
// "This URL doesn't work."
Routington.isValidURL = function (url) {
  // Non-null strings only
  if (typeof url !== 'string') return false
  // Special case for root path
  if (url === '') return true
  // Relative URLs only
  if (url[0] !== '/' || url[1] === '/') return false
  // No multi-slashes anywhere in the route
  if (url.match(/\/{2,}/)) return false

  return true
}