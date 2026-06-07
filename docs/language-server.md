# Editor Support

iamlisp ships two editor integrations:

- `iamlisp-lsp`: diagnostics, completion, hover help, and document symbols
- `editors/iamlisp-textmate`: syntax highlighting for `.iamlisp` files

## Install

Build from this repository:

```bash
npm ci
npm run build
npm link
```

This makes the `iamlisp-lsp` executable available on your PATH.

## WebStorm

### Syntax highlighting

1. Open **Settings | Editor | TextMate Bundles**.
2. Add the `editors/iamlisp-textmate` directory from this repository.
3. Open an `.iamlisp` file.

### Language server

1. Install the free
   [LSP4IJ](https://plugins.jetbrains.com/plugin/23257-lsp4ij) plugin.
2. Open **Settings | Languages & Frameworks | Language Servers**.
3. Add a user-defined language server.
4. Use `iamlisp-lsp --stdio` as the command.
5. Map the `*.iamlisp` file-name pattern to the server with language ID
   `iamlisp`.
6. Enable LSP inlay hints under **Settings | Editor | Inlay Hints** if
   expression results are hidden.

## Other Editors

Any LSP-capable editor can launch:

```bash
iamlisp-lsp --stdio
```

Point TextMate-compatible editors at
`editors/iamlisp-textmate/syntaxes/iamlisp.tmLanguage.json` for highlighting.

## Current Features

- Parser diagnostics for bracket and layout-v1 syntax
- Built-in form and operator completion
- Hover descriptions for core forms
- Document symbols for `def`, `defun`, `defmacro`, and `defmulti`
- Safe expression-result inlay hints
- TextMate syntax highlighting

## Expression Results

The language server shows inline results for one-line expressions whose
dependencies can be evaluated without side effects:

```lisp
(def x 5)
(defun square (n) (* n n))
(square x) ; => 25
```

It supports document-local variables and functions composed from literals,
pure variables, pure functions, arithmetic, comparisons, booleans, and `if`.
Pure `begin` and `cond` expressions are also supported. It skips unknown calls,
JavaScript interop, mutation, output, collections, quotes, and functions that
depend on them. Evaluation has a step limit to stop unbounded recursion.
