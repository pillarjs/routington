var Routington = require('./routington')

Routington.parse = Parse

var slug = /^[.-\w]+$/

function Parse(string) {
  var options = {
    name: '',
    string: {},
    regex: ''
  }

  // Check for trailing ?
  if (string[string.length - 1] === '?') {
    string = string.slice(0, -1)
    options.string[''] = true
  }

  // Is a simple string
  if (string === '' || slug.test(string)) {
    options.string[string] = true
    return options
  }

  // Pipe-separated strings
  if (/^[.-\w][.-\w\|]+[.-\w]$/.test(string)) {
    string.split('|').forEach(function (x) {
      if (!slug.test(x))
        throw new TypeError('Invalid pipe separated strings: ' + string)

      options.string[x] = true
    })
    return options
  }

  // Find a parameter name for the string
  string = string.replace(/^:\w+\b/, function (_) {
    if (_)
      options.name = _.slice(1)

    if (!options.name)
      throw new TypeError('Invalid parameter name for:' + string)

    return ''
  })

  // Return if there are no attached regular expressions
  // ie when no ()
  if (!/^\(.+\)$/.test(string))
    return options

  // Regular expressions are split by a |
  // We remove any that can simply be strings
  options.regex = string.slice(1, -1).split('|').filter(function (x) {
    if (slug.test(x)) {
      options.string[x] = true
      return false
    }

    // Only want regular expressions
    return x
  }).join('|')

  return options
}