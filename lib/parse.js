var Routington = require('./routington')

var pairs = [
  ['[', ']'],
  ['(', ')'],
  ['{', '}']
]

Routington.parse = function (string) {
  var options = Parse(string)
  if (!options)
    throw new Error('Invalid parsed string: ' + string)

  return options
}

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
  if (isValidSlug(string)) {
    options.string[string] = true
    return options
  }

  // Pipe-separated strings
  if (isPipeSeparatedString(string)) {
    string.split('|').forEach(function (x) {
      options.string[x] = true
    })
    return options
  }

  // Find a parameter name for the string
  string = string.replace(/^\:\w+\b/, function (_) {
    options.name = _.slice(1)
    return ''
  })

  // Return if the string is now empty
  if (!string)
    return options

  // Regular expressions are split by a |
  // We remove any that can simply be strings
  // This may mess up the regex
  if (/^\(.+\)$/.test(string) && (string = string.slice(1, -1))) {
    if (isPipeSeparatedString(string))
      string.split('|').filter(function (x) {
        options.string[x] = true
      })
    else
      options.regex = string

    return options
  }
}

function isValidSlug(x) {
  return x === ''
    || /^[\w\.-]+$/.test(x)
}

function isPipeSeparatedString(x) {
  return /^[\w\.\-][\w\.\-\|]+[\w\.\-]$/.test(x)
}