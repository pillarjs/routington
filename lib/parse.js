var Routington = require('./routington')

Routington.parse = function (string) {
  var options = Parse(string)

  if (
    !options.name &&
    !options.regex &&
    !Object.keys(options.string).length
  ) throw new Error('Invalid parsed string: ' + string)

  return options
}

function Parse(string) {
  var og = string

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
  if (isValidSlug(string)) {
    options.string[string] = true
    return options
  }

  // Pipe-separated strings
  if (/^[.-\w][.-\w\|]+[.-\w]$/.test(string)) {
    string.split('|').forEach(function (x) {
      options.string[x] = true
    })
    return options
  }

  // Find a parameter name for the string
  string = string.replace(/^:\w+\b/, function (_) {
    options.name = _.slice(1)

    return ''
  })

  // Return if the string is now empty
  if (!string)
    return options

  // Return if there are no attached regular expressions
  // ie when no ()
  if (!/^\(.+\)$/.test(string)) {
    if (/(\.*\)/.test(string))
      throw new Error('Invalid regular expression capture: ' + og)
    else
      return options
  }

  // Regular expressions are split by a |
  // We remove any that can simply be strings
  // This may mess up the regex
  options.regex = string.slice(1, -1).split('|').filter(function (x) {
    if (isValidSlug(x)) {
      options.string[x] = true
      return false
    }

    // Only want regular expressions
    return x
  }).join('|')

  return options
}

function isValidSlug(x) {
  return x === ''
    || /^[.-\w]+$/.test(x)
}