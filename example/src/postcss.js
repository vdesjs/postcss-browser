var process = {
  env: {}
}
function getAugmentedNamespace(n) {
  if (n.__esModule) return n
  var a = Object.defineProperty({}, '__esModule', { value: true })
  Object.keys(n).forEach(function (k) {
    var d = Object.getOwnPropertyDescriptor(n, k)
    Object.defineProperty(
      a,
      k,
      d.get
        ? d
        : {
            enumerable: true,
            get: function () {
              return n[k]
            }
          }
    )
  })
  return a
}

// MIT lisence
// from https://github.com/substack/tty-browserify/blob/1ba769a6429d242f36226538835b4034bf6b7886/index.js

function isatty() {
  return false
}

function ReadStream() {
  throw new Error('tty.ReadStream is not implemented')
}

function WriteStream() {
  throw new Error('tty.ReadStream is not implemented')
}

var tty$1 = {
  isatty: isatty,
  ReadStream: ReadStream,
  WriteStream: WriteStream
}

var tty$2 = /*#__PURE__*/ Object.freeze({
  __proto__: null,
  isatty: isatty,
  ReadStream: ReadStream,
  WriteStream: WriteStream,
  default: tty$1
})

var require$$0 = /*@__PURE__*/ getAugmentedNamespace(tty$2)

let tty = require$$0

let isDisabled = 'NO_COLOR' in process.env
let isForced = 'FORCE_COLOR' in process.env
let isWindows = process.platform === 'win32'

let isCompatibleTerminal =
  tty && tty.isatty(1) && process.env.TERM && process.env.TERM !== 'dumb'

let isCI =
  'CI' in process.env &&
  ('GITHUB_ACTIONS' in process.env ||
    'GITLAB_CI' in process.env ||
    'CIRCLECI' in process.env)

let isColorSupported$1 =
  !isDisabled && (isForced || isWindows || isCompatibleTerminal || isCI)

let nope = s => String(s)

function color(openCode, closeCode) {
  let open = `\x1b[${openCode}m`
  let close = `\x1b[${closeCode}m`

  return s => {
    if (s === '') {
      return s
    } else {
      return (
        open +
        (!!~('' + s).indexOf(close, 4)
          ? s.replace(new RegExp(`\\x1b\\[${closeCode}m`, 'g'), open)
          : s) +
        close
      )
    }
  }
}

function createColors(enabled = isColorSupported$1) {
  if (enabled) {
    return {
      isColorSupported: true,
      reset: color(0, 0),
      bold: color(1, 22),
      dim: color(2, 22),
      italic: color(3, 23),
      underline: color(4, 24),
      inverse: color(7, 27),
      hidden: color(8, 28),
      strikethrough: color(9, 29),
      black: color(30, 39),
      red: color(31, 39),
      green: color(32, 39),
      yellow: color(33, 39),
      blue: color(34, 39),
      magenta: color(35, 39),
      cyan: color(36, 39),
      white: color(37, 39),
      gray: color(90, 39),
      bgBlack: color(40, 49),
      bgRed: color(41, 49),
      bgGreen: color(42, 49),
      bgYellow: color(43, 49),
      bgBlue: color(44, 49),
      bgMagenta: color(45, 49),
      bgCyan: color(46, 49),
      bgWhite: color(47, 49)
    }
  } else {
    return {
      isColorSupported: false,
      reset: nope,
      bold: nope,
      dim: nope,
      italic: nope,
      underline: nope,
      inverse: nope,
      hidden: nope,
      strikethrough: nope,
      black: nope,
      red: nope,
      green: nope,
      yellow: nope,
      blue: nope,
      magenta: nope,
      cyan: nope,
      white: nope,
      gray: nope,
      bgBlack: nope,
      bgRed: nope,
      bgGreen: nope,
      bgYellow: nope,
      bgBlue: nope,
      bgMagenta: nope,
      bgCyan: nope,
      bgWhite: nope
    }
  }
}

let {
  reset,
  bold: bold$1,
  dim,
  italic,
  underline,
  inverse,
  hidden,
  strikethrough,
  black,
  red: red$1,
  green: green$1,
  yellow: yellow$1,
  blue,
  magenta: magenta$1,
  cyan: cyan$1,
  white,
  gray: gray$2,
  bgBlack,
  bgRed,
  bgGreen,
  bgYellow,
  bgBlue,
  bgMagenta,
  bgCyan,
  bgWhite
} = createColors(isColorSupported$1)

var nanocolors = {
  isColorSupported: isColorSupported$1,
  reset,
  bold: bold$1,
  dim,
  italic,
  underline,
  inverse,
  hidden,
  strikethrough,
  black,
  red: red$1,
  green: green$1,
  yellow: yellow$1,
  blue,
  magenta: magenta$1,
  cyan: cyan$1,
  white,
  gray: gray$2,
  bgBlack,
  bgRed,
  bgGreen,
  bgYellow,
  bgBlue,
  bgMagenta,
  bgCyan,
  bgWhite,
  createColors
}

const SINGLE_QUOTE = "'".charCodeAt(0)
const DOUBLE_QUOTE = '"'.charCodeAt(0)
const BACKSLASH = '\\'.charCodeAt(0)
const SLASH = '/'.charCodeAt(0)
const NEWLINE = '\n'.charCodeAt(0)
const SPACE = ' '.charCodeAt(0)
const FEED = '\f'.charCodeAt(0)
const TAB = '\t'.charCodeAt(0)
const CR = '\r'.charCodeAt(0)
const OPEN_SQUARE = '['.charCodeAt(0)
const CLOSE_SQUARE = ']'.charCodeAt(0)
const OPEN_PARENTHESES = '('.charCodeAt(0)
const CLOSE_PARENTHESES = ')'.charCodeAt(0)
const OPEN_CURLY = '{'.charCodeAt(0)
const CLOSE_CURLY = '}'.charCodeAt(0)
const SEMICOLON = ';'.charCodeAt(0)
const ASTERISK = '*'.charCodeAt(0)
const COLON = ':'.charCodeAt(0)
const AT = '@'.charCodeAt(0)

const RE_AT_END = /[\t\n\f\r "#'()/;[\\\]{}]/g
const RE_WORD_END = /[\t\n\f\r !"#'():;@[\\\]{}]|\/(?=\*)/g
const RE_BAD_BRACKET = /.[\n"'(/\\]/
const RE_HEX_ESCAPE = /[\da-f]/i

var tokenize = function tokenizer(input, options = {}) {
  let css = input.css.valueOf()
  let ignore = options.ignoreErrors

  let code, next, quote, content, escape
  let escaped, escapePos, prev, n, currentToken

  let length = css.length
  let pos = 0
  let buffer = []
  let returned = []

  function position() {
    return pos
  }

  function unclosed(what) {
    throw input.error('Unclosed ' + what, pos)
  }

  function endOfFile() {
    return returned.length === 0 && pos >= length
  }

  function nextToken(opts) {
    if (returned.length) return returned.pop()
    if (pos >= length) return

    let ignoreUnclosed = opts ? opts.ignoreUnclosed : false

    code = css.charCodeAt(pos)

    switch (code) {
      case NEWLINE:
      case SPACE:
      case TAB:
      case CR:
      case FEED: {
        next = pos
        do {
          next += 1
          code = css.charCodeAt(next)
        } while (
          code === SPACE ||
          code === NEWLINE ||
          code === TAB ||
          code === CR ||
          code === FEED
        )

        currentToken = ['space', css.slice(pos, next)]
        pos = next - 1
        break
      }

      case OPEN_SQUARE:
      case CLOSE_SQUARE:
      case OPEN_CURLY:
      case CLOSE_CURLY:
      case COLON:
      case SEMICOLON:
      case CLOSE_PARENTHESES: {
        let controlChar = String.fromCharCode(code)
        currentToken = [controlChar, controlChar, pos]
        break
      }

      case OPEN_PARENTHESES: {
        prev = buffer.length ? buffer.pop()[1] : ''
        n = css.charCodeAt(pos + 1)
        if (
          prev === 'url' &&
          n !== SINGLE_QUOTE &&
          n !== DOUBLE_QUOTE &&
          n !== SPACE &&
          n !== NEWLINE &&
          n !== TAB &&
          n !== FEED &&
          n !== CR
        ) {
          next = pos
          do {
            escaped = false
            next = css.indexOf(')', next + 1)
            if (next === -1) {
              if (ignore || ignoreUnclosed) {
                next = pos
                break
              } else {
                unclosed('bracket')
              }
            }
            escapePos = next
            while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
              escapePos -= 1
              escaped = !escaped
            }
          } while (escaped)

          currentToken = ['brackets', css.slice(pos, next + 1), pos, next]

          pos = next
        } else {
          next = css.indexOf(')', pos + 1)
          content = css.slice(pos, next + 1)

          if (next === -1 || RE_BAD_BRACKET.test(content)) {
            currentToken = ['(', '(', pos]
          } else {
            currentToken = ['brackets', content, pos, next]
            pos = next
          }
        }

        break
      }

      case SINGLE_QUOTE:
      case DOUBLE_QUOTE: {
        quote = code === SINGLE_QUOTE ? "'" : '"'
        next = pos
        do {
          escaped = false
          next = css.indexOf(quote, next + 1)
          if (next === -1) {
            if (ignore || ignoreUnclosed) {
              next = pos + 1
              break
            } else {
              unclosed('string')
            }
          }
          escapePos = next
          while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
            escapePos -= 1
            escaped = !escaped
          }
        } while (escaped)

        currentToken = ['string', css.slice(pos, next + 1), pos, next]
        pos = next
        break
      }

      case AT: {
        RE_AT_END.lastIndex = pos + 1
        RE_AT_END.test(css)
        if (RE_AT_END.lastIndex === 0) {
          next = css.length - 1
        } else {
          next = RE_AT_END.lastIndex - 2
        }

        currentToken = ['at-word', css.slice(pos, next + 1), pos, next]

        pos = next
        break
      }

      case BACKSLASH: {
        next = pos
        escape = true
        while (css.charCodeAt(next + 1) === BACKSLASH) {
          next += 1
          escape = !escape
        }
        code = css.charCodeAt(next + 1)
        if (
          escape &&
          code !== SLASH &&
          code !== SPACE &&
          code !== NEWLINE &&
          code !== TAB &&
          code !== CR &&
          code !== FEED
        ) {
          next += 1
          if (RE_HEX_ESCAPE.test(css.charAt(next))) {
            while (RE_HEX_ESCAPE.test(css.charAt(next + 1))) {
              next += 1
            }
            if (css.charCodeAt(next + 1) === SPACE) {
              next += 1
            }
          }
        }

        currentToken = ['word', css.slice(pos, next + 1), pos, next]

        pos = next
        break
      }

      default: {
        if (code === SLASH && css.charCodeAt(pos + 1) === ASTERISK) {
          next = css.indexOf('*/', pos + 2) + 1
          if (next === 0) {
            if (ignore || ignoreUnclosed) {
              next = css.length
            } else {
              unclosed('comment')
            }
          }

          currentToken = ['comment', css.slice(pos, next + 1), pos, next]
          pos = next
        } else {
          RE_WORD_END.lastIndex = pos + 1
          RE_WORD_END.test(css)
          if (RE_WORD_END.lastIndex === 0) {
            next = css.length - 1
          } else {
            next = RE_WORD_END.lastIndex - 2
          }

          currentToken = ['word', css.slice(pos, next + 1), pos, next]
          buffer.push(currentToken)
          pos = next
        }

        break
      }
    }

    pos++
    return currentToken
  }

  function back(token) {
    returned.push(token)
  }

  return {
    back,
    nextToken,
    endOfFile,
    position
  }
}

let { cyan, gray: gray$1, green, yellow, magenta } = nanocolors

let tokenizer$1 = tokenize

let Input$4

function registerInput(dependant) {
  Input$4 = dependant
}

const HIGHLIGHT_THEME = {
  'brackets': cyan,
  'at-word': cyan,
  'comment': gray$1,
  'string': green,
  'class': yellow,
  'hash': magenta,
  'call': cyan,
  '(': cyan,
  ')': cyan,
  '{': yellow,
  '}': yellow,
  '[': yellow,
  ']': yellow,
  ':': yellow,
  ';': yellow
}

function getTokenType([type, value], processor) {
  if (type === 'word') {
    if (value[0] === '.') {
      return 'class'
    }
    if (value[0] === '#') {
      return 'hash'
    }
  }

  if (!processor.endOfFile()) {
    let next = processor.nextToken()
    processor.back(next)
    if (next[0] === 'brackets' || next[0] === '(') return 'call'
  }

  return type
}

function terminalHighlight$2(css) {
  let processor = tokenizer$1(new Input$4(css), { ignoreErrors: true })
  let result = ''
  while (!processor.endOfFile()) {
    let token = processor.nextToken()
    let color = HIGHLIGHT_THEME[getTokenType(token, processor)]
    if (color) {
      result += token[1]
        .split(/\r?\n/)
        .map(i => color(i))
        .join('\n')
    } else {
      result += token[1]
    }
  }
  return result
}

terminalHighlight$2.registerInput = registerInput

var terminalHighlight_1 = terminalHighlight$2

let { red, bold, gray, isColorSupported } = nanocolors

let terminalHighlight$1 = terminalHighlight_1

class CssSyntaxError$3 extends Error {
  constructor(message, line, column, source, file, plugin) {
    super(message)
    this.name = 'CssSyntaxError'
    this.reason = message

    if (file) {
      this.file = file
    }
    if (source) {
      this.source = source
    }
    if (plugin) {
      this.plugin = plugin
    }
    if (typeof line !== 'undefined' && typeof column !== 'undefined') {
      this.line = line
      this.column = column
    }

    this.setMessage()

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CssSyntaxError$3)
    }
  }

  setMessage() {
    this.message = this.plugin ? this.plugin + ': ' : ''
    this.message += this.file ? this.file : '<css input>'
    if (typeof this.line !== 'undefined') {
      this.message += ':' + this.line + ':' + this.column
    }
    this.message += ': ' + this.reason
  }

  showSourceCode(color) {
    if (!this.source) return ''

    let css = this.source
    if (color == null) color = isColorSupported
    if (terminalHighlight$1) {
      if (color) css = terminalHighlight$1(css)
    }

    let lines = css.split(/\r?\n/)
    let start = Math.max(this.line - 3, 0)
    let end = Math.min(this.line + 2, lines.length)

    let maxWidth = String(end).length

    let mark, aside
    if (color) {
      mark = text => bold(red(text))
      aside = text => gray(text)
    } else {
      mark = aside = str => str
    }

    return lines
      .slice(start, end)
      .map((line, index) => {
        let number = start + 1 + index
        let gutter = ' ' + (' ' + number).slice(-maxWidth) + ' | '
        if (number === this.line) {
          let spacing =
            aside(gutter.replace(/\d/g, ' ')) +
            line.slice(0, this.column - 1).replace(/[^\t]/g, ' ')
          return mark('>') + aside(gutter) + line + '\n ' + spacing + mark('^')
        }
        return ' ' + aside(gutter) + line
      })
      .join('\n')
  }

  toString() {
    let code = this.showSourceCode()
    if (code) {
      code = '\n\n' + code + '\n'
    }
    return this.name + ': ' + this.message + code
  }
}

var cssSyntaxError = CssSyntaxError$3
CssSyntaxError$3.default = CssSyntaxError$3

var symbols = {}

symbols.isClean = Symbol('isClean')

symbols.my = Symbol('my')

const DEFAULT_RAW = {
  colon: ': ',
  indent: '    ',
  beforeDecl: '\n',
  beforeRule: '\n',
  beforeOpen: ' ',
  beforeClose: '\n',
  beforeComment: '\n',
  after: '\n',
  emptyBody: '',
  commentLeft: ' ',
  commentRight: ' ',
  semicolon: false
}

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1)
}

class Stringifier$2 {
  constructor(builder) {
    this.builder = builder
  }

  stringify(node, semicolon) {
    /* istanbul ignore if */
    if (!this[node.type]) {
      throw new Error(
        'Unknown AST node type ' +
          node.type +
          '. ' +
          'Maybe you need to change PostCSS stringifier.'
      )
    }
    this[node.type](node, semicolon)
  }

  document(node) {
    this.body(node)
  }

  root(node) {
    this.body(node)
    if (node.raws.after) this.builder(node.raws.after)
  }

  comment(node) {
    let left = this.raw(node, 'left', 'commentLeft')
    let right = this.raw(node, 'right', 'commentRight')
    this.builder('/*' + left + node.text + right + '*/', node)
  }

  decl(node, semicolon) {
    let between = this.raw(node, 'between', 'colon')
    let string = node.prop + between + this.rawValue(node, 'value')

    if (node.important) {
      string += node.raws.important || ' !important'
    }

    if (semicolon) string += ';'
    this.builder(string, node)
  }

  rule(node) {
    this.block(node, this.rawValue(node, 'selector'))
    if (node.raws.ownSemicolon) {
      this.builder(node.raws.ownSemicolon, node, 'end')
    }
  }

  atrule(node, semicolon) {
    let name = '@' + node.name
    let params = node.params ? this.rawValue(node, 'params') : ''

    if (typeof node.raws.afterName !== 'undefined') {
      name += node.raws.afterName
    } else if (params) {
      name += ' '
    }

    if (node.nodes) {
      this.block(node, name + params)
    } else {
      let end = (node.raws.between || '') + (semicolon ? ';' : '')
      this.builder(name + params + end, node)
    }
  }

  body(node) {
    let last = node.nodes.length - 1
    while (last > 0) {
      if (node.nodes[last].type !== 'comment') break
      last -= 1
    }

    let semicolon = this.raw(node, 'semicolon')
    for (let i = 0; i < node.nodes.length; i++) {
      let child = node.nodes[i]
      let before = this.raw(child, 'before')
      if (before) this.builder(before)
      this.stringify(child, last !== i || semicolon)
    }
  }

  block(node, start) {
    let between = this.raw(node, 'between', 'beforeOpen')
    this.builder(start + between + '{', node, 'start')

    let after
    if (node.nodes && node.nodes.length) {
      this.body(node)
      after = this.raw(node, 'after')
    } else {
      after = this.raw(node, 'after', 'emptyBody')
    }

    if (after) this.builder(after)
    this.builder('}', node, 'end')
  }

  raw(node, own, detect) {
    let value
    if (!detect) detect = own

    // Already had
    if (own) {
      value = node.raws[own]
      if (typeof value !== 'undefined') return value
    }

    let parent = node.parent

    if (detect === 'before') {
      // Hack for first rule in CSS
      if (!parent || (parent.type === 'root' && parent.first === node)) {
        return ''
      }

      // `root` nodes in `document` should use only their own raws
      if (parent && parent.type === 'document') {
        return ''
      }
    }

    // Floating child without parent
    if (!parent) return DEFAULT_RAW[detect]

    // Detect style by other nodes
    let root = node.root()
    if (!root.rawCache) root.rawCache = {}
    if (typeof root.rawCache[detect] !== 'undefined') {
      return root.rawCache[detect]
    }

    if (detect === 'before' || detect === 'after') {
      return this.beforeAfter(node, detect)
    } else {
      let method = 'raw' + capitalize(detect)
      if (this[method]) {
        value = this[method](root, node)
      } else {
        root.walk(i => {
          value = i.raws[own]
          if (typeof value !== 'undefined') return false
        })
      }
    }

    if (typeof value === 'undefined') value = DEFAULT_RAW[detect]

    root.rawCache[detect] = value
    return value
  }

  rawSemicolon(root) {
    let value
    root.walk(i => {
      if (i.nodes && i.nodes.length && i.last.type === 'decl') {
        value = i.raws.semicolon
        if (typeof value !== 'undefined') return false
      }
    })
    return value
  }

  rawEmptyBody(root) {
    let value
    root.walk(i => {
      if (i.nodes && i.nodes.length === 0) {
        value = i.raws.after
        if (typeof value !== 'undefined') return false
      }
    })
    return value
  }

  rawIndent(root) {
    if (root.raws.indent) return root.raws.indent
    let value
    root.walk(i => {
      let p = i.parent
      if (p && p !== root && p.parent && p.parent === root) {
        if (typeof i.raws.before !== 'undefined') {
          let parts = i.raws.before.split('\n')
          value = parts[parts.length - 1]
          value = value.replace(/\S/g, '')
          return false
        }
      }
    })
    return value
  }

  rawBeforeComment(root, node) {
    let value
    root.walkComments(i => {
      if (typeof i.raws.before !== 'undefined') {
        value = i.raws.before
        if (value.includes('\n')) {
          value = value.replace(/[^\n]+$/, '')
        }
        return false
      }
    })
    if (typeof value === 'undefined') {
      value = this.raw(node, null, 'beforeDecl')
    } else if (value) {
      value = value.replace(/\S/g, '')
    }
    return value
  }

  rawBeforeDecl(root, node) {
    let value
    root.walkDecls(i => {
      if (typeof i.raws.before !== 'undefined') {
        value = i.raws.before
        if (value.includes('\n')) {
          value = value.replace(/[^\n]+$/, '')
        }
        return false
      }
    })
    if (typeof value === 'undefined') {
      value = this.raw(node, null, 'beforeRule')
    } else if (value) {
      value = value.replace(/\S/g, '')
    }
    return value
  }

  rawBeforeRule(root) {
    let value
    root.walk(i => {
      if (i.nodes && (i.parent !== root || root.first !== i)) {
        if (typeof i.raws.before !== 'undefined') {
          value = i.raws.before
          if (value.includes('\n')) {
            value = value.replace(/[^\n]+$/, '')
          }
          return false
        }
      }
    })
    if (value) value = value.replace(/\S/g, '')
    return value
  }

  rawBeforeClose(root) {
    let value
    root.walk(i => {
      if (i.nodes && i.nodes.length > 0) {
        if (typeof i.raws.after !== 'undefined') {
          value = i.raws.after
          if (value.includes('\n')) {
            value = value.replace(/[^\n]+$/, '')
          }
          return false
        }
      }
    })
    if (value) value = value.replace(/\S/g, '')
    return value
  }

  rawBeforeOpen(root) {
    let value
    root.walk(i => {
      if (i.type !== 'decl') {
        value = i.raws.between
        if (typeof value !== 'undefined') return false
      }
    })
    return value
  }

  rawColon(root) {
    let value
    root.walkDecls(i => {
      if (typeof i.raws.between !== 'undefined') {
        value = i.raws.between.replace(/[^\s:]/g, '')
        return false
      }
    })
    return value
  }

  beforeAfter(node, detect) {
    let value
    if (node.type === 'decl') {
      value = this.raw(node, null, 'beforeDecl')
    } else if (node.type === 'comment') {
      value = this.raw(node, null, 'beforeComment')
    } else if (detect === 'before') {
      value = this.raw(node, null, 'beforeRule')
    } else {
      value = this.raw(node, null, 'beforeClose')
    }

    let buf = node.parent
    let depth = 0
    while (buf && buf.type !== 'root') {
      depth += 1
      buf = buf.parent
    }

    if (value.includes('\n')) {
      let indent = this.raw(node, null, 'indent')
      if (indent.length) {
        for (let step = 0; step < depth; step++) value += indent
      }
    }

    return value
  }

  rawValue(node, prop) {
    let value = node[prop]
    let raw = node.raws[prop]
    if (raw && raw.value === value) {
      return raw.raw
    }

    return value
  }
}

var stringifier = Stringifier$2

let Stringifier$1 = stringifier

function stringify$4(node, builder) {
  let str = new Stringifier$1(builder)
  str.stringify(node)
}

var stringify_1 = stringify$4
stringify$4.default = stringify$4

let { isClean: isClean$2, my: my$2 } = symbols
let CssSyntaxError$2 = cssSyntaxError
let Stringifier = stringifier
let stringify$3 = stringify_1

function cloneNode(obj, parent) {
  let cloned = new obj.constructor()

  for (let i in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, i)) {
      // istanbul ignore next
      continue
    }
    if (i === 'proxyCache') continue
    let value = obj[i]
    let type = typeof value

    if (i === 'parent' && type === 'object') {
      if (parent) cloned[i] = parent
    } else if (i === 'source') {
      cloned[i] = value
    } else if (Array.isArray(value)) {
      cloned[i] = value.map(j => cloneNode(j, cloned))
    } else {
      if (type === 'object' && value !== null) value = cloneNode(value)
      cloned[i] = value
    }
  }

  return cloned
}

class Node$4 {
  constructor(defaults = {}) {
    this.raws = {}
    this[isClean$2] = false
    this[my$2] = true

    for (let name in defaults) {
      if (name === 'nodes') {
        this.nodes = []
        for (let node of defaults[name]) {
          if (typeof node.clone === 'function') {
            this.append(node.clone())
          } else {
            this.append(node)
          }
        }
      } else {
        this[name] = defaults[name]
      }
    }
  }

  error(message, opts = {}) {
    if (this.source) {
      let pos = this.positionBy(opts)
      return this.source.input.error(message, pos.line, pos.column, opts)
    }
    return new CssSyntaxError$2(message)
  }

  warn(result, text, opts) {
    let data = { node: this }
    for (let i in opts) data[i] = opts[i]
    return result.warn(text, data)
  }

  remove() {
    if (this.parent) {
      this.parent.removeChild(this)
    }
    this.parent = undefined
    return this
  }

  toString(stringifier = stringify$3) {
    if (stringifier.stringify) stringifier = stringifier.stringify
    let result = ''
    stringifier(this, i => {
      result += i
    })
    return result
  }

  assign(overrides = {}) {
    for (let name in overrides) {
      this[name] = overrides[name]
    }
    return this
  }

  clone(overrides = {}) {
    let cloned = cloneNode(this)
    for (let name in overrides) {
      cloned[name] = overrides[name]
    }
    return cloned
  }

  cloneBefore(overrides = {}) {
    let cloned = this.clone(overrides)
    this.parent.insertBefore(this, cloned)
    return cloned
  }

  cloneAfter(overrides = {}) {
    let cloned = this.clone(overrides)
    this.parent.insertAfter(this, cloned)
    return cloned
  }

  replaceWith(...nodes) {
    if (this.parent) {
      let bookmark = this
      let foundSelf = false
      for (let node of nodes) {
        if (node === this) {
          foundSelf = true
        } else if (foundSelf) {
          this.parent.insertAfter(bookmark, node)
          bookmark = node
        } else {
          this.parent.insertBefore(bookmark, node)
        }
      }

      if (!foundSelf) {
        this.remove()
      }
    }

    return this
  }

  next() {
    if (!this.parent) return undefined
    let index = this.parent.index(this)
    return this.parent.nodes[index + 1]
  }

  prev() {
    if (!this.parent) return undefined
    let index = this.parent.index(this)
    return this.parent.nodes[index - 1]
  }

  before(add) {
    this.parent.insertBefore(this, add)
    return this
  }

  after(add) {
    this.parent.insertAfter(this, add)
    return this
  }

  root() {
    let result = this
    while (result.parent && result.parent.type !== 'document') {
      result = result.parent
    }
    return result
  }

  raw(prop, defaultType) {
    let str = new Stringifier()
    return str.raw(this, prop, defaultType)
  }

  cleanRaws(keepBetween) {
    delete this.raws.before
    delete this.raws.after
    if (!keepBetween) delete this.raws.between
  }

  toJSON(_, inputs) {
    let fixed = {}
    let emitInputs = inputs == null
    inputs = inputs || new Map()
    let inputsNextIndex = 0

    for (let name in this) {
      if (!Object.prototype.hasOwnProperty.call(this, name)) {
        // istanbul ignore next
        continue
      }
      if (name === 'parent' || name === 'proxyCache') continue
      let value = this[name]

      if (Array.isArray(value)) {
        fixed[name] = value.map(i => {
          if (typeof i === 'object' && i.toJSON) {
            return i.toJSON(null, inputs)
          } else {
            return i
          }
        })
      } else if (typeof value === 'object' && value.toJSON) {
        fixed[name] = value.toJSON(null, inputs)
      } else if (name === 'source') {
        let inputId = inputs.get(value.input)
        if (inputId == null) {
          inputId = inputsNextIndex
          inputs.set(value.input, inputsNextIndex)
          inputsNextIndex++
        }
        fixed[name] = {
          inputId,
          start: value.start,
          end: value.end
        }
      } else {
        fixed[name] = value
      }
    }

    if (emitInputs) {
      fixed.inputs = [...inputs.keys()].map(input => input.toJSON())
    }

    return fixed
  }

  positionInside(index) {
    let string = this.toString()
    let column = this.source.start.column
    let line = this.source.start.line

    for (let i = 0; i < index; i++) {
      if (string[i] === '\n') {
        column = 1
        line += 1
      } else {
        column += 1
      }
    }

    return { line, column }
  }

  positionBy(opts) {
    let pos = this.source.start
    if (opts.index) {
      pos = this.positionInside(opts.index)
    } else if (opts.word) {
      let index = this.toString().indexOf(opts.word)
      if (index !== -1) pos = this.positionInside(index)
    }
    return pos
  }

  getProxyProcessor() {
    return {
      set(node, prop, value) {
        if (node[prop] === value) return true
        node[prop] = value
        if (
          prop === 'prop' ||
          prop === 'value' ||
          prop === 'name' ||
          prop === 'params' ||
          prop === 'important' ||
          prop === 'text'
        ) {
          node.markDirty()
        }
        return true
      },

      get(node, prop) {
        if (prop === 'proxyOf') {
          return node
        } else if (prop === 'root') {
          return () => node.root().toProxy()
        } else {
          return node[prop]
        }
      }
    }
  }

  toProxy() {
    if (!this.proxyCache) {
      this.proxyCache = new Proxy(this, this.getProxyProcessor())
    }
    return this.proxyCache
  }

  addToError(error) {
    error.postcssNode = this
    if (error.stack && this.source && /\n\s{4}at /.test(error.stack)) {
      let s = this.source
      error.stack = error.stack.replace(
        /\n\s{4}at /,
        `$&${s.input.from}:${s.start.line}:${s.start.column}$&`
      )
    }
    return error
  }

  markDirty() {
    if (this[isClean$2]) {
      this[isClean$2] = false
      let next = this
      while ((next = next.parent)) {
        next[isClean$2] = false
      }
    }
  }

  get proxyOf() {
    return this
  }
}

var node_1 = Node$4
Node$4.default = Node$4

let Node$3 = node_1

class Declaration$4 extends Node$3 {
  constructor(defaults) {
    if (
      defaults &&
      typeof defaults.value !== 'undefined' &&
      typeof defaults.value !== 'string'
    ) {
      defaults = { ...defaults, value: String(defaults.value) }
    }
    super(defaults)
    this.type = 'decl'
  }

  get variable() {
    return this.prop.startsWith('--') || this.prop[0] === '$'
  }
}

var declaration = Declaration$4
Declaration$4.default = Declaration$4

var sourceMap = {}

var sourceMapGenerator = {}

var base64Vlq = {}

var base64$1 = {}

/* -*- Mode: js; js-indent-level: 2; -*- */

/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var intToCharMap =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('')

/**
 * Encode an integer in the range of 0 to 63 to a single base 64 digit.
 */
base64$1.encode = function (number) {
  if (0 <= number && number < intToCharMap.length) {
    return intToCharMap[number]
  }
  throw new TypeError('Must be between 0 and 63: ' + number)
}

/**
 * Decode a single base 64 character code digit to an integer. Returns -1 on
 * failure.
 */
base64$1.decode = function (charCode) {
  var bigA = 65 // 'A'
  var bigZ = 90 // 'Z'

  var littleA = 97 // 'a'
  var littleZ = 122 // 'z'

  var zero = 48 // '0'
  var nine = 57 // '9'

  var plus = 43 // '+'
  var slash = 47 // '/'

  var littleOffset = 26
  var numberOffset = 52

  // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
  if (bigA <= charCode && charCode <= bigZ) {
    return charCode - bigA
  }

  // 26 - 51: abcdefghijklmnopqrstuvwxyz
  if (littleA <= charCode && charCode <= littleZ) {
    return charCode - littleA + littleOffset
  }

  // 52 - 61: 0123456789
  if (zero <= charCode && charCode <= nine) {
    return charCode - zero + numberOffset
  }

  // 62: +
  if (charCode == plus) {
    return 62
  }

  // 63: /
  if (charCode == slash) {
    return 63
  }

  // Invalid base64 digit.
  return -1
}

/* -*- Mode: js; js-indent-level: 2; -*- */

/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 *
 * Based on the Base 64 VLQ implementation in Closure Compiler:
 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
 *
 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above
 *    copyright notice, this list of conditions and the following
 *    disclaimer in the documentation and/or other materials provided
 *    with the distribution.
 *  * Neither the name of Google Inc. nor the names of its
 *    contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var base64 = base64$1

// A single base 64 digit can contain 6 bits of data. For the base 64 variable
// length quantities we use in the source map spec, the first bit is the sign,
// the next four bits are the actual value, and the 6th bit is the
// continuation bit. The continuation bit tells us whether there are more
// digits in this value following this digit.
//
//   Continuation
//   |    Sign
//   |    |
//   V    V
//   101011

var VLQ_BASE_SHIFT = 5

// binary: 100000
var VLQ_BASE = 1 << VLQ_BASE_SHIFT

// binary: 011111
var VLQ_BASE_MASK = VLQ_BASE - 1

// binary: 100000
var VLQ_CONTINUATION_BIT = VLQ_BASE

/**
 * Converts from a two-complement value to a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
 *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
 */
function toVLQSigned(aValue) {
  return aValue < 0 ? (-aValue << 1) + 1 : (aValue << 1) + 0
}

/**
 * Converts to a two-complement value from a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
 *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
 */
function fromVLQSigned(aValue) {
  var isNegative = (aValue & 1) === 1
  var shifted = aValue >> 1
  return isNegative ? -shifted : shifted
}

/**
 * Returns the base 64 VLQ encoded value.
 */
base64Vlq.encode = function base64VLQ_encode(aValue) {
  var encoded = ''
  var digit

  var vlq = toVLQSigned(aValue)

  do {
    digit = vlq & VLQ_BASE_MASK
    vlq >>>= VLQ_BASE_SHIFT
    if (vlq > 0) {
      // There are still more digits in this value, so we must make sure the
      // continuation bit is marked.
      digit |= VLQ_CONTINUATION_BIT
    }
    encoded += base64.encode(digit)
  } while (vlq > 0)

  return encoded
}

/**
 * Decodes the next base 64 VLQ value from the given string and returns the
 * value and the rest of the string via the out parameter.
 */
base64Vlq.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
  var strLen = aStr.length
  var result = 0
  var shift = 0
  var continuation, digit

  do {
    if (aIndex >= strLen) {
      throw new Error('Expected more digits in base 64 VLQ value.')
    }

    digit = base64.decode(aStr.charCodeAt(aIndex++))
    if (digit === -1) {
      throw new Error('Invalid base64 digit: ' + aStr.charAt(aIndex - 1))
    }

    continuation = !!(digit & VLQ_CONTINUATION_BIT)
    digit &= VLQ_BASE_MASK
    result = result + (digit << shift)
    shift += VLQ_BASE_SHIFT
  } while (continuation)

  aOutParam.value = fromVLQSigned(result)
  aOutParam.rest = aIndex
}

var util$5 = {}

/* -*- Mode: js; js-indent-level: 2; -*- */

;(function (exports) {
  /*
   * Copyright 2011 Mozilla Foundation and contributors
   * Licensed under the New BSD license. See LICENSE or:
   * http://opensource.org/licenses/BSD-3-Clause
   */

  /**
   * This is a helper function for getting values from parameter/options
   * objects.
   *
   * @param args The object we are extracting values from
   * @param name The name of the property we are getting.
   * @param defaultValue An optional value to return if the property is missing
   * from the object. If this is not specified and the property is missing, an
   * error will be thrown.
   */
  function getArg(aArgs, aName, aDefaultValue) {
    if (aName in aArgs) {
      return aArgs[aName]
    } else if (arguments.length === 3) {
      return aDefaultValue
    } else {
      throw new Error('"' + aName + '" is a required argument.')
    }
  }
  exports.getArg = getArg

  var urlRegexp =
    /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/
  var dataUrlRegexp = /^data:.+\,.+$/

  function urlParse(aUrl) {
    var match = aUrl.match(urlRegexp)
    if (!match) {
      return null
    }
    return {
      scheme: match[1],
      auth: match[2],
      host: match[3],
      port: match[4],
      path: match[5]
    }
  }
  exports.urlParse = urlParse

  function urlGenerate(aParsedUrl) {
    var url = ''
    if (aParsedUrl.scheme) {
      url += aParsedUrl.scheme + ':'
    }
    url += '//'
    if (aParsedUrl.auth) {
      url += aParsedUrl.auth + '@'
    }
    if (aParsedUrl.host) {
      url += aParsedUrl.host
    }
    if (aParsedUrl.port) {
      url += ':' + aParsedUrl.port
    }
    if (aParsedUrl.path) {
      url += aParsedUrl.path
    }
    return url
  }
  exports.urlGenerate = urlGenerate

  var MAX_CACHED_INPUTS = 32

  /**
   * Takes some function `f(input) -> result` and returns a memoized version of
   * `f`.
   *
   * We keep at most `MAX_CACHED_INPUTS` memoized results of `f` alive. The
   * memoization is a dumb-simple, linear least-recently-used cache.
   */
  function lruMemoize(f) {
    var cache = []

    return function (input) {
      for (var i = 0; i < cache.length; i++) {
        if (cache[i].input === input) {
          var temp = cache[0]
          cache[0] = cache[i]
          cache[i] = temp
          return cache[0].result
        }
      }

      var result = f(input)

      cache.unshift({
        input,
        result
      })

      if (cache.length > MAX_CACHED_INPUTS) {
        cache.pop()
      }

      return result
    }
  }

  /**
   * Normalizes a path, or the path portion of a URL:
   *
   * - Replaces consecutive slashes with one slash.
   * - Removes unnecessary '.' parts.
   * - Removes unnecessary '<dir>/..' parts.
   *
   * Based on code in the Node.js 'path' core module.
   *
   * @param aPath The path or url to normalize.
   */
  var normalize = lruMemoize(function normalize(aPath) {
    var path = aPath
    var url = urlParse(aPath)
    if (url) {
      if (!url.path) {
        return aPath
      }
      path = url.path
    }
    var isAbsolute = exports.isAbsolute(path)
    // Split the path into parts between `/` characters. This is much faster than
    // using `.split(/\/+/g)`.
    var parts = []
    var start = 0
    var i = 0
    while (true) {
      start = i
      i = path.indexOf('/', start)
      if (i === -1) {
        parts.push(path.slice(start))
        break
      } else {
        parts.push(path.slice(start, i))
        while (i < path.length && path[i] === '/') {
          i++
        }
      }
    }

    for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
      part = parts[i]
      if (part === '.') {
        parts.splice(i, 1)
      } else if (part === '..') {
        up++
      } else if (up > 0) {
        if (part === '') {
          // The first part is blank if the path is absolute. Trying to go
          // above the root is a no-op. Therefore we can remove all '..' parts
          // directly after the root.
          parts.splice(i + 1, up)
          up = 0
        } else {
          parts.splice(i, 2)
          up--
        }
      }
    }
    path = parts.join('/')

    if (path === '') {
      path = isAbsolute ? '/' : '.'
    }

    if (url) {
      url.path = path
      return urlGenerate(url)
    }
    return path
  })
  exports.normalize = normalize

  /**
   * Joins two paths/URLs.
   *
   * @param aRoot The root path or URL.
   * @param aPath The path or URL to be joined with the root.
   *
   * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
   *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
   *   first.
   * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
   *   is updated with the result and aRoot is returned. Otherwise the result
   *   is returned.
   *   - If aPath is absolute, the result is aPath.
   *   - Otherwise the two paths are joined with a slash.
   * - Joining for example 'http://' and 'www.example.com' is also supported.
   */
  function join(aRoot, aPath) {
    if (aRoot === '') {
      aRoot = '.'
    }
    if (aPath === '') {
      aPath = '.'
    }
    var aPathUrl = urlParse(aPath)
    var aRootUrl = urlParse(aRoot)
    if (aRootUrl) {
      aRoot = aRootUrl.path || '/'
    }

    // `join(foo, '//www.example.org')`
    if (aPathUrl && !aPathUrl.scheme) {
      if (aRootUrl) {
        aPathUrl.scheme = aRootUrl.scheme
      }
      return urlGenerate(aPathUrl)
    }

    if (aPathUrl || aPath.match(dataUrlRegexp)) {
      return aPath
    }

    // `join('http://', 'www.example.com')`
    if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
      aRootUrl.host = aPath
      return urlGenerate(aRootUrl)
    }

    var joined =
      aPath.charAt(0) === '/'
        ? aPath
        : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath)

    if (aRootUrl) {
      aRootUrl.path = joined
      return urlGenerate(aRootUrl)
    }
    return joined
  }
  exports.join = join

  exports.isAbsolute = function (aPath) {
    return aPath.charAt(0) === '/' || urlRegexp.test(aPath)
  }

  /**
   * Make a path relative to a URL or another path.
   *
   * @param aRoot The root path or URL.
   * @param aPath The path or URL to be made relative to aRoot.
   */
  function relative(aRoot, aPath) {
    if (aRoot === '') {
      aRoot = '.'
    }

    aRoot = aRoot.replace(/\/$/, '')

    // It is possible for the path to be above the root. In this case, simply
    // checking whether the root is a prefix of the path won't work. Instead, we
    // need to remove components from the root one by one, until either we find
    // a prefix that fits, or we run out of components to remove.
    var level = 0
    while (aPath.indexOf(aRoot + '/') !== 0) {
      var index = aRoot.lastIndexOf('/')
      if (index < 0) {
        return aPath
      }

      // If the only part of the root that is left is the scheme (i.e. http://,
      // file:///, etc.), one or more slashes (/), or simply nothing at all, we
      // have exhausted all components, so the path is not relative to the root.
      aRoot = aRoot.slice(0, index)
      if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
        return aPath
      }

      ++level
    }

    // Make sure we add a "../" for each component we removed from the root.
    return Array(level + 1).join('../') + aPath.substr(aRoot.length + 1)
  }
  exports.relative = relative

  var supportsNullProto = (function () {
    var obj = Object.create(null)
    return !('__proto__' in obj)
  })()

  function identity(s) {
    return s
  }

  /**
   * Because behavior goes wacky when you set `__proto__` on objects, we
   * have to prefix all the strings in our set with an arbitrary character.
   *
   * See https://github.com/mozilla/source-map/pull/31 and
   * https://github.com/mozilla/source-map/issues/30
   *
   * @param String aStr
   */
  function toSetString(aStr) {
    if (isProtoString(aStr)) {
      return '$' + aStr
    }

    return aStr
  }
  exports.toSetString = supportsNullProto ? identity : toSetString

  function fromSetString(aStr) {
    if (isProtoString(aStr)) {
      return aStr.slice(1)
    }

    return aStr
  }
  exports.fromSetString = supportsNullProto ? identity : fromSetString

  function isProtoString(s) {
    if (!s) {
      return false
    }

    var length = s.length

    if (length < 9 /* "__proto__".length */) {
      return false
    }

    if (
      s.charCodeAt(length - 1) !== 95 /* '_' */ ||
      s.charCodeAt(length - 2) !== 95 /* '_' */ ||
      s.charCodeAt(length - 3) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 4) !== 116 /* 't' */ ||
      s.charCodeAt(length - 5) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 6) !== 114 /* 'r' */ ||
      s.charCodeAt(length - 7) !== 112 /* 'p' */ ||
      s.charCodeAt(length - 8) !== 95 /* '_' */ ||
      s.charCodeAt(length - 9) !== 95 /* '_' */
    ) {
      return false
    }

    for (var i = length - 10; i >= 0; i--) {
      if (s.charCodeAt(i) !== 36 /* '$' */) {
        return false
      }
    }

    return true
  }

  /**
   * Comparator between two mappings where the original positions are compared.
   *
   * Optionally pass in `true` as `onlyCompareGenerated` to consider two
   * mappings with the same original source/line/column, but different generated
   * line and column the same. Useful when searching for a mapping with a
   * stubbed out mapping.
   */
  function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
    var cmp = strcmp(mappingA.source, mappingB.source)
    if (cmp !== 0) {
      return cmp
    }

    cmp = mappingA.originalLine - mappingB.originalLine
    if (cmp !== 0) {
      return cmp
    }

    cmp = mappingA.originalColumn - mappingB.originalColumn
    if (cmp !== 0 || onlyCompareOriginal) {
      return cmp
    }

    cmp = mappingA.generatedColumn - mappingB.generatedColumn
    if (cmp !== 0) {
      return cmp
    }

    cmp = mappingA.generatedLine - mappingB.generatedLine
    if (cmp !== 0) {
      return cmp
    }

    return strcmp(mappingA.name, mappingB.name)
  }
  exports.compareByOriginalPositions = compareByOriginalPositions

  function compareByOriginalPositionsNoSource(
    mappingA,
    mappingB,
    onlyCompareOriginal
  ) {
    var cmp

    cmp = mappingA.originalLine - mappingB.originalLine
    if (cmp !== 0) {
      return cmp
    }

    cmp = mappingA.originalColumn - mappingB.originalColumn
    if (cmp !== 0 || onlyCompareOriginal) {
      return cmp
    }

    cmp = mappingA.generatedColumn - mappingB.generatedColumn
    if (cmp !== 0) {
      return cmp
    }

    cmp = mappingA.generatedLine - mappingB.generatedLine
    if (cmp !== 0) {
      return cmp
    }

    return strcmp(mappingA.name, mappingB.name)
  }
  exports.compareByOriginalPositionsNoSource =
    compareByOriginalPositionsNoSource

  /**
   * Comparator between two mappings with deflated source and name indices where
   * the generated positions are compared.
   *
   * Optionally pass in `true` as `onlyCompareGenerated` to consider two
   * mappings with the same generated line and column, but different
   * source/name/original line and column the same. Useful when searching for a
   * mapping with a stubbed out mapping.
   */
  function compareByGeneratedPositionsDeflated(
    mappingA,
    mappingB,
    onlyCompareGenerated
  ) {
    var cmp = mappingA.generatedLine - mappingB.generatedLine
    if (cmp !== 0) {
      return cmp
    }

    cmp = mappingA.generatedColumn - mappingB.generatedColumn
    if (cmp !== 0 || onlyCompareGenerated) {
      return cmp
    }

    cmp = strcmp(mappingA.source, mappingB.source)
    if (cmp !== 0) {
      return cmp
    }

    cmp = mappingA.originalLine - mappingB.originalLine
    if (cmp !== 0) {
      return cmp
    }

    cmp = mappingA.originalColumn - mappingB.originalColumn
    if (cmp !== 0) {
      return cmp
    }

    return strcmp(mappingA.name, mappingB.name)
  }
  exports.compareByGeneratedPositionsDeflated =
    compareByGeneratedPositionsDeflated

  function compareByGeneratedPositionsDeflatedNoLine(
    mappingA,
    mappingB,
    onlyCompareGenerated
  ) {
    var cmp = mappingA.generatedColumn - mappingB.generatedColumn
    if (cmp !== 0 || onlyCompareGenerated) {
      return cmp
    }

    cmp = strcmp(mappingA.source, mappingB.source)
    if (cmp !== 0) {
      return cmp
    }

    cmp = mappingA.originalLine - mappingB.originalLine
    if (cmp !== 0) {
      return cmp
    }

    cmp = mappingA.originalColumn - mappingB.originalColumn
    if (cmp !== 0) {
      return cmp
    }

    return strcmp(mappingA.name, mappingB.name)
  }
  exports.compareByGeneratedPositionsDeflatedNoLine =
    compareByGeneratedPositionsDeflatedNoLine

  function strcmp(aStr1, aStr2) {
    if (aStr1 === aStr2) {
      return 0
    }

    if (aStr1 === null) {
      return 1 // aStr2 !== null
    }

    if (aStr2 === null) {
      return -1 // aStr1 !== null
    }

    if (aStr1 > aStr2) {
      return 1
    }

    return -1
  }

  /**
   * Comparator between two mappings with inflated source and name strings where
   * the generated positions are compared.
   */
  function compareByGeneratedPositionsInflated(mappingA, mappingB) {
    var cmp = mappingA.generatedLine - mappingB.generatedLine
    if (cmp !== 0) {
      return cmp
    }

    cmp = mappingA.generatedColumn - mappingB.generatedColumn
    if (cmp !== 0) {
      return cmp
    }

    cmp = strcmp(mappingA.source, mappingB.source)
    if (cmp !== 0) {
      return cmp
    }

    cmp = mappingA.originalLine - mappingB.originalLine
    if (cmp !== 0) {
      return cmp
    }

    cmp = mappingA.originalColumn - mappingB.originalColumn
    if (cmp !== 0) {
      return cmp
    }

    return strcmp(mappingA.name, mappingB.name)
  }
  exports.compareByGeneratedPositionsInflated =
    compareByGeneratedPositionsInflated

  /**
   * Strip any JSON XSSI avoidance prefix from the string (as documented
   * in the source maps specification), and then parse the string as
   * JSON.
   */
  function parseSourceMapInput(str) {
    return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ''))
  }
  exports.parseSourceMapInput = parseSourceMapInput

  /**
   * Compute the URL of a source given the the source root, the source's
   * URL, and the source map's URL.
   */
  function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
    sourceURL = sourceURL || ''

    if (sourceRoot) {
      // This follows what Chrome does.
      if (sourceRoot[sourceRoot.length - 1] !== '/' && sourceURL[0] !== '/') {
        sourceRoot += '/'
      }
      // The spec says:
      //   Line 4: An optional source root, useful for relocating source
      //   files on a server or removing repeated values in the
      //   “sources” entry.  This value is prepended to the individual
      //   entries in the “source” field.
      sourceURL = sourceRoot + sourceURL
    }

    // Historically, SourceMapConsumer did not take the sourceMapURL as
    // a parameter.  This mode is still somewhat supported, which is why
    // this code block is conditional.  However, it's preferable to pass
    // the source map URL to SourceMapConsumer, so that this function
    // can implement the source URL resolution algorithm as outlined in
    // the spec.  This block is basically the equivalent of:
    //    new URL(sourceURL, sourceMapURL).toString()
    // ... except it avoids using URL, which wasn't available in the
    // older releases of node still supported by this library.
    //
    // The spec says:
    //   If the sources are not absolute URLs after prepending of the
    //   “sourceRoot”, the sources are resolved relative to the
    //   SourceMap (like resolving script src in a html document).
    if (sourceMapURL) {
      var parsed = urlParse(sourceMapURL)
      if (!parsed) {
        throw new Error('sourceMapURL could not be parsed')
      }
      if (parsed.path) {
        // Strip the last path component, but keep the "/".
        var index = parsed.path.lastIndexOf('/')
        if (index >= 0) {
          parsed.path = parsed.path.substring(0, index + 1)
        }
      }
      sourceURL = join(urlGenerate(parsed), sourceURL)
    }

    return normalize(sourceURL)
  }
  exports.computeSourceURL = computeSourceURL
})(util$5)

var arraySet = {}

/* -*- Mode: js; js-indent-level: 2; -*- */

/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util$4 = util$5
var has = Object.prototype.hasOwnProperty
var hasNativeMap = typeof Map !== 'undefined'

/**
 * A data structure which is a combination of an array and a set. Adding a new
 * member is O(1), testing for membership is O(1), and finding the index of an
 * element is O(1). Removing elements from the set is not supported. Only
 * strings are supported for membership.
 */
function ArraySet$2() {
  this._array = []
  this._set = hasNativeMap ? new Map() : Object.create(null)
}

/**
 * Static method for creating ArraySet instances from an existing array.
 */
ArraySet$2.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
  var set = new ArraySet$2()
  for (var i = 0, len = aArray.length; i < len; i++) {
    set.add(aArray[i], aAllowDuplicates)
  }
  return set
}

/**
 * Return how many unique items are in this ArraySet. If duplicates have been
 * added, than those do not count towards the size.
 *
 * @returns Number
 */
ArraySet$2.prototype.size = function ArraySet_size() {
  return hasNativeMap
    ? this._set.size
    : Object.getOwnPropertyNames(this._set).length
}

/**
 * Add the given string to this set.
 *
 * @param String aStr
 */
ArraySet$2.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
  var sStr = hasNativeMap ? aStr : util$4.toSetString(aStr)
  var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr)
  var idx = this._array.length
  if (!isDuplicate || aAllowDuplicates) {
    this._array.push(aStr)
  }
  if (!isDuplicate) {
    if (hasNativeMap) {
      this._set.set(aStr, idx)
    } else {
      this._set[sStr] = idx
    }
  }
}

/**
 * Is the given string a member of this set?
 *
 * @param String aStr
 */
ArraySet$2.prototype.has = function ArraySet_has(aStr) {
  if (hasNativeMap) {
    return this._set.has(aStr)
  } else {
    var sStr = util$4.toSetString(aStr)
    return has.call(this._set, sStr)
  }
}

/**
 * What is the index of the given string in the array?
 *
 * @param String aStr
 */
ArraySet$2.prototype.indexOf = function ArraySet_indexOf(aStr) {
  if (hasNativeMap) {
    var idx = this._set.get(aStr)
    if (idx >= 0) {
      return idx
    }
  } else {
    var sStr = util$4.toSetString(aStr)
    if (has.call(this._set, sStr)) {
      return this._set[sStr]
    }
  }

  throw new Error('"' + aStr + '" is not in the set.')
}

/**
 * What is the element at the given index?
 *
 * @param Number aIdx
 */
ArraySet$2.prototype.at = function ArraySet_at(aIdx) {
  if (aIdx >= 0 && aIdx < this._array.length) {
    return this._array[aIdx]
  }
  throw new Error('No element indexed by ' + aIdx)
}

/**
 * Returns the array representation of this set (which has the proper indices
 * indicated by indexOf). Note that this is a copy of the internal array used
 * for storing the members so that no one can mess with internal state.
 */
ArraySet$2.prototype.toArray = function ArraySet_toArray() {
  return this._array.slice()
}

arraySet.ArraySet = ArraySet$2

var mappingList = {}

/* -*- Mode: js; js-indent-level: 2; -*- */

/*
 * Copyright 2014 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util$3 = util$5

/**
 * Determine whether mappingB is after mappingA with respect to generated
 * position.
 */
function generatedPositionAfter(mappingA, mappingB) {
  // Optimized for most common case
  var lineA = mappingA.generatedLine
  var lineB = mappingB.generatedLine
  var columnA = mappingA.generatedColumn
  var columnB = mappingB.generatedColumn
  return (
    lineB > lineA ||
    (lineB == lineA && columnB >= columnA) ||
    util$3.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0
  )
}

/**
 * A data structure to provide a sorted view of accumulated mappings in a
 * performance conscious manner. It trades a neglibable overhead in general
 * case for a large speedup in case of mappings being added in order.
 */
function MappingList$1() {
  this._array = []
  this._sorted = true
  // Serves as infimum
  this._last = { generatedLine: -1, generatedColumn: 0 }
}

/**
 * Iterate through internal items. This method takes the same arguments that
 * `Array.prototype.forEach` takes.
 *
 * NOTE: The order of the mappings is NOT guaranteed.
 */
MappingList$1.prototype.unsortedForEach = function MappingList_forEach(
  aCallback,
  aThisArg
) {
  this._array.forEach(aCallback, aThisArg)
}

/**
 * Add the given source mapping.
 *
 * @param Object aMapping
 */
MappingList$1.prototype.add = function MappingList_add(aMapping) {
  if (generatedPositionAfter(this._last, aMapping)) {
    this._last = aMapping
    this._array.push(aMapping)
  } else {
    this._sorted = false
    this._array.push(aMapping)
  }
}

/**
 * Returns the flat, sorted array of mappings. The mappings are sorted by
 * generated position.
 *
 * WARNING: This method returns internal data without copying, for
 * performance. The return value must NOT be mutated, and should be treated as
 * an immutable borrow. If you want to take ownership, you must make your own
 * copy.
 */
MappingList$1.prototype.toArray = function MappingList_toArray() {
  if (!this._sorted) {
    this._array.sort(util$3.compareByGeneratedPositionsInflated)
    this._sorted = true
  }
  return this._array
}

mappingList.MappingList = MappingList$1

/* -*- Mode: js; js-indent-level: 2; -*- */

/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var base64VLQ$1 = base64Vlq
var util$2 = util$5
var ArraySet$1 = arraySet.ArraySet
var MappingList = mappingList.MappingList

/**
 * An instance of the SourceMapGenerator represents a source map which is
 * being built incrementally. You may pass an object with the following
 * properties:
 *
 *   - file: The filename of the generated source.
 *   - sourceRoot: A root for all relative URLs in this source map.
 */
function SourceMapGenerator$4(aArgs) {
  if (!aArgs) {
    aArgs = {}
  }
  this._file = util$2.getArg(aArgs, 'file', null)
  this._sourceRoot = util$2.getArg(aArgs, 'sourceRoot', null)
  this._skipValidation = util$2.getArg(aArgs, 'skipValidation', false)
  this._sources = new ArraySet$1()
  this._names = new ArraySet$1()
  this._mappings = new MappingList()
  this._sourcesContents = null
}

SourceMapGenerator$4.prototype._version = 3

/**
 * Creates a new SourceMapGenerator based on a SourceMapConsumer
 *
 * @param aSourceMapConsumer The SourceMap.
 */
SourceMapGenerator$4.fromSourceMap = function SourceMapGenerator_fromSourceMap(
  aSourceMapConsumer
) {
  var sourceRoot = aSourceMapConsumer.sourceRoot
  var generator = new SourceMapGenerator$4({
    file: aSourceMapConsumer.file,
    sourceRoot: sourceRoot
  })
  aSourceMapConsumer.eachMapping(function (mapping) {
    var newMapping = {
      generated: {
        line: mapping.generatedLine,
        column: mapping.generatedColumn
      }
    }

    if (mapping.source != null) {
      newMapping.source = mapping.source
      if (sourceRoot != null) {
        newMapping.source = util$2.relative(sourceRoot, newMapping.source)
      }

      newMapping.original = {
        line: mapping.originalLine,
        column: mapping.originalColumn
      }

      if (mapping.name != null) {
        newMapping.name = mapping.name
      }
    }

    generator.addMapping(newMapping)
  })
  aSourceMapConsumer.sources.forEach(function (sourceFile) {
    var sourceRelative = sourceFile
    if (sourceRoot !== null) {
      sourceRelative = util$2.relative(sourceRoot, sourceFile)
    }

    if (!generator._sources.has(sourceRelative)) {
      generator._sources.add(sourceRelative)
    }

    var content = aSourceMapConsumer.sourceContentFor(sourceFile)
    if (content != null) {
      generator.setSourceContent(sourceFile, content)
    }
  })
  return generator
}

/**
 * Add a single mapping from original source line and column to the generated
 * source's line and column for this source map being created. The mapping
 * object should have the following properties:
 *
 *   - generated: An object with the generated line and column positions.
 *   - original: An object with the original line and column positions.
 *   - source: The original source file (relative to the sourceRoot).
 *   - name: An optional original token name for this mapping.
 */
SourceMapGenerator$4.prototype.addMapping =
  function SourceMapGenerator_addMapping(aArgs) {
    var generated = util$2.getArg(aArgs, 'generated')
    var original = util$2.getArg(aArgs, 'original', null)
    var source = util$2.getArg(aArgs, 'source', null)
    var name = util$2.getArg(aArgs, 'name', null)

    if (!this._skipValidation) {
      this._validateMapping(generated, original, source, name)
    }

    if (source != null) {
      source = String(source)
      if (!this._sources.has(source)) {
        this._sources.add(source)
      }
    }

    if (name != null) {
      name = String(name)
      if (!this._names.has(name)) {
        this._names.add(name)
      }
    }

    this._mappings.add({
      generatedLine: generated.line,
      generatedColumn: generated.column,
      originalLine: original != null && original.line,
      originalColumn: original != null && original.column,
      source: source,
      name: name
    })
  }

/**
 * Set the source content for a source file.
 */
SourceMapGenerator$4.prototype.setSourceContent =
  function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
    var source = aSourceFile
    if (this._sourceRoot != null) {
      source = util$2.relative(this._sourceRoot, source)
    }

    if (aSourceContent != null) {
      // Add the source content to the _sourcesContents map.
      // Create a new _sourcesContents map if the property is null.
      if (!this._sourcesContents) {
        this._sourcesContents = Object.create(null)
      }
      this._sourcesContents[util$2.toSetString(source)] = aSourceContent
    } else if (this._sourcesContents) {
      // Remove the source file from the _sourcesContents map.
      // If the _sourcesContents map is empty, set the property to null.
      delete this._sourcesContents[util$2.toSetString(source)]
      if (Object.keys(this._sourcesContents).length === 0) {
        this._sourcesContents = null
      }
    }
  }

/**
 * Applies the mappings of a sub-source-map for a specific source file to the
 * source map being generated. Each mapping to the supplied source file is
 * rewritten using the supplied source map. Note: The resolution for the
 * resulting mappings is the minimium of this map and the supplied map.
 *
 * @param aSourceMapConsumer The source map to be applied.
 * @param aSourceFile Optional. The filename of the source file.
 *        If omitted, SourceMapConsumer's file property will be used.
 * @param aSourceMapPath Optional. The dirname of the path to the source map
 *        to be applied. If relative, it is relative to the SourceMapConsumer.
 *        This parameter is needed when the two source maps aren't in the same
 *        directory, and the source map to be applied contains relative source
 *        paths. If so, those relative source paths need to be rewritten
 *        relative to the SourceMapGenerator.
 */
SourceMapGenerator$4.prototype.applySourceMap =
  function SourceMapGenerator_applySourceMap(
    aSourceMapConsumer,
    aSourceFile,
    aSourceMapPath
  ) {
    var sourceFile = aSourceFile
    // If aSourceFile is omitted, we will use the file property of the SourceMap
    if (aSourceFile == null) {
      if (aSourceMapConsumer.file == null) {
        throw new Error(
          'SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' +
            'or the source map\'s "file" property. Both were omitted.'
        )
      }
      sourceFile = aSourceMapConsumer.file
    }
    var sourceRoot = this._sourceRoot
    // Make "sourceFile" relative if an absolute Url is passed.
    if (sourceRoot != null) {
      sourceFile = util$2.relative(sourceRoot, sourceFile)
    }
    // Applying the SourceMap can add and remove items from the sources and
    // the names array.
    var newSources = new ArraySet$1()
    var newNames = new ArraySet$1()

    // Find mappings for the "sourceFile"
    this._mappings.unsortedForEach(function (mapping) {
      if (mapping.source === sourceFile && mapping.originalLine != null) {
        // Check if it can be mapped by the source map, then update the mapping.
        var original = aSourceMapConsumer.originalPositionFor({
          line: mapping.originalLine,
          column: mapping.originalColumn
        })
        if (original.source != null) {
          // Copy mapping
          mapping.source = original.source
          if (aSourceMapPath != null) {
            mapping.source = util$2.join(aSourceMapPath, mapping.source)
          }
          if (sourceRoot != null) {
            mapping.source = util$2.relative(sourceRoot, mapping.source)
          }
          mapping.originalLine = original.line
          mapping.originalColumn = original.column
          if (original.name != null) {
            mapping.name = original.name
          }
        }
      }

      var source = mapping.source
      if (source != null && !newSources.has(source)) {
        newSources.add(source)
      }

      var name = mapping.name
      if (name != null && !newNames.has(name)) {
        newNames.add(name)
      }
    }, this)
    this._sources = newSources
    this._names = newNames

    // Copy sourcesContents of applied map.
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile)
      if (content != null) {
        if (aSourceMapPath != null) {
          sourceFile = util$2.join(aSourceMapPath, sourceFile)
        }
        if (sourceRoot != null) {
          sourceFile = util$2.relative(sourceRoot, sourceFile)
        }
        this.setSourceContent(sourceFile, content)
      }
    }, this)
  }

/**
 * A mapping can have one of the three levels of data:
 *
 *   1. Just the generated position.
 *   2. The Generated position, original position, and original source.
 *   3. Generated and original position, original source, as well as a name
 *      token.
 *
 * To maintain consistency, we validate that any new mapping being added falls
 * in to one of these categories.
 */
SourceMapGenerator$4.prototype._validateMapping =
  function SourceMapGenerator_validateMapping(
    aGenerated,
    aOriginal,
    aSource,
    aName
  ) {
    // When aOriginal is truthy but has empty values for .line and .column,
    // it is most likely a programmer error. In this case we throw a very
    // specific error message to try to guide them the right way.
    // For example: https://github.com/Polymer/polymer-bundler/pull/519
    if (
      aOriginal &&
      typeof aOriginal.line !== 'number' &&
      typeof aOriginal.column !== 'number'
    ) {
      throw new Error(
        'original.line and original.column are not numbers -- you probably meant to omit ' +
          'the original mapping entirely and only map the generated position. If so, pass ' +
          'null for the original mapping instead of an object with empty or null values.'
      )
    }

    if (
      aGenerated &&
      'line' in aGenerated &&
      'column' in aGenerated &&
      aGenerated.line > 0 &&
      aGenerated.column >= 0 &&
      !aOriginal &&
      !aSource &&
      !aName
    ) {
      // Case 1.
      return
    } else if (
      aGenerated &&
      'line' in aGenerated &&
      'column' in aGenerated &&
      aOriginal &&
      'line' in aOriginal &&
      'column' in aOriginal &&
      aGenerated.line > 0 &&
      aGenerated.column >= 0 &&
      aOriginal.line > 0 &&
      aOriginal.column >= 0 &&
      aSource
    ) {
      // Cases 2 and 3.
      return
    } else {
      throw new Error(
        'Invalid mapping: ' +
          JSON.stringify({
            generated: aGenerated,
            source: aSource,
            original: aOriginal,
            name: aName
          })
      )
    }
  }

/**
 * Serialize the accumulated mappings in to the stream of base 64 VLQs
 * specified by the source map format.
 */
SourceMapGenerator$4.prototype._serializeMappings =
  function SourceMapGenerator_serializeMappings() {
    var previousGeneratedColumn = 0
    var previousGeneratedLine = 1
    var previousOriginalColumn = 0
    var previousOriginalLine = 0
    var previousName = 0
    var previousSource = 0
    var result = ''
    var next
    var mapping
    var nameIdx
    var sourceIdx

    var mappings = this._mappings.toArray()
    for (var i = 0, len = mappings.length; i < len; i++) {
      mapping = mappings[i]
      next = ''

      if (mapping.generatedLine !== previousGeneratedLine) {
        previousGeneratedColumn = 0
        while (mapping.generatedLine !== previousGeneratedLine) {
          next += ';'
          previousGeneratedLine++
        }
      } else {
        if (i > 0) {
          if (
            !util$2.compareByGeneratedPositionsInflated(
              mapping,
              mappings[i - 1]
            )
          ) {
            continue
          }
          next += ','
        }
      }

      next += base64VLQ$1.encode(
        mapping.generatedColumn - previousGeneratedColumn
      )
      previousGeneratedColumn = mapping.generatedColumn

      if (mapping.source != null) {
        sourceIdx = this._sources.indexOf(mapping.source)
        next += base64VLQ$1.encode(sourceIdx - previousSource)
        previousSource = sourceIdx

        // lines are stored 0-based in SourceMap spec version 3
        next += base64VLQ$1.encode(
          mapping.originalLine - 1 - previousOriginalLine
        )
        previousOriginalLine = mapping.originalLine - 1

        next += base64VLQ$1.encode(
          mapping.originalColumn - previousOriginalColumn
        )
        previousOriginalColumn = mapping.originalColumn

        if (mapping.name != null) {
          nameIdx = this._names.indexOf(mapping.name)
          next += base64VLQ$1.encode(nameIdx - previousName)
          previousName = nameIdx
        }
      }

      result += next
    }

    return result
  }

SourceMapGenerator$4.prototype._generateSourcesContent =
  function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
    return aSources.map(function (source) {
      if (!this._sourcesContents) {
        return null
      }
      if (aSourceRoot != null) {
        source = util$2.relative(aSourceRoot, source)
      }
      var key = util$2.toSetString(source)
      return Object.prototype.hasOwnProperty.call(this._sourcesContents, key)
        ? this._sourcesContents[key]
        : null
    }, this)
  }

/**
 * Externalize the source map.
 */
SourceMapGenerator$4.prototype.toJSON = function SourceMapGenerator_toJSON() {
  var map = {
    version: this._version,
    sources: this._sources.toArray(),
    names: this._names.toArray(),
    mappings: this._serializeMappings()
  }
  if (this._file != null) {
    map.file = this._file
  }
  if (this._sourceRoot != null) {
    map.sourceRoot = this._sourceRoot
  }
  if (this._sourcesContents) {
    map.sourcesContent = this._generateSourcesContent(
      map.sources,
      map.sourceRoot
    )
  }

  return map
}

/**
 * Render the source map being generated to a string.
 */
SourceMapGenerator$4.prototype.toString =
  function SourceMapGenerator_toString() {
    return JSON.stringify(this.toJSON())
  }

sourceMapGenerator.SourceMapGenerator = SourceMapGenerator$4

var sourceMapConsumer = {}

var binarySearch$1 = {}

/* -*- Mode: js; js-indent-level: 2; -*- */

;(function (exports) {
  /*
   * Copyright 2011 Mozilla Foundation and contributors
   * Licensed under the New BSD license. See LICENSE or:
   * http://opensource.org/licenses/BSD-3-Clause
   */

  exports.GREATEST_LOWER_BOUND = 1
  exports.LEAST_UPPER_BOUND = 2

  /**
   * Recursive implementation of binary search.
   *
   * @param aLow Indices here and lower do not contain the needle.
   * @param aHigh Indices here and higher do not contain the needle.
   * @param aNeedle The element being searched for.
   * @param aHaystack The non-empty array being searched.
   * @param aCompare Function which takes two elements and returns -1, 0, or 1.
   * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
   *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
   *     closest element that is smaller than or greater than the one we are
   *     searching for, respectively, if the exact element cannot be found.
   */
  function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
    // This function terminates when one of the following is true:
    //
    //   1. We find the exact element we are looking for.
    //
    //   2. We did not find the exact element, but we can return the index of
    //      the next-closest element.
    //
    //   3. We did not find the exact element, and there is no next-closest
    //      element than the one we are searching for, so we return -1.
    var mid = Math.floor((aHigh - aLow) / 2) + aLow
    var cmp = aCompare(aNeedle, aHaystack[mid], true)
    if (cmp === 0) {
      // Found the element we are looking for.
      return mid
    } else if (cmp > 0) {
      // Our needle is greater than aHaystack[mid].
      if (aHigh - mid > 1) {
        // The element is in the upper half.
        return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias)
      }

      // The exact needle element was not found in this haystack. Determine if
      // we are in termination case (3) or (2) and return the appropriate thing.
      if (aBias == exports.LEAST_UPPER_BOUND) {
        return aHigh < aHaystack.length ? aHigh : -1
      } else {
        return mid
      }
    } else {
      // Our needle is less than aHaystack[mid].
      if (mid - aLow > 1) {
        // The element is in the lower half.
        return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias)
      }

      // we are in termination case (3) or (2) and return the appropriate thing.
      if (aBias == exports.LEAST_UPPER_BOUND) {
        return mid
      } else {
        return aLow < 0 ? -1 : aLow
      }
    }
  }

  /**
   * This is an implementation of binary search which will always try and return
   * the index of the closest element if there is no exact hit. This is because
   * mappings between original and generated line/col pairs are single points,
   * and there is an implicit region between each of them, so a miss just means
   * that you aren't on the very start of a region.
   *
   * @param aNeedle The element you are looking for.
   * @param aHaystack The array that is being searched.
   * @param aCompare A function which takes the needle and an element in the
   *     array and returns -1, 0, or 1 depending on whether the needle is less
   *     than, equal to, or greater than the element, respectively.
   * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
   *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
   *     closest element that is smaller than or greater than the one we are
   *     searching for, respectively, if the exact element cannot be found.
   *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
   */
  exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
    if (aHaystack.length === 0) {
      return -1
    }

    var index = recursiveSearch(
      -1,
      aHaystack.length,
      aNeedle,
      aHaystack,
      aCompare,
      aBias || exports.GREATEST_LOWER_BOUND
    )
    if (index < 0) {
      return -1
    }

    // We have found either the exact element, or the next-closest element than
    // the one we are searching for. However, there may be more than one such
    // element. Make sure we always return the smallest of these.
    while (index - 1 >= 0) {
      if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
        break
      }
      --index
    }

    return index
  }
})(binarySearch$1)

var quickSort$1 = {}

/* -*- Mode: js; js-indent-level: 2; -*- */

/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

// It turns out that some (most?) JavaScript engines don't self-host
// `Array.prototype.sort`. This makes sense because C++ will likely remain
// faster than JS when doing raw CPU-intensive sorting. However, when using a
// custom comparator function, calling back and forth between the VM's C++ and
// JIT'd JS is rather slow *and* loses JIT type information, resulting in
// worse generated code for the comparator function than would be optimal. In
// fact, when sorting with a comparator, these costs outweigh the benefits of
// sorting in C++. By using our own JS-implemented Quick Sort (below), we get
// a ~3500ms mean speed-up in `bench/bench.html`.

function SortTemplate(comparator) {
  /**
   * Swap the elements indexed by `x` and `y` in the array `ary`.
   *
   * @param {Array} ary
   *        The array.
   * @param {Number} x
   *        The index of the first item.
   * @param {Number} y
   *        The index of the second item.
   */
  function swap(ary, x, y) {
    var temp = ary[x]
    ary[x] = ary[y]
    ary[y] = temp
  }

  /**
   * Returns a random integer within the range `low .. high` inclusive.
   *
   * @param {Number} low
   *        The lower bound on the range.
   * @param {Number} high
   *        The upper bound on the range.
   */
  function randomIntInRange(low, high) {
    return Math.round(low + Math.random() * (high - low))
  }

  /**
   * The Quick Sort algorithm.
   *
   * @param {Array} ary
   *        An array to sort.
   * @param {function} comparator
   *        Function to use to compare two items.
   * @param {Number} p
   *        Start index of the array
   * @param {Number} r
   *        End index of the array
   */
  function doQuickSort(ary, comparator, p, r) {
    // If our lower bound is less than our upper bound, we (1) partition the
    // array into two pieces and (2) recurse on each half. If it is not, this is
    // the empty array and our base case.

    if (p < r) {
      // (1) Partitioning.
      //
      // The partitioning chooses a pivot between `p` and `r` and moves all
      // elements that are less than or equal to the pivot to the before it, and
      // all the elements that are greater than it after it. The effect is that
      // once partition is done, the pivot is in the exact place it will be when
      // the array is put in sorted order, and it will not need to be moved
      // again. This runs in O(n) time.

      // Always choose a random pivot so that an input array which is reverse
      // sorted does not cause O(n^2) running time.
      var pivotIndex = randomIntInRange(p, r)
      var i = p - 1

      swap(ary, pivotIndex, r)
      var pivot = ary[r]

      // Immediately after `j` is incremented in this loop, the following hold
      // true:
      //
      //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
      //
      //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
      for (var j = p; j < r; j++) {
        if (comparator(ary[j], pivot, false) <= 0) {
          i += 1
          swap(ary, i, j)
        }
      }

      swap(ary, i + 1, j)
      var q = i + 1

      // (2) Recurse on each half.

      doQuickSort(ary, comparator, p, q - 1)
      doQuickSort(ary, comparator, q + 1, r)
    }
  }

  return doQuickSort
}

function cloneSort(comparator) {
  let template = SortTemplate.toString()
  let templateFn = new Function(`return ${template}`)()
  return templateFn(comparator)
}

/**
 * Sort the given array in-place with the given comparator function.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 */

let sortCache = new WeakMap()
quickSort$1.quickSort = function (ary, comparator, start = 0) {
  let doQuickSort = sortCache.get(comparator)
  if (doQuickSort === void 0) {
    doQuickSort = cloneSort(comparator)
    sortCache.set(comparator, doQuickSort)
  }
  doQuickSort(ary, comparator, start, ary.length - 1)
}

/* -*- Mode: js; js-indent-level: 2; -*- */

/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util$1 = util$5
var binarySearch = binarySearch$1
var ArraySet = arraySet.ArraySet
var base64VLQ = base64Vlq
var quickSort = quickSort$1.quickSort

function SourceMapConsumer$3(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap
  if (typeof aSourceMap === 'string') {
    sourceMap = util$1.parseSourceMapInput(aSourceMap)
  }

  return sourceMap.sections != null
    ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL)
    : new BasicSourceMapConsumer(sourceMap, aSourceMapURL)
}

SourceMapConsumer$3.fromSourceMap = function (aSourceMap, aSourceMapURL) {
  return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL)
}

/**
 * The version of the source mapping spec that we are consuming.
 */
SourceMapConsumer$3.prototype._version = 3

// `__generatedMappings` and `__originalMappings` are arrays that hold the
// parsed mapping coordinates from the source map's "mappings" attribute. They
// are lazily instantiated, accessed via the `_generatedMappings` and
// `_originalMappings` getters respectively, and we only parse the mappings
// and create these arrays once queried for a source location. We jump through
// these hoops because there can be many thousands of mappings, and parsing
// them is expensive, so we only want to do it if we must.
//
// Each object in the arrays is of the form:
//
//     {
//       generatedLine: The line number in the generated code,
//       generatedColumn: The column number in the generated code,
//       source: The path to the original source file that generated this
//               chunk of code,
//       originalLine: The line number in the original source that
//                     corresponds to this chunk of generated code,
//       originalColumn: The column number in the original source that
//                       corresponds to this chunk of generated code,
//       name: The name of the original symbol which generated this chunk of
//             code.
//     }
//
// All properties except for `generatedLine` and `generatedColumn` can be
// `null`.
//
// `_generatedMappings` is ordered by the generated positions.
//
// `_originalMappings` is ordered by the original positions.

SourceMapConsumer$3.prototype.__generatedMappings = null
Object.defineProperty(SourceMapConsumer$3.prototype, '_generatedMappings', {
  configurable: true,
  enumerable: true,
  get: function () {
    if (!this.__generatedMappings) {
      this._parseMappings(this._mappings, this.sourceRoot)
    }

    return this.__generatedMappings
  }
})

SourceMapConsumer$3.prototype.__originalMappings = null
Object.defineProperty(SourceMapConsumer$3.prototype, '_originalMappings', {
  configurable: true,
  enumerable: true,
  get: function () {
    if (!this.__originalMappings) {
      this._parseMappings(this._mappings, this.sourceRoot)
    }

    return this.__originalMappings
  }
})

SourceMapConsumer$3.prototype._charIsMappingSeparator =
  function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
    var c = aStr.charAt(index)
    return c === ';' || c === ','
  }

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
SourceMapConsumer$3.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    throw new Error('Subclasses must implement _parseMappings')
  }

SourceMapConsumer$3.GENERATED_ORDER = 1
SourceMapConsumer$3.ORIGINAL_ORDER = 2

SourceMapConsumer$3.GREATEST_LOWER_BOUND = 1
SourceMapConsumer$3.LEAST_UPPER_BOUND = 2

/**
 * Iterate over each mapping between an original source/line/column and a
 * generated line/column in this source map.
 *
 * @param Function aCallback
 *        The function that is called with each mapping.
 * @param Object aContext
 *        Optional. If specified, this object will be the value of `this` every
 *        time that `aCallback` is called.
 * @param aOrder
 *        Either `SourceMapConsumer.GENERATED_ORDER` or
 *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
 *        iterate over the mappings sorted by the generated file's line/column
 *        order or the original's source/line/column order, respectively. Defaults to
 *        `SourceMapConsumer.GENERATED_ORDER`.
 */
SourceMapConsumer$3.prototype.eachMapping =
  function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
    var context = aContext || null
    var order = aOrder || SourceMapConsumer$3.GENERATED_ORDER

    var mappings
    switch (order) {
      case SourceMapConsumer$3.GENERATED_ORDER:
        mappings = this._generatedMappings
        break
      case SourceMapConsumer$3.ORIGINAL_ORDER:
        mappings = this._originalMappings
        break
      default:
        throw new Error('Unknown order of iteration.')
    }

    var sourceRoot = this.sourceRoot
    mappings
      .map(function (mapping) {
        var source =
          mapping.source === null ? null : this._sources.at(mapping.source)
        source = util$1.computeSourceURL(sourceRoot, source, this._sourceMapURL)
        return {
          source: source,
          generatedLine: mapping.generatedLine,
          generatedColumn: mapping.generatedColumn,
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name: mapping.name === null ? null : this._names.at(mapping.name)
        }
      }, this)
      .forEach(aCallback, context)
  }

/**
 * Returns all generated line and column information for the original source,
 * line, and column provided. If no column is provided, returns all mappings
 * corresponding to a either the line we are searching for or the next
 * closest line that has any mappings. Otherwise, returns all mappings
 * corresponding to the given line and either the column we are searching for
 * or the next closest column that has any offsets.
 *
 * The only argument is an object with the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number is 1-based.
 *   - column: Optional. the column number in the original source.
 *    The column number is 0-based.
 *
 * and an array of objects is returned, each with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *    line number is 1-based.
 *   - column: The column number in the generated source, or null.
 *    The column number is 0-based.
 */
SourceMapConsumer$3.prototype.allGeneratedPositionsFor =
  function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
    var line = util$1.getArg(aArgs, 'line')

    // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
    // returns the index of the closest mapping less than the needle. By
    // setting needle.originalColumn to 0, we thus find the last mapping for
    // the given line, provided such a mapping exists.
    var needle = {
      source: util$1.getArg(aArgs, 'source'),
      originalLine: line,
      originalColumn: util$1.getArg(aArgs, 'column', 0)
    }

    needle.source = this._findSourceIndex(needle.source)
    if (needle.source < 0) {
      return []
    }

    var mappings = []

    var index = this._findMapping(
      needle,
      this._originalMappings,
      'originalLine',
      'originalColumn',
      util$1.compareByOriginalPositions,
      binarySearch.LEAST_UPPER_BOUND
    )
    if (index >= 0) {
      var mapping = this._originalMappings[index]

      if (aArgs.column === undefined) {
        var originalLine = mapping.originalLine

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we found. Since
        // mappings are sorted, this is guaranteed to find all mappings for
        // the line we found.
        while (mapping && mapping.originalLine === originalLine) {
          mappings.push({
            line: util$1.getArg(mapping, 'generatedLine', null),
            column: util$1.getArg(mapping, 'generatedColumn', null),
            lastColumn: util$1.getArg(mapping, 'lastGeneratedColumn', null)
          })

          mapping = this._originalMappings[++index]
        }
      } else {
        var originalColumn = mapping.originalColumn

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we were searching for.
        // Since mappings are sorted, this is guaranteed to find all mappings for
        // the line we are searching for.
        while (
          mapping &&
          mapping.originalLine === line &&
          mapping.originalColumn == originalColumn
        ) {
          mappings.push({
            line: util$1.getArg(mapping, 'generatedLine', null),
            column: util$1.getArg(mapping, 'generatedColumn', null),
            lastColumn: util$1.getArg(mapping, 'lastGeneratedColumn', null)
          })

          mapping = this._originalMappings[++index]
        }
      }
    }

    return mappings
  }

sourceMapConsumer.SourceMapConsumer = SourceMapConsumer$3

/**
 * A BasicSourceMapConsumer instance represents a parsed source map which we can
 * query for information about the original file positions by giving it a file
 * position in the generated source.
 *
 * The first parameter is the raw source map (either as a JSON string, or
 * already parsed to an object). According to the spec, source maps have the
 * following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - sources: An array of URLs to the original source files.
 *   - names: An array of identifiers which can be referrenced by individual mappings.
 *   - sourceRoot: Optional. The URL root from which all sources are relative.
 *   - sourcesContent: Optional. An array of contents of the original source files.
 *   - mappings: A string of base64 VLQs which contain the actual mappings.
 *   - file: Optional. The generated file this source map is associated with.
 *
 * Here is an example source map, taken from the source map spec[0]:
 *
 *     {
 *       version : 3,
 *       file: "out.js",
 *       sourceRoot : "",
 *       sources: ["foo.js", "bar.js"],
 *       names: ["src", "maps", "are", "fun"],
 *       mappings: "AA,AB;;ABCDE;"
 *     }
 *
 * The second parameter, if given, is a string whose value is the URL
 * at which the source map was found.  This URL is used to compute the
 * sources array.
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
 */
function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap
  if (typeof aSourceMap === 'string') {
    sourceMap = util$1.parseSourceMapInput(aSourceMap)
  }

  var version = util$1.getArg(sourceMap, 'version')
  var sources = util$1.getArg(sourceMap, 'sources')
  // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
  // requires the array) to play nice here.
  var names = util$1.getArg(sourceMap, 'names', [])
  var sourceRoot = util$1.getArg(sourceMap, 'sourceRoot', null)
  var sourcesContent = util$1.getArg(sourceMap, 'sourcesContent', null)
  var mappings = util$1.getArg(sourceMap, 'mappings')
  var file = util$1.getArg(sourceMap, 'file', null)

  // Once again, Sass deviates from the spec and supplies the version as a
  // string rather than a number, so we use loose equality checking here.
  if (version != this._version) {
    throw new Error('Unsupported version: ' + version)
  }

  if (sourceRoot) {
    sourceRoot = util$1.normalize(sourceRoot)
  }

  sources = sources
    .map(String)
    // Some source maps produce relative source paths like "./foo.js" instead of
    // "foo.js".  Normalize these first so that future comparisons will succeed.
    // See bugzil.la/1090768.
    .map(util$1.normalize)
    // Always ensure that absolute sources are internally stored relative to
    // the source root, if the source root is absolute. Not doing this would
    // be particularly problematic when the source root is a prefix of the
    // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
    .map(function (source) {
      return sourceRoot &&
        util$1.isAbsolute(sourceRoot) &&
        util$1.isAbsolute(source)
        ? util$1.relative(sourceRoot, source)
        : source
    })

  // Pass `true` below to allow duplicate names and sources. While source maps
  // are intended to be compressed and deduplicated, the TypeScript compiler
  // sometimes generates source maps with duplicates in them. See Github issue
  // #72 and bugzil.la/889492.
  this._names = ArraySet.fromArray(names.map(String), true)
  this._sources = ArraySet.fromArray(sources, true)

  this._absoluteSources = this._sources.toArray().map(function (s) {
    return util$1.computeSourceURL(sourceRoot, s, aSourceMapURL)
  })

  this.sourceRoot = sourceRoot
  this.sourcesContent = sourcesContent
  this._mappings = mappings
  this._sourceMapURL = aSourceMapURL
  this.file = file
}

BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer$3.prototype)
BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer$3

/**
 * Utility function to find the index of a source.  Returns -1 if not
 * found.
 */
BasicSourceMapConsumer.prototype._findSourceIndex = function (aSource) {
  var relativeSource = aSource
  if (this.sourceRoot != null) {
    relativeSource = util$1.relative(this.sourceRoot, relativeSource)
  }

  if (this._sources.has(relativeSource)) {
    return this._sources.indexOf(relativeSource)
  }

  // Maybe aSource is an absolute URL as returned by |sources|.  In
  // this case we can't simply undo the transform.
  var i
  for (i = 0; i < this._absoluteSources.length; ++i) {
    if (this._absoluteSources[i] == aSource) {
      return i
    }
  }

  return -1
}

/**
 * Create a BasicSourceMapConsumer from a SourceMapGenerator.
 *
 * @param SourceMapGenerator aSourceMap
 *        The source map that will be consumed.
 * @param String aSourceMapURL
 *        The URL at which the source map can be found (optional)
 * @returns BasicSourceMapConsumer
 */
BasicSourceMapConsumer.fromSourceMap = function SourceMapConsumer_fromSourceMap(
  aSourceMap,
  aSourceMapURL
) {
  var smc = Object.create(BasicSourceMapConsumer.prototype)

  var names = (smc._names = ArraySet.fromArray(
    aSourceMap._names.toArray(),
    true
  ))
  var sources = (smc._sources = ArraySet.fromArray(
    aSourceMap._sources.toArray(),
    true
  ))
  smc.sourceRoot = aSourceMap._sourceRoot
  smc.sourcesContent = aSourceMap._generateSourcesContent(
    smc._sources.toArray(),
    smc.sourceRoot
  )
  smc.file = aSourceMap._file
  smc._sourceMapURL = aSourceMapURL
  smc._absoluteSources = smc._sources.toArray().map(function (s) {
    return util$1.computeSourceURL(smc.sourceRoot, s, aSourceMapURL)
  })

  // Because we are modifying the entries (by converting string sources and
  // names to indices into the sources and names ArraySets), we have to make
  // a copy of the entry or else bad things happen. Shared mutable state
  // strikes again! See github issue #191.

  var generatedMappings = aSourceMap._mappings.toArray().slice()
  var destGeneratedMappings = (smc.__generatedMappings = [])
  var destOriginalMappings = (smc.__originalMappings = [])

  for (var i = 0, length = generatedMappings.length; i < length; i++) {
    var srcMapping = generatedMappings[i]
    var destMapping = new Mapping()
    destMapping.generatedLine = srcMapping.generatedLine
    destMapping.generatedColumn = srcMapping.generatedColumn

    if (srcMapping.source) {
      destMapping.source = sources.indexOf(srcMapping.source)
      destMapping.originalLine = srcMapping.originalLine
      destMapping.originalColumn = srcMapping.originalColumn

      if (srcMapping.name) {
        destMapping.name = names.indexOf(srcMapping.name)
      }

      destOriginalMappings.push(destMapping)
    }

    destGeneratedMappings.push(destMapping)
  }

  quickSort(smc.__originalMappings, util$1.compareByOriginalPositions)

  return smc
}

/**
 * The version of the source mapping spec that we are consuming.
 */
BasicSourceMapConsumer.prototype._version = 3

/**
 * The list of original sources.
 */
Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
  get: function () {
    return this._absoluteSources.slice()
  }
})

/**
 * Provide the JIT with a nice shape / hidden class.
 */
function Mapping() {
  this.generatedLine = 0
  this.generatedColumn = 0
  this.source = null
  this.originalLine = null
  this.originalColumn = null
  this.name = null
}

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */

const compareGenerated = util$1.compareByGeneratedPositionsDeflatedNoLine
function sortGenerated(array, start) {
  let l = array.length
  let n = array.length - start
  if (n <= 1) {
    return
  } else if (n == 2) {
    let a = array[start]
    let b = array[start + 1]
    if (compareGenerated(a, b) > 0) {
      array[start] = b
      array[start + 1] = a
    }
  } else if (n < 20) {
    for (let i = start; i < l; i++) {
      for (let j = i; j > start; j--) {
        let a = array[j - 1]
        let b = array[j]
        if (compareGenerated(a, b) <= 0) {
          break
        }
        array[j - 1] = b
        array[j] = a
      }
    }
  } else {
    quickSort(array, compareGenerated, start)
  }
}
BasicSourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    var generatedLine = 1
    var previousGeneratedColumn = 0
    var previousOriginalLine = 0
    var previousOriginalColumn = 0
    var previousSource = 0
    var previousName = 0
    var length = aStr.length
    var index = 0
    var temp = {}
    var originalMappings = []
    var generatedMappings = []
    var mapping, segment, end, value

    let subarrayStart = 0
    while (index < length) {
      if (aStr.charAt(index) === ';') {
        generatedLine++
        index++
        previousGeneratedColumn = 0

        sortGenerated(generatedMappings, subarrayStart)
        subarrayStart = generatedMappings.length
      } else if (aStr.charAt(index) === ',') {
        index++
      } else {
        mapping = new Mapping()
        mapping.generatedLine = generatedLine

        for (end = index; end < length; end++) {
          if (this._charIsMappingSeparator(aStr, end)) {
            break
          }
        }
        aStr.slice(index, end)

        segment = []
        while (index < end) {
          base64VLQ.decode(aStr, index, temp)
          value = temp.value
          index = temp.rest
          segment.push(value)
        }

        if (segment.length === 2) {
          throw new Error('Found a source, but no line and column')
        }

        if (segment.length === 3) {
          throw new Error('Found a source and line, but no column')
        }

        // Generated column.
        mapping.generatedColumn = previousGeneratedColumn + segment[0]
        previousGeneratedColumn = mapping.generatedColumn

        if (segment.length > 1) {
          // Original source.
          mapping.source = previousSource + segment[1]
          previousSource += segment[1]

          // Original line.
          mapping.originalLine = previousOriginalLine + segment[2]
          previousOriginalLine = mapping.originalLine
          // Lines are stored 0-based
          mapping.originalLine += 1

          // Original column.
          mapping.originalColumn = previousOriginalColumn + segment[3]
          previousOriginalColumn = mapping.originalColumn

          if (segment.length > 4) {
            // Original name.
            mapping.name = previousName + segment[4]
            previousName += segment[4]
          }
        }

        generatedMappings.push(mapping)
        if (typeof mapping.originalLine === 'number') {
          let currentSource = mapping.source
          while (originalMappings.length <= currentSource) {
            originalMappings.push(null)
          }
          if (originalMappings[currentSource] === null) {
            originalMappings[currentSource] = []
          }
          originalMappings[currentSource].push(mapping)
        }
      }
    }

    sortGenerated(generatedMappings, subarrayStart)
    this.__generatedMappings = generatedMappings

    for (var i = 0; i < originalMappings.length; i++) {
      if (originalMappings[i] != null) {
        quickSort(
          originalMappings[i],
          util$1.compareByOriginalPositionsNoSource
        )
      }
    }
    this.__originalMappings = [].concat(...originalMappings)
  }

/**
 * Find the mapping that best matches the hypothetical "needle" mapping that
 * we are searching for in the given "haystack" of mappings.
 */
BasicSourceMapConsumer.prototype._findMapping =
  function SourceMapConsumer_findMapping(
    aNeedle,
    aMappings,
    aLineName,
    aColumnName,
    aComparator,
    aBias
  ) {
    // To return the position we are searching for, we must first find the
    // mapping for the given position and then return the opposite position it
    // points to. Because the mappings are sorted, we can use binary search to
    // find the best mapping.

    if (aNeedle[aLineName] <= 0) {
      throw new TypeError(
        'Line must be greater than or equal to 1, got ' + aNeedle[aLineName]
      )
    }
    if (aNeedle[aColumnName] < 0) {
      throw new TypeError(
        'Column must be greater than or equal to 0, got ' + aNeedle[aColumnName]
      )
    }

    return binarySearch.search(aNeedle, aMappings, aComparator, aBias)
  }

/**
 * Compute the last column for each generated mapping. The last column is
 * inclusive.
 */
BasicSourceMapConsumer.prototype.computeColumnSpans =
  function SourceMapConsumer_computeColumnSpans() {
    for (var index = 0; index < this._generatedMappings.length; ++index) {
      var mapping = this._generatedMappings[index]

      // Mappings do not contain a field for the last generated columnt. We
      // can come up with an optimistic estimate, however, by assuming that
      // mappings are contiguous (i.e. given two consecutive mappings, the
      // first mapping ends where the second one starts).
      if (index + 1 < this._generatedMappings.length) {
        var nextMapping = this._generatedMappings[index + 1]

        if (mapping.generatedLine === nextMapping.generatedLine) {
          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1
          continue
        }
      }

      // The last mapping for each line spans the entire line.
      mapping.lastGeneratedColumn = Infinity
    }
  }

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.  The line number
 *     is 1-based.
 *   - column: The column number in the generated source.  The column
 *     number is 0-based.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the original source, or null.  The
 *     column number is 0-based.
 *   - name: The original identifier, or null.
 */
BasicSourceMapConsumer.prototype.originalPositionFor =
  function SourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util$1.getArg(aArgs, 'line'),
      generatedColumn: util$1.getArg(aArgs, 'column')
    }

    var index = this._findMapping(
      needle,
      this._generatedMappings,
      'generatedLine',
      'generatedColumn',
      util$1.compareByGeneratedPositionsDeflated,
      util$1.getArg(aArgs, 'bias', SourceMapConsumer$3.GREATEST_LOWER_BOUND)
    )

    if (index >= 0) {
      var mapping = this._generatedMappings[index]

      if (mapping.generatedLine === needle.generatedLine) {
        var source = util$1.getArg(mapping, 'source', null)
        if (source !== null) {
          source = this._sources.at(source)
          source = util$1.computeSourceURL(
            this.sourceRoot,
            source,
            this._sourceMapURL
          )
        }
        var name = util$1.getArg(mapping, 'name', null)
        if (name !== null) {
          name = this._names.at(name)
        }
        return {
          source: source,
          line: util$1.getArg(mapping, 'originalLine', null),
          column: util$1.getArg(mapping, 'originalColumn', null),
          name: name
        }
      }
    }

    return {
      source: null,
      line: null,
      column: null,
      name: null
    }
  }

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
  function BasicSourceMapConsumer_hasContentsOfAllSources() {
    if (!this.sourcesContent) {
      return false
    }
    return (
      this.sourcesContent.length >= this._sources.size() &&
      !this.sourcesContent.some(function (sc) {
        return sc == null
      })
    )
  }

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
BasicSourceMapConsumer.prototype.sourceContentFor =
  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    if (!this.sourcesContent) {
      return null
    }

    var index = this._findSourceIndex(aSource)
    if (index >= 0) {
      return this.sourcesContent[index]
    }

    var relativeSource = aSource
    if (this.sourceRoot != null) {
      relativeSource = util$1.relative(this.sourceRoot, relativeSource)
    }

    var url
    if (this.sourceRoot != null && (url = util$1.urlParse(this.sourceRoot))) {
      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
      // many users. We can help them out when they expect file:// URIs to
      // behave like it would if they were running a local HTTP server. See
      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
      var fileUriAbsPath = relativeSource.replace(/^file:\/\//, '')
      if (url.scheme == 'file' && this._sources.has(fileUriAbsPath)) {
        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
      }

      if (
        (!url.path || url.path == '/') &&
        this._sources.has('/' + relativeSource)
      ) {
        return this.sourcesContent[this._sources.indexOf('/' + relativeSource)]
      }
    }

    // This function is used recursively from
    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
    // don't want to throw if we can't find the source - we just want to
    // return null, so we provide a flag to exit gracefully.
    if (nullOnMissing) {
      return null
    } else {
      throw new Error('"' + relativeSource + '" is not in the SourceMap.')
    }
  }

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number
 *     is 1-based.
 *   - column: The column number in the original source.  The column
 *     number is 0-based.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the generated source, or null.
 *     The column number is 0-based.
 */
BasicSourceMapConsumer.prototype.generatedPositionFor =
  function SourceMapConsumer_generatedPositionFor(aArgs) {
    var source = util$1.getArg(aArgs, 'source')
    source = this._findSourceIndex(source)
    if (source < 0) {
      return {
        line: null,
        column: null,
        lastColumn: null
      }
    }

    var needle = {
      source: source,
      originalLine: util$1.getArg(aArgs, 'line'),
      originalColumn: util$1.getArg(aArgs, 'column')
    }

    var index = this._findMapping(
      needle,
      this._originalMappings,
      'originalLine',
      'originalColumn',
      util$1.compareByOriginalPositions,
      util$1.getArg(aArgs, 'bias', SourceMapConsumer$3.GREATEST_LOWER_BOUND)
    )

    if (index >= 0) {
      var mapping = this._originalMappings[index]

      if (mapping.source === needle.source) {
        return {
          line: util$1.getArg(mapping, 'generatedLine', null),
          column: util$1.getArg(mapping, 'generatedColumn', null),
          lastColumn: util$1.getArg(mapping, 'lastGeneratedColumn', null)
        }
      }
    }

    return {
      line: null,
      column: null,
      lastColumn: null
    }
  }

sourceMapConsumer.BasicSourceMapConsumer = BasicSourceMapConsumer

/**
 * An IndexedSourceMapConsumer instance represents a parsed source map which
 * we can query for information. It differs from BasicSourceMapConsumer in
 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
 * input.
 *
 * The first parameter is a raw source map (either as a JSON string, or already
 * parsed to an object). According to the spec for indexed source maps, they
 * have the following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - file: Optional. The generated file this source map is associated with.
 *   - sections: A list of section definitions.
 *
 * Each value under the "sections" field has two fields:
 *   - offset: The offset into the original specified at which this section
 *       begins to apply, defined as an object with a "line" and "column"
 *       field.
 *   - map: A source map definition. This source map could also be indexed,
 *       but doesn't have to be.
 *
 * Instead of the "map" field, it's also possible to have a "url" field
 * specifying a URL to retrieve a source map from, but that's currently
 * unsupported.
 *
 * Here's an example source map, taken from the source map spec[0], but
 * modified to omit a section which uses the "url" field.
 *
 *  {
 *    version : 3,
 *    file: "app.js",
 *    sections: [{
 *      offset: {line:100, column:10},
 *      map: {
 *        version : 3,
 *        file: "section.js",
 *        sources: ["foo.js", "bar.js"],
 *        names: ["src", "maps", "are", "fun"],
 *        mappings: "AAAA,E;;ABCDE;"
 *      }
 *    }],
 *  }
 *
 * The second parameter, if given, is a string whose value is the URL
 * at which the source map was found.  This URL is used to compute the
 * sources array.
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
 */
function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap
  if (typeof aSourceMap === 'string') {
    sourceMap = util$1.parseSourceMapInput(aSourceMap)
  }

  var version = util$1.getArg(sourceMap, 'version')
  var sections = util$1.getArg(sourceMap, 'sections')

  if (version != this._version) {
    throw new Error('Unsupported version: ' + version)
  }

  this._sources = new ArraySet()
  this._names = new ArraySet()

  var lastOffset = {
    line: -1,
    column: 0
  }
  this._sections = sections.map(function (s) {
    if (s.url) {
      // The url field will require support for asynchronicity.
      // See https://github.com/mozilla/source-map/issues/16
      throw new Error('Support for url field in sections not implemented.')
    }
    var offset = util$1.getArg(s, 'offset')
    var offsetLine = util$1.getArg(offset, 'line')
    var offsetColumn = util$1.getArg(offset, 'column')

    if (
      offsetLine < lastOffset.line ||
      (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)
    ) {
      throw new Error('Section offsets must be ordered and non-overlapping.')
    }
    lastOffset = offset

    return {
      generatedOffset: {
        // The offset fields are 0-based, but we use 1-based indices when
        // encoding/decoding from VLQ.
        generatedLine: offsetLine + 1,
        generatedColumn: offsetColumn + 1
      },
      consumer: new SourceMapConsumer$3(util$1.getArg(s, 'map'), aSourceMapURL)
    }
  })
}

IndexedSourceMapConsumer.prototype = Object.create(
  SourceMapConsumer$3.prototype
)
IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer$3

/**
 * The version of the source mapping spec that we are consuming.
 */
IndexedSourceMapConsumer.prototype._version = 3

/**
 * The list of original sources.
 */
Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
  get: function () {
    var sources = []
    for (var i = 0; i < this._sections.length; i++) {
      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
        sources.push(this._sections[i].consumer.sources[j])
      }
    }
    return sources
  }
})

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.  The line number
 *     is 1-based.
 *   - column: The column number in the generated source.  The column
 *     number is 0-based.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the original source, or null.  The
 *     column number is 0-based.
 *   - name: The original identifier, or null.
 */
IndexedSourceMapConsumer.prototype.originalPositionFor =
  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util$1.getArg(aArgs, 'line'),
      generatedColumn: util$1.getArg(aArgs, 'column')
    }

    // Find the section containing the generated position we're trying to map
    // to an original position.
    var sectionIndex = binarySearch.search(
      needle,
      this._sections,
      function (needle, section) {
        var cmp = needle.generatedLine - section.generatedOffset.generatedLine
        if (cmp) {
          return cmp
        }

        return needle.generatedColumn - section.generatedOffset.generatedColumn
      }
    )
    var section = this._sections[sectionIndex]

    if (!section) {
      return {
        source: null,
        line: null,
        column: null,
        name: null
      }
    }

    return section.consumer.originalPositionFor({
      line: needle.generatedLine - (section.generatedOffset.generatedLine - 1),
      column:
        needle.generatedColumn -
        (section.generatedOffset.generatedLine === needle.generatedLine
          ? section.generatedOffset.generatedColumn - 1
          : 0),
      bias: aArgs.bias
    })
  }

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
    return this._sections.every(function (s) {
      return s.consumer.hasContentsOfAllSources()
    })
  }

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
IndexedSourceMapConsumer.prototype.sourceContentFor =
  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i]

      var content = section.consumer.sourceContentFor(aSource, true)
      if (content) {
        return content
      }
    }
    if (nullOnMissing) {
      return null
    } else {
      throw new Error('"' + aSource + '" is not in the SourceMap.')
    }
  }

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number
 *     is 1-based.
 *   - column: The column number in the original source.  The column
 *     number is 0-based.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the generated source, or null.
 *     The column number is 0-based.
 */
IndexedSourceMapConsumer.prototype.generatedPositionFor =
  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i]

      // Only consider this section if the requested source is in the list of
      // sources of the consumer.
      if (
        section.consumer._findSourceIndex(util$1.getArg(aArgs, 'source')) === -1
      ) {
        continue
      }
      var generatedPosition = section.consumer.generatedPositionFor(aArgs)
      if (generatedPosition) {
        var ret = {
          line:
            generatedPosition.line +
            (section.generatedOffset.generatedLine - 1),
          column:
            generatedPosition.column +
            (section.generatedOffset.generatedLine === generatedPosition.line
              ? section.generatedOffset.generatedColumn - 1
              : 0)
        }
        return ret
      }
    }

    return {
      line: null,
      column: null
    }
  }

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
IndexedSourceMapConsumer.prototype._parseMappings =
  function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    this.__generatedMappings = []
    this.__originalMappings = []
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i]
      var sectionMappings = section.consumer._generatedMappings
      for (var j = 0; j < sectionMappings.length; j++) {
        var mapping = sectionMappings[j]

        var source = section.consumer._sources.at(mapping.source)
        source = util$1.computeSourceURL(
          section.consumer.sourceRoot,
          source,
          this._sourceMapURL
        )
        this._sources.add(source)
        source = this._sources.indexOf(source)

        var name = null
        if (mapping.name) {
          name = section.consumer._names.at(mapping.name)
          this._names.add(name)
          name = this._names.indexOf(name)
        }

        // The mappings coming from the consumer for the section have
        // generated positions relative to the start of the section, so we
        // need to offset them to be relative to the start of the concatenated
        // generated file.
        var adjustedMapping = {
          source: source,
          generatedLine:
            mapping.generatedLine + (section.generatedOffset.generatedLine - 1),
          generatedColumn:
            mapping.generatedColumn +
            (section.generatedOffset.generatedLine === mapping.generatedLine
              ? section.generatedOffset.generatedColumn - 1
              : 0),
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name: name
        }

        this.__generatedMappings.push(adjustedMapping)
        if (typeof adjustedMapping.originalLine === 'number') {
          this.__originalMappings.push(adjustedMapping)
        }
      }
    }

    quickSort(
      this.__generatedMappings,
      util$1.compareByGeneratedPositionsDeflated
    )
    quickSort(this.__originalMappings, util$1.compareByOriginalPositions)
  }

sourceMapConsumer.IndexedSourceMapConsumer = IndexedSourceMapConsumer

var sourceNode = {}

/* -*- Mode: js; js-indent-level: 2; -*- */

/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var SourceMapGenerator$3 = sourceMapGenerator.SourceMapGenerator
var util = util$5

// Matches a Windows-style `\r\n` newline or a `\n` newline used by all other
// operating systems these days (capturing the result).
var REGEX_NEWLINE = /(\r?\n)/

// Newline character code for charCodeAt() comparisons
var NEWLINE_CODE = 10

// Private symbol for identifying `SourceNode`s when multiple versions of
// the source-map library are loaded. This MUST NOT CHANGE across
// versions!
var isSourceNode = '$$$isSourceNode$$$'

/**
 * SourceNodes provide a way to abstract over interpolating/concatenating
 * snippets of generated JavaScript source code while maintaining the line and
 * column information associated with the original source code.
 *
 * @param aLine The original line number.
 * @param aColumn The original column number.
 * @param aSource The original source's filename.
 * @param aChunks Optional. An array of strings which are snippets of
 *        generated JS, or other SourceNodes.
 * @param aName The original identifier.
 */
function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
  this.children = []
  this.sourceContents = {}
  this.line = aLine == null ? null : aLine
  this.column = aColumn == null ? null : aColumn
  this.source = aSource == null ? null : aSource
  this.name = aName == null ? null : aName
  this[isSourceNode] = true
  if (aChunks != null) this.add(aChunks)
}

/**
 * Creates a SourceNode from generated code and a SourceMapConsumer.
 *
 * @param aGeneratedCode The generated code
 * @param aSourceMapConsumer The SourceMap for the generated code
 * @param aRelativePath Optional. The path that relative sources in the
 *        SourceMapConsumer should be relative to.
 */
SourceNode.fromStringWithSourceMap =
  function SourceNode_fromStringWithSourceMap(
    aGeneratedCode,
    aSourceMapConsumer,
    aRelativePath
  ) {
    // The SourceNode we want to fill with the generated code
    // and the SourceMap
    var node = new SourceNode()

    // All even indices of this array are one line of the generated code,
    // while all odd indices are the newlines between two adjacent lines
    // (since `REGEX_NEWLINE` captures its match).
    // Processed fragments are accessed by calling `shiftNextLine`.
    var remainingLines = aGeneratedCode.split(REGEX_NEWLINE)
    var remainingLinesIndex = 0
    var shiftNextLine = function () {
      var lineContents = getNextLine()
      // The last line of a file might not have a newline.
      var newLine = getNextLine() || ''
      return lineContents + newLine

      function getNextLine() {
        return remainingLinesIndex < remainingLines.length
          ? remainingLines[remainingLinesIndex++]
          : undefined
      }
    }

    // We need to remember the position of "remainingLines"
    var lastGeneratedLine = 1,
      lastGeneratedColumn = 0

    // The generate SourceNodes we need a code range.
    // To extract it current and last mapping is used.
    // Here we store the last mapping.
    var lastMapping = null

    aSourceMapConsumer.eachMapping(function (mapping) {
      if (lastMapping !== null) {
        // We add the code from "lastMapping" to "mapping":
        // First check if there is a new line in between.
        if (lastGeneratedLine < mapping.generatedLine) {
          // Associate first line with "lastMapping"
          addMappingWithCode(lastMapping, shiftNextLine())
          lastGeneratedLine++
          lastGeneratedColumn = 0
          // The remaining code is added without mapping
        } else {
          // There is no new line in between.
          // Associate the code between "lastGeneratedColumn" and
          // "mapping.generatedColumn" with "lastMapping"
          var nextLine = remainingLines[remainingLinesIndex] || ''
          var code = nextLine.substr(
            0,
            mapping.generatedColumn - lastGeneratedColumn
          )
          remainingLines[remainingLinesIndex] = nextLine.substr(
            mapping.generatedColumn - lastGeneratedColumn
          )
          lastGeneratedColumn = mapping.generatedColumn
          addMappingWithCode(lastMapping, code)
          // No more remaining code, continue
          lastMapping = mapping
          return
        }
      }
      // We add the generated code until the first mapping
      // to the SourceNode without any mapping.
      // Each line is added as separate string.
      while (lastGeneratedLine < mapping.generatedLine) {
        node.add(shiftNextLine())
        lastGeneratedLine++
      }
      if (lastGeneratedColumn < mapping.generatedColumn) {
        var nextLine = remainingLines[remainingLinesIndex] || ''
        node.add(nextLine.substr(0, mapping.generatedColumn))
        remainingLines[remainingLinesIndex] = nextLine.substr(
          mapping.generatedColumn
        )
        lastGeneratedColumn = mapping.generatedColumn
      }
      lastMapping = mapping
    }, this)
    // We have processed all mappings.
    if (remainingLinesIndex < remainingLines.length) {
      if (lastMapping) {
        // Associate the remaining code in the current line with "lastMapping"
        addMappingWithCode(lastMapping, shiftNextLine())
      }
      // and add the remaining lines without any mapping
      node.add(remainingLines.splice(remainingLinesIndex).join(''))
    }

    // Copy sourcesContent into SourceNode
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile)
      if (content != null) {
        if (aRelativePath != null) {
          sourceFile = util.join(aRelativePath, sourceFile)
        }
        node.setSourceContent(sourceFile, content)
      }
    })

    return node

    function addMappingWithCode(mapping, code) {
      if (mapping === null || mapping.source === undefined) {
        node.add(code)
      } else {
        var source = aRelativePath
          ? util.join(aRelativePath, mapping.source)
          : mapping.source
        node.add(
          new SourceNode(
            mapping.originalLine,
            mapping.originalColumn,
            source,
            code,
            mapping.name
          )
        )
      }
    }
  }

/**
 * Add a chunk of generated JS to this source node.
 *
 * @param aChunk A string snippet of generated JS code, another instance of
 *        SourceNode, or an array where each member is one of those things.
 */
SourceNode.prototype.add = function SourceNode_add(aChunk) {
  if (Array.isArray(aChunk)) {
    aChunk.forEach(function (chunk) {
      this.add(chunk)
    }, this)
  } else if (aChunk[isSourceNode] || typeof aChunk === 'string') {
    if (aChunk) {
      this.children.push(aChunk)
    }
  } else {
    throw new TypeError(
      'Expected a SourceNode, string, or an array of SourceNodes and strings. Got ' +
        aChunk
    )
  }
  return this
}

/**
 * Add a chunk of generated JS to the beginning of this source node.
 *
 * @param aChunk A string snippet of generated JS code, another instance of
 *        SourceNode, or an array where each member is one of those things.
 */
SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
  if (Array.isArray(aChunk)) {
    for (var i = aChunk.length - 1; i >= 0; i--) {
      this.prepend(aChunk[i])
    }
  } else if (aChunk[isSourceNode] || typeof aChunk === 'string') {
    this.children.unshift(aChunk)
  } else {
    throw new TypeError(
      'Expected a SourceNode, string, or an array of SourceNodes and strings. Got ' +
        aChunk
    )
  }
  return this
}

/**
 * Walk over the tree of JS snippets in this node and its children. The
 * walking function is called once for each snippet of JS and is passed that
 * snippet and the its original associated source's line/column location.
 *
 * @param aFn The traversal function.
 */
SourceNode.prototype.walk = function SourceNode_walk(aFn) {
  var chunk
  for (var i = 0, len = this.children.length; i < len; i++) {
    chunk = this.children[i]
    if (chunk[isSourceNode]) {
      chunk.walk(aFn)
    } else {
      if (chunk !== '') {
        aFn(chunk, {
          source: this.source,
          line: this.line,
          column: this.column,
          name: this.name
        })
      }
    }
  }
}

/**
 * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
 * each of `this.children`.
 *
 * @param aSep The separator.
 */
SourceNode.prototype.join = function SourceNode_join(aSep) {
  var newChildren
  var i
  var len = this.children.length
  if (len > 0) {
    newChildren = []
    for (i = 0; i < len - 1; i++) {
      newChildren.push(this.children[i])
      newChildren.push(aSep)
    }
    newChildren.push(this.children[i])
    this.children = newChildren
  }
  return this
}

/**
 * Call String.prototype.replace on the very right-most source snippet. Useful
 * for trimming whitespace from the end of a source node, etc.
 *
 * @param aPattern The pattern to replace.
 * @param aReplacement The thing to replace the pattern with.
 */
SourceNode.prototype.replaceRight = function SourceNode_replaceRight(
  aPattern,
  aReplacement
) {
  var lastChild = this.children[this.children.length - 1]
  if (lastChild[isSourceNode]) {
    lastChild.replaceRight(aPattern, aReplacement)
  } else if (typeof lastChild === 'string') {
    this.children[this.children.length - 1] = lastChild.replace(
      aPattern,
      aReplacement
    )
  } else {
    this.children.push(''.replace(aPattern, aReplacement))
  }
  return this
}

/**
 * Set the source content for a source file. This will be added to the SourceMapGenerator
 * in the sourcesContent field.
 *
 * @param aSourceFile The filename of the source file
 * @param aSourceContent The content of the source file
 */
SourceNode.prototype.setSourceContent = function SourceNode_setSourceContent(
  aSourceFile,
  aSourceContent
) {
  this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent
}

/**
 * Walk over the tree of SourceNodes. The walking function is called for each
 * source file content and is passed the filename and source content.
 *
 * @param aFn The traversal function.
 */
SourceNode.prototype.walkSourceContents =
  function SourceNode_walkSourceContents(aFn) {
    for (var i = 0, len = this.children.length; i < len; i++) {
      if (this.children[i][isSourceNode]) {
        this.children[i].walkSourceContents(aFn)
      }
    }

    var sources = Object.keys(this.sourceContents)
    for (var i = 0, len = sources.length; i < len; i++) {
      aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]])
    }
  }

/**
 * Return the string representation of this source node. Walks over the tree
 * and concatenates all the various snippets together to one string.
 */
SourceNode.prototype.toString = function SourceNode_toString() {
  var str = ''
  this.walk(function (chunk) {
    str += chunk
  })
  return str
}

/**
 * Returns the string representation of this source node along with a source
 * map.
 */
SourceNode.prototype.toStringWithSourceMap =
  function SourceNode_toStringWithSourceMap(aArgs) {
    var generated = {
      code: '',
      line: 1,
      column: 0
    }
    var map = new SourceMapGenerator$3(aArgs)
    var sourceMappingActive = false
    var lastOriginalSource = null
    var lastOriginalLine = null
    var lastOriginalColumn = null
    var lastOriginalName = null
    this.walk(function (chunk, original) {
      generated.code += chunk
      if (
        original.source !== null &&
        original.line !== null &&
        original.column !== null
      ) {
        if (
          lastOriginalSource !== original.source ||
          lastOriginalLine !== original.line ||
          lastOriginalColumn !== original.column ||
          lastOriginalName !== original.name
        ) {
          map.addMapping({
            source: original.source,
            original: {
              line: original.line,
              column: original.column
            },
            generated: {
              line: generated.line,
              column: generated.column
            },
            name: original.name
          })
        }
        lastOriginalSource = original.source
        lastOriginalLine = original.line
        lastOriginalColumn = original.column
        lastOriginalName = original.name
        sourceMappingActive = true
      } else if (sourceMappingActive) {
        map.addMapping({
          generated: {
            line: generated.line,
            column: generated.column
          }
        })
        lastOriginalSource = null
        sourceMappingActive = false
      }
      for (var idx = 0, length = chunk.length; idx < length; idx++) {
        if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
          generated.line++
          generated.column = 0
          // Mappings end at eol
          if (idx + 1 === length) {
            lastOriginalSource = null
            sourceMappingActive = false
          } else if (sourceMappingActive) {
            map.addMapping({
              source: original.source,
              original: {
                line: original.line,
                column: original.column
              },
              generated: {
                line: generated.line,
                column: generated.column
              },
              name: original.name
            })
          }
        } else {
          generated.column++
        }
      }
    })
    this.walkSourceContents(function (sourceFile, sourceContent) {
      map.setSourceContent(sourceFile, sourceContent)
    })

    return { code: generated.code, map: map }
  }

sourceNode.SourceNode = SourceNode

/*
 * Copyright 2009-2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE.txt or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

sourceMap.SourceMapGenerator = sourceMapGenerator.SourceMapGenerator
sourceMap.SourceMapConsumer = sourceMapConsumer.SourceMapConsumer
sourceMap.SourceNode = sourceNode.SourceNode

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i]
    if (last === '.') {
      parts.splice(i, 1)
    } else if (last === '..') {
      parts.splice(i, 1)
      up++
    } else if (up) {
      parts.splice(i, 1)
      up--
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..')
    }
  }

  return parts
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
  /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/
var splitPath = function (filename) {
  return splitPathRe.exec(filename).slice(1)
}

// path.resolve([from ...], to)
// posix version
function resolve$2() {
  var resolvedPath = '',
    resolvedAbsolute = false

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = i >= 0 ? arguments[i] : '/'

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings')
    } else if (!path) {
      continue
    }

    resolvedPath = path + '/' + resolvedPath
    resolvedAbsolute = path.charAt(0) === '/'
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(
    filter(resolvedPath.split('/'), function (p) {
      return !!p
    }),
    !resolvedAbsolute
  ).join('/')

  return (resolvedAbsolute ? '/' : '') + resolvedPath || '.'
}
// path.normalize(path)
// posix version
function normalize(path) {
  var isPathAbsolute = isAbsolute$1(path),
    trailingSlash = substr(path, -1) === '/'

  // Normalize the path
  path = normalizeArray(
    filter(path.split('/'), function (p) {
      return !!p
    }),
    !isPathAbsolute
  ).join('/')

  if (!path && !isPathAbsolute) {
    path = '.'
  }
  if (path && trailingSlash) {
    path += '/'
  }

  return (isPathAbsolute ? '/' : '') + path
}
// posix version
function isAbsolute$1(path) {
  return path.charAt(0) === '/'
}

// posix version
function join$1() {
  var paths = Array.prototype.slice.call(arguments, 0)
  return normalize(
    filter(paths, function (p, index) {
      if (typeof p !== 'string') {
        throw new TypeError('Arguments to path.join must be strings')
      }
      return p
    }).join('/')
  )
}

// path.relative(from, to)
// posix version
function relative$1(from, to) {
  from = resolve$2(from).substr(1)
  to = resolve$2(to).substr(1)

  function trim(arr) {
    var start = 0
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break
    }

    var end = arr.length - 1
    for (; end >= 0; end--) {
      if (arr[end] !== '') break
    }

    if (start > end) return []
    return arr.slice(start, end - start + 1)
  }

  var fromParts = trim(from.split('/'))
  var toParts = trim(to.split('/'))

  var length = Math.min(fromParts.length, toParts.length)
  var samePartsLength = length
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i
      break
    }
  }

  var outputParts = []
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..')
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength))

  return outputParts.join('/')
}

var sep$1 = '/'
var delimiter$1 = ':'

function dirname$2(path) {
  var result = splitPath(path),
    root = result[0],
    dir = result[1]

  if (!root && !dir) {
    // No dirname whatsoever
    return '.'
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1)
  }

  return root + dir
}

function basename(path, ext) {
  var f = splitPath(path)[2]
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length)
  }
  return f
}

function extname(path) {
  return splitPath(path)[3]
}
var path = {
  extname: extname,
  basename: basename,
  dirname: dirname$2,
  sep: sep$1,
  delimiter: delimiter$1,
  relative: relative$1,
  join: join$1,
  isAbsolute: isAbsolute$1,
  normalize: normalize,
  resolve: resolve$2
}
function filter(xs, f) {
  if (xs.filter) return xs.filter(f)
  var res = []
  for (var i = 0; i < xs.length; i++) {
    if (f(xs[i], i, xs)) res.push(xs[i])
  }
  return res
}

// String.prototype.substr - negative index don't work in IE8
var substr =
  'ab'.substr(-1) === 'b'
    ? function (str, start, len) {
        return str.substr(start, len)
      }
    : function (str, start, len) {
        if (start < 0) start = str.length + start
        return str.substr(start, len)
      }
var path$1 = /*#__PURE__*/ Object.freeze({
  __proto__: null,
  resolve: resolve$2,
  normalize: normalize,
  isAbsolute: isAbsolute$1,
  join: join$1,
  relative: relative$1,
  sep: sep$1,
  delimiter: delimiter$1,
  dirname: dirname$2,
  basename: basename,
  extname: extname,
  default: path
})

var require$$2 = /*@__PURE__*/ getAugmentedNamespace(path$1)

/*! https://mths.be/punycode v1.4.1 by @mathias */

/** Highest positive signed 32-bit float value */
var maxInt = 2147483647 // aka. 0x7FFFFFFF or 2^31-1

/** Bootstring parameters */
var base = 36
var tMin = 1
var tMax = 26
var skew = 38
var damp = 700
var initialBias = 72
var initialN = 128 // 0x80
var delimiter = '-' // '\x2D'
var regexNonASCII = /[^\x20-\x7E]/ // unprintable ASCII chars + non-ASCII chars
var regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g // RFC 3490 separators

/** Error messages */
var errors = {
  'overflow': 'Overflow: input needs wider integers to process',
  'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
  'invalid-input': 'Invalid input'
}

/** Convenience shortcuts */
var baseMinusTMin = base - tMin
var floor = Math.floor
var stringFromCharCode = String.fromCharCode

/*--------------------------------------------------------------------------*/

/**
 * A generic error utility function.
 * @private
 * @param {String} type The error type.
 * @returns {Error} Throws a `RangeError` with the applicable error message.
 */
function error(type) {
  throw new RangeError(errors[type])
}

/**
 * A generic `Array#map` utility function.
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} callback The function that gets called for every array
 * item.
 * @returns {Array} A new array of values returned by the callback function.
 */
function map$1(array, fn) {
  var length = array.length
  var result = []
  while (length--) {
    result[length] = fn(array[length])
  }
  return result
}

/**
 * A simple `Array#map`-like wrapper to work with domain name strings or email
 * addresses.
 * @private
 * @param {String} domain The domain name or email address.
 * @param {Function} callback The function that gets called for every
 * character.
 * @returns {Array} A new string of characters returned by the callback
 * function.
 */
function mapDomain(string, fn) {
  var parts = string.split('@')
  var result = ''
  if (parts.length > 1) {
    // In email addresses, only the domain name should be punycoded. Leave
    // the local part (i.e. everything up to `@`) intact.
    result = parts[0] + '@'
    string = parts[1]
  }
  // Avoid `split(regex)` for IE8 compatibility. See #17.
  string = string.replace(regexSeparators, '\x2E')
  var labels = string.split('.')
  var encoded = map$1(labels, fn).join('.')
  return result + encoded
}

/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 * @see `punycode.ucs2.encode`
 * @see <https://mathiasbynens.be/notes/javascript-encoding>
 * @memberOf punycode.ucs2
 * @name decode
 * @param {String} string The Unicode input string (UCS-2).
 * @returns {Array} The new array of code points.
 */
function ucs2decode(string) {
  var output = [],
    counter = 0,
    length = string.length,
    value,
    extra
  while (counter < length) {
    value = string.charCodeAt(counter++)
    if (value >= 0xd800 && value <= 0xdbff && counter < length) {
      // high surrogate, and there is a next character
      extra = string.charCodeAt(counter++)
      if ((extra & 0xfc00) == 0xdc00) {
        // low surrogate
        output.push(((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000)
      } else {
        // unmatched surrogate; only append this code unit, in case the next
        // code unit is the high surrogate of a surrogate pair
        output.push(value)
        counter--
      }
    } else {
      output.push(value)
    }
  }
  return output
}

/**
 * Converts a digit/integer into a basic code point.
 * @see `basicToDigit()`
 * @private
 * @param {Number} digit The numeric value of a basic code point.
 * @returns {Number} The basic code point whose value (when used for
 * representing integers) is `digit`, which needs to be in the range
 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
 * used; else, the lowercase form is used. The behavior is undefined
 * if `flag` is non-zero and `digit` has no uppercase form.
 */
function digitToBasic(digit, flag) {
  //  0..25 map to ASCII a..z or A..Z
  // 26..35 map to ASCII 0..9
  return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5)
}

/**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 * @private
 */
function adapt(delta, numPoints, firstTime) {
  var k = 0
  delta = firstTime ? floor(delta / damp) : delta >> 1
  delta += floor(delta / numPoints)
  for (
    ;
    /* no initialization */ delta > (baseMinusTMin * tMax) >> 1;
    k += base
  ) {
    delta = floor(delta / baseMinusTMin)
  }
  return floor(k + ((baseMinusTMin + 1) * delta) / (delta + skew))
}

/**
 * Converts a string of Unicode symbols (e.g. a domain name label) to a
 * Punycode string of ASCII-only symbols.
 * @memberOf punycode
 * @param {String} input The string of Unicode symbols.
 * @returns {String} The resulting Punycode string of ASCII-only symbols.
 */
function encode(input) {
  var n,
    delta,
    handledCPCount,
    basicLength,
    bias,
    j,
    m,
    q,
    k,
    t,
    currentValue,
    output = [],
    /** `inputLength` will hold the number of code points in `input`. */
    inputLength,
    /** Cached calculation results */
    handledCPCountPlusOne,
    baseMinusT,
    qMinusT

  // Convert the input in UCS-2 to Unicode
  input = ucs2decode(input)

  // Cache the length
  inputLength = input.length

  // Initialize the state
  n = initialN
  delta = 0
  bias = initialBias

  // Handle the basic code points
  for (j = 0; j < inputLength; ++j) {
    currentValue = input[j]
    if (currentValue < 0x80) {
      output.push(stringFromCharCode(currentValue))
    }
  }

  handledCPCount = basicLength = output.length

  // `handledCPCount` is the number of code points that have been handled;
  // `basicLength` is the number of basic code points.

  // Finish the basic string - if it is not empty - with a delimiter
  if (basicLength) {
    output.push(delimiter)
  }

  // Main encoding loop:
  while (handledCPCount < inputLength) {
    // All non-basic code points < n have been handled already. Find the next
    // larger one:
    for (m = maxInt, j = 0; j < inputLength; ++j) {
      currentValue = input[j]
      if (currentValue >= n && currentValue < m) {
        m = currentValue
      }
    }

    // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
    // but guard against overflow
    handledCPCountPlusOne = handledCPCount + 1
    if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
      error('overflow')
    }

    delta += (m - n) * handledCPCountPlusOne
    n = m

    for (j = 0; j < inputLength; ++j) {
      currentValue = input[j]

      if (currentValue < n && ++delta > maxInt) {
        error('overflow')
      }

      if (currentValue == n) {
        // Represent delta as a generalized variable-length integer
        for (q = delta, k = base /* no condition */; ; k += base) {
          t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias
          if (q < t) {
            break
          }
          qMinusT = q - t
          baseMinusT = base - t
          output.push(
            stringFromCharCode(digitToBasic(t + (qMinusT % baseMinusT), 0))
          )
          q = floor(qMinusT / baseMinusT)
        }

        output.push(stringFromCharCode(digitToBasic(q, 0)))
        bias = adapt(
          delta,
          handledCPCountPlusOne,
          handledCPCount == basicLength
        )
        delta = 0
        ++handledCPCount
      }
    }

    ++delta
    ++n
  }
  return output.join('')
}

/**
 * Converts a Unicode string representing a domain name or an email address to
 * Punycode. Only the non-ASCII parts of the domain name will be converted,
 * i.e. it doesn't matter if you call it with a domain that's already in
 * ASCII.
 * @memberOf punycode
 * @param {String} input The domain name or email address to convert, as a
 * Unicode string.
 * @returns {String} The Punycode representation of the given domain name or
 * email address.
 */
function toASCII(input) {
  return mapDomain(input, function (string) {
    return regexNonASCII.test(string) ? 'xn--' + encode(string) : string
  })
}

function isNull(arg) {
  return arg === null
}

function isNullOrUndefined(arg) {
  return arg == null
}

function isString(arg) {
  return typeof arg === 'string'
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null
}

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}
var isArray =
  Array.isArray ||
  function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]'
  }
function stringifyPrimitive(v) {
  switch (typeof v) {
    case 'string':
      return v

    case 'boolean':
      return v ? 'true' : 'false'

    case 'number':
      return isFinite(v) ? v : ''

    default:
      return ''
  }
}

function stringify$2(obj, sep, eq, name) {
  sep = sep || '&'
  eq = eq || '='
  if (obj === null) {
    obj = undefined
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function (k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq
      if (isArray(obj[k])) {
        return map(obj[k], function (v) {
          return ks + encodeURIComponent(stringifyPrimitive(v))
        }).join(sep)
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]))
      }
    }).join(sep)
  }

  if (!name) return ''
  return (
    encodeURIComponent(stringifyPrimitive(name)) +
    eq +
    encodeURIComponent(stringifyPrimitive(obj))
  )
}
function map(xs, f) {
  if (xs.map) return xs.map(f)
  var res = []
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i))
  }
  return res
}

var objectKeys =
  Object.keys ||
  function (obj) {
    var res = []
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key)
    }
    return res
  }

function parse$5(qs, sep, eq, options) {
  sep = sep || '&'
  eq = eq || '='
  var obj = {}

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj
  }

  var regexp = /\+/g
  qs = qs.split(sep)

  var maxKeys = 1000
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys
  }

  var len = qs.length
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
      idx = x.indexOf(eq),
      kstr,
      vstr,
      k,
      v

    if (idx >= 0) {
      kstr = x.substr(0, idx)
      vstr = x.substr(idx + 1)
    } else {
      kstr = x
      vstr = ''
    }

    k = decodeURIComponent(kstr)
    v = decodeURIComponent(vstr)

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v
    } else if (isArray(obj[k])) {
      obj[k].push(v)
    } else {
      obj[k] = [obj[k], v]
    }
  }

  return obj
}

// Copyright Joyent, Inc. and other Node contributors.
var url = {
  parse: urlParse,
  resolve: urlResolve,
  resolveObject: urlResolveObject,
  format: urlFormat,
  Url: Url
}
function Url() {
  this.protocol = null
  this.slashes = null
  this.auth = null
  this.host = null
  this.port = null
  this.hostname = null
  this.hash = null
  this.search = null
  this.query = null
  this.pathname = null
  this.path = null
  this.href = null
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
  portPattern = /:[0-9]*$/,
  // Special case for a simple path URL
  simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,
  // RFC 2396: characters reserved for delimiting URLs.
  // We actually just auto-escape these.
  delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],
  // RFC 2396: characters not allowed for various reasons.
  unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),
  // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
  autoEscape = ["'"].concat(unwise),
  // Characters that are never ever allowed in a hostname.
  // Note that any invalid chars are also handled, but these
  // are the ones that are *expected* to be seen, so we fast-path
  // them.
  nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
  hostEndingChars = ['/', '?', '#'],
  hostnameMaxLen = 255,
  hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
  hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
  // protocols that can allow "unsafe" and "unwise" chars.
  unsafeProtocol = {
    'javascript': true,
    'javascript:': true
  },
  // protocols that never have a hostname.
  hostlessProtocol = {
    'javascript': true,
    'javascript:': true
  },
  // protocols that always contain a // bit.
  slashedProtocol = {
    'http': true,
    'https': true,
    'ftp': true,
    'gopher': true,
    'file': true,
    'http:': true,
    'https:': true,
    'ftp:': true,
    'gopher:': true,
    'file:': true
  }

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && isObject(url) && url instanceof Url) return url

  var u = new Url()
  u.parse(url, parseQueryString, slashesDenoteHost)
  return u
}
Url.prototype.parse = function (url, parseQueryString, slashesDenoteHost) {
  return parse$4(this, url, parseQueryString, slashesDenoteHost)
}

function parse$4(self, url, parseQueryString, slashesDenoteHost) {
  if (!isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url)
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
    splitter = queryIndex !== -1 && queryIndex < url.indexOf('#') ? '?' : '#',
    uSplit = url.split(splitter),
    slashRegex = /\\/g
  uSplit[0] = uSplit[0].replace(slashRegex, '/')
  url = uSplit.join(splitter)

  var rest = url

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim()

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest)
    if (simplePath) {
      self.path = rest
      self.href = rest
      self.pathname = simplePath[1]
      if (simplePath[2]) {
        self.search = simplePath[2]
        if (parseQueryString) {
          self.query = parse$5(self.search.substr(1))
        } else {
          self.query = self.search.substr(1)
        }
      } else if (parseQueryString) {
        self.search = ''
        self.query = {}
      }
      return self
    }
  }

  var proto = protocolPattern.exec(rest)
  if (proto) {
    proto = proto[0]
    var lowerProto = proto.toLowerCase()
    self.protocol = lowerProto
    rest = rest.substr(proto.length)
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//'
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2)
      self.slashes = true
    }
  }
  var i, hec, l, p
  if (
    !hostlessProtocol[proto] &&
    (slashes || (proto && !slashedProtocol[proto]))
  ) {
    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1
    for (i = 0; i < hostEndingChars.length; i++) {
      hec = rest.indexOf(hostEndingChars[i])
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@')
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd)
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign)
      rest = rest.slice(atSign + 1)
      self.auth = decodeURIComponent(auth)
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1
    for (i = 0; i < nonHostChars.length; i++) {
      hec = rest.indexOf(nonHostChars[i])
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1) hostEnd = rest.length

    self.host = rest.slice(0, hostEnd)
    rest = rest.slice(hostEnd)

    // pull out port.
    parseHost(self)

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    self.hostname = self.hostname || ''

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname =
      self.hostname[0] === '[' &&
      self.hostname[self.hostname.length - 1] === ']'

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = self.hostname.split(/\./)
      for (i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i]
        if (!part) continue
        if (!part.match(hostnamePartPattern)) {
          var newpart = ''
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x'
            } else {
              newpart += part[j]
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i)
            var notHost = hostparts.slice(i + 1)
            var bit = part.match(hostnamePartStart)
            if (bit) {
              validParts.push(bit[1])
              notHost.unshift(bit[2])
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest
            }
            self.hostname = validParts.join('.')
            break
          }
        }
      }
    }

    if (self.hostname.length > hostnameMaxLen) {
      self.hostname = ''
    } else {
      // hostnames are always lower case.
      self.hostname = self.hostname.toLowerCase()
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      self.hostname = toASCII(self.hostname)
    }

    p = self.port ? ':' + self.port : ''
    var h = self.hostname || ''
    self.host = h + p
    self.href += self.host

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      self.hostname = self.hostname.substr(1, self.hostname.length - 2)
      if (rest[0] !== '/') {
        rest = '/' + rest
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {
    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i]
      if (rest.indexOf(ae) === -1) continue
      var esc = encodeURIComponent(ae)
      if (esc === ae) {
        esc = escape(ae)
      }
      rest = rest.split(ae).join(esc)
    }
  }

  // chop off from the tail first.
  var hash = rest.indexOf('#')
  if (hash !== -1) {
    // got a fragment string.
    self.hash = rest.substr(hash)
    rest = rest.slice(0, hash)
  }
  var qm = rest.indexOf('?')
  if (qm !== -1) {
    self.search = rest.substr(qm)
    self.query = rest.substr(qm + 1)
    if (parseQueryString) {
      self.query = parse$5(self.query)
    }
    rest = rest.slice(0, qm)
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    self.search = ''
    self.query = {}
  }
  if (rest) self.pathname = rest
  if (slashedProtocol[lowerProto] && self.hostname && !self.pathname) {
    self.pathname = '/'
  }

  //to support http.request
  if (self.pathname || self.search) {
    p = self.pathname || ''
    var s = self.search || ''
    self.path = p + s
  }

  // finally, reconstruct the href based on what has been validated.
  self.href = format(self)
  return self
}

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (isString(obj)) obj = parse$4({}, obj)
  return format(obj)
}

function format(self) {
  var auth = self.auth || ''
  if (auth) {
    auth = encodeURIComponent(auth)
    auth = auth.replace(/%3A/i, ':')
    auth += '@'
  }

  var protocol = self.protocol || '',
    pathname = self.pathname || '',
    hash = self.hash || '',
    host = false,
    query = ''

  if (self.host) {
    host = auth + self.host
  } else if (self.hostname) {
    host =
      auth +
      (self.hostname.indexOf(':') === -1
        ? self.hostname
        : '[' + this.hostname + ']')
    if (self.port) {
      host += ':' + self.port
    }
  }

  if (self.query && isObject(self.query) && Object.keys(self.query).length) {
    query = stringify$2(self.query)
  }

  var search = self.search || (query && '?' + query) || ''

  if (protocol && protocol.substr(-1) !== ':') protocol += ':'

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (
    self.slashes ||
    ((!protocol || slashedProtocol[protocol]) && host !== false)
  ) {
    host = '//' + (host || '')
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname
  } else if (!host) {
    host = ''
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash
  if (search && search.charAt(0) !== '?') search = '?' + search

  pathname = pathname.replace(/[?#]/g, function (match) {
    return encodeURIComponent(match)
  })
  search = search.replace('#', '%23')

  return protocol + host + pathname + search + hash
}

Url.prototype.format = function () {
  return format(this)
}

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative)
}

Url.prototype.resolve = function (relative) {
  return this.resolveObject(urlParse(relative, false, true)).format()
}

function urlResolveObject(source, relative) {
  if (!source) return relative
  return urlParse(source, false, true).resolveObject(relative)
}

Url.prototype.resolveObject = function (relative) {
  if (isString(relative)) {
    var rel = new Url()
    rel.parse(relative, false, true)
    relative = rel
  }

  var result = new Url()
  var tkeys = Object.keys(this)
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk]
    result[tkey] = this[tkey]
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format()
    return result
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative)
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk]
      if (rkey !== 'protocol') result[rkey] = relative[rkey]
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (
      slashedProtocol[result.protocol] &&
      result.hostname &&
      !result.pathname
    ) {
      result.path = result.pathname = '/'
    }

    result.href = result.format()
    return result
  }
  var relPath
  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative)
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v]
        result[k] = relative[k]
      }
      result.href = result.format()
      return result
    }

    result.protocol = relative.protocol
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      relPath = (relative.pathname || '').split('/')
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = ''
      if (!relative.hostname) relative.hostname = ''
      if (relPath[0] !== '') relPath.unshift('')
      if (relPath.length < 2) relPath.unshift('')
      result.pathname = relPath.join('/')
    } else {
      result.pathname = relative.pathname
    }
    result.search = relative.search
    result.query = relative.query
    result.host = relative.host || ''
    result.auth = relative.auth
    result.hostname = relative.hostname || relative.host
    result.port = relative.port
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || ''
      var s = result.search || ''
      result.path = p + s
    }
    result.slashes = result.slashes || relative.slashes
    result.href = result.format()
    return result
  }

  var isSourceAbs = result.pathname && result.pathname.charAt(0) === '/',
    isRelAbs =
      relative.host ||
      (relative.pathname && relative.pathname.charAt(0) === '/'),
    mustEndAbs = isRelAbs || isSourceAbs || (result.host && relative.pathname),
    removeAllDots = mustEndAbs,
    srcPath = (result.pathname && result.pathname.split('/')) || [],
    psychotic = result.protocol && !slashedProtocol[result.protocol]
  relPath = (relative.pathname && relative.pathname.split('/')) || []
  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = ''
    result.port = null
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host
      else srcPath.unshift(result.host)
    }
    result.host = ''
    if (relative.protocol) {
      relative.hostname = null
      relative.port = null
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host
        else relPath.unshift(relative.host)
      }
      relative.host = null
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '')
  }
  var authInHost
  if (isRelAbs) {
    // it's absolute.
    result.host =
      relative.host || relative.host === '' ? relative.host : result.host
    result.hostname =
      relative.hostname || relative.hostname === ''
        ? relative.hostname
        : result.hostname
    result.search = relative.search
    result.query = relative.query
    srcPath = relPath
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = []
    srcPath.pop()
    srcPath = srcPath.concat(relPath)
    result.search = relative.search
    result.query = relative.query
  } else if (!isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift()
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      authInHost =
        result.host && result.host.indexOf('@') > 0
          ? result.host.split('@')
          : false
      if (authInHost) {
        result.auth = authInHost.shift()
        result.host = result.hostname = authInHost.shift()
      }
    }
    result.search = relative.search
    result.query = relative.query
    //to support http.request
    if (!isNull(result.pathname) || !isNull(result.search)) {
      result.path =
        (result.pathname ? result.pathname : '') +
        (result.search ? result.search : '')
    }
    result.href = result.format()
    return result
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search
    } else {
      result.path = null
    }
    result.href = result.format()
    return result
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0]
  var hasTrailingSlash =
    ((result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..')) ||
    last === ''

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i]
    if (last === '.') {
      srcPath.splice(i, 1)
    } else if (last === '..') {
      srcPath.splice(i, 1)
      up++
    } else if (up) {
      srcPath.splice(i, 1)
      up--
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..')
    }
  }

  if (
    mustEndAbs &&
    srcPath[0] !== '' &&
    (!srcPath[0] || srcPath[0].charAt(0) !== '/')
  ) {
    srcPath.unshift('')
  }

  if (hasTrailingSlash && srcPath.join('/').substr(-1) !== '/') {
    srcPath.push('')
  }

  var isAbsolute =
    srcPath[0] === '' || (srcPath[0] && srcPath[0].charAt(0) === '/')

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute
      ? ''
      : srcPath.length
      ? srcPath.shift()
      : ''
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    authInHost =
      result.host && result.host.indexOf('@') > 0
        ? result.host.split('@')
        : false
    if (authInHost) {
      result.auth = authInHost.shift()
      result.host = result.hostname = authInHost.shift()
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length)

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('')
  }

  if (!srcPath.length) {
    result.pathname = null
    result.path = null
  } else {
    result.pathname = srcPath.join('/')
  }

  //to support request.http
  if (!isNull(result.pathname) || !isNull(result.search)) {
    result.path =
      (result.pathname ? result.pathname : '') +
      (result.search ? result.search : '')
  }
  result.auth = relative.auth || result.auth
  result.slashes = result.slashes || relative.slashes
  result.href = result.format()
  return result
}

Url.prototype.parseHost = function () {
  return parseHost(this)
}

function parseHost(self) {
  var host = self.host
  var port = portPattern.exec(host)
  if (port) {
    port = port[0]
    if (port !== ':') {
      self.port = port.substr(1)
    }
    host = host.substr(0, host.length - port.length)
  }
  if (host) self.hostname = host
}

var url$1 = /*#__PURE__*/ Object.freeze({
  __proto__: null,
  parse: urlParse,
  resolve: urlResolve,
  resolveObject: urlResolveObject,
  format: urlFormat,
  default: url,
  Url: Url
})

var require$$1$1 = /*@__PURE__*/ getAugmentedNamespace(url$1)

let {
  SourceMapConsumer: SourceMapConsumer$2,
  SourceMapGenerator: SourceMapGenerator$2
} = sourceMap
let { dirname: dirname$1, resolve: resolve$1, relative, sep } = require$$2
let { pathToFileURL: pathToFileURL$1 } = require$$1$1

let sourceMapAvailable$1 = Boolean(SourceMapConsumer$2 && SourceMapGenerator$2)
let pathAvailable$1 = Boolean(dirname$1 && resolve$1 && relative && sep)

class MapGenerator$1 {
  constructor(stringify, root, opts) {
    this.stringify = stringify
    this.mapOpts = opts.map || {}
    this.root = root
    this.opts = opts
  }

  isMap() {
    if (typeof this.opts.map !== 'undefined') {
      return !!this.opts.map
    }
    return this.previous().length > 0
  }

  previous() {
    if (!this.previousMaps) {
      this.previousMaps = []
      this.root.walk(node => {
        if (node.source && node.source.input.map) {
          let map = node.source.input.map
          if (!this.previousMaps.includes(map)) {
            this.previousMaps.push(map)
          }
        }
      })
    }

    return this.previousMaps
  }

  isInline() {
    if (typeof this.mapOpts.inline !== 'undefined') {
      return this.mapOpts.inline
    }

    let annotation = this.mapOpts.annotation
    if (typeof annotation !== 'undefined' && annotation !== true) {
      return false
    }

    if (this.previous().length) {
      return this.previous().some(i => i.inline)
    }
    return true
  }

  isSourcesContent() {
    if (typeof this.mapOpts.sourcesContent !== 'undefined') {
      return this.mapOpts.sourcesContent
    }
    if (this.previous().length) {
      return this.previous().some(i => i.withContent())
    }
    return true
  }

  clearAnnotation() {
    if (this.mapOpts.annotation === false) return

    let node
    for (let i = this.root.nodes.length - 1; i >= 0; i--) {
      node = this.root.nodes[i]
      if (node.type !== 'comment') continue
      if (node.text.indexOf('# sourceMappingURL=') === 0) {
        this.root.removeChild(i)
      }
    }
  }

  setSourcesContent() {
    let already = {}
    this.root.walk(node => {
      if (node.source) {
        let from = node.source.input.from
        if (from && !already[from]) {
          already[from] = true
          this.map.setSourceContent(
            this.toUrl(this.path(from)),
            node.source.input.css
          )
        }
      }
    })
  }

  applyPrevMaps() {
    for (let prev of this.previous()) {
      let from = this.toUrl(this.path(prev.file))
      let root = prev.root || dirname$1(prev.file)
      let map

      if (this.mapOpts.sourcesContent === false) {
        map = new SourceMapConsumer$2(prev.text)
        if (map.sourcesContent) {
          map.sourcesContent = map.sourcesContent.map(() => null)
        }
      } else {
        map = prev.consumer()
      }

      this.map.applySourceMap(map, from, this.toUrl(this.path(root)))
    }
  }

  isAnnotation() {
    if (this.isInline()) {
      return true
    }
    if (typeof this.mapOpts.annotation !== 'undefined') {
      return this.mapOpts.annotation
    }
    if (this.previous().length) {
      return this.previous().some(i => i.annotation)
    }
    return true
  }

  toBase64(str) {
    if (Buffer) {
      return Buffer.from(str).toString('base64')
    } else {
      // istanbul ignore next
      return window.btoa(unescape(encodeURIComponent(str)))
    }
  }

  addAnnotation() {
    let content

    if (this.isInline()) {
      content =
        'data:application/json;base64,' + this.toBase64(this.map.toString())
    } else if (typeof this.mapOpts.annotation === 'string') {
      content = this.mapOpts.annotation
    } else if (typeof this.mapOpts.annotation === 'function') {
      content = this.mapOpts.annotation(this.opts.to, this.root)
    } else {
      content = this.outputFile() + '.map'
    }

    let eol = '\n'
    if (this.css.includes('\r\n')) eol = '\r\n'

    this.css += eol + '/*# sourceMappingURL=' + content + ' */'
  }

  outputFile() {
    if (this.opts.to) {
      return this.path(this.opts.to)
    }
    if (this.opts.from) {
      return this.path(this.opts.from)
    }
    return 'to.css'
  }

  generateMap() {
    this.generateString()
    if (this.isSourcesContent()) this.setSourcesContent()
    if (this.previous().length > 0) this.applyPrevMaps()
    if (this.isAnnotation()) this.addAnnotation()

    if (this.isInline()) {
      return [this.css]
    }
    return [this.css, this.map]
  }

  path(file) {
    if (file.indexOf('<') === 0) return file
    if (/^\w+:\/\//.test(file)) return file
    if (this.mapOpts.absolute) return file

    let from = this.opts.to ? dirname$1(this.opts.to) : '.'

    if (typeof this.mapOpts.annotation === 'string') {
      from = dirname$1(resolve$1(from, this.mapOpts.annotation))
    }

    file = relative(from, file)
    return file
  }

  toUrl(path) {
    if (sep === '\\') {
      // istanbul ignore next
      path = path.replace(/\\/g, '/')
    }
    return encodeURI(path).replace(/[#?]/g, encodeURIComponent)
  }

  sourcePath(node) {
    if (this.mapOpts.from) {
      return this.toUrl(this.mapOpts.from)
    } else if (this.mapOpts.absolute) {
      if (pathToFileURL$1) {
        return pathToFileURL$1(node.source.input.from).toString()
      } else {
        // istanbul ignore next
        throw new Error(
          '`map.absolute` option is not available in this PostCSS build'
        )
      }
    } else {
      return this.toUrl(this.path(node.source.input.from))
    }
  }

  generateString() {
    this.css = ''
    this.map = new SourceMapGenerator$2({ file: this.outputFile() })

    let line = 1
    let column = 1

    let noSource = '<no source>'
    let mapping = {
      source: '',
      generated: { line: 0, column: 0 },
      original: { line: 0, column: 0 }
    }

    let lines, last
    this.stringify(this.root, (str, node, type) => {
      this.css += str

      if (node && type !== 'end') {
        mapping.generated.line = line
        mapping.generated.column = column - 1
        if (node.source && node.source.start) {
          mapping.source = this.sourcePath(node)
          mapping.original.line = node.source.start.line
          mapping.original.column = node.source.start.column - 1
          this.map.addMapping(mapping)
        } else {
          mapping.source = noSource
          mapping.original.line = 1
          mapping.original.column = 0
          this.map.addMapping(mapping)
        }
      }

      lines = str.match(/\n/g)
      if (lines) {
        line += lines.length
        last = str.lastIndexOf('\n')
        column = str.length - last
      } else {
        column += str.length
      }

      if (node && type !== 'start') {
        let p = node.parent || { raws: {} }
        if (node.type !== 'decl' || node !== p.last || p.raws.semicolon) {
          if (node.source && node.source.end) {
            mapping.source = this.sourcePath(node)
            mapping.original.line = node.source.end.line
            mapping.original.column = node.source.end.column - 1
            mapping.generated.line = line
            mapping.generated.column = column - 2
            this.map.addMapping(mapping)
          } else {
            mapping.source = noSource
            mapping.original.line = 1
            mapping.original.column = 0
            mapping.generated.line = line
            mapping.generated.column = column - 1
            this.map.addMapping(mapping)
          }
        }
      }
    })
  }

  generate() {
    this.clearAnnotation()

    if (pathAvailable$1 && sourceMapAvailable$1 && this.isMap()) {
      return this.generateMap()
    }

    let result = ''
    this.stringify(this.root, i => {
      result += i
    })
    return [result]
  }
}

var mapGenerator = MapGenerator$1

let Node$2 = node_1

class Comment$4 extends Node$2 {
  constructor(defaults) {
    super(defaults)
    this.type = 'comment'
  }
}

var comment = Comment$4
Comment$4.default = Comment$4

let { isClean: isClean$1, my: my$1 } = symbols
let Declaration$3 = declaration
let Comment$3 = comment
let Node$1 = node_1

let parse$3, Rule$4, AtRule$4

function cleanSource(nodes) {
  return nodes.map(i => {
    if (i.nodes) i.nodes = cleanSource(i.nodes)
    delete i.source
    return i
  })
}

function markDirtyUp(node) {
  node[isClean$1] = false
  if (node.proxyOf.nodes) {
    for (let i of node.proxyOf.nodes) {
      markDirtyUp(i)
    }
  }
}

class Container$7 extends Node$1 {
  push(child) {
    child.parent = this
    this.proxyOf.nodes.push(child)
    return this
  }

  each(callback) {
    if (!this.proxyOf.nodes) return undefined
    let iterator = this.getIterator()

    let index, result
    while (this.indexes[iterator] < this.proxyOf.nodes.length) {
      index = this.indexes[iterator]
      result = callback(this.proxyOf.nodes[index], index)
      if (result === false) break

      this.indexes[iterator] += 1
    }

    delete this.indexes[iterator]
    return result
  }

  walk(callback) {
    return this.each((child, i) => {
      let result
      try {
        result = callback(child, i)
      } catch (e) {
        throw child.addToError(e)
      }
      if (result !== false && child.walk) {
        result = child.walk(callback)
      }

      return result
    })
  }

  walkDecls(prop, callback) {
    if (!callback) {
      callback = prop
      return this.walk((child, i) => {
        if (child.type === 'decl') {
          return callback(child, i)
        }
      })
    }
    if (prop instanceof RegExp) {
      return this.walk((child, i) => {
        if (child.type === 'decl' && prop.test(child.prop)) {
          return callback(child, i)
        }
      })
    }
    return this.walk((child, i) => {
      if (child.type === 'decl' && child.prop === prop) {
        return callback(child, i)
      }
    })
  }

  walkRules(selector, callback) {
    if (!callback) {
      callback = selector

      return this.walk((child, i) => {
        if (child.type === 'rule') {
          return callback(child, i)
        }
      })
    }
    if (selector instanceof RegExp) {
      return this.walk((child, i) => {
        if (child.type === 'rule' && selector.test(child.selector)) {
          return callback(child, i)
        }
      })
    }
    return this.walk((child, i) => {
      if (child.type === 'rule' && child.selector === selector) {
        return callback(child, i)
      }
    })
  }

  walkAtRules(name, callback) {
    if (!callback) {
      callback = name
      return this.walk((child, i) => {
        if (child.type === 'atrule') {
          return callback(child, i)
        }
      })
    }
    if (name instanceof RegExp) {
      return this.walk((child, i) => {
        if (child.type === 'atrule' && name.test(child.name)) {
          return callback(child, i)
        }
      })
    }
    return this.walk((child, i) => {
      if (child.type === 'atrule' && child.name === name) {
        return callback(child, i)
      }
    })
  }

  walkComments(callback) {
    return this.walk((child, i) => {
      if (child.type === 'comment') {
        return callback(child, i)
      }
    })
  }

  append(...children) {
    for (let child of children) {
      let nodes = this.normalize(child, this.last)
      for (let node of nodes) this.proxyOf.nodes.push(node)
    }

    this.markDirty()

    return this
  }

  prepend(...children) {
    children = children.reverse()
    for (let child of children) {
      let nodes = this.normalize(child, this.first, 'prepend').reverse()
      for (let node of nodes) this.proxyOf.nodes.unshift(node)
      for (let id in this.indexes) {
        this.indexes[id] = this.indexes[id] + nodes.length
      }
    }

    this.markDirty()

    return this
  }

  cleanRaws(keepBetween) {
    super.cleanRaws(keepBetween)
    if (this.nodes) {
      for (let node of this.nodes) node.cleanRaws(keepBetween)
    }
  }

  insertBefore(exist, add) {
    exist = this.index(exist)

    let type = exist === 0 ? 'prepend' : false
    let nodes = this.normalize(add, this.proxyOf.nodes[exist], type).reverse()
    for (let node of nodes) this.proxyOf.nodes.splice(exist, 0, node)

    let index
    for (let id in this.indexes) {
      index = this.indexes[id]
      if (exist <= index) {
        this.indexes[id] = index + nodes.length
      }
    }

    this.markDirty()

    return this
  }

  insertAfter(exist, add) {
    exist = this.index(exist)

    let nodes = this.normalize(add, this.proxyOf.nodes[exist]).reverse()
    for (let node of nodes) this.proxyOf.nodes.splice(exist + 1, 0, node)

    let index
    for (let id in this.indexes) {
      index = this.indexes[id]
      if (exist < index) {
        this.indexes[id] = index + nodes.length
      }
    }

    this.markDirty()

    return this
  }

  removeChild(child) {
    child = this.index(child)
    this.proxyOf.nodes[child].parent = undefined
    this.proxyOf.nodes.splice(child, 1)

    let index
    for (let id in this.indexes) {
      index = this.indexes[id]
      if (index >= child) {
        this.indexes[id] = index - 1
      }
    }

    this.markDirty()

    return this
  }

  removeAll() {
    for (let node of this.proxyOf.nodes) node.parent = undefined
    this.proxyOf.nodes = []

    this.markDirty()

    return this
  }

  replaceValues(pattern, opts, callback) {
    if (!callback) {
      callback = opts
      opts = {}
    }

    this.walkDecls(decl => {
      if (opts.props && !opts.props.includes(decl.prop)) return
      if (opts.fast && !decl.value.includes(opts.fast)) return

      decl.value = decl.value.replace(pattern, callback)
    })

    this.markDirty()

    return this
  }

  every(condition) {
    return this.nodes.every(condition)
  }

  some(condition) {
    return this.nodes.some(condition)
  }

  index(child) {
    if (typeof child === 'number') return child
    if (child.proxyOf) child = child.proxyOf
    return this.proxyOf.nodes.indexOf(child)
  }

  get first() {
    if (!this.proxyOf.nodes) return undefined
    return this.proxyOf.nodes[0]
  }

  get last() {
    if (!this.proxyOf.nodes) return undefined
    return this.proxyOf.nodes[this.proxyOf.nodes.length - 1]
  }

  normalize(nodes, sample) {
    if (typeof nodes === 'string') {
      nodes = cleanSource(parse$3(nodes).nodes)
    } else if (Array.isArray(nodes)) {
      nodes = nodes.slice(0)
      for (let i of nodes) {
        if (i.parent) i.parent.removeChild(i, 'ignore')
      }
    } else if (nodes.type === 'root' && this.type !== 'document') {
      nodes = nodes.nodes.slice(0)
      for (let i of nodes) {
        if (i.parent) i.parent.removeChild(i, 'ignore')
      }
    } else if (nodes.type) {
      nodes = [nodes]
    } else if (nodes.prop) {
      if (typeof nodes.value === 'undefined') {
        throw new Error('Value field is missed in node creation')
      } else if (typeof nodes.value !== 'string') {
        nodes.value = String(nodes.value)
      }
      nodes = [new Declaration$3(nodes)]
    } else if (nodes.selector) {
      nodes = [new Rule$4(nodes)]
    } else if (nodes.name) {
      nodes = [new AtRule$4(nodes)]
    } else if (nodes.text) {
      nodes = [new Comment$3(nodes)]
    } else {
      throw new Error('Unknown node type in node creation')
    }

    let processed = nodes.map(i => {
      // istanbul ignore next
      if (!i[my$1]) Container$7.rebuild(i)
      i = i.proxyOf
      if (i.parent) i.parent.removeChild(i)
      if (i[isClean$1]) markDirtyUp(i)
      if (typeof i.raws.before === 'undefined') {
        if (sample && typeof sample.raws.before !== 'undefined') {
          i.raws.before = sample.raws.before.replace(/\S/g, '')
        }
      }
      i.parent = this
      return i
    })

    return processed
  }

  getProxyProcessor() {
    return {
      set(node, prop, value) {
        if (node[prop] === value) return true
        node[prop] = value
        if (prop === 'name' || prop === 'params' || prop === 'selector') {
          node.markDirty()
        }
        return true
      },

      get(node, prop) {
        if (prop === 'proxyOf') {
          return node
        } else if (!node[prop]) {
          return node[prop]
        } else if (
          prop === 'each' ||
          (typeof prop === 'string' && prop.startsWith('walk'))
        ) {
          return (...args) => {
            return node[prop](
              ...args.map(i => {
                if (typeof i === 'function') {
                  return (child, index) => i(child.toProxy(), index)
                } else {
                  return i
                }
              })
            )
          }
        } else if (prop === 'every' || prop === 'some') {
          return cb => {
            return node[prop]((child, ...other) =>
              cb(child.toProxy(), ...other)
            )
          }
        } else if (prop === 'root') {
          return () => node.root().toProxy()
        } else if (prop === 'nodes') {
          return node.nodes.map(i => i.toProxy())
        } else if (prop === 'first' || prop === 'last') {
          return node[prop].toProxy()
        } else {
          return node[prop]
        }
      }
    }
  }

  getIterator() {
    if (!this.lastEach) this.lastEach = 0
    if (!this.indexes) this.indexes = {}

    this.lastEach += 1
    let iterator = this.lastEach
    this.indexes[iterator] = 0

    return iterator
  }
}

Container$7.registerParse = dependant => {
  parse$3 = dependant
}

Container$7.registerRule = dependant => {
  Rule$4 = dependant
}

Container$7.registerAtRule = dependant => {
  AtRule$4 = dependant
}

var container = Container$7
Container$7.default = Container$7

// istanbul ignore next
Container$7.rebuild = node => {
  if (node.type === 'atrule') {
    Object.setPrototypeOf(node, AtRule$4.prototype)
  } else if (node.type === 'rule') {
    Object.setPrototypeOf(node, Rule$4.prototype)
  } else if (node.type === 'decl') {
    Object.setPrototypeOf(node, Declaration$3.prototype)
  } else if (node.type === 'comment') {
    Object.setPrototypeOf(node, Comment$3.prototype)
  }

  node[my$1] = true

  if (node.nodes) {
    node.nodes.forEach(child => {
      Container$7.rebuild(child)
    })
  }
}

let Container$6 = container

let LazyResult$4, Processor$3

class Document$3 extends Container$6 {
  constructor(defaults) {
    // type needs to be passed to super, otherwise child roots won't be normalized correctly
    super({ type: 'document', ...defaults })

    if (!this.nodes) {
      this.nodes = []
    }
  }

  toResult(opts = {}) {
    let lazy = new LazyResult$4(new Processor$3(), this, opts)

    return lazy.stringify()
  }
}

Document$3.registerLazyResult = dependant => {
  LazyResult$4 = dependant
}

Document$3.registerProcessor = dependant => {
  Processor$3 = dependant
}

var document = Document$3
Document$3.default = Document$3

let printed = {}

var warnOnce$1 = function warnOnce(message) {
  if (printed[message]) return
  printed[message] = true

  if (typeof console !== 'undefined' && console.warn) {
    console.warn(message)
  }
}

class Warning$2 {
  constructor(text, opts = {}) {
    this.type = 'warning'
    this.text = text

    if (opts.node && opts.node.source) {
      let pos = opts.node.positionBy(opts)
      this.line = pos.line
      this.column = pos.column
    }

    for (let opt in opts) this[opt] = opts[opt]
  }

  toString() {
    if (this.node) {
      return this.node.error(this.text, {
        plugin: this.plugin,
        index: this.index,
        word: this.word
      }).message
    }

    if (this.plugin) {
      return this.plugin + ': ' + this.text
    }

    return this.text
  }
}

var warning = Warning$2
Warning$2.default = Warning$2

let Warning$1 = warning

class Result$2 {
  constructor(processor, root, opts) {
    this.processor = processor
    this.messages = []
    this.root = root
    this.opts = opts
    this.css = undefined
    this.map = undefined
  }

  toString() {
    return this.css
  }

  warn(text, opts = {}) {
    if (!opts.plugin) {
      if (this.lastPlugin && this.lastPlugin.postcssPlugin) {
        opts.plugin = this.lastPlugin.postcssPlugin
      }
    }

    let warning = new Warning$1(text, opts)
    this.messages.push(warning)

    return warning
  }

  warnings() {
    return this.messages.filter(i => i.type === 'warning')
  }

  get content() {
    return this.css
  }
}

var result = Result$2
Result$2.default = Result$2

let Container$5 = container

class AtRule$3 extends Container$5 {
  constructor(defaults) {
    super(defaults)
    this.type = 'atrule'
  }

  append(...children) {
    if (!this.proxyOf.nodes) this.nodes = []
    return super.append(...children)
  }

  prepend(...children) {
    if (!this.proxyOf.nodes) this.nodes = []
    return super.prepend(...children)
  }
}

var atRule = AtRule$3
AtRule$3.default = AtRule$3

Container$5.registerAtRule(AtRule$3)

let Container$4 = container

let LazyResult$3, Processor$2

class Root$5 extends Container$4 {
  constructor(defaults) {
    super(defaults)
    this.type = 'root'
    if (!this.nodes) this.nodes = []
  }

  removeChild(child, ignore) {
    let index = this.index(child)

    if (!ignore && index === 0 && this.nodes.length > 1) {
      this.nodes[1].raws.before = this.nodes[index].raws.before
    }

    return super.removeChild(child)
  }

  normalize(child, sample, type) {
    let nodes = super.normalize(child)

    if (sample) {
      if (type === 'prepend') {
        if (this.nodes.length > 1) {
          sample.raws.before = this.nodes[1].raws.before
        } else {
          delete sample.raws.before
        }
      } else if (this.first !== sample) {
        for (let node of nodes) {
          node.raws.before = sample.raws.before
        }
      }
    }

    return nodes
  }

  toResult(opts = {}) {
    let lazy = new LazyResult$3(new Processor$2(), this, opts)
    return lazy.stringify()
  }
}

Root$5.registerLazyResult = dependant => {
  LazyResult$3 = dependant
}

Root$5.registerProcessor = dependant => {
  Processor$2 = dependant
}

var root = Root$5
Root$5.default = Root$5

let list$2 = {
  split(string, separators, last) {
    let array = []
    let current = ''
    let split = false

    let func = 0
    let quote = false
    let escape = false

    for (let letter of string) {
      if (escape) {
        escape = false
      } else if (letter === '\\') {
        escape = true
      } else if (quote) {
        if (letter === quote) {
          quote = false
        }
      } else if (letter === '"' || letter === "'") {
        quote = letter
      } else if (letter === '(') {
        func += 1
      } else if (letter === ')') {
        if (func > 0) func -= 1
      } else if (func === 0) {
        if (separators.includes(letter)) split = true
      }

      if (split) {
        if (current !== '') array.push(current.trim())
        current = ''
        split = false
      } else {
        current += letter
      }
    }

    if (last || current !== '') array.push(current.trim())
    return array
  },

  space(string) {
    let spaces = [' ', '\n', '\t']
    return list$2.split(string, spaces)
  },

  comma(string) {
    return list$2.split(string, [','], true)
  }
}

var list_1 = list$2
list$2.default = list$2

let Container$3 = container
let list$1 = list_1

class Rule$3 extends Container$3 {
  constructor(defaults) {
    super(defaults)
    this.type = 'rule'
    if (!this.nodes) this.nodes = []
  }

  get selectors() {
    return list$1.comma(this.selector)
  }

  set selectors(values) {
    let match = this.selector ? this.selector.match(/,\s*/) : null
    let sep = match ? match[0] : ',' + this.raw('between', 'beforeOpen')
    this.selector = values.join(sep)
  }
}

var rule = Rule$3
Rule$3.default = Rule$3

Container$3.registerRule(Rule$3)

let Declaration$2 = declaration
let tokenizer = tokenize
let Comment$2 = comment
let AtRule$2 = atRule
let Root$4 = root
let Rule$2 = rule

class Parser$1 {
  constructor(input) {
    this.input = input

    this.root = new Root$4()
    this.current = this.root
    this.spaces = ''
    this.semicolon = false
    this.customProperty = false

    this.createTokenizer()
    this.root.source = { input, start: { offset: 0, line: 1, column: 1 } }
  }

  createTokenizer() {
    this.tokenizer = tokenizer(this.input)
  }

  parse() {
    let token
    while (!this.tokenizer.endOfFile()) {
      token = this.tokenizer.nextToken()

      switch (token[0]) {
        case 'space':
          this.spaces += token[1]
          break

        case ';':
          this.freeSemicolon(token)
          break

        case '}':
          this.end(token)
          break

        case 'comment':
          this.comment(token)
          break

        case 'at-word':
          this.atrule(token)
          break

        case '{':
          this.emptyRule(token)
          break

        default:
          this.other(token)
          break
      }
    }
    this.endFile()
  }

  comment(token) {
    let node = new Comment$2()
    this.init(node, token[2])
    node.source.end = this.getPosition(token[3] || token[2])

    let text = token[1].slice(2, -2)
    if (/^\s*$/.test(text)) {
      node.text = ''
      node.raws.left = text
      node.raws.right = ''
    } else {
      let match = text.match(/^(\s*)([^]*\S)(\s*)$/)
      node.text = match[2]
      node.raws.left = match[1]
      node.raws.right = match[3]
    }
  }

  emptyRule(token) {
    let node = new Rule$2()
    this.init(node, token[2])
    node.selector = ''
    node.raws.between = ''
    this.current = node
  }

  other(start) {
    let end = false
    let type = null
    let colon = false
    let bracket = null
    let brackets = []
    let customProperty = start[1].startsWith('--')

    let tokens = []
    let token = start
    while (token) {
      type = token[0]
      tokens.push(token)

      if (type === '(' || type === '[') {
        if (!bracket) bracket = token
        brackets.push(type === '(' ? ')' : ']')
      } else if (customProperty && colon && type === '{') {
        if (!bracket) bracket = token
        brackets.push('}')
      } else if (brackets.length === 0) {
        if (type === ';') {
          if (colon) {
            this.decl(tokens, customProperty)
            return
          } else {
            break
          }
        } else if (type === '{') {
          this.rule(tokens)
          return
        } else if (type === '}') {
          this.tokenizer.back(tokens.pop())
          end = true
          break
        } else if (type === ':') {
          colon = true
        }
      } else if (type === brackets[brackets.length - 1]) {
        brackets.pop()
        if (brackets.length === 0) bracket = null
      }

      token = this.tokenizer.nextToken()
    }

    if (this.tokenizer.endOfFile()) end = true
    if (brackets.length > 0) this.unclosedBracket(bracket)

    if (end && colon) {
      while (tokens.length) {
        token = tokens[tokens.length - 1][0]
        if (token !== 'space' && token !== 'comment') break
        this.tokenizer.back(tokens.pop())
      }
      this.decl(tokens, customProperty)
    } else {
      this.unknownWord(tokens)
    }
  }

  rule(tokens) {
    tokens.pop()

    let node = new Rule$2()
    this.init(node, tokens[0][2])

    node.raws.between = this.spacesAndCommentsFromEnd(tokens)
    this.raw(node, 'selector', tokens)
    this.current = node
  }

  decl(tokens, customProperty) {
    let node = new Declaration$2()
    this.init(node, tokens[0][2])

    let last = tokens[tokens.length - 1]
    if (last[0] === ';') {
      this.semicolon = true
      tokens.pop()
    }
    node.source.end = this.getPosition(last[3] || last[2])

    while (tokens[0][0] !== 'word') {
      if (tokens.length === 1) this.unknownWord(tokens)
      node.raws.before += tokens.shift()[1]
    }
    node.source.start = this.getPosition(tokens[0][2])

    node.prop = ''
    while (tokens.length) {
      let type = tokens[0][0]
      if (type === ':' || type === 'space' || type === 'comment') {
        break
      }
      node.prop += tokens.shift()[1]
    }

    node.raws.between = ''

    let token
    while (tokens.length) {
      token = tokens.shift()

      if (token[0] === ':') {
        node.raws.between += token[1]
        break
      } else {
        if (token[0] === 'word' && /\w/.test(token[1])) {
          this.unknownWord([token])
        }
        node.raws.between += token[1]
      }
    }

    if (node.prop[0] === '_' || node.prop[0] === '*') {
      node.raws.before += node.prop[0]
      node.prop = node.prop.slice(1)
    }
    let firstSpaces = this.spacesAndCommentsFromStart(tokens)
    this.precheckMissedSemicolon(tokens)

    for (let i = tokens.length - 1; i >= 0; i--) {
      token = tokens[i]
      if (token[1].toLowerCase() === '!important') {
        node.important = true
        let string = this.stringFrom(tokens, i)
        string = this.spacesFromEnd(tokens) + string
        if (string !== ' !important') node.raws.important = string
        break
      } else if (token[1].toLowerCase() === 'important') {
        let cache = tokens.slice(0)
        let str = ''
        for (let j = i; j > 0; j--) {
          let type = cache[j][0]
          if (str.trim().indexOf('!') === 0 && type !== 'space') {
            break
          }
          str = cache.pop()[1] + str
        }
        if (str.trim().indexOf('!') === 0) {
          node.important = true
          node.raws.important = str
          tokens = cache
        }
      }

      if (token[0] !== 'space' && token[0] !== 'comment') {
        break
      }
    }

    let hasWord = tokens.some(i => i[0] !== 'space' && i[0] !== 'comment')
    this.raw(node, 'value', tokens)
    if (hasWord) {
      node.raws.between += firstSpaces
    } else {
      node.value = firstSpaces + node.value
    }

    if (node.value.includes(':') && !customProperty) {
      this.checkMissedSemicolon(tokens)
    }
  }

  atrule(token) {
    let node = new AtRule$2()
    node.name = token[1].slice(1)
    if (node.name === '') {
      this.unnamedAtrule(node, token)
    }
    this.init(node, token[2])

    let type
    let prev
    let shift
    let last = false
    let open = false
    let params = []
    let brackets = []

    while (!this.tokenizer.endOfFile()) {
      token = this.tokenizer.nextToken()
      type = token[0]

      if (type === '(' || type === '[') {
        brackets.push(type === '(' ? ')' : ']')
      } else if (type === '{' && brackets.length > 0) {
        brackets.push('}')
      } else if (type === brackets[brackets.length - 1]) {
        brackets.pop()
      }

      if (brackets.length === 0) {
        if (type === ';') {
          node.source.end = this.getPosition(token[2])
          this.semicolon = true
          break
        } else if (type === '{') {
          open = true
          break
        } else if (type === '}') {
          if (params.length > 0) {
            shift = params.length - 1
            prev = params[shift]
            while (prev && prev[0] === 'space') {
              prev = params[--shift]
            }
            if (prev) {
              node.source.end = this.getPosition(prev[3] || prev[2])
            }
          }
          this.end(token)
          break
        } else {
          params.push(token)
        }
      } else {
        params.push(token)
      }

      if (this.tokenizer.endOfFile()) {
        last = true
        break
      }
    }

    node.raws.between = this.spacesAndCommentsFromEnd(params)
    if (params.length) {
      node.raws.afterName = this.spacesAndCommentsFromStart(params)
      this.raw(node, 'params', params)
      if (last) {
        token = params[params.length - 1]
        node.source.end = this.getPosition(token[3] || token[2])
        this.spaces = node.raws.between
        node.raws.between = ''
      }
    } else {
      node.raws.afterName = ''
      node.params = ''
    }

    if (open) {
      node.nodes = []
      this.current = node
    }
  }

  end(token) {
    if (this.current.nodes && this.current.nodes.length) {
      this.current.raws.semicolon = this.semicolon
    }
    this.semicolon = false

    this.current.raws.after = (this.current.raws.after || '') + this.spaces
    this.spaces = ''

    if (this.current.parent) {
      this.current.source.end = this.getPosition(token[2])
      this.current = this.current.parent
    } else {
      this.unexpectedClose(token)
    }
  }

  endFile() {
    if (this.current.parent) this.unclosedBlock()
    if (this.current.nodes && this.current.nodes.length) {
      this.current.raws.semicolon = this.semicolon
    }
    this.current.raws.after = (this.current.raws.after || '') + this.spaces
  }

  freeSemicolon(token) {
    this.spaces += token[1]
    if (this.current.nodes) {
      let prev = this.current.nodes[this.current.nodes.length - 1]
      if (prev && prev.type === 'rule' && !prev.raws.ownSemicolon) {
        prev.raws.ownSemicolon = this.spaces
        this.spaces = ''
      }
    }
  }

  // Helpers

  getPosition(offset) {
    let pos = this.input.fromOffset(offset)
    return {
      offset,
      line: pos.line,
      column: pos.col
    }
  }

  init(node, offset) {
    this.current.push(node)
    node.source = {
      start: this.getPosition(offset),
      input: this.input
    }
    node.raws.before = this.spaces
    this.spaces = ''
    if (node.type !== 'comment') this.semicolon = false
  }

  raw(node, prop, tokens) {
    let token, type
    let length = tokens.length
    let value = ''
    let clean = true
    let next, prev
    let pattern = /^([#.|])?(\w)+/i

    for (let i = 0; i < length; i += 1) {
      token = tokens[i]
      type = token[0]

      if (type === 'comment' && node.type === 'rule') {
        prev = tokens[i - 1]
        next = tokens[i + 1]

        if (
          prev[0] !== 'space' &&
          next[0] !== 'space' &&
          pattern.test(prev[1]) &&
          pattern.test(next[1])
        ) {
          value += token[1]
        } else {
          clean = false
        }

        continue
      }

      if (type === 'comment' || (type === 'space' && i === length - 1)) {
        clean = false
      } else {
        value += token[1]
      }
    }
    if (!clean) {
      let raw = tokens.reduce((all, i) => all + i[1], '')
      node.raws[prop] = { value, raw }
    }
    node[prop] = value
  }

  spacesAndCommentsFromEnd(tokens) {
    let lastTokenType
    let spaces = ''
    while (tokens.length) {
      lastTokenType = tokens[tokens.length - 1][0]
      if (lastTokenType !== 'space' && lastTokenType !== 'comment') break
      spaces = tokens.pop()[1] + spaces
    }
    return spaces
  }

  spacesAndCommentsFromStart(tokens) {
    let next
    let spaces = ''
    while (tokens.length) {
      next = tokens[0][0]
      if (next !== 'space' && next !== 'comment') break
      spaces += tokens.shift()[1]
    }
    return spaces
  }

  spacesFromEnd(tokens) {
    let lastTokenType
    let spaces = ''
    while (tokens.length) {
      lastTokenType = tokens[tokens.length - 1][0]
      if (lastTokenType !== 'space') break
      spaces = tokens.pop()[1] + spaces
    }
    return spaces
  }

  stringFrom(tokens, from) {
    let result = ''
    for (let i = from; i < tokens.length; i++) {
      result += tokens[i][1]
    }
    tokens.splice(from, tokens.length - from)
    return result
  }

  colon(tokens) {
    let brackets = 0
    let token, type, prev
    for (let [i, element] of tokens.entries()) {
      token = element
      type = token[0]

      if (type === '(') {
        brackets += 1
      }
      if (type === ')') {
        brackets -= 1
      }
      if (brackets === 0 && type === ':') {
        if (!prev) {
          this.doubleColon(token)
        } else if (prev[0] === 'word' && prev[1] === 'progid') {
          continue
        } else {
          return i
        }
      }

      prev = token
    }
    return false
  }

  // Errors

  unclosedBracket(bracket) {
    throw this.input.error('Unclosed bracket', bracket[2])
  }

  unknownWord(tokens) {
    throw this.input.error('Unknown word', tokens[0][2])
  }

  unexpectedClose(token) {
    throw this.input.error('Unexpected }', token[2])
  }

  unclosedBlock() {
    let pos = this.current.source.start
    throw this.input.error('Unclosed block', pos.line, pos.column)
  }

  doubleColon(token) {
    throw this.input.error('Double colon', token[2])
  }

  unnamedAtrule(node, token) {
    throw this.input.error('At-rule without name', token[2])
  }

  precheckMissedSemicolon(/* tokens */) {
    // Hook for Safe Parser
  }

  checkMissedSemicolon(tokens) {
    let colon = this.colon(tokens)
    if (colon === false) return

    let founded = 0
    let token
    for (let j = colon - 1; j >= 0; j--) {
      token = tokens[j]
      if (token[0] !== 'space') {
        founded += 1
        if (founded === 2) break
      }
    }
    // If the token is a word, e.g. `!important`, `red` or any other valid property's value.
    // Then we need to return the colon after that word token. [3] is the "end" colon of that word.
    // And because we need it after that one we do +1 to get the next one.
    throw this.input.error(
      'Missed semicolon',
      token[0] === 'word' ? token[3] + 1 : token[2]
    )
  }
}

var parser = Parser$1

// This alphabet uses `A-Za-z0-9_-` symbols. The genetic algorithm helped
// optimize the gzip compression for this alphabet.
let urlAlphabet =
  'ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW'

let customAlphabet = (alphabet, size) => {
  return () => {
    let id = ''
    // A compact alternative for `for (var i = 0; i < step; i++)`.
    let i = size
    while (i--) {
      // `| 0` is more compact and faster than `Math.floor()`.
      id += alphabet[(Math.random() * alphabet.length) | 0]
    }
    return id
  }
}

let nanoid$1 = (size = 21) => {
  let id = ''
  // A compact alternative for `for (var i = 0; i < step; i++)`.
  let i = size
  while (i--) {
    // `| 0` is more compact and faster than `Math.floor()`.
    id += urlAlphabet[(Math.random() * 64) | 0]
  }
  return id
}

var nonSecure = { nanoid: nanoid$1, customAlphabet }

var empty = {}

var empty$1 = /*#__PURE__*/ Object.freeze({
  __proto__: null,
  default: empty
})

var require$$1 = /*@__PURE__*/ getAugmentedNamespace(empty$1)

let {
  SourceMapConsumer: SourceMapConsumer$1,
  SourceMapGenerator: SourceMapGenerator$1
} = sourceMap
let { existsSync, readFileSync } = require$$1
let { dirname, join } = require$$2

function fromBase64(str) {
  if (Buffer) {
    return Buffer.from(str, 'base64').toString()
  } else {
    // istanbul ignore next
    return window.atob(str)
  }
}

class PreviousMap$2 {
  constructor(css, opts) {
    if (opts.map === false) return
    this.loadAnnotation(css)
    this.inline = this.startWith(this.annotation, 'data:')

    let prev = opts.map ? opts.map.prev : undefined
    let text = this.loadMap(opts.from, prev)
    if (!this.mapFile && opts.from) {
      this.mapFile = opts.from
    }
    if (this.mapFile) this.root = dirname(this.mapFile)
    if (text) this.text = text
  }

  consumer() {
    if (!this.consumerCache) {
      this.consumerCache = new SourceMapConsumer$1(this.text)
    }
    return this.consumerCache
  }

  withContent() {
    return !!(
      this.consumer().sourcesContent &&
      this.consumer().sourcesContent.length > 0
    )
  }

  startWith(string, start) {
    if (!string) return false
    return string.substr(0, start.length) === start
  }

  getAnnotationURL(sourceMapString) {
    return sourceMapString
      .match(/\/\*\s*# sourceMappingURL=((?:(?!sourceMappingURL=).)*)\*\//)[1]
      .trim()
  }

  loadAnnotation(css) {
    let annotations = css.match(
      /\/\*\s*# sourceMappingURL=(?:(?!sourceMappingURL=).)*\*\//gm
    )

    if (annotations && annotations.length > 0) {
      // Locate the last sourceMappingURL to avoid picking up
      // sourceMappingURLs from comments, strings, etc.
      let lastAnnotation = annotations[annotations.length - 1]
      if (lastAnnotation) {
        this.annotation = this.getAnnotationURL(lastAnnotation)
      }
    }
  }

  decodeInline(text) {
    let baseCharsetUri = /^data:application\/json;charset=utf-?8;base64,/
    let baseUri = /^data:application\/json;base64,/
    let charsetUri = /^data:application\/json;charset=utf-?8,/
    let uri = /^data:application\/json,/

    if (charsetUri.test(text) || uri.test(text)) {
      return decodeURIComponent(text.substr(RegExp.lastMatch.length))
    }

    if (baseCharsetUri.test(text) || baseUri.test(text)) {
      return fromBase64(text.substr(RegExp.lastMatch.length))
    }

    let encoding = text.match(/data:application\/json;([^,]+),/)[1]
    throw new Error('Unsupported source map encoding ' + encoding)
  }

  loadFile(path) {
    this.root = dirname(path)
    if (existsSync(path)) {
      this.mapFile = path
      return readFileSync(path, 'utf-8').toString().trim()
    }
  }

  loadMap(file, prev) {
    if (prev === false) return false

    if (prev) {
      if (typeof prev === 'string') {
        return prev
      } else if (typeof prev === 'function') {
        let prevPath = prev(file)
        if (prevPath) {
          let map = this.loadFile(prevPath)
          if (!map) {
            throw new Error(
              'Unable to load previous source map: ' + prevPath.toString()
            )
          }
          return map
        }
      } else if (prev instanceof SourceMapConsumer$1) {
        return SourceMapGenerator$1.fromSourceMap(prev).toString()
      } else if (prev instanceof SourceMapGenerator$1) {
        return prev.toString()
      } else if (this.isMap(prev)) {
        return JSON.stringify(prev)
      } else {
        throw new Error(
          'Unsupported previous source map format: ' + prev.toString()
        )
      }
    } else if (this.inline) {
      return this.decodeInline(this.annotation)
    } else if (this.annotation) {
      let map = this.annotation
      if (file) map = join(dirname(file), map)
      return this.loadFile(map)
    }
  }

  isMap(map) {
    if (typeof map !== 'object') return false
    return (
      typeof map.mappings === 'string' ||
      typeof map._mappings === 'string' ||
      Array.isArray(map.sections)
    )
  }
}

var previousMap = PreviousMap$2
PreviousMap$2.default = PreviousMap$2

let { SourceMapConsumer, SourceMapGenerator } = sourceMap
let { fileURLToPath, pathToFileURL } = require$$1$1
let { resolve, isAbsolute } = require$$2
let { nanoid } = nonSecure

let terminalHighlight = terminalHighlight_1
let CssSyntaxError$1 = cssSyntaxError
let PreviousMap$1 = previousMap

let fromOffsetCache = Symbol('fromOffsetCache')

let sourceMapAvailable = Boolean(SourceMapConsumer && SourceMapGenerator)
let pathAvailable = Boolean(resolve && isAbsolute)

class Input$3 {
  constructor(css, opts = {}) {
    if (
      css === null ||
      typeof css === 'undefined' ||
      (typeof css === 'object' && !css.toString)
    ) {
      throw new Error(`PostCSS received ${css} instead of CSS string`)
    }

    this.css = css.toString()

    if (this.css[0] === '\uFEFF' || this.css[0] === '\uFFFE') {
      this.hasBOM = true
      this.css = this.css.slice(1)
    } else {
      this.hasBOM = false
    }

    if (opts.from) {
      if (
        !pathAvailable ||
        /^\w+:\/\//.test(opts.from) ||
        isAbsolute(opts.from)
      ) {
        this.file = opts.from
      } else {
        this.file = resolve(opts.from)
      }
    }

    if (pathAvailable && sourceMapAvailable) {
      let map = new PreviousMap$1(this.css, opts)
      if (map.text) {
        this.map = map
        let file = map.consumer().file
        if (!this.file && file) this.file = this.mapResolve(file)
      }
    }

    if (!this.file) {
      this.id = '<input css ' + nanoid(6) + '>'
    }
    if (this.map) this.map.file = this.from
  }

  fromOffset(offset) {
    let lastLine, lineToIndex
    if (!this[fromOffsetCache]) {
      let lines = this.css.split('\n')
      lineToIndex = new Array(lines.length)
      let prevIndex = 0

      for (let i = 0, l = lines.length; i < l; i++) {
        lineToIndex[i] = prevIndex
        prevIndex += lines[i].length + 1
      }

      this[fromOffsetCache] = lineToIndex
    } else {
      lineToIndex = this[fromOffsetCache]
    }
    lastLine = lineToIndex[lineToIndex.length - 1]

    let min = 0
    if (offset >= lastLine) {
      min = lineToIndex.length - 1
    } else {
      let max = lineToIndex.length - 2
      let mid
      while (min < max) {
        mid = min + ((max - min) >> 1)
        if (offset < lineToIndex[mid]) {
          max = mid - 1
        } else if (offset >= lineToIndex[mid + 1]) {
          min = mid + 1
        } else {
          min = mid
          break
        }
      }
    }
    return {
      line: min + 1,
      col: offset - lineToIndex[min] + 1
    }
  }

  error(message, line, column, opts = {}) {
    let result
    if (!column) {
      let pos = this.fromOffset(line)
      line = pos.line
      column = pos.col
    }
    let origin = this.origin(line, column)
    if (origin) {
      result = new CssSyntaxError$1(
        message,
        origin.line,
        origin.column,
        origin.source,
        origin.file,
        opts.plugin
      )
    } else {
      result = new CssSyntaxError$1(
        message,
        line,
        column,
        this.css,
        this.file,
        opts.plugin
      )
    }

    result.input = { line, column, source: this.css }
    if (this.file) {
      if (pathToFileURL) {
        result.input.url = pathToFileURL(this.file).toString()
      }
      result.input.file = this.file
    }

    return result
  }

  origin(line, column) {
    if (!this.map) return false
    let consumer = this.map.consumer()

    let from = consumer.originalPositionFor({ line, column })
    if (!from.source) return false

    let fromUrl

    if (isAbsolute(from.source)) {
      fromUrl = pathToFileURL(from.source)
    } else {
      fromUrl = new URL(
        from.source,
        this.map.consumer().sourceRoot || pathToFileURL(this.map.mapFile)
      )
    }

    let result = {
      url: fromUrl.toString(),
      line: from.line,
      column: from.column
    }

    if (fromUrl.protocol === 'file:') {
      if (fileURLToPath) {
        result.file = fileURLToPath(fromUrl)
      } else {
        // istanbul ignore next
        throw new Error(`file: protocol is not available in this PostCSS build`)
      }
    }

    let source = consumer.sourceContentFor(from.source)
    if (source) result.source = source

    return result
  }

  mapResolve(file) {
    if (/^\w+:\/\//.test(file)) {
      return file
    }
    return resolve(this.map.consumer().sourceRoot || this.map.root || '.', file)
  }

  get from() {
    return this.file || this.id
  }

  toJSON() {
    let json = {}
    for (let name of ['hasBOM', 'css', 'file', 'id']) {
      if (this[name] != null) {
        json[name] = this[name]
      }
    }
    if (this.map) {
      json.map = { ...this.map }
      if (json.map.consumerCache) {
        json.map.consumerCache = undefined
      }
    }
    return json
  }
}

var input = Input$3
Input$3.default = Input$3

if (terminalHighlight && terminalHighlight.registerInput) {
  terminalHighlight.registerInput(Input$3)
}

let Container$2 = container
let Parser = parser
let Input$2 = input

function parse$2(css, opts) {
  let input = new Input$2(css, opts)
  let parser = new Parser(input)
  try {
    parser.parse()
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      if (e.name === 'CssSyntaxError' && opts && opts.from) {
        if (/\.scss$/i.test(opts.from)) {
          e.message +=
            '\nYou tried to parse SCSS with ' +
            'the standard CSS parser; ' +
            'try again with the postcss-scss parser'
        } else if (/\.sass/i.test(opts.from)) {
          e.message +=
            '\nYou tried to parse Sass with ' +
            'the standard CSS parser; ' +
            'try again with the postcss-sass parser'
        } else if (/\.less$/i.test(opts.from)) {
          e.message +=
            '\nYou tried to parse Less with ' +
            'the standard CSS parser; ' +
            'try again with the postcss-less parser'
        }
      }
    }
    throw e
  }

  return parser.root
}

var parse_1 = parse$2
parse$2.default = parse$2

Container$2.registerParse(parse$2)

let { isClean, my } = symbols
let MapGenerator = mapGenerator
let stringify$1 = stringify_1
let Container$1 = container
let Document$2 = document
let warnOnce = warnOnce$1
let Result$1 = result
let parse$1 = parse_1
let Root$3 = root

const TYPE_TO_CLASS_NAME = {
  document: 'Document',
  root: 'Root',
  atrule: 'AtRule',
  rule: 'Rule',
  decl: 'Declaration',
  comment: 'Comment'
}

const PLUGIN_PROPS = {
  postcssPlugin: true,
  prepare: true,
  Once: true,
  Document: true,
  Root: true,
  Declaration: true,
  Rule: true,
  AtRule: true,
  Comment: true,
  DeclarationExit: true,
  RuleExit: true,
  AtRuleExit: true,
  CommentExit: true,
  RootExit: true,
  DocumentExit: true,
  OnceExit: true
}

const NOT_VISITORS = {
  postcssPlugin: true,
  prepare: true,
  Once: true
}

const CHILDREN = 0

function isPromise(obj) {
  return typeof obj === 'object' && typeof obj.then === 'function'
}

function getEvents(node) {
  let key = false
  let type = TYPE_TO_CLASS_NAME[node.type]
  if (node.type === 'decl') {
    key = node.prop.toLowerCase()
  } else if (node.type === 'atrule') {
    key = node.name.toLowerCase()
  }

  if (key && node.append) {
    return [
      type,
      type + '-' + key,
      CHILDREN,
      type + 'Exit',
      type + 'Exit-' + key
    ]
  } else if (key) {
    return [type, type + '-' + key, type + 'Exit', type + 'Exit-' + key]
  } else if (node.append) {
    return [type, CHILDREN, type + 'Exit']
  } else {
    return [type, type + 'Exit']
  }
}

function toStack(node) {
  let events
  if (node.type === 'document') {
    events = ['Document', CHILDREN, 'DocumentExit']
  } else if (node.type === 'root') {
    events = ['Root', CHILDREN, 'RootExit']
  } else {
    events = getEvents(node)
  }

  return {
    node,
    events,
    eventIndex: 0,
    visitors: [],
    visitorIndex: 0,
    iterator: 0
  }
}

function cleanMarks(node) {
  node[isClean] = false
  if (node.nodes) node.nodes.forEach(i => cleanMarks(i))
  return node
}

let postcss$1 = {}

class LazyResult$2 {
  constructor(processor, css, opts) {
    this.stringified = false
    this.processed = false

    let root
    if (
      typeof css === 'object' &&
      css !== null &&
      (css.type === 'root' || css.type === 'document')
    ) {
      root = cleanMarks(css)
    } else if (css instanceof LazyResult$2 || css instanceof Result$1) {
      root = cleanMarks(css.root)
      if (css.map) {
        if (typeof opts.map === 'undefined') opts.map = {}
        if (!opts.map.inline) opts.map.inline = false
        opts.map.prev = css.map
      }
    } else {
      let parser = parse$1
      if (opts.syntax) parser = opts.syntax.parse
      if (opts.parser) parser = opts.parser
      if (parser.parse) parser = parser.parse

      try {
        root = parser(css, opts)
      } catch (error) {
        this.processed = true
        this.error = error
      }

      if (root && !root[my]) {
        // istanbul ignore next
        Container$1.rebuild(root)
      }
    }

    this.result = new Result$1(processor, root, opts)
    this.helpers = { ...postcss$1, result: this.result, postcss: postcss$1 }
    this.plugins = this.processor.plugins.map(plugin => {
      if (typeof plugin === 'object' && plugin.prepare) {
        return { ...plugin, ...plugin.prepare(this.result) }
      } else {
        return plugin
      }
    })
  }

  get [Symbol.toStringTag]() {
    return 'LazyResult'
  }

  get processor() {
    return this.result.processor
  }

  get opts() {
    return this.result.opts
  }

  get css() {
    return this.stringify().css
  }

  get content() {
    return this.stringify().content
  }

  get map() {
    return this.stringify().map
  }

  get root() {
    return this.sync().root
  }

  get messages() {
    return this.sync().messages
  }

  warnings() {
    return this.sync().warnings()
  }

  toString() {
    return this.css
  }

  then(onFulfilled, onRejected) {
    if (process.env.NODE_ENV !== 'production') {
      if (!('from' in this.opts)) {
        warnOnce(
          'Without `from` option PostCSS could generate wrong source map ' +
            'and will not find Browserslist config. Set it to CSS file path ' +
            'or to `undefined` to prevent this warning.'
        )
      }
    }
    return this.async().then(onFulfilled, onRejected)
  }

  catch(onRejected) {
    return this.async().catch(onRejected)
  }

  finally(onFinally) {
    return this.async().then(onFinally, onFinally)
  }

  async() {
    if (this.error) return Promise.reject(this.error)
    if (this.processed) return Promise.resolve(this.result)
    if (!this.processing) {
      this.processing = this.runAsync()
    }
    return this.processing
  }

  sync() {
    if (this.error) throw this.error
    if (this.processed) return this.result
    this.processed = true

    if (this.processing) {
      throw this.getAsyncError()
    }

    for (let plugin of this.plugins) {
      let promise = this.runOnRoot(plugin)
      if (isPromise(promise)) {
        throw this.getAsyncError()
      }
    }

    this.prepareVisitors()
    if (this.hasListener) {
      let root = this.result.root
      while (!root[isClean]) {
        root[isClean] = true
        this.walkSync(root)
      }
      if (this.listeners.OnceExit) {
        if (root.type === 'document') {
          for (let subRoot of root.nodes) {
            this.visitSync(this.listeners.OnceExit, subRoot)
          }
        } else {
          this.visitSync(this.listeners.OnceExit, root)
        }
      }
    }

    return this.result
  }

  stringify() {
    if (this.error) throw this.error
    if (this.stringified) return this.result
    this.stringified = true

    this.sync()

    let opts = this.result.opts
    let str = stringify$1
    if (opts.syntax) str = opts.syntax.stringify
    if (opts.stringifier) str = opts.stringifier
    if (str.stringify) str = str.stringify

    let map = new MapGenerator(str, this.result.root, this.result.opts)
    let data = map.generate()
    this.result.css = data[0]
    this.result.map = data[1]

    return this.result
  }

  walkSync(node) {
    node[isClean] = true
    let events = getEvents(node)
    for (let event of events) {
      if (event === CHILDREN) {
        if (node.nodes) {
          node.each(child => {
            if (!child[isClean]) this.walkSync(child)
          })
        }
      } else {
        let visitors = this.listeners[event]
        if (visitors) {
          if (this.visitSync(visitors, node.toProxy())) return
        }
      }
    }
  }

  visitSync(visitors, node) {
    for (let [plugin, visitor] of visitors) {
      this.result.lastPlugin = plugin
      let promise
      try {
        promise = visitor(node, this.helpers)
      } catch (e) {
        throw this.handleError(e, node.proxyOf)
      }
      if (node.type !== 'root' && node.type !== 'document' && !node.parent) {
        return true
      }
      if (isPromise(promise)) {
        throw this.getAsyncError()
      }
    }
  }

  runOnRoot(plugin) {
    this.result.lastPlugin = plugin
    try {
      if (typeof plugin === 'object' && plugin.Once) {
        if (this.result.root.type === 'document') {
          let roots = this.result.root.nodes.map(root =>
            plugin.Once(root, this.helpers)
          )

          if (isPromise(roots[0])) {
            return Promise.all(roots)
          }

          return roots
        }

        return plugin.Once(this.result.root, this.helpers)
      } else if (typeof plugin === 'function') {
        return plugin(this.result.root, this.result)
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  getAsyncError() {
    throw new Error('Use process(css).then(cb) to work with async plugins')
  }

  handleError(error, node) {
    let plugin = this.result.lastPlugin
    try {
      if (node) node.addToError(error)
      this.error = error
      if (error.name === 'CssSyntaxError' && !error.plugin) {
        error.plugin = plugin.postcssPlugin
        error.setMessage()
      } else if (plugin.postcssVersion) {
        if (process.env.NODE_ENV !== 'production') {
          let pluginName = plugin.postcssPlugin
          let pluginVer = plugin.postcssVersion
          let runtimeVer = this.result.processor.version
          let a = pluginVer.split('.')
          let b = runtimeVer.split('.')

          if (a[0] !== b[0] || parseInt(a[1]) > parseInt(b[1])) {
            console.error(
              'Unknown error from PostCSS plugin. Your current PostCSS ' +
                'version is ' +
                runtimeVer +
                ', but ' +
                pluginName +
                ' uses ' +
                pluginVer +
                '. Perhaps this is the source of the error below.'
            )
          }
        }
      }
    } catch (err) {
      // istanbul ignore next
      if (console && console.error) console.error(err)
    }
    return error
  }

  async runAsync() {
    this.plugin = 0
    for (let i = 0; i < this.plugins.length; i++) {
      let plugin = this.plugins[i]
      let promise = this.runOnRoot(plugin)
      if (isPromise(promise)) {
        try {
          await promise
        } catch (error) {
          throw this.handleError(error)
        }
      }
    }

    this.prepareVisitors()
    if (this.hasListener) {
      let root = this.result.root
      while (!root[isClean]) {
        root[isClean] = true
        let stack = [toStack(root)]
        while (stack.length > 0) {
          let promise = this.visitTick(stack)
          if (isPromise(promise)) {
            try {
              await promise
            } catch (e) {
              let node = stack[stack.length - 1].node
              throw this.handleError(e, node)
            }
          }
        }
      }

      if (this.listeners.OnceExit) {
        for (let [plugin, visitor] of this.listeners.OnceExit) {
          this.result.lastPlugin = plugin
          try {
            if (root.type === 'document') {
              let roots = root.nodes.map(subRoot =>
                visitor(subRoot, this.helpers)
              )

              await Promise.all(roots)
            } else {
              await visitor(root, this.helpers)
            }
          } catch (e) {
            throw this.handleError(e)
          }
        }
      }
    }

    this.processed = true
    return this.stringify()
  }

  prepareVisitors() {
    this.listeners = {}
    let add = (plugin, type, cb) => {
      if (!this.listeners[type]) this.listeners[type] = []
      this.listeners[type].push([plugin, cb])
    }
    for (let plugin of this.plugins) {
      if (typeof plugin === 'object') {
        for (let event in plugin) {
          if (!PLUGIN_PROPS[event] && /^[A-Z]/.test(event)) {
            throw new Error(
              `Unknown event ${event} in ${plugin.postcssPlugin}. ` +
                `Try to update PostCSS (${this.processor.version} now).`
            )
          }
          if (!NOT_VISITORS[event]) {
            if (typeof plugin[event] === 'object') {
              for (let filter in plugin[event]) {
                if (filter === '*') {
                  add(plugin, event, plugin[event][filter])
                } else {
                  add(
                    plugin,
                    event + '-' + filter.toLowerCase(),
                    plugin[event][filter]
                  )
                }
              }
            } else if (typeof plugin[event] === 'function') {
              add(plugin, event, plugin[event])
            }
          }
        }
      }
    }
    this.hasListener = Object.keys(this.listeners).length > 0
  }

  visitTick(stack) {
    let visit = stack[stack.length - 1]
    let { node, visitors } = visit

    if (node.type !== 'root' && node.type !== 'document' && !node.parent) {
      stack.pop()
      return
    }

    if (visitors.length > 0 && visit.visitorIndex < visitors.length) {
      let [plugin, visitor] = visitors[visit.visitorIndex]
      visit.visitorIndex += 1
      if (visit.visitorIndex === visitors.length) {
        visit.visitors = []
        visit.visitorIndex = 0
      }
      this.result.lastPlugin = plugin
      try {
        return visitor(node.toProxy(), this.helpers)
      } catch (e) {
        throw this.handleError(e, node)
      }
    }

    if (visit.iterator !== 0) {
      let iterator = visit.iterator
      let child
      while ((child = node.nodes[node.indexes[iterator]])) {
        node.indexes[iterator] += 1
        if (!child[isClean]) {
          child[isClean] = true
          stack.push(toStack(child))
          return
        }
      }
      visit.iterator = 0
      delete node.indexes[iterator]
    }

    let events = visit.events
    while (visit.eventIndex < events.length) {
      let event = events[visit.eventIndex]
      visit.eventIndex += 1
      if (event === CHILDREN) {
        if (node.nodes && node.nodes.length) {
          node[isClean] = true
          visit.iterator = node.getIterator()
        }
        return
      } else if (this.listeners[event]) {
        visit.visitors = this.listeners[event]
        return
      }
    }
    stack.pop()
  }
}

LazyResult$2.registerPostcss = dependant => {
  postcss$1 = dependant
}

var lazyResult = LazyResult$2
LazyResult$2.default = LazyResult$2

Root$3.registerLazyResult(LazyResult$2)
Document$2.registerLazyResult(LazyResult$2)

let LazyResult$1 = lazyResult
let Document$1 = document
let Root$2 = root

class Processor$1 {
  constructor(plugins = []) {
    this.version = '8.3.6'
    this.plugins = this.normalize(plugins)
  }

  use(plugin) {
    this.plugins = this.plugins.concat(this.normalize([plugin]))
    return this
  }

  process(css, opts = {}) {
    if (
      this.plugins.length === 0 &&
      typeof opts.parser === 'undefined' &&
      typeof opts.stringifier === 'undefined' &&
      typeof opts.syntax === 'undefined' &&
      !opts.hideNothingWarning
    ) {
      if (process.env.NODE_ENV !== 'production') {
        if (typeof console !== 'undefined' && console.warn) {
          console.warn(
            'You did not set any plugins, parser, or stringifier. ' +
              'Right now, PostCSS does nothing. Pick plugins for your case ' +
              'on https://www.postcss.parts/ and use them in postcss.config.js.'
          )
        }
      }
    }
    return new LazyResult$1(this, css, opts)
  }

  normalize(plugins) {
    let normalized = []
    for (let i of plugins) {
      if (i.postcss === true) {
        i = i()
      } else if (i.postcss) {
        i = i.postcss
      }

      if (typeof i === 'object' && Array.isArray(i.plugins)) {
        normalized = normalized.concat(i.plugins)
      } else if (typeof i === 'object' && i.postcssPlugin) {
        normalized.push(i)
      } else if (typeof i === 'function') {
        normalized.push(i)
      } else if (typeof i === 'object' && (i.parse || i.stringify)) {
        if (process.env.NODE_ENV !== 'production') {
          throw new Error(
            'PostCSS syntaxes cannot be used as plugins. Instead, please use ' +
              'one of the syntax/parser/stringifier options as outlined ' +
              'in your PostCSS runner documentation.'
          )
        }
      } else {
        throw new Error(i + ' is not a PostCSS plugin')
      }
    }
    return normalized
  }
}

var processor = Processor$1
Processor$1.default = Processor$1

Root$2.registerProcessor(Processor$1)
Document$1.registerProcessor(Processor$1)

let Declaration$1 = declaration
let PreviousMap = previousMap
let Comment$1 = comment
let AtRule$1 = atRule
let Input$1 = input
let Root$1 = root
let Rule$1 = rule

function fromJSON$1(json, inputs) {
  if (Array.isArray(json)) return json.map(n => fromJSON$1(n))

  let { inputs: ownInputs, ...defaults } = json
  if (ownInputs) {
    inputs = []
    for (let input of ownInputs) {
      let inputHydrated = { ...input, __proto__: Input$1.prototype }
      if (inputHydrated.map) {
        inputHydrated.map = {
          ...inputHydrated.map,
          __proto__: PreviousMap.prototype
        }
      }
      inputs.push(inputHydrated)
    }
  }
  if (defaults.nodes) {
    defaults.nodes = json.nodes.map(n => fromJSON$1(n, inputs))
  }
  if (defaults.source) {
    let { inputId, ...source } = defaults.source
    defaults.source = source
    if (inputId != null) {
      defaults.source.input = inputs[inputId]
    }
  }
  if (defaults.type === 'root') {
    return new Root$1(defaults)
  } else if (defaults.type === 'decl') {
    return new Declaration$1(defaults)
  } else if (defaults.type === 'rule') {
    return new Rule$1(defaults)
  } else if (defaults.type === 'comment') {
    return new Comment$1(defaults)
  } else if (defaults.type === 'atrule') {
    return new AtRule$1(defaults)
  } else {
    throw new Error('Unknown node type: ' + json.type)
  }
}

var fromJSON_1 = fromJSON$1
fromJSON$1.default = fromJSON$1

let CssSyntaxError = cssSyntaxError
let Declaration = declaration
let LazyResult = lazyResult
let Container = container
let Processor = processor
let stringify = stringify_1
let fromJSON = fromJSON_1
let Document = document
let Warning = warning
let Comment = comment
let AtRule = atRule
let Result = result
let Input = input
let parse = parse_1
let list = list_1
let Rule = rule
let Root = root
let Node = node_1

function postcss(...plugins) {
  if (plugins.length === 1 && Array.isArray(plugins[0])) {
    plugins = plugins[0]
  }
  return new Processor(plugins)
}

postcss.plugin = function plugin(name, initializer) {
  if (console && console.warn) {
    console.warn(
      name +
        ': postcss.plugin was deprecated. Migration guide:\n' +
        'https://evilmartians.com/chronicles/postcss-8-plugin-migration'
    )
    if (process.env.LANG && process.env.LANG.startsWith('cn')) {
      // istanbul ignore next
      console.warn(
        name +
          ': 里面 postcss.plugin 被弃用. 迁移指南:\n' +
          'https://www.w3ctech.com/topic/2226'
      )
    }
  }
  function creator(...args) {
    let transformer = initializer(...args)
    transformer.postcssPlugin = name
    transformer.postcssVersion = new Processor().version
    return transformer
  }

  let cache
  Object.defineProperty(creator, 'postcss', {
    get() {
      if (!cache) cache = creator()
      return cache
    }
  })

  creator.process = function (css, processOpts, pluginOpts) {
    return postcss([creator(pluginOpts)]).process(css, processOpts)
  }

  return creator
}

postcss.stringify = stringify
postcss.parse = parse
postcss.fromJSON = fromJSON
postcss.list = list

postcss.comment = defaults => new Comment(defaults)
postcss.atRule = defaults => new AtRule(defaults)
postcss.decl = defaults => new Declaration(defaults)
postcss.rule = defaults => new Rule(defaults)
postcss.root = defaults => new Root(defaults)
postcss.document = defaults => new Document(defaults)

postcss.CssSyntaxError = CssSyntaxError
postcss.Declaration = Declaration
postcss.Container = Container
postcss.Document = Document
postcss.Comment = Comment
postcss.Warning = Warning
postcss.AtRule = AtRule
postcss.Result = Result
postcss.Input = Input
postcss.Rule = Rule
postcss.Root = Root
postcss.Node = Node

LazyResult.registerPostcss(postcss)

var postcss_1 = postcss
postcss.default = postcss

export { postcss_1 as default }
