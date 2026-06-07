# SICP Concept Path

These executable layout-v1 examples follow the main ideas developed before and
during SICP's metacircular evaluator. They are adaptations for iamlisp, not a
line-by-line reproduction of the book.

Run each file in a fresh evaluator. The files progress in order:

1. `01-procedures.iamlisp` - expressions, procedures, conditionals, Newton's method
2. `02-processes.iamlisp` - recursive and iterative processes, counting change
3. `03-higher-order.iamlisp` - procedures as arguments and returned values
4. `04-data-abstraction.iamlisp` - rational numbers and interval arithmetic
5. `05-sequences-trees.iamlisp` - lists, maps, filters, folds, and trees
6. `06-symbolic-data.iamlisp` - quotation and symbolic differentiation
7. `07-state.iamlisp` - local state and message-passing objects
8. `08-streams.iamlisp` - delayed infinite sequences
9. `09-metacircular-evaluator.iamlisp` - a small Lisp evaluator written in iamlisp

Differences from Scheme:

- iamlisp list helpers come from `(import "list")`.
- Maps are used where mutable association lists would add noise.
- JavaScript interop supplies a few host operations.
- The final evaluator intentionally supports a small, clear language core.
