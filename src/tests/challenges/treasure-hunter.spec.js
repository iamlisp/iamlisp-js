import createEvaluator from "../../createEvaluator";

let evaluate;

beforeEach(() => {
  evaluate = createEvaluator({});
});

test("Treasure Hunter", () => {
  const code = `
    (import "list" as "l")

    (def initial-coords (l/list 1 1))

    (defun find-treasure (map-data) 
      (def treasure-map (l/chunk 5 map-data))

      (defun iter (coords acc)
        (def y (-> coords (l/nth 0))
             x (-> coords (l/nth 1)))

        (def hint (-> treasure-map (l/nth (dec y))
                                   (l/nth (dec x))))

        (def hint-y (floor (/ hint 10))
             hint-x (% hint 10))
             
        (def next-path (l/list* coords acc))

        (cond ((and (eq? y hint-y) (eq? x hint-x)) next-path)
              ((iter (l/list hint-y hint-x) next-path))))

      (l/reverse (iter initial-coords l/Nil)))

    (find-treasure
      (l/list
          55 14 25 52 21
          44 31 11 53 43
          24 13 45 12 34
          42 22 43 32 41
          51 23 33 54 15))
  `;

  expect(evaluate(code)).toBe(
    "((1 1) (5 5) (1 5) (2 1) (4 4) (3 2) (1 3) (2 5) (4 3))"
  );
});
