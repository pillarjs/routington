var routington = require('../')
var parse = routington.parse

describe('Parse', function () {
  it('should parse a null string', function () {
    parse('').should.eql({
      name: '',
      strings: [
        ''
      ],
      regexs: []
    })
  })

  it('should parse a word string', function () {
    parse('asdf').should.eql({
      name: '',
      strings: [
        'asdf'
      ],
      regexs: []
    })
  })

  it('should allow -, _, and . in strings', function () {
    parse('a-b_-.a').should.eql({
      name: '',
      strings: [
        'a-b_-.a'
      ],
      regexs: []
    })
  })

  it('should parse a named parameter', function () {
    parse(':id').should.eql({
      name: 'id',
      strings: [],
      regexs: []
    })
  })

  it('should parse a named parameter with strings', function () {
    parse(':id(one|two)').should.eql({
      name: 'id',
      strings: [
        'one',
        'two'
      ],
      regexs: []
    })
  })

  it('should parse a named parameter with regexs', function () {
    parse(':id(\\w{3,30}|[0-9a-f]{24})').should.eql({
      name: 'id',
      strings: [],
      regexs: [
        '\\w{3,30}',
        '[0-9a-f]{24}'
      ]
    })
  })

  it('should parse a named parameter with regexs and strings', function () {
    parse(':id(\\w{3,30}|asdf)').should.eql({
      name: 'id',
      strings: [
        'asdf'
      ],
      regexs: [
        '\\w{3,30}'
      ]
    })
  })

  it('should parse pipe separated strings', function () {
    parse('asdf|qwer').should.eql({
      name: '',
      strings: [
        'asdf',
        'qwer'
      ],
      regexs: []
    })
  })

  it('should throw on invalid pipe separated strings', function () {
    parse('asdf|$$$').should.throw()
  })

  it('should parse unnamed regexs', function () {
    parse('(\\w+|\\d+)').should.eql({
      name: '',
      strings: [],
      regexs: [
        '\\w+',
        '\\d+'
      ]
    })
  })
})