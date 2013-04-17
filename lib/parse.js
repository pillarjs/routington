var Routington = require('./routington')

Routington.parse = Parse

var slug = /^[.-\w]+$/

function Parse(string) {
  var options = {
    name: '',
    strings: [],
    regexs: []
  }

  // Is a simple string
  if (string === '' || slug.test(string)) {
    options.strings = [string]
    return options
  }

  // Pipe separated strings
  if (/^[.-\w][.-\w\|]+[.-\w]$/.test(string)) {
    string.split('|').forEach(function (x) {
      if (!slug.test(x))
        throw TypeError('Invalid pipe separated strings: ' + string)

      options.strings.push(x)
    })
    return options
  }

  // Find a parameter name for the string
  string = string.replace(/^:\w+\b/, function (_) {
    if (_) options.name = _.slice(1)

    if (!options.name)
      throw TypeError('Invalid parameter name for:' + string)

    return ''
  })

  // Return if there are no attached regular expressions
  // ie when no ()
  if (!/^\(.+\)$/.test(string)) return options

  // Regular expressions are split by a |
  // Obviously, this will break if your regexp
  // includes |s
  string.slice(1, -1).split('|').forEach(function (x) {
    options[
      slug.test(x)
      ? 'strings'
      : 'regexs'
    ].push(x)
  })

  return options
}