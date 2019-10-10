import createEvaluator from "../../createEvaluator";

test("Treasure Hunter", () => {
  const evaluate = createEvaluator({});

  const code = `
    (import "list" as "l")

    (def input-map-data
      (l/list
        55 14 25 52 21
        44 31 11 53 43
        24 13 45 12 34
        42 22 43 32 41
        51 23 33 54 15))

    (def map-width 5)

    (def initial-coords (l/list 1 1))

    (defun find-treasure (map-data) 
      (def treasure-map (-> map-data (l/chunk map-width)))

      (defun iter (coords acc)
        (def y (-> coords (l/nth 0))
             x (-> coords (l/nth 1)))

        (def clue (-> treasure-map (l/nth (dec y))
                                   (l/nth (dec x))))

        (def clue-y (floor (/ clue 10))
             clue-x (% clue 10))
             
        (def next-path (l/list* coords acc))

        (cond ((and (eq? y clue-y) 
                    (eq? x clue-x)) next-path)
              ((iter (l/list clue-y clue-x) next-path))))

      (l/reverse (iter initial-coords l/Nil)))

    (find-treasure input-map-data)
  `;

  expect(evaluate(code)).toBe(
    "((1 1) (5 5) (1 5) (2 1) (4 4) (3 2) (1 3) (2 5) (4 3))"
  );
});
