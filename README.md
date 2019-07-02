# iamlisp

Another one my LISP-like langage interpreter hosted on JS.

## Syntax examples

### Define variable

```
(def a 10 b 20)
(def foo "Hello World")
(def bar true)
```

### Define function

```
(defun sum (a b) (+ a b))
```

### Define macro

```
(defmacro backwards (. body) (eval (cons 'begin (.reverse 'body))))
```

### Define lambda

```
(def my-lambda (lambda (a b) (+ a b)))
```

### Iterative loop

```
(loop (x 100)
      (print x)
      (cond (> x 0) (recur (- x 1))))
```
