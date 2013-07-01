var assert = require('assert')

var routington = require('../')

var parse = routington.parse

describe('Parse', function () {
  it('should parse a null string', function () {
    parse('').should.eql({
      name: '',
      string: {
        '': true
      },
      regex: ''
    })
  })

  it('should parse a word string', function () {
    parse('asdf').should.eql({
      name: '',
      string: {
        'asdf': true
      },
      regex: ''
    })
  })

  it('should allow - and _ in strings', function () {
    parse('a-b_-a').should.eql({
      name: '',
      string: {
        'a-b_-a': true
      },
      regex: ''
    })
  })

  it('should parse a named parameter', function () {
    parse(':id').should.eql({
      name: 'id',
      string: {},
      regex: ''
    })
  })

  it('should parse a named parameter with strings', function () {
    parse(':id(one|two)').should.eql({
      name: 'id',
      string: {
        'one': true,
        'two': true
      },
      regex: ''
    })
  })

  it('should parse a named parameter with regexs', function () {
    parse(':id(\\w{3,30}|[0-9a-f]{24})').should.eql({
      name: 'id',
      string: {},
      regex: '\\w{3,30}|[0-9a-f]{24}'
    })
  })

  it('should parse a named parameter with regexs and strings', function () {
    parse(':id(\\w{3,30}|asdf)').should.eql({
      name: 'id',
      string: {
        'asdf': true
      },
      regex: '\\w{3,30}'
    })
  })

  it('should parse pipe separated strings', function () {
    parse('asdf|qwer').should.eql({
      name: '',
      string: {
        'asdf': true,
        'qwer': true
      },
      regex: ''
    })
  })

  it('should throw on invalid pipe separated strings', function () {
    assert.throws(function () {
      parse('asdf|$$$')
    })
  })

  it('should parse unnamed regexs', function () {
    parse('(\\w+|\\d+)').should.eql({
      name: '',
      string: {},
      regex: '\\w+|\\d+'
    })
  })

  it('should parse trailing ?', function () {
    parse(':id?').should.eql({
      name: 'id',
      string: {
        '': true
      },
      regex: ''
    })
  })

  it('should throw on invalid parameters', function () {
    ;[
      '*',
      ':id*',
      '*a',
      'a*',
      ':',
      ':()'
    ].forEach(function (x) {
      assert.throws(function () {
        parse(x)
      }, x)
    })
  })

  it('should not throw on oddly piped parameters', function () {
    ;[
      'a|b',
      'a||b',
      ':a(|b|c)',
      ':b(|c||d)'
    ].forEach(function (x) {
      assert.doesNotThrow(function () {
        parse(x)
      }, x)
    })
  })

  it('should support regular expressions with pipes', function () {
    parse(':id([0-9a-f]{24}\\.[olmsta]\\.(jpg|png))').should.eql({
      name: 'id',
      string: {},
      regex: '[0-9a-f]{24}\\.[olmsta]\\.(jpg|png)'
    })
  })

  it('should parse strings with a `.` as a string', function () {
    parse('blog.rss').should.eql({
      name: '',
      string: {
        'blog.rss': true
      },
      regex: ''
    })

    parse(':nav(blog.rss)').should.eql({
      name: 'nav',
      string: {
        'blog.rss': true
      },
      regex: ''
    })
  })

  it('should parse strings with a `-` as a string', function () {
    parse('privacy-policy').should.eql({
      name: '',
      string: {
        'privacy-policy': true
      },
      regex: ''
    })

    parse(':nav(privacy-policy|terms-of-service)').should.eql({
      name: 'nav',
      string: {
        'privacy-policy': true,
        'terms-of-service': true
      },
      regex: ''
    })
  })
})