# iamlisp

[![Build Status](https://travis-ci.org/pldin601/iamlisp.svg?branch=master)](https://travis-ci.org/pldin601/iamlisp)

Another one my LISP-like language interpreter hosted on JS.

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
; Print numbers from 100 to 0

(loop (x 100)
      (print x)
      (cond ((> x 0) (recur (dec x)))))

; Fibonacci using iterative loop

(defun fib (n)
  (loop (x 0 y 1 i n)
    (cond ((<= i 0) x) ((recur y (+ x y) (dec i))))))
```

### Define variable using list destructuring

```
; Nested destructuring
(def (a (b c)) '(2 '(4 6)))

; Destructuring with rest
(def (first . rest) '(1 2 3 4 5))
```
