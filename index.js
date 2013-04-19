module.exports = require('./lib/routington')

;[
  'define',
  'match',
  'parse'
].forEach(function (x) {
  require('./lib/' + x)
})