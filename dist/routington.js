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
require.register("routington//index.js", function(exports, require, module){
module.exports = require('./lib/routington')

;[
  'define',
  'match',
  'parse'
].forEach(function (x) {
  require('./lib/' + x)
})
});
require.register("routington//lib/routington.js", function(exports, require, module){
module.exports = Routington

function Routington(options) {
  if (!(this instanceof Routington))
    return new Routington()

  options = options || {}

  this.child = {}
  this.children = []
  this.name = options.name || ''

  if (typeof options.string === 'string')
    this.string = options.string
  else if (typeof options.regex === 'string')
    this.regex = new RegExp('^(' + options.regex + ')$', 'i')
  else if (options.regex instanceof RegExp)
    this.regex = options.regex
}

// Find || (create && attach) a child node
Routington.prototype.add = function (options) {
  return this.find(options)
    || this.attach(options)
}

// Find a child node based on a bunch of options
Routington.prototype.find = function (options) {
  // Find by string
  if (typeof options.string === 'string')
    return this.child[options.string]

  var child
  var children = this.children
  var l = children.length

  // Find by name
  if (options.name)
    for (var j = 0; j < l; j++)
      if ((child = children[j]).name === options.name)
        return child
}

// Attach a node to this node
Routington.prototype.attach = function (node) {
  if (!(node instanceof Routington))
    node = new Routington(node)

  node.parent = this

  if (node.string == null)
    this.children.push(node)
  else
    this.child[node.string] = node

  return node
}
});
require.register("routington//lib/define.js", function(exports, require, module){
var Routington = require('./routington')

/*

  @route {string}

  returns []routington

*/
Routington.prototype.define = function (route) {
  if (typeof route !== 'string')
    throw new TypeError('Only strings can be defined.')

  var frags = route.split('/').slice(1)
  if (frags[frags.length - 1] !== '')
    frags.push('')

  try {
    return Define(frags, this)
  } catch (err) {
    err.route = route
    throw err
  }
}

function Define(frags, root) {
  var frag = frags[0]
  var info = Routington.parse(frag)
  var name = info.name

  var nodes = Object.keys(info.string).map(function (x) {
    return {
      name: name,
      string: x
    }
  })

  if (info.regex) {
    nodes.push({
      name: name,
      regex: info.regex
    })
  }

  if (!nodes.length) {
    nodes = [{
      name: name
    }]
  }

  nodes = nodes.map(root.add, root)

  return frags.length - 1
    ? flatten(nodes.map(Define.bind(null, frags.slice(1))))
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

  returns {object} {
    param: {
      {name}: {string}
    },
    node: {routington}
  }

*/

Routington.prototype.match = function (url) {
  var match = {
    param: {}
  }

  var frags = url.split('/').slice(1)
  var length = frags.length
  if (frags[length - 1] !== '')
    length = frags.push('')

  var root = this
  var frag, node, nodes, regex, name

  top:
  while (length) {
    frag = frags.shift()
    length = frags.length

    // Check by name
    if (node = root.child[frag]) {
      if (name = node.name)
        match.param[name] = frag

      if (!length) {
        match.node = node
        return match
      }

      root = node
      continue top
    }

    // Check array of names/regexs
    nodes = root.children
    for (var i = 0, l = nodes.length; i < l; i++) {
      node = nodes[i]

      if (!(regex = node.regex) || regex.test(frag)) {
        if (name = node.name)
          match.param[name] = frag

        if (!length) {
          match.node = node
          return match
        }

        root = node
        continue top
      }
    }
  }
}
});
require.register("routington//lib/parse.js", function(exports, require, module){
var Routington = require('./routington')

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
  if (/^[\w-][\w\|-]+[\w-]$/.test(string)) {
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

  // Regular expressions are split by a |
  // We remove any that can simply be strings
  // This may mess up the regex
  if (/^\(.+\)$/.test(string)) {
    options.regex = string.slice(1, -1).split('|').filter(function (x) {
      if (!isValidSlug(x))
        return true

      options.string[x] = true
      return false
    }).join('|')

    return options
  }
}

function isValidSlug(x) {
  return x === ''
    || /^[\w-]+$/.test(x)
}
});
require.alias("routington/index.js", "routington/index.js");

if (typeof exports == "object") {
  module.exports = require("routington");
} else if (typeof define == "function" && define.amd) {
  define(function(){ return require("routington"); });
} else {
  this["routington"] = require("routington");
}})();