;(function(){

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);
  var index = path + '/index.js';

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
  }

  if (require.aliases.hasOwnProperty(index)) {
    return require.aliases[index];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("routington//lib/routington.js", function(exports, require, module){
var util = require('util')

var node = require('./node')

util.inherits(Routington, node)

module.exports = Routington

Routington.node = node

function Routington() {
  if (!(this instanceof Routington))
    return new Routington()

  node.call(this)
}

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
});
require.register("routington//lib/define.js", function(exports, require, module){
var Routington = require('./routington')

Routington.define = Define

/*

  @url {string}

  returns @branches {array} [
    {branch}
  ]

*/
Routington.prototype.define = function (url) {
  var frags = url.split('/').slice(1)
  // Fragments must always end with a '' || '*'
  if (!~['*', ''].indexOf(frags[frags.length - 1]))
    frags.push('')

  var matches = []

  return Define(frags, this)
}

function Define(frags, root) {
  var info = Routington.parse(frags[0])
  frags = frags.slice(1)

  var nodes = info.strings.map(function (x) {
    return {
      name: info.name,
      string: x
    }
  }).concat(info.regexs.map(function (x) {
    return {
      name: info.name,
      regex: x
    }
  }))

  if (!nodes.length) {
    nodes = [{
      name: info.name
    }]
  }

  nodes = nodes.map(root.add, root)

  return frags.length
    ? flatten(nodes.map(Define.bind(null, frags)))
    : nodes
}

function flatten(arr, tmp) {
  tmp = tmp || []

  if (Array.isArray(arr)) {
    arr.forEach(function (x) {
      flatten(x, tmp)
    })
  } else {
    tmp.push(arr)
  }

  return tmp
}
});
require.register("routington//lib/match.js", function(exports, require, module){
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
});
require.register("routington//lib/node.js", function(exports, require, module){
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
    this.regex = new RegExp('^' + regex + '$', 'i')
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

  if (node.string == null) {
    this.branches.push(node)
  } else {
    this.branch[node.string] = node
  }

  return node
}
});
require.register("routington//lib/parse.js", function(exports, require, module){
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
});
require.alias("routington/index.js", "routington/index.js");

if (typeof exports == "object") {
  module.exports = require("routington");
} else if (typeof define == "function" && define.amd) {
  define(function(){ return require("routington"); });
} else {
  window["routington"] = require("routington");
}})();