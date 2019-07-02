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
; Print numbers from 100 to 0

(loop (x 100)
      (print x)
      (cond (> x 0) (recur (dec x))))

; Fibonacci using iterative loop

(defun fib (n)
  (loop (x 0 y 1 i n)
    (def fibn (+ x y))
    (cond (<= i 0) x (recur y fibn (dec i)))))
```
