# iamlisp

[![Test](https://github.com/iamlisp/iamlisp-js/actions/workflows/test.yml/badge.svg)](https://github.com/iamlisp/iamlisp-js/actions/workflows/test.yml)
[![npm](https://img.shields.io/npm/v/iamlisp)](https://www.npmjs.com/package/iamlisp)
![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg)

iamlisp is a small Lisp-like language interpreter written in JavaScript. It
includes a REPL, macros, JavaScript interop, common collection helpers, and an
optional whitespace-indented syntax.

## Why iamlisp?

iamlisp began as a learning project while I was studying
[Structure and Interpretation of Computer Programs](https://mitpress.mit.edu/9780262510875/structure-and-interpretation-of-computer-programs/).

I wanted to better understand Lisp by building my own interpreter and
experimenting with language ideas.

It remains a personal learning project and playground, not a production-ready
programming language.

## Quick Start

Requires Node.js 22.13 or newer.

```bash
npm install --global iamlisp
iamlisp
```

Try an expression in the REPL:

```lisp
> (+ 20 22)
42

> (defun square (x) (* x x))
undefined

> (square 12)
144
```

## Language Tour

Define values and functions:

```lisp
(def greeting "Hello")
(defun greet (name) (+ greeting ", " name))

(greet "world") ; => "Hello, world"
```

Use conditions and recursion:

```lisp
(defun fib (n)
  (cond ((<= n 1) n)
        ((+ (fib (- n 1)) (fib (- n 2))))))

(fib 10) ; => 55
```

Import collection helpers:

```lisp
(import "list")

(map #(* % %) (until 1 6)) ; => (1 4 9 16 25)
```

Call JavaScript globals and methods:

```lisp
(.max js/Math 7 42 11) ; => 42
```

Other supported language ideas include macros, lexical scope, lambdas,
destructuring, maps, arrays, multimethods, streams, and loop/recur.

## Editor Support

iamlisp includes a language server for diagnostics, completion, hover help,
document symbols, semantic highlighting, and live expression-result hints,
plus a TextMate grammar for fallback syntax highlighting.

See [editor setup instructions](docs/language-server.md), including WebStorm
configuration.

## Workspace Packages

This repository is an npm monorepo. Shared language-building blocks live under
`packages/`.

- [`@iamlisp/lexer`](packages/lexer) consumes a reader and produces immutable
  lexer tokens with source locations.
- [`@iamlisp/reader`](packages/reader) exposes a minimal byte reader through
  `next`, `eof`, and `value`.

Run both interpreter and workspace-package tests with:

```bash
npm run test:all
```

## Layout Syntax

Programs can opt into whitespace-indented layout syntax with an exact header:

```lisp
#!iamlisp layout-v1
defun fib (n)
  cond
       (<= n 1) n
       else
          + (fib (- n 1)) (fib (- n 2))

fib 10
```

Relative indentation replaces outer parentheses. Inline parentheses remain
available. See [the layout-v1 specification](docs/layout-v1.md).

## Embedding

Install from npm:

```bash
npm install iamlisp
```

Create an evaluator with a persistent environment:

```js
const { createEvaluator } = require("iamlisp");

const evaluate = createEvaluator();

evaluate("(def x 40)");
evaluate("(+ x 2)"); // 42
```

Available options:

| Option | Purpose |
| --- | --- |
| `mode: "recursive"` | Use the original recursive evaluator instead of the default iterative evaluator |
| `timeout` | Stop evaluation after the given number of milliseconds |
| `printFn` | Receive values produced by the iamlisp `print` form |
| `debug` | Print evaluator tracing information |

## Examples

| Example | Description |
| --- | --- |
| [SICP concept path](docs/examples/sicp/README.md) | Executable examples through a small metacircular evaluator |
| [Layout Fibonacci](docs/examples/layout-fibonacci.iamlisp) | Whitespace-indented syntax |
| [Tail-call optimization](docs/examples/tail-call-optimization.iamlisp) | Tail-recursive Fibonacci |
| [Loop and recur](docs/examples/loop.iamlisp) | Iterative loops |
| [Streams](docs/examples/fibonacci-on-streams.iamlisp) | Fibonacci sequence using streams |
| [Permutations](docs/examples/permutations.iamlisp) | Recursive list processing |
| [Balanced brackets](docs/examples/brackets-balanced.iamlisp) | Rosetta Code exercise |
| [Smoke test](docs/examples/smoke-test.iamlisp) | End-to-end language feature sample |

## Evaluation Model

The default evaluator uses explicit frames to evaluate deeply recursive
programs iteratively. The original recursive evaluator remains available with
`createEvaluator({ mode: "recursive" })`.

Some less common special forms still use the recursive evaluator internally as
a compatibility fallback.

## Development

```bash
git clone https://github.com/iamlisp/iamlisp-js.git
cd iamlisp-js
npm ci
npm test -- --runInBand
npm run lint
npm run build
```

GitHub Actions runs tests, lint, and build on Node.js 22 and 24.

## Status and Limitations

- iamlisp is an educational language and experiment.
- The CLI currently provides an interactive REPL, not a file runner.
- Layout syntax is opt-in and explicit bracket expressions must fit on one
  physical line.
- Language and embedding APIs may change as experiments continue.

## License

ISC
