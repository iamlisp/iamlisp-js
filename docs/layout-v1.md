# Layout Syntax v1

Layout syntax is an opt-in alternative to outer parentheses. Enable it with an
exact header on the first line:

```lisp
#!iamlisp layout-v1
```

## Rules

- Every non-empty code line is an implicit list.
- Leading tabs or spaces define nesting by relative indentation.
- More leading whitespace than the previous code line opens exactly one level.
- The same leading-whitespace width stays at the same level.
- Less leading whitespace dedents and must match a previously used width.
- Nested lines become trailing arguments of their parent line.
- Indentation has no required width. One, two, four, or any other increase all
  open one level.
- Blank lines and comment-only lines do not affect nesting.
- Inline parentheses, arrays, maps, quotes, metadata, and sharp lambdas retain
  their existing syntax.
- Explicit bracket expressions must fit on one physical line.
- A line beginning with `=>` inserts exactly one raw expression instead of an
  implicit list. Raw expressions cannot contain nested lines.

## Example

```lisp
#!iamlisp layout-v1
defun fib (n)
  cond
       (<= n 1) n
       else
          + (fib (- n 1)) (fib (- n 2))

fib 10
```

Equivalent bracket syntax:

```lisp
(defun fib (n)
  (cond
    ((<= n 1) n)
    (else
      (+ (fib (- n 1)) (fib (- n 2))))))

(fib 10)
```

Use `=>` when a nested expression must be a scalar rather than a call:

```lisp
#!iamlisp layout-v1
defun sign (n)
	cond
		(zero? n)
			=> "zero"
		else
			=> "nonzero"
```
