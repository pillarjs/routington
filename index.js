module.exports = require('./lib/routington')

;[
  'define',
  'match',
  'node',
  'parse'
].forEach(function (x) {
  require('./lib/' + x)
})