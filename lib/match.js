var Routington = require('./routington')

/*

  @url {string}

  returns @match {object} {
    param: {
      {name}: {string}
    },
    branch: branch{}
  }

*/

Routington.prototype.match = function (url) {
  var match = {
    param: {}
  }

  var frags = url.split('/').slice(1).concat('')
  var length = frags.length
  var root = this

  var frag, branch, branches, regex, name

  top:
  while (length) {
    frag = frags.shift()
    length = frags.length

    // Check by name
    if (branch = root.branch[frag]) {
      if (name = branch.name) match.param[name] = frag
      if (!length) {
        match.branch = branch
        return match
      }
      root = branch
      continue top
    }

    // Check array of names/regexs
    branches = root.branches
    for (var i = 0, l = branches.length; i < l; i++) {
      branch = branches[i]

      if (!(regex = branch.regex) || regex.test(frag)) {
        if (name = branch.name) match.param[name] = frag
        if (!length) {
          match.branch = branch
          return match
        }
        root = branch
        continue top
      }
    }
  }
}